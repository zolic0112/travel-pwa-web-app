#!/usr/bin/env node
/*
 * Validates a trip file against what app.js actually assumes about it.
 * Runs in CI on trip.js; takes a path to check any other trip:
 *
 *   node scripts/check-trip.mjs               # trip.js
 *   node scripts/check-trip.mjs other-trip.js
 *
 * The point is that a new trip fails here, with a line you can act on,
 * rather than silently rendering an empty countdown on the road.
 */
import fs from 'node:fs';
import path from 'node:path';

const file = process.argv[2] || 'trip.js';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const src = fs.readFileSync(path.resolve(root, file), 'utf8');

/* the file assigns to window; give it one */
const window = {};
new Function('window', src)(window);
const trip = window.TRIP;

/* the icon names app.js can actually draw */
const icons = new Set([...fs.readFileSync(path.resolve(root, 'app.js'), 'utf8')
  .matchAll(/^\s{2}(\w+):P\(/gm)].map(m => m[1]));

const errs = [];
const bad = (where, msg) => errs.push(`${where}: ${msg}`);
const isStr = v => typeof v === 'string' && v.length > 0;

/* ── meta ── */
const m = trip.meta || {};
for (const k of ['id','title','shortTitle','subtitle','description','tz','timeZone','checkedOn'])
  if (!isStr(m[k])) bad('meta', `${k} must be a non-empty string`);
if (m.id && !/^[A-Za-z0-9_-]+$/.test(m.id)) bad('meta.id', 'is a localStorage key prefix; keep it to letters, digits, - and _');
if (!(Number.isInteger(m.party) && m.party > 0)) bad('meta', 'party must be a positive integer');
if (m.tz && !/^[+-]\d{2}:\d{2}$/.test(m.tz)) bad('meta.tz', 'must look like +08:00');
if (m.timeZone) { try { new Intl.DateTimeFormat('en', { timeZone: m.timeZone }); }
  catch { bad('meta.timeZone', `${m.timeZone} is not an IANA zone`); } }
if (!isStr(m.currency?.prefix) || !isStr(m.currency?.locale)) bad('meta.currency', 'needs prefix and locale');
if (!isStr(m.alert?.title) || !isStr(m.alert?.text)) bad('meta.alert', 'needs title and text');

/* ── types ── */
const types = trip.types || {};
if (!Object.keys(types).length) bad('types', 'no event types defined');
for (const [name, t] of Object.entries(types)) {
  if (!icons.has(t.icon)) bad(`types.${name}`, `icon "${t.icon}" is not one app.js has`);
  if (t.group && !['transport','stay'].includes(t.group)) bad(`types.${name}`, `group "${t.group}" is not transport or stay`);
}
if (!Object.keys(types).some(t => types[t].plannable)) bad('types', 'no plannable type, so the planner dialog would offer nothing');

/* ── days and events ── */
const days = trip.days || [];
if (!days.length) bad('days', 'a trip needs at least one day');
let prev = '';
days.forEach((d, i) => {
  const at = `days[${i}]`;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date || '')) bad(at, 'date must be YYYY-MM-DD');
  else if (d.date <= prev) bad(at, `date ${d.date} does not come after ${prev}; days must be in order`);
  prev = d.date || prev;
  if (!isStr(d.label)) bad(at, 'label is what the day heading and chips show');
  if (!Array.isArray(d.events) || !d.events.length) bad(at, 'has no events');
  (d.events || []).forEach((e, j) => {
    const ev = `${at}.events[${j}] "${e.title || '?'}"`;
    for (const k of ['time','type','title','status','note']) if (!isStr(e[k])) bad(ev, `${k} must be a non-empty string`);
    if (!Array.isArray(e.meta)) bad(ev, 'meta must be an array of chips');
    if (e.type && !types[e.type]) bad(ev, `type "${e.type}" is not declared in types`);
    if (e.status && !/^[✓✕⚠]/.test(e.status)) bad(ev, 'status must start with ✓, ✕ or ⚠ — the colour is chosen from it');
    if (e.level && !['critical','caution'].includes(e.level)) bad(ev, `level "${e.level}" is not critical or caution`);
    if (e.route) {
      const r = e.route;
      if (!['air','rail'].includes(r.kind)) bad(ev, 'route.kind must be air or rail');
      for (const k of ['no','from','to','dep','arr']) if (!isStr(r[k])) bad(ev, `route.${k} is required`);
      for (const k of ['dep','arr']) if (r[k] && !/^\d{2}:\d{2}$/.test(r[k])) bad(ev, `route.${k} must be HH:MM`);
    }
    if (e.brief) {
      /* This is what a follower is told to do with their brain switched off,
         so it is checked harder than anything else in the file. */
      const br = e.brief, at = `${ev} brief`;
      for (const k of ['line','because','need','fallback']) if (!isStr(br[k])) bad(at, `${k} is required`);
      if (isStr(br.line) && [...br.line].length > 12) bad(at, `line is ${[...br.line].length} characters; 12 is the limit — Chinese has no spaces, so a longer one breaks mid-word`);
      if (!Array.isArray(br.steps) || !br.steps.length || !br.steps.every(isStr)) bad(at, 'steps must be a non-empty array of strings');
      else if (br.steps.length > 4) bad(at, `${br.steps.length} steps; 4 is the limit for one glance`);
      /* Same number the drafting prompt asks for and the editor enforces —
         a limit only one of the three honours is not a limit. */
      else for (const st of br.steps) if ([...st].length > 10)
        bad(at, `step ${JSON.stringify(st)} is ${[...st].length} chars; 10 is the limit`);
      const w = br.window || {};
      for (const k of ['from','to']) {
        if (!isStr(w[k]) || Number.isNaN(+new Date(w[k]))) { bad(at, `window.${k} is not a date`); continue; }
        if (!/[+-]\d{2}:\d{2}$|Z$/.test(w[k])) bad(at, `window.${k} needs an explicit offset`);
      }
      for (const k of ['fromLabel','toLabel']) if (!isStr(w[k])) bad(at, `window.${k} is required`);
      const t0 = +new Date(w.from), t1 = +new Date(w.to);
      if (t0 && t1 && !(t0 < t1)) bad(at, 'window.from must come before window.to');
      if (w.wall != null) {
        const tw = +new Date(w.wall);
        if (Number.isNaN(tw)) bad(at, 'window.wall is not a date');
        else if (!(t0 <= tw && tw <= t1)) bad(at, 'window.wall falls outside from…to, so it would be drawn off the scale');
        if (!isStr(w.wallLabel)) bad(at, 'window.wall needs a wallLabel');
      }
      if (!e.milestone) bad(at, 'only an event with a milestone can carry a brief — nothing would ever show it');
    }
    if (e.milestone) {
      const ms = e.milestone;
      const t = new Date(ms.at);
      if (!isStr(ms.at) || Number.isNaN(+t)) bad(ev, 'milestone.at is not a date');
      else if (!/[+-]\d{2}:\d{2}$|Z$/.test(ms.at)) bad(ev, 'milestone.at needs an explicit offset, or it means a different moment per device');
      else if (ms.at.slice(0, 10) !== d.date) bad(ev, `milestone.at is on ${ms.at.slice(0,10)} but sits under ${d.date}`);
      if (!isStr(ms.detail)) bad(ev, 'milestone.detail is the line under the countdown title');
      if (ms.kind && !types[ms.kind]) bad(ev, `milestone.kind "${ms.kind}" is not declared in types`);
    }
  });
});
const stones = days.flatMap(d => d.events.filter(e => e.milestone));
if (!stones.length) bad('days', 'no event carries a milestone, so the countdown has nothing to count');

