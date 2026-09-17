#!/usr/bin/env node
/*
 * Browser smoke tests. Not wired into CI and not a project dependency — the
 * site stays dependency-free. Run it by hand after a change:
 *
 *   python3 -m http.server 8099 &
 *   npm i -g playwright && npx playwright install chromium   # first time only
 *   node scripts/smoke.mjs
 *
 * SMOKE_URL overrides the address, CHROMIUM_PATH an already-installed browser.
 *
 * Every case here is a bug that actually shipped at some point.
 */
/* playwright is not a dependency of this project; find it wherever it lives */
const { chromium } = await (async () => {
  for (const spec of ['playwright', process.env.PLAYWRIGHT_PATH, '/opt/node22/lib/node_modules/playwright/index.js']) {
    if (!spec) continue;
    try { const m = await import(spec); if (m.chromium || m.default?.chromium) return m.chromium ? m : m.default; } catch {}
  }
  console.error('playwright not found — npm i -g playwright, or set PLAYWRIGHT_PATH');
  process.exit(2);
})();

import fs from 'node:fs';
import path from 'node:path';

const HERE = import.meta.dirname;
const URL = process.env.SMOKE_URL || 'http://localhost:8099/';
const EXEC = process.env.CHROMIUM_PATH;
const fails = [];
const check = (name, ok, detail = '') => {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
  if (!ok) fails.push(name);
};

const browser = await chromium.launch(EXEC ? { executablePath: EXEC } : {});
const phone = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true,
  permissions: ['clipboard-read', 'clipboard-write'] };

const open = async (opts = {}) => {
  const ctx = await browser.newContext({ ...phone, ...opts.context });
  if (opts.trip) await ctx.route('**/trip.js', r =>
    r.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(opts.trip, 'utf8') }));
  if (opts.clock) await ctx.addInitScript(`{const F=Date;const f=new F(${JSON.stringify(opts.clock)}).getTime();
    class D extends F{constructor(...a){a.length?super(...a):super(f)}static now(){return f}}globalThis.Date=D;}`);
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto(URL + (opts.query || ''), { waitUntil: 'domcontentloaded' });
  if (opts.seed) { await page.evaluate(opts.seed); await page.reload({ waitUntil: 'domcontentloaded' }); }
  await page.waitForTimeout(700);
  return { page, ctx, errs };
};

console.log('\n── storage is untrusted input ──');
for (const [label, value] of [
  ['malformed JSON', '{{{'],
  ['an object where an array belongs', '{"a":1}'],
  ['an array of nulls', '[null,null]'],
  ['a record missing every field', '[{}]'],
  ['a date outside the trip', '[{"id":"1","date":"1999-01-01","time":"10:00","title":"x","type":"景點"}]'],
  ['a non-time value', '[{"id":"2","date":"2026-10-08","time":"banana","title":"y","type":"景點"}]'],
]) {
  const { page, ctx, errs } = await open({ seed: `localStorage.setItem('my2026.plans.v1', ${JSON.stringify(value)})` });
  const alive = await page.evaluate(() => !!document.querySelector('.tl-row') && !!document.querySelector('.tab'));
  check(`survives ${label}`, alive && !errs.length, errs[0] || (alive ? '' : 'nothing rendered'));
  await ctx.close();
}
{
  const { page, ctx } = await open({ seed: `localStorage.setItem('my2026.todos', '["a","b","c"]')` });
  const pct = await page.evaluate(() => document.querySelector('#todoPercent').textContent);
  check('an array of to-do state does not tick anything', pct === '0%', `progress=${pct}`);
  await ctx.close();
}

console.log('\n── stored values reach templates as text, never as markup ──');
{
  const evil = '"><img src=x onerror="window.__pwned=1">';
  const { page, ctx } = await open({ seed: `localStorage.setItem('my2026.plans.v1', JSON.stringify([
    {id:'a',date:'2026-10-08',time:${JSON.stringify(evil)},type:'景點',title:'t'},
    {id:'b',date:'2026-10-08',time:'10:00',type:${JSON.stringify(evil)},title:${JSON.stringify(evil)},
     duration:${JSON.stringify(evil)},note:${JSON.stringify(evil)}}]))` });
  await page.click('.tab[data-view="planner"]');
  await page.waitForTimeout(400);
  /* the seeded key must be one the app actually reads, or this whole section
     passes by testing an empty page — which is exactly what it did while the
     namespace said myTrip2026 and the app said my2026 */
  check('the hostile plans were actually loaded', (await page.evaluate(() =>
    document.querySelectorAll('#planList .plan-card').length)) >= 1,
    String(await page.evaluate(() => document.querySelector('#planList')?.children.length)));
  check('no injected script runs', !(await page.evaluate(() => !!window.__pwned)));
  check('no injected elements', (await page.evaluate(() => document.querySelectorAll('#planList img').length)) === 0);
  await ctx.close();
}

console.log('\n── the countdown points at a real row, at every hour that matters ──');
for (const clock of ['2026-10-08T05:00:00+08:00', '2026-10-10T13:00:00+08:00', '2026-10-10T17:00:00+08:00',
                     '2026-10-13T06:00:00+08:00', '2026-10-13T13:00:00+08:00', '2026-10-13T21:00:00+08:00']) {
  const { page, ctx, errs } = await open({ clock });
  const row = await page.evaluate(() => document.querySelector('.tl-row.is-next .tl-card h3')?.textContent?.trim() || null);
  check(`${clock.slice(5, 16)} marks a row`, !!row && !errs.length, errs[0] || String(row));
  await ctx.close();
}
for (const clock of ['2026-10-14T12:00:00+08:00', '2027-10-14T12:00:00+08:00']) {
  const { page, ctx, errs } = await open({ clock });
  const done = await page.evaluate(() => document.querySelector('#nextTitle').textContent);
  check(`${clock.slice(0, 10)} after the trip reads as finished`, done === '旅程已完成' && !errs.length, done);
  await ctx.close();
}

console.log('\n── a plan survives create, edit, reload and delete ──');
{
  const { page, ctx, errs } = await open();
  page.on('dialog', d => d.accept());
  await page.click('.tab[data-view="planner"]');
  await page.waitForTimeout(300);
  await page.click('#addPlanFab');
  await page.waitForTimeout(300);
  await page.fill('#planTitle', '亞羅街晚餐');
  await page.fill('#planTime', '19:30');
  await page.click('#planDialog button[value="default"]');
  await page.waitForTimeout(400);
  check('saved', (await page.evaluate(() => document.querySelectorAll('.plan-card').length)) === 1);
  await page.click('.edit-plan');
  await page.waitForTimeout(300);
  check('edit prefills', (await page.evaluate(() => document.querySelector('#planTime').value)) === '19:30');
  await page.fill('#planTitle', '改名');
  await page.click('#planDialog button[value="default"]');
  await page.waitForTimeout(400);
  check('edit does not duplicate', (await page.evaluate(() => document.querySelectorAll('.plan-card').length)) === 1);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(700);
  await page.click('.tab[data-view="planner"]');
  await page.waitForTimeout(300);
  check('survives a reload', (await page.evaluate(() => document.querySelector('.plan-body h3')?.textContent)) === '改名');
  check('empty state hidden while a plan exists',
    (await page.evaluate(() => getComputedStyle(document.querySelector('#planEmpty')).display)) === 'none');
  await page.click('.delete-plan');
  await page.waitForTimeout(400);
  check('deleted', (await page.evaluate(() => document.querySelectorAll('.plan-card').length)) === 0);
  check('empty state returns',
    (await page.evaluate(() => getComputedStyle(document.querySelector('#planEmpty')).display)) !== 'none');
  check('no errors across the flow', !errs.length, errs[0] || '');
  await ctx.close();
}

