// Catches the one CSS mistake this stylesheet keeps making: deleting a rule
// that a second consumer still points at.
//
// It has happened twice. .mc-lbl was removed with the markup it was written
// for, while the A.T. field cut still used the class for its header. Then
// @keyframes mc-show went the same way, and because a dangling animation name
// is SILENT — the animation just does not apply — the field cut shipped with no
// label and no verdict stamp, behind a click where nobody would look.
//
// Both are the same shape: a name referenced in one place and defined in none.
// Neither breaks the build, neither warns, and both look fine until the exact
// state that uses them.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Both stylesheets and components: Boot.astro computes its own @keyframes from
// the readout and emits them inline, so a check that only read global.css
// reported that one as undefined.
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return /\.(css|astro)$/.test(e.name) ? [p] : [];
  });
}
const files = walk('src');

// Comment markers must pair up. An unmatched */ leaves the prose after it
// sitting at top level as garbage, which is a parse error that silently eats
// the NEXT rule — that is how the per-ring collapse stopped applying while the
// stylesheet still looked correct and every animation name still resolved.
for (const f of files.filter((f) => f.endsWith('.css'))) {
  const t = readFileSync(f, 'utf8');
  const open = (t.match(/\/\*/g) || []).length;
  const close = (t.match(/\*\//g) || []).length;
  if (open !== close) {
    console.error(`\n${f}: ${open} "/*" against ${close} "*/".\n` +
      `An unmatched marker turns the prose after it into top-level garbage and\n` +
      `the rule that follows is dropped without a warning.\n`);
    process.exit(1);
  }
}

// Strip comments — the prose in here names animations on purpose.
const src = files
  .map((f) => readFileSync(f, 'utf8'))
  .join('\n')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');

const file = 'src';
const defined = new Set([...src.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]));

// `animation:` shorthand and `animation-name:` both. The shorthand's name is
// whatever token is not a time, a timing function, a count or a keyword.
const RESERVED = new Set([
  'none', 'infinite', 'normal', 'reverse', 'alternate', 'alternate-reverse',
  'forwards', 'backwards', 'both', 'running', 'paused', 'linear', 'ease',
  'ease-in', 'ease-out', 'ease-in-out', 'step-start', 'step-end', 'initial',
  'inherit', 'unset', 'revert',
]);
const used = new Set();
for (const m of src.matchAll(/animation(?:-name)?\s*:([^;}]+)/g)) {
  for (const part of m[1].split(',')) {
    for (const tok of part.trim().split(/\s+/)) {
      if (!tok || RESERVED.has(tok)) continue;
      if (/^[\d.]/.test(tok)) continue;                 // 0.82s, 3, 1.3s
      if (/^(steps|cubic-bezier|var)\(/.test(tok)) continue;
      if (/[()]/.test(tok)) continue;                   // tail of a function
      if (/^[\w-]+$/.test(tok)) used.add(tok);
    }
  }
}

const missing = [...used].filter((n) => !defined.has(n));
if (missing.length) {
  console.error(`\n${file}: animation name(s) referenced but never defined:\n` +
    missing.map((n) => `  - ${n}`).join('\n') +
    `\n\nA dangling @keyframes reference does not error — the animation silently\n` +
    `does not apply. Define it or drop the rule.\n`);
  process.exit(1);
}

const unused = [...defined].filter((n) => !used.has(n));
if (unused.length) console.warn(`${file}: unused @keyframes: ${unused.join(', ')}`);
console.log(`${file}: ${defined.size} keyframes, all ${used.size} references resolve.`);