/* ── todos, costs, sources ── */
/* ticks are stored against these ids, so a duplicate or a renamed id moves
   somebody's saved state onto the wrong row — the bug that keying by array
   position used to cause on every insert. */
const todoIds = new Set();
(trip.todos || []).forEach((t, i) => {
  for (const k of ['id','due','title','why','priority']) if (!isStr(t[k])) bad(`todos[${i}]`, `${k} is required`);
  if (t.id && !/^[A-Za-z0-9_-]+$/.test(t.id)) bad(`todos[${i}]`, `id "${t.id}" must be letters, digits, - or _`);
  if (t.id && todoIds.has(t.id)) bad(`todos[${i}]`, `id "${t.id}" is used twice`);
  todoIds.add(t.id);
});
if (!(trip.todos || []).length) bad('todos', 'empty, so the to-do ring would divide by zero');
(trip.costs || []).forEach((c, i) => {
  if (!isStr(c.name)) bad(`costs[${i}]`, 'name is required');
  if (!Number.isFinite(c.total)) bad(`costs[${i}]`, 'total must be a number');
  if (!trip.categories?.[c.cat]) bad(`costs[${i}]`, `category "${c.cat}" has no colour in categories`);
  if (c.per != null && !Number.isFinite(c.per)) bad(`costs[${i}]`, 'per must be a number or null');
});
(trip.sources || []).forEach((s, i) => {
  if (!Array.isArray(s) || s.length !== 3 || !s.every(isStr)) bad(`sources[${i}]`, 'must be [name, what, url]');
  else if (!/^https?:\/\//.test(s[2])) bad(`sources[${i}]`, 'third entry must be a URL');
});

/* The manifest is static JSON the browser reads before any script runs, so it
   cannot be filled from the trip. It is the one place a second trip must be
   edited by hand — which is exactly why it is checked here. */
if (!process.argv[2]) {
  const mf = JSON.parse(fs.readFileSync(path.resolve(root, 'manifest.webmanifest'), 'utf8'));
  if (mf.name !== `${m.title}｜旅程助手`) bad('manifest.webmanifest', `name is "${mf.name}" but the trip is "${m.title}"`);
  if (mf.short_name !== m.shortTitle) bad('manifest.webmanifest', `short_name is "${mf.short_name}" but the trip says "${m.shortTitle}"`);
  if (mf.description !== m.description) bad('manifest.webmanifest', 'description does not match meta.description');
}

if (errs.length) { console.error(`${file}\n` + errs.map(e => '  ✕ ' + e).join('\n')); process.exit(1); }
console.log(`ok — ${file}: ${days.length} days, ${days.reduce((n,d)=>n+d.events.length,0)} events, `
  + `${stones.length} milestones, ${(trip.todos||[]).length} to-dos, ${(trip.costs||[]).length} costs`);