console.log('\n── the shell holds together ──');
{
  const { page, ctx, errs } = await open();
  const bar = await page.evaluate(() => {
    const b = document.querySelector('.tabs'), r = b.getBoundingClientRect();
    return { fixed: getComputedStyle(b).position === 'fixed', atBottom: Math.round(innerHeight - r.bottom) === 0,
      cols: [...b.querySelectorAll('.tab')].map(t => Math.round(t.getBoundingClientRect().width)) };
  });
  check('tab bar pinned to the bottom edge', bar.fixed && bar.atBottom, JSON.stringify(bar));
  check('tabs share the width evenly', new Set(bar.cols).size === 1, bar.cols.join(','));
  check('every tab is the topmost element at its own centre', await page.evaluate(() =>
    [...document.querySelectorAll('.tab')].every(t => { const r = t.getBoundingClientRect();
      const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return t.contains(el) || t === el; })));
  for (const v of ['planner', 'todos', 'costs', 'itinerary']) {
    await page.click(`.tab[data-view="${v}"]`);
    await page.waitForTimeout(220);
    check(`tapping ${v} switches the panel`, (await page.evaluate(() => document.querySelector('.view.active').id)) === v);
  }
  check('no hover rule applies without a pointer', (await page.evaluate(() => {
    let n = 0;
    for (const sheet of document.styleSheets) {
      let rules; try { rules = sheet.cssRules; } catch { continue; }
      const walk = (list, guarded) => { for (const r of list) {
        if (r.media) { walk(r.cssRules, guarded || /hover/.test(r.conditionText)); continue; }
        if (r.selectorText?.includes(':hover') && !guarded) n++; } };
      walk(rules, false);
    }
    return n;
  })) === 0);
  check('nothing animates a layout property', (await page.evaluate(() => {
    const layout = /\b(width|height|padding|margin|top|left|right|bottom|inset|font-size|gap|max-height)\b/;
    return [...document.querySelectorAll('body *')].filter(el => {
      const t = getComputedStyle(el).transitionProperty;
      return t && t !== 'none' && layout.test(t);
    }).length;
  })) === 0);
  check('no horizontal overflow', (await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth)) === 0);
  check('no errors', !errs.length, errs[0] || '');
  await ctx.close();
}

