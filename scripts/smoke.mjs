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
const phone = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true };

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
