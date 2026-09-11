#!/usr/bin/env node
// Fails if styles.css references a custom property it never defines and gives
// no fallback. A dropped declaration is silent in CSS: every var() resolves to
// nothing, so corners go square and stacking collapses with no error anywhere.
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

// Definitions can share a line, so scan the whole text — but only after removing
// var() references, or `var(--x)` would count as defining --x.
const declarations = css.replace(/var\(\s*--[\w-]+/g, 'var(');
const defined = new Set([...declarations.matchAll(/(--[\w-]+)\s*:/g)].map(m => m[1]));

// A var() carrying a fallback is fine even when nothing declares it — that is
// how a property set from JS at runtime is meant to be written.
const required = new Set(
  [...css.matchAll(/var\(\s*(--[\w-]+)\s*([,)])/g)]
    .filter(m => m[2] === ')')
    .map(m => m[1])
);

// A selector left without a block swallows everything after it until the next
// closing brace, silently deleting whole sections of the stylesheet.
const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '');
if (stripped.split('{').length !== stripped.split('}').length) {
  console.error(`styles.css has unbalanced braces: ${stripped.split('{').length - 1} "{" vs ${stripped.split('}').length - 1} "}"`);
  process.exit(1);
}
const orphan = [...stripped.matchAll(/\n\s*([.#][^{}\n;]*[^{}\s;])\s*\n\s*(?=[.#@])/g)].map(m => m[1].trim());
if (orphan.length) {
  console.error('styles.css has selectors with no block:');
  for (const o of orphan) console.error(`  ${o.slice(0, 70)}`);
  process.exit(1);
}

const missing = [...required].filter(n => !defined.has(n)).sort();
if (missing.length) {
  console.error(`styles.css uses ${missing.length} undefined custom propert${missing.length === 1 ? 'y' : 'ies'}:`);
  for (const n of missing) {
    const uses = [...css.matchAll(new RegExp(`var\\(\\s*${n}\\b`, 'g'))].length;
    console.error(`  ${n} — ${uses} use${uses === 1 ? '' : 's'}`);
  }
  process.exit(1);
}
console.log(`ok — ${required.size} custom properties required, all defined`);