console.log('\n── every control does what it says ──');
{
  /* This section exists because 查看行程 sat there for weeks doing nothing:
     it scrolled to #itinerary, which is where the app already was. A control
     that looks live and is not is worse than one that is missing. */
  const { page, ctx, errs } = await open({ clock: '2026-10-10T13:00:00+08:00' });
  page.on('dialog', d => d.accept());
  const val = fn => page.evaluate(fn);

  await val(() => scrollTo(0, 0)); await page.waitForTimeout(200);
  await page.click('#jumpNextBtn'); await page.waitForTimeout(1200);
  const jump = await val(() => ({ y: scrollY, top: document.querySelector('.tl-row.is-next')?.getBoundingClientRect().top }));
  check('查看行程 scrolls to the row the countdown is about', jump.y > 0 && jump.top > 0 && jump.top < 300, JSON.stringify(jump));

  /* the skip link needs a focusable target, or it moves nothing */
  await val(() => document.querySelector('.skip-link').click()); await page.waitForTimeout(250);
  check('the skip link moves focus into main', (await val(() => document.activeElement?.id)) === 'main');

  for (const v of ['planner', 'todos', 'costs', 'itinerary']) {
    await page.click(`.tab[data-view="${v}"]`); await page.waitForTimeout(250);
    const s = await val(() => ({ view: document.querySelector('.view.active').id,
      fab: document.querySelector('#addPlanFab').classList.contains('show') }));
    check(`the ${v} tab shows ${v}, with the FAB only on the planner`, s.view === v && s.fab === (v === 'planner'), JSON.stringify(s));
  }

  await page.click('.tab[data-view="itinerary"]'); await page.waitForTimeout(250);
  for (const [pick, groups] of [['all', 6], ['0', 1], ['5', 1]]) {
    await page.click(`#dayStrip .day-chip[data-pick="${pick}"]`); await page.waitForTimeout(300);
    const s = await val(() => ({ groups: document.querySelectorAll('.day-group').length,
      a: document.querySelector('#dayStrip .day-chip.active')?.dataset.pick,
      b: document.querySelector('#planDayStrip .day-chip.active')?.dataset.pick }));
    check(`day ${pick} filters the timeline and both strips agree`, s.groups === groups && s.a === pick && s.b === pick, JSON.stringify(s));
  }

  await page.click('#dayStrip .day-chip[data-pick="all"]'); await page.waitForTimeout(300);
  const want = await val(() => document.querySelector('.copy-chip')?.dataset.copy);
  await page.click('.copy-chip'); await page.waitForTimeout(400);
  const copied = await val(async () => ({ clip: await navigator.clipboard.readText(),
    toast: document.querySelector('#toast').classList.contains('show') }));
  check('a copy chip copies and says so', copied.clip === want && copied.toast, JSON.stringify(copied));

  await page.click('.tab[data-view="todos"]'); await page.waitForTimeout(250);
  await page.click('#todoList .todo:nth-of-type(1)'); await page.waitForTimeout(350);
  check('ticking a to-do moves the ring', (await val(() => document.querySelector('#todoPercent').textContent)) !== '0%');
  await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForTimeout(700);
  await page.click('.tab[data-view="todos"]'); await page.waitForTimeout(250);
  check('the tick survives a reload', (await val(() => document.querySelectorAll('#todoList input:checked').length)) === 1);
  await page.click('#resetTodos'); await page.waitForTimeout(400);
  check('reset clears every tick', (await val(() => document.querySelector('#todoPercent').textContent)) === '0%');

  check('the switch offers two themes, not three',
    (await val(() => [...document.querySelectorAll('.theme-opt')].map(b => b.dataset.themeSet).join(',')))
    === 'light,dark');
  for (const t of ['dark', 'light']) {
    await page.click(`.theme-opt[data-theme-set="${t}"]`); await page.waitForTimeout(300);
    const s = await val(() => ({ attr: document.documentElement.getAttribute('data-theme'),
      checked: document.querySelector('.theme-opt[aria-checked=true]')?.dataset.themeSet,
      metas: document.querySelectorAll('meta[name=theme-color]').length }));
    check(`the ${t} theme applies and leaves one theme-color`,
      s.checked === t && s.metas === 1 && s.attr === t, JSON.stringify(s));
  }
  await page.click('.theme-opt[data-theme-set="dark"]'); await page.waitForTimeout(250);
  await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForTimeout(700);
  check('the theme survives a reload', (await val(() => document.documentElement.getAttribute('data-theme'))) === 'dark');

  /* In dark mode elevation reads as lightness. The hero was once darker than
     the page, which put it behind the background and made it disappear. */
  const ladder = await val(() => {
    const L = s => { const [r, g, b] = s.match(/-?[\d.]+/g).slice(0, 3).map(Number).map(x => {
      x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
    const bgOf = s => getComputedStyle(document.querySelector(s)).backgroundColor;
    const grad = getComputedStyle(document.querySelector('#nowPanel')).backgroundImage.match(/rgb\([^)]*\)/g);
    return { page: L(bgOf('body')), card: L(bgOf('.tl-card')), hero: L(grad[grad.length - 1]),
      chip: L(bgOf('.meta-chip')) };
  });
  check('dark elevation steps up: page < card < inner chip', ladder.page < ladder.card && ladder.card < ladder.chip,
    JSON.stringify(ladder));
  check('the hero sits above the page rather than behind it', ladder.hero > ladder.page * 1.5,
    `hero ${ladder.hero.toFixed(4)} vs page ${ladder.page.toFixed(4)}`);
  await page.click('.theme-opt[data-theme-set="dark"]'); await page.waitForTimeout(200);

  await page.click('.tab[data-view="itinerary"]'); await page.waitForTimeout(250);
  await page.click('#dismissBanner'); await page.waitForTimeout(250);
  check('the alert can be dismissed', (await val(() => document.querySelector('#criticalBanner').hidden)) === true);
  await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForTimeout(700);
  check('and stays dismissed for the session', (await val(() => document.querySelector('#criticalBanner').hidden)) === true);

  await page.click('#sourceBtn'); await page.waitForTimeout(350);
  const src = await val(() => ({ open: document.querySelector('#sourceDialog').open,
    n: document.querySelectorAll('#sourceList .source').length,
    links: [...document.querySelectorAll('#sourceList a')].every(a => /^https?:/.test(a.href) && a.target === '_blank') }));
  check('the sources dialog opens with working links', src.open && src.n > 0 && src.links, JSON.stringify(src));
  await page.keyboard.press('Escape'); await page.waitForTimeout(250);
  check('Escape closes it', (await val(() => document.querySelector('#sourceDialog').open)) === false);

  await page.click('.tab[data-view="itinerary"]'); await page.waitForTimeout(200);
  await page.focus('.tab[data-view="itinerary"]');
  await page.keyboard.press('ArrowRight'); await page.waitForTimeout(250);
  check('arrow keys move between tabs', (await val(() => document.querySelector('.view.active').id)) === 'planner');
  await page.keyboard.press('End'); await page.waitForTimeout(250);
  check('End reaches the last tab', (await val(() => document.querySelector('.view.active').id)) === 'costs');
  await page.keyboard.press('Home'); await page.waitForTimeout(250);
  check('Home reaches the first', (await val(() => document.querySelector('.view.active').id)) === 'itinerary');

  const swipe = async dx => { await page.evaluate(d => {
    const m = document.querySelector('#main');
    const fire = (n, x) => m.dispatchEvent(new TouchEvent(n, { bubbles: true, cancelable: true,
      [n === 'touchend' ? 'changedTouches' : 'touches']: [new Touch({ identifier: 1, target: m, clientX: x, clientY: 400 })] }));
    fire('touchstart', 200); fire('touchend', 200 + d);
  }, dx); await page.waitForTimeout(320); };
  await swipe(-120);
  check('swiping left moves one tab along', (await val(() => document.querySelector('.view.active').id)) === 'planner');
  await swipe(120); await swipe(120);
  check('swiping past the first tab stays put', (await val(() => document.querySelector('.view.active').id)) === 'itinerary');
  await swipe(-20);
  check('a small drag is not a swipe', (await val(() => document.querySelector('.view.active').id)) === 'itinerary');

  await val(() => scrollTo(0, 0)); await page.waitForTimeout(300);
  await page.mouse.wheel(0, 700); await page.waitForTimeout(500);
  const down = await val(() => document.querySelector('.topbar').classList.contains('hidden'));
  await page.mouse.wheel(0, -300); await page.waitForTimeout(500);
  const up = await val(() => document.querySelector('.topbar').classList.contains('hidden'));
  check('the header hides going down and returns going up', down === true && up === false, `down=${down} up=${up}`);

  /* the itinerary is the long one; scroll it, go away, come back */
  await page.click('.tab[data-view="itinerary"]'); await page.waitForTimeout(400);
  await val(() => scrollTo(0, 500)); await page.waitForTimeout(400);
  const left = await val(() => Math.round(scrollY));
  await page.click('.tab[data-view="costs"]'); await page.waitForTimeout(300);
  const away = await val(() => Math.round(scrollY));
  await page.click('.tab[data-view="itinerary"]'); await page.waitForTimeout(500);
  const back = await val(() => Math.round(scrollY));
  check('each tab keeps its own scroll position', left > 400 && away < 60 && Math.abs(back - left) < 40,
    `left at ${left}, costs opened at ${away}, came back to ${back}`);

  check('no errors across every interaction', !errs.length, errs.slice(0, 2).join(' | '));
  await ctx.close();
}

console.log('\n── to-do ticks belong to items, not to positions ──');
{
  /* Ticks were keyed by index, so inserting one to-do moved everybody's
     saved ticks onto the wrong rows — silently. */
  const { page, ctx, errs } = await open({
    seed: `localStorage.setItem('my2026.todos', JSON.stringify({"0":true,"2":true,"5":true}))` });
  const val = fn => page.evaluate(fn);
  await page.click('.tab[data-view="todos"]'); await page.waitForTimeout(300);

  check('old index-keyed ticks migrate to ids', (await val(() =>
    Object.keys(JSON.parse(localStorage.getItem('my2026.todos'))).sort().join(','))) === 't1,t3,t6');
  check('and land on the same three items', (await val(() =>
    [...document.querySelectorAll('#todoList input')].map((c, i) => c.checked ? i : null)
      .filter(x => x !== null).join(','))) === '0,2,5');

  const was = await val(() => [...document.querySelectorAll('#todoList .todo')]
    .filter(t => t.querySelector('input').checked).map(t => t.querySelector('h3').textContent).join('|'));
  await val(() => { window.TRIP.todos.unshift({ id: 'tINS', due: '現在', title: '插進來的', why: 'x', priority: '中', note: '' }); renderTodos(); });
  await page.waitForTimeout(250);
  const now = await val(() => [...document.querySelectorAll('#todoList .todo')]
    .filter(t => t.querySelector('input').checked).map(t => t.querySelector('h3').textContent).join('|'));
  check('inserting a to-do does not move anyone’s ticks', now === was, `${was} → ${now}`);
  check('no errors', !errs.length, errs[0] || '');
  await ctx.close();
}

console.log('\n── my own to-dos are mine, and separate ──');
{
  const { page, ctx, errs } = await open();
  const val = fn => page.evaluate(fn);
  await page.click('.tab[data-view="todos"]'); await page.waitForTimeout(300);

  check('the two lists are never on screen together', await val(() =>
    getComputedStyle(document.querySelector('#paneShared')).display !== 'none'
    && getComputedStyle(document.querySelector('#paneMine')).display === 'none'));

  await page.click('#segMine'); await page.waitForTimeout(300);
  /* stacked, this control sat 522px below the fold and read as broken */
  const reach = await val(() => { const r = document.querySelector('#mineForm button').getBoundingClientRect();
    return { top: Math.round(r.top), bottom: Math.round(r.bottom), vh: innerHeight }; });
  check('加入 is on screen without scrolling', reach.top > 0 && reach.bottom < reach.vh, JSON.stringify(reach));

  const box = await page.locator('#mineInput').boundingBox();
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); await page.waitForTimeout(250);
  check('a real tap focuses the field', (await val(() => document.activeElement?.id)) === 'mineInput');
  const btn = await page.locator('#mineForm button').boundingBox();
  await page.touchscreen.tap(btn.x + btn.width / 2, btn.y + btn.height / 2); await page.waitForTimeout(400);
  check('an empty submit says so instead of doing nothing',
    (await val(() => document.querySelector('#toastText').textContent)) === '先輸入一個名稱'
    && (await val(() => document.activeElement?.id)) === 'mineInput');

  await page.fill('#mineInput', '換錢');
  await page.click('#mineForm button[type=submit]'); await page.waitForTimeout(300);
  check('adding one works and clears the field',
    (await val(() => document.querySelectorAll('#mineList .todo').length)) === 1
    && (await val(() => document.querySelector('#mineInput').value)) === '');
  await page.click('#mineForm button[type=submit]'); await page.waitForTimeout(250);
  check('an empty title adds nothing', (await val(() => document.querySelectorAll('#mineList .todo').length)) === 1);
  await page.click('#mineList .todo-hit'); await page.waitForTimeout(300);
  check('ticking mine does not touch the trip’s progress',
    (await val(() => document.querySelector('#todoPercent').textContent)) === '0%'
    && (await val(() => document.querySelector('#mineCount').textContent)) === '1/1');
  await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForTimeout(700);
  await page.click('.tab[data-view="todos"]'); await page.waitForTimeout(300);
  await page.click('#segMine'); await page.waitForTimeout(300);
  check('mine survive a reload', (await val(() => document.querySelectorAll('#mineList .todo').length)) === 1);
  await page.click('#segShared'); await page.waitForTimeout(250);
  await page.click('#resetTodos'); await page.waitForTimeout(350);
  await page.click('#segMine'); await page.waitForTimeout(300);
  check('resetting the shared list leaves mine alone',
    (await val(() => document.querySelectorAll('#mineList .todo').length)) === 1);
  await page.click('.del-mine'); await page.waitForTimeout(350);
  check('deleting offers an undo', (await val(() => document.querySelectorAll('#mineList .todo').length)) === 0
    && (await val(() => document.querySelector('#toastAction').textContent)) === '復原');
  await page.click('#toastAction'); await page.waitForTimeout(350);
  check('undo brings it back', (await val(() => document.querySelectorAll('#mineList .todo').length)) === 1);
  check('no errors', !errs.length, errs[0] || '');
  await ctx.close();
}
for (const [label, v] of [['an object', '{"a":1}'], ['nulls', '[null,{"id":"x"}]'], ['malformed JSON', '{{{']]) {
  const { page, ctx, errs } = await open({ seed: `localStorage.setItem('my2026.todos.mine.v1', ${JSON.stringify(v)})` });
  await page.click('.tab[data-view="todos"]'); await page.waitForTimeout(300);
  await page.click('#segMine'); await page.waitForTimeout(250);
  check(`my list survives ${label} in storage`,
    (await page.evaluate(() => !!document.querySelector('#todoList .todo'))) && !errs.length, errs[0] || '');
  await ctx.close();
}

console.log('\n── it behaves like an app on a phone, not like a web page ──');
{
  const { page, ctx, errs } = await open();
  const val = fn => page.evaluate(fn);

  /* iOS zooms the whole page into any focused field under 16px and does not
     zoom back out when it blurs. This is the one that shipped. */
  await page.click('.tab[data-view="planner"]'); await page.waitForTimeout(250);
  await page.click('#addPlanFab'); await page.waitForTimeout(400);
  const small = await val(() => [...document.querySelectorAll('#planForm input,#planForm select,#planForm textarea')]
    .map(e => ({ id: e.id, px: parseFloat(getComputedStyle(e).fontSize) })).filter(x => x.px < 16));
  check('no text field is small enough to trigger iOS zoom', small.length === 0, JSON.stringify(small));

  check('text fields do not invite autocorrect or spellcheck squiggles',
    await val(() => [...document.querySelectorAll('#planTitle,#planDuration,#planNote')]
      .every(e => e.getAttribute('spellcheck') === 'false' && e.getAttribute('autocorrect') === 'off'
        && e.getAttribute('autocomplete') === 'off' && e.getAttribute('enterkeyhint'))));

  /* the on-screen keyboard leaves roughly this much room on a small phone */
  await page.setViewportSize({ width: 390, height: 380 }); await page.waitForTimeout(350);
  const reach = await val(() => {
    const r = document.querySelector('#planDialog button[value="default"]').getBoundingClientRect();
    return { top: Math.round(r.top), bottom: Math.round(r.bottom), vh: innerHeight };
  });
  check('儲存 stays reachable with the keyboard open', reach.bottom <= reach.vh && reach.top >= 0, JSON.stringify(reach));
  await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(250);
  await val(() => document.querySelector('#planDialog').close()); await page.waitForTimeout(250);

  /* a bare dialog{display:flex} beats the UA's dialog:not([open]){display:none}
     and leaves closed dialogs over the page, eating taps */
  check('a closed dialog is out of the way', await val(() =>
    [...document.querySelectorAll('dialog:not([open])')].every(d => getComputedStyle(d).display === 'none')));

  /* the hidden attribute must actually hide, everywhere, in every view */
  const showing = [];
  for (const v of ['itinerary', 'planner', 'todos', 'costs']) {
    await page.click(`.tab[data-view="${v}"]`); await page.waitForTimeout(200);
    showing.push(...await val(() => [...document.querySelectorAll('[hidden]')]
      .filter(el => getComputedStyle(el).display !== 'none')
      .map(el => (el.id || el.className || el.tagName) + ':' + getComputedStyle(el).display)));
  }
  check('nothing marked hidden is still painted', showing.length === 0, showing.slice(0, 5).join(', '));

  check('no browser confirm() or alert() interrupts a tap', await val(() => {
    let hit = false;
    const spy = () => { hit = true; return true; };
    const [c, a] = [window.confirm, window.alert];
    window.confirm = spy; window.alert = spy;
    document.querySelector('#resetTodos').click();
    window.confirm = c; window.alert = a;
    return !hit;
  }));

  const tiny = [];
  for (const v of ['itinerary', 'planner', 'todos', 'costs']) {
    await page.click(`.tab[data-view="${v}"]`); await page.waitForTimeout(250);
    tiny.push(...await val(() => [...document.querySelectorAll('button,a[href],select,label.todo,[data-copy]')]
      .filter(e => e.getBoundingClientRect().width > 0)
      .map(e => { const r = e.getBoundingClientRect(), a = getComputedStyle(e, '::after');
        const ax = parseFloat(a.insetInlineStart) || 0, ay = parseFloat(a.insetBlockStart) || 0;
        return { t: (e.id || e.className || e.tagName).toString().slice(0, 20),
          w: Math.round(r.width + (ax < 0 ? -2 * ax : 0)), h: Math.round(r.height + (ay < 0 ? -2 * ay : 0)) }; })
      .filter(x => x.w < 44 || x.h < 44)));
  }
  check('every control is at least a fingertip across', tiny.length === 0,
    JSON.stringify([...new Map(tiny.map(t => [t.t, t])).values()].slice(0, 6)));

  check('no errors', !errs.length, errs[0] || '');
  await ctx.close();
}

console.log('\n── follower mode shows one order and nothing else ──');
{
  const read = p => p.evaluate(() => ({
    kicker: document.querySelector('#flKicker').textContent,
    line: document.querySelector('#flLine').textContent,
    cd: document.querySelector('#flCd').textContent,
    hot: document.querySelector('#flCard').classList.contains('hot'),
    calm: document.querySelector('#flCard').classList.contains('calm'),
    wall: document.querySelector('#flWallTag').hidden ? null : document.querySelector('#flWallTime').textContent,
    ends: document.querySelector('#flL1').textContent + '→' + document.querySelector('#flL2').textContent,
    steps: [...document.querySelectorAll('#flSteps b')].map(x => x.textContent).join('/'),
    tabs: getComputedStyle(document.querySelector('.tabs')).display,
  }));
  const follow = `localStorage.setItem('my2026.mode','follow')`;

  {
    const { page, ctx, errs } = await open({ seed: follow, clock: '2026-10-13T11:45:00+08:00' });
    const r = await read(page);
    check('the KUL transfer reads as the tight one', r.hot && r.kicker === '這段要抓緊' && r.line === '直接去長榮報到',
      `${r.kicker} / ${r.line}`);
    /* the whole point of the scale: the deadline is the counter, not the flight */
    check('it counts down to the counter closing, not to departure', r.cd === '2:45' && r.wall === '14:30',
      `${r.cd}, wall ${r.wall}`);
    check('and the scale spans landing to take-off', r.ends === '11:45→15:30', r.ends);
    check('the steps are there to be counted, not read', r.steps === '領行李/轉機櫃檯/報到託運', r.steps);
    check('nothing else is on screen', r.tabs === 'none');
    check('no errors', !errs.length, errs[0] || '');
    await ctx.close();
  }
  for (const [clock, want] of [
    ['2026-10-13T06:50:00+08:00', '快到了'],
    ['2026-10-13T07:20:00+08:00', '現在'],
  ]) {
    const { page, ctx } = await open({ seed: follow, clock });
    check(`${clock.slice(11, 16)} reads as 「${want}」`, (await read(page)).kicker === want, (await read(page)).kicker);
    await ctx.close();
  }
  {
    const { page, ctx } = await open({ seed: follow, clock: '2026-10-11T10:20:00+08:00' });
    const r = await read(page);
    check('a free day says so and points at the next thing', r.calm && r.line === '沒有要趕的事'
      && (await page.evaluate(() => document.querySelector('#flBecause').textContent)).includes('10/13'), r.line);
    await ctx.close();
  }
  {
    const { page, ctx } = await open({ seed: follow, clock: '2026-10-14T09:00:00+08:00' });
    check('after the trip it is finished', (await read(page)).line === '旅程完成');
    await ctx.close();
  }
  /* an event with a clock on it is already an answer to "what now" — the
     screen must not go blank between the nine written orders */
  for (const [clock, want] of [
    ['2026-10-08T17:30:00+08:00', 'KUL 入境、領行李 → Hotel Royal Signature'],
    ['2026-10-10T12:10:00+08:00', 'Hotel Royal Signature 退房／寄放行李'],
    ['2026-10-13T20:40:00+08:00', 'TPE T2 入境／領行李 → A13 → A18'],
  ]) {
    const { page, ctx, errs } = await open({ query: '?mode=follow', clock });
    const r = await read(page);
    check(`${clock.slice(5, 16)} answers from the itinerary instead of going quiet`,
      r.line === want && !r.calm, `${r.line}${r.calm ? ' (calm)' : ''}`);
    /* nothing was written, so nothing is claimed: no steps, nothing to open */
    check('and it claims no more than the row says', await page.evaluate(() =>
      document.querySelector('#flSteps').hidden && document.querySelector('#flMore').hidden
      && document.querySelector('#flCard').classList.contains('plain')));
    check('no errors', !errs.length, errs[0] || '');
    await ctx.close();
  }
  {
    const { page, ctx } = await open({ query: '?mode=follow', clock: '2026-10-09T10:00:00+08:00' });
    check('a free day points at the real next thing, not the next written one',
      (await page.evaluate(() => document.querySelector('#flBecause').textContent)).includes('10/10 12:00'),
      await page.evaluate(() => document.querySelector('#flBecause').textContent));
    await ctx.close();
  }
  /* the productisation test: a trip.js with no briefs at all still answers */
  {
    const { page, ctx, errs } = await open({ trip: path.join(HERE, 'fixtures/sample.trip.js'),
      query: '?mode=follow', clock: '2027-03-05T10:00:00+09:00' });
    const r = await read(page);
    check('a trip that has never been briefed still works in follower mode',
      r.line === '台北 TPE → 東京 NRT' && !r.calm, r.line);
    check('no errors', !errs.length, errs[0] || '');
    await ctx.close();
  }
  /* a quiet screen and a broken screen look the same — three weeks out it
     has to say which one it is */
  {
    const { page, ctx, errs } = await open({ query: '?mode=follow', clock: '2026-09-17T14:00:00+08:00' });
    const r = await read(page);
    check('before the trip it counts the days instead of saying nothing is on',
      r.kicker === '出發前' && r.line === '還有 21 天', `${r.kicker} / ${r.line}`);
    check('and names what starts it', (await page.evaluate(() =>
      document.querySelector('#flBecause').textContent)).includes('10/08 06:40'));
    check('no errors', !errs.length, errs[0] || '');
    await ctx.close();
  }
  {
    const { page, ctx } = await open({ query: '?mode=follow', clock: '2026-10-11T10:20:00+08:00' });
    check('a free day in the middle of the trip is still a free day, not a countdown',
      (await read(page)).line === '沒有要趕的事');
    await ctx.close();
  }
  /* the answer to "I want to tap a row and see it": every row with a clock
     offers the follower view of itself */
  {
    const { page, ctx, errs } = await open({ clock: '2026-09-17T14:00:00+08:00' });
    const val = fn => page.evaluate(fn);
    check('a row with a clock offers it, a row without one does not',
      (await val(() => document.querySelectorAll('[data-peek]').length)) === 4
      && (await val(() => document.querySelectorAll('.tl-row').length)) === 5,
      `${await val(() => document.querySelectorAll('[data-peek]').length)} of ${await val(() => document.querySelectorAll('.tl-row').length)}`);
    await page.evaluate(() => [...document.querySelectorAll("#dayStrip .day-chip")]
      .find(x => /全部/.test(x.textContent))?.click());
    await page.waitForTimeout(300);
    await page.evaluate(() => document.querySelector('.peek[data-peek*="長榮"]').scrollIntoView({ block: 'center' }));
    await page.tap('.peek[data-peek*="長榮"]'); await page.waitForTimeout(400);
    check('tapping one shows what that moment will say, three weeks early',
      (await val(() => document.documentElement.dataset.mode)) === 'follow'
      && (await val(() => document.querySelector('#flLine').textContent)) === '直接去長榮報到'
      && (await val(() => document.querySelector('#flCd').textContent)) === '2:45');
    check('marked a preview, so it is never mistaken for the real state',
      await val(() => !document.querySelector('#flPreview').hidden));
    await page.tap('#flExit'); await page.waitForTimeout(300);
    await page.tap('#modeBtn'); await page.waitForTimeout(300);
    check('and leaving it leaves the preview behind',
      (await val(() => document.querySelector('#flLine').textContent)) === '還有 21 天'
      && (await val(() => document.querySelector('#flPreview').hidden)), await val(() => document.querySelector('#flLine').textContent));
    check('no errors', !errs.length, errs[0] || '');
    await ctx.close();
  }
  /* leading is editing a draft, not filling a form */
  {
    const { page, ctx, errs } = await open({ clock: '2026-09-17T14:00:00+08:00' });
    const val = fn => page.evaluate(fn);
    const key = await val(() => [...document.querySelectorAll('[data-edit]')]
      .map(x => x.dataset.edit).find(k => k.includes('入境')));
    check('an unwritten row invites one to be written', await val(() =>
      [...document.querySelectorAll('[data-edit]')].find(x => x.dataset.edit.includes('入境'))
        .textContent.includes('寫')));
    await page.evaluate(k => document.querySelector(`[data-edit="${k}"]`).click(), key);
    await page.waitForTimeout(300);
    check('it opens naming the row it is for', (await val(() =>
      document.querySelector('#briefFor').textContent)).includes('KUL 入境'));
    /* the field caps it at 12, so this sets the value past the cap directly:
       the check has to hold when the input's own limit is not what stopped it */
    await page.evaluate(() => { document.querySelector('#bfLine').value = '這行字整整超過十二個字很多'; });
    await page.evaluate(() => document.querySelector('#briefForm button[value=default]').click());
    await page.waitForTimeout(250);
    check('a line too long to read at a glance is refused', await val(() =>
      document.querySelector('#briefDialog').open
      && document.querySelector('#toast').textContent.includes('12')));
    await page.fill('#bfLine', '先領行李再入境');
    await page.fill('#bfSteps', '領行李\n入境\n叫車\n到飯店\n多的一步');
    await page.evaluate(() => document.querySelector('#briefForm button[value=default]').click());
    await page.waitForTimeout(250);
    check('more steps than anybody holds in their head is refused', await val(() =>
      document.querySelector('#briefDialog').open
      && document.querySelector('#toast').textContent.includes('四步')));
    await page.fill('#bfSteps', '領行李\n入境\n叫車');
    await page.fill('#bfFallback', '行李沒到就去 baggage claim 櫃檯');
    await page.evaluate(() => document.querySelector('#briefForm button[value=default]').click());
    await page.waitForTimeout(350);
    check('what was written is what the row now says', await val(() =>
      [...document.querySelectorAll('[data-edit]')].find(x => x.dataset.edit.includes('入境'))
        .textContent.includes('改')));
    await page.evaluate(k => document.querySelector(`[data-peek="${k}"]`).click(), key);
    await page.waitForTimeout(350);
    const r = await read(page);
    check('and follower mode stops treating it as an unwritten row',
      r.line === '先領行李再入境' && r.steps === '領行李/入境/叫車'
      && !(await val(() => document.querySelector('#flCard').classList.contains('plain'))), `${r.line} / ${r.steps}`);
    /* the row's clock stays the itinerary's: an override carries words only */
    check('the window is still the itinerary\'s, not the editor\'s', r.ends === '16:10→19:00', r.ends);
    await page.tap('#flExit'); await page.waitForTimeout(250);
    await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForTimeout(800);
    check('it survives a reload', await val(() =>
      [...document.querySelectorAll('[data-edit]')].find(x => x.dataset.edit.includes('入境'))
        .textContent.includes('改')));
    await page.evaluate(k => document.querySelector(`[data-edit="${k}"]`).click(), key);
    await page.waitForTimeout(300);
    await page.evaluate(() => document.querySelector('#bfClear').click());
    await page.waitForTimeout(350);
    check('clearing returns the row to what the itinerary says', await val(() =>
      [...document.querySelectorAll('[data-edit]')].find(x => x.dataset.edit.includes('入境'))
        .textContent.includes('寫')));
    check('no errors', !errs.length, errs[0] || '');
    await ctx.close();
  }
  /* AI drafting, step one: the app writes the prompt, a person carries it,
     and what comes back goes through the same gate the editor uses */
  {
    const { page, ctx, errs } = await open({ clock: '2026-09-17T14:00:00+08:00',
      context: { permissions: ['clipboard-read', 'clipboard-write'] } });
    const val = fn => page.evaluate(fn);
    await page.click('#draftAllBtn'); await page.waitForTimeout(300);
    check('it offers to draft exactly the rows nobody has written',
      (await val(() => document.querySelector('#dfFor').textContent)).startsWith('5 個'),
      await val(() => document.querySelector('#dfFor').textContent));
    await page.click('#dfCopy'); await page.waitForTimeout(300);
    const prompt = await val(() => navigator.clipboard.readText());
    /* the prompt has to carry the trip, the rules and the exact keys, or what
       comes back cannot be applied to anything */
    check('the prompt carries the limits that make the screen readable',
      prompt.includes('不超過 12 個字') && prompt.includes('最多 4 步'));
    check('and the instruction not to make things up',
      prompt.includes('不要編造'));
    check('and the real keys it expects back',
      prompt.includes('0|16:10–約19:00|KUL 入境、領行李 → Hotel Royal Signature'));
    check('and the trip, not a different one', prompt.includes('馬來西亞'));

    const KUL = '0|16:10–約19:00|KUL 入境、領行李 → Hotel Royal Signature';
    /* a model will go over twelve characters; the limit is the whole reason
       the screen works, so nothing over it may be stored */
    await page.fill('#dfPaste', '```json\n' + JSON.stringify({
      [KUL]: { line: '這一句話整整超過了十二個字的上限', because: 'x', steps: ['a','b','c','d','e'], need: '', fallback: '' },
      'nope|x|y': { line: '短', because: '', steps: [], need: '', fallback: '' },
    }) + '\n```');
    await page.click('#dfApply'); await page.waitForTimeout(400);
    const said = await val(() => document.querySelector('#dfResult').textContent);
    check('an over-long line is refused, and the reason names it', said.includes('16 字'), said.slice(0, 80));
    check('too many steps are refused too', said.includes('5 個步驟'));
    check('a key it invented is skipped', said.includes('不認得的項目 1 個'));
    check('and nothing at all was stored', (await val(() => localStorage.getItem('my2026.briefs.v1'))) === null);

    /* the prompt asks for ten characters a step, so the gate has to mean it */
    await page.fill('#dfPaste', JSON.stringify({
      [KUL]: { line: '入境後去飯店', because: 'x', steps: ['入境之後先去領行李再排隊'], need: '', fallback: '' },
    }));
    await page.click('#dfApply'); await page.waitForTimeout(400);
    check('a step longer than the prompt asked for is refused too',
      (await val(() => document.querySelector('#dfResult').textContent)).includes('12 字，超過 10')
      && (await val(() => localStorage.getItem('my2026.briefs.v1'))) === null,
      (await val(() => document.querySelector('#dfResult').textContent)).slice(0, 90));

    await page.fill('#dfPaste', JSON.stringify({
      [KUL]: { line: '入境後去飯店', because: '排隊加領行李要抓 1.5–2.5 小時。', steps: ['入境','領行李','去飯店'], need: '', fallback: '' },
    }));
    await page.click('#dfApply'); await page.waitForTimeout(400);
    check('a draft that obeys the rules is applied and says so',
      (await val(() => document.querySelector('#dfResult').textContent)).includes('已套用 1 個'));
    await page.click('#closeDraft'); await page.waitForTimeout(300);
    check('the row says out loud that nobody has checked it',
      (await val(() => document.querySelectorAll('.ai-flag').length)) === 1);
    await page.evaluate(() => document.querySelector('[data-peek*="入境、領行李"]').click());
    await page.waitForTimeout(400);
    check('and follower mode uses it like any written brief',
      (await read(page)).steps === '入境/領行李/去飯店');
    await page.click('#flExit'); await page.waitForTimeout(250);
    /* the flag is a claim about human attention, so reading it must clear it */
    await page.evaluate(() => document.querySelector('[data-edit*="入境、領行李"]').click());
    await page.waitForTimeout(350);
    await page.fill('#bfLine', '入境後直接去飯店');
    await page.evaluate(() => document.querySelector('#briefForm button[value=default]').click());
    await page.waitForTimeout(400);
    check('once a person has edited it, it stops being an AI draft',
      (await val(() => document.querySelectorAll('.ai-flag').length)) === 0
      && (await val(() => JSON.parse(localStorage.getItem('my2026.briefs.v1'))[
        '0|16:10–約19:00|KUL 入境、領行李 → Hotel Royal Signature'].by)) === 'me');
    check('no errors', !errs.length, errs[0] || '');
    await ctx.close();
  }
  /* applying is a bulk write, so it has to come back in one move — and
     drafting again has to stay possible, or one apply ends the experiment */
  {
    const { page, ctx, errs } = await open({ clock: '2026-09-17T14:00:00+08:00' });
    const val = fn => page.evaluate(fn);
    const KUL = '0|16:10–約19:00|KUL 入境、領行李 → Hotel Royal Signature';
    const CHECKOUT = '2|12:00|Hotel Royal Signature 退房／寄放行李';
    const draft = JSON.stringify({
      [KUL]: { line: '入境後去飯店', because: 'a', steps: ['入境'], need: '', fallback: '' },
      [CHECKOUT]: { line: '退房寄行李', because: 'b', steps: ['退房'], need: '', fallback: '' },
    });
    await page.click('#draftAllBtn'); await page.waitForTimeout(300);
    await page.fill('#dfPaste', draft);
    await page.click('#dfApply'); await page.waitForTimeout(400);
    check('after applying, undo is offered', await val(() => !document.querySelector('#dfUndo').hidden));
    await page.click('#dfUndo'); await page.waitForTimeout(400);
    check('and it puts everything back in one move',
      (await val(() => localStorage.getItem('my2026.briefs.v1'))) === '{}'
      && (await val(() => document.querySelectorAll('.ai-flag').length)) === 0);

    await page.fill('#dfPaste', draft);
    await page.click('#dfApply'); await page.waitForTimeout(400);
    await page.click('#closeDraft'); await page.waitForTimeout(250);
    await page.click('#draftAllBtn'); await page.waitForTimeout(350);
    check('an unchecked draft still counts as unwritten, so it can be redrafted',
      (await val(() => document.querySelector('#dfFor').textContent)).startsWith('5 個'),
      await val(() => document.querySelector('#dfFor').textContent));

    /* clearing is the way back for drafts applied in an earlier session, and
       it must not touch anything a person has already read */
    await page.evaluate(k => {
      const all = JSON.parse(localStorage.getItem('my2026.briefs.v1'));
      all[k] = { ...all[k], line: '我改過的', by: 'me' };
      localStorage.setItem('my2026.briefs.v1', JSON.stringify(all));
    }, CHECKOUT);
    await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForTimeout(800);
    await page.click('#draftAllBtn'); await page.waitForTimeout(350);
    check('the clear button counts only the unchecked ones',
      (await val(() => document.querySelector('#dfClearAi').textContent)).includes('1 筆'),
      await val(() => document.querySelector('#dfClearAi').textContent));
    await page.click('#dfClearAi'); await page.waitForTimeout(450);
    const left = JSON.parse(await val(() => localStorage.getItem('my2026.briefs.v1')));
    check('clearing keeps what a person checked and drops what they did not',
      Object.keys(left).length === 1 && left[CHECKOUT].line === '我改過的', JSON.stringify(Object.keys(left)));
    check('no errors', !errs.length, errs[0] || '');
    await ctx.close();
  }
  {
    const { page, ctx } = await open({ clock: '2026-09-17T14:00:00+08:00' });
    await page.click('#draftAllBtn'); await page.waitForTimeout(300);
    await page.click('#dfApply'); await page.waitForTimeout(200);
    check('pasting nothing is told what is wrong, not ignored',
      (await page.evaluate(() => document.querySelector('#dfResult').textContent)).includes('JSON'));
    await ctx.close();
  }

  for (const [label, value] of [
    ['malformed JSON', '{{{'],
    ['an array', '[1,2,3]'],
    ['a null override', '{"0|x|y":null}'],
    ['steps that are not strings', '{"0|16:10–約19:00|KUL 入境、領行李 → Hotel Royal Signature":{"steps":[1,null,{}]}}'],
  ]) {
    const { page, ctx, errs } = await open({ query: '?mode=follow', clock: '2026-10-08T17:30:00+08:00',
      seed: `localStorage.setItem('my2026.briefs.v1', ${JSON.stringify(value)})` });
    check(`a written brief stored as ${label} does not take the screen down`,
      !!(await read(page)).line && !errs.length, errs[0] || '');
    await ctx.close();
  }
  /* ?at= is how anybody checks a moment that has not arrived yet */
  {
    const { page, ctx, errs } = await open({ query: '?at=2026-10-13T11:45', clock: '2026-09-17T14:00:00+08:00' });
    const r = await read(page);
    check('a preview time shows that moment, without being in it', r.hot && r.cd === '2:45', `${r.cd}`);
    check('and it is in follower mode without being asked', await page.evaluate(() =>
      document.documentElement.dataset.mode === 'follow'));
    check('and the screen says it is a preview', await page.evaluate(() =>
      !document.querySelector('#flPreview').hidden));
    check('no errors', !errs.length, errs[0] || '');
    await ctx.close();
  }
  {
    const { page, ctx, errs } = await open({ query: '?at=garbage', clock: '2026-09-17T14:00:00+08:00' });
    check('an unparseable preview time is ignored rather than obeyed', await page.evaluate(() =>
      document.documentElement.dataset.mode !== 'follow'
      && document.querySelector('#flPreview').hidden));
    check('no errors', !errs.length, errs[0] || '');
    await ctx.close();
  }
  /* the link is the product: four people open it and are in follower mode
     without being told which button to press */
  {
    const { page, ctx, errs } = await open({ query: '?mode=follow', clock: '2026-10-13T11:45:00+08:00' });
    const val = fn => page.evaluate(fn);
    check('?mode=follow lands straight in follower mode with nothing stored',
      (await val(() => !document.querySelector('#follow').hidden)));
    check('and the parameter is gone from the URL afterwards',
      !(await val(() => location.search)).includes('mode'), await val(() => location.search));
    await page.click('#flExit'); await page.waitForTimeout(200);
    await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForTimeout(800);
    check('so leaving survives a reload instead of being dragged back in',
      (await val(() => document.querySelector('#follow').hidden)) === true);
    check('no errors', !errs.length, errs[0] || '');
    await ctx.close();
  }
  {
    const { page, ctx } = await open({ query: '#follow', clock: '2026-10-13T11:45:00+08:00' });
    check('#follow works too, for anything that eats query strings',
      (await page.evaluate(() => !document.querySelector('#follow').hidden)));
    await ctx.close();
  }
  {
    const { page, ctx } = await open({ clock: '2026-10-13T11:45:00+08:00' });
    await page.evaluate(() => { navigator.share = undefined;
      window.__c = ''; navigator.clipboard.writeText = t => { window.__c = t; return Promise.resolve(); }; });
    await page.click('#shareFollowBtn'); await page.waitForTimeout(300);
    const copied = await page.evaluate(() => window.__c);
    check('the leader can hand that link out in one tap', copied.endsWith('?mode=follow'), copied);
    check('and is told it worked', (await page.evaluate(() =>
      document.querySelector('#toast').textContent)).includes('已複製'));
    await ctx.close();
  }
  {
    const { page, ctx } = await open({ seed: follow, clock: '2026-10-13T11:45:00+08:00' });
    const val = fn => page.evaluate(fn);
    await page.click('#flExit'); await page.waitForTimeout(300);
    check('leaving returns the full app', (await val(() => document.querySelector('#follow').hidden)) === true
      && (await val(() => getComputedStyle(document.querySelector('.tabs')).display)) !== 'none');
    await page.click('#modeBtn'); await page.waitForTimeout(300);
    check('the header button goes back in', (await val(() => !document.querySelector('#follow').hidden)));
    await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForTimeout(800);
    check('the mode is remembered', (await val(() => !document.querySelector('#follow').hidden)));
    await page.click('#flMore'); await page.waitForTimeout(300);
    check('the fallback is the last thing you see when expanded',
      (await val(() => document.querySelector('#flFallback').textContent)).includes('長榮改票'));
    await ctx.close();
  }
}

console.log('\n── the app carries no knowledge of one particular trip ──');
{
  /* a different country, currency, party size, time zone and vocabulary,
     served in place of trip.js with no change to app.js */
  const { page, ctx, errs } = await open({ trip: path.join(HERE, 'fixtures/sample.trip.js'),
    clock: '2027-03-05T06:00:00+09:00' });
  const seen = await page.evaluate(() => ({
    title: document.title,
    h1: document.querySelector('#tripTitle').textContent,
    route: document.querySelector('#tripRoute').textContent,
    next: document.querySelector('#nextTitle').textContent,
    marked: document.querySelector('.tl-row.is-next .tl-card h3')?.textContent?.trim(),
    days: document.querySelectorAll('#dayStrip .day-chip').length,
    rows: document.querySelectorAll('.tl-row').length,
    money: document.querySelector('#costSummary strong')?.textContent,
    alert: document.querySelector('#alertText').textContent,
  }));
  check('the other trip renders end to end', !errs.length, errs[0] || '');
  check('its own name is in the shell', seen.title === '東京 3天2夜' && seen.h1 === seen.title, seen.h1);
  check('its route strip is built from its own flights', seen.route === 'TPENRTTPE', seen.route);
  check('its day strip is its own length', seen.days === 4, `${seen.days} chips for 3 days + 全部日期`);
  check('its countdown points at one of its rows', !!seen.marked && seen.next.length > 0, `${seen.next} → ${seen.marked}`);
  check('its money is in its own currency', seen.money?.startsWith('¥'), seen.money);
  check('its alert is its own', seen.alert.includes('成田'), seen.alert);
  await ctx.close();
}

console.log(fails.length ? `\n${fails.length} FAILING: ${fails.join(', ')}` : '\nall clear');
await browser.close();
process.exit(fails.length ? 1 : 0);
