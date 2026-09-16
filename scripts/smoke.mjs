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
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
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
  const { page, ctx, errs } = await open({ seed: `localStorage.setItem('myTrip2026.plans.v1', ${JSON.stringify(value)})` });
  const alive = await page.evaluate(() => !!document.querySelector('.tl-row') && !!document.querySelector('.tab'));
  check(`survives ${label}`, alive && !errs.length, errs[0] || (alive ? '' : 'nothing rendered'));
  await ctx.close();
}
{
  const { page, ctx } = await open({ seed: `localStorage.setItem('myTrip2026.todos', '["a","b","c"]')` });
  const pct = await page.evaluate(() => document.querySelector('#todoPercent').textContent);
  check('an array of to-do state does not tick anything', pct === '0%', `progress=${pct}`);
  await ctx.close();
}

console.log('\n── stored values reach templates as text, never as markup ──');
{
  const evil = '"><img src=x onerror="window.__pwned=1">';
  const { page, ctx } = await open({ seed: `localStorage.setItem('myTrip2026.plans.v1', JSON.stringify([
    {id:'a',date:'2026-10-08',time:${JSON.stringify(evil)},type:'景點',title:'t'},
    {id:'b',date:'2026-10-08',time:'10:00',type:${JSON.stringify(evil)},title:${JSON.stringify(evil)},
     duration:${JSON.stringify(evil)},note:${JSON.stringify(evil)}}]))` });
  await page.click('.tab[data-view="planner"]');
  await page.waitForTimeout(400);
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
