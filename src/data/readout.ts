// The profile the console reads on the way up.
//
// Every line is DERIVED, never written here. The boot streams a few dozen rows
// past too fast to read, and the one thing that makes that honest rather than
// decorative is that all of it is true — so it is generated from the same files
// the pages render from. Change a venue in publications.ts and the boot changes
// with it; there is no second copy to drift.
//
// It answers three questions and stops: where he studied, what he researched,
// what he works with. Employment, per-project metrics and the channel came out
// — the boot is an index, not a second copy of the site.
//
// One row in each of the three sections is marked `lock`, and the stream holds
// on it long enough to read: the degree, the throughline the four led papers
// share, and the serving stack. They are chosen against the panel underneath —
// it already carries ICML/AAAI and the four-paper line, and a boot that repeats
// the page it is covering is worth nothing.
import { basics, education, skills } from './cv';
import { publications, inProgress } from './publications';


export type LineKind = 'head' | 'row' | 'lock';
export interface Line { k: LineKind; t: string; }

/** Source strings carry markup (titleHtml, resultHtml, summary). Strip it, and
 *  flatten the arrows and dashes the prose uses into console-safe glyphs. */
const plain = (s: string) =>
  s.replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/—/g, '-')
    .replace(/→/g, '->')
    .replace(/·/g, '/')
    .replace(/\s+/g, ' ')
    .trim();

/** The window is a fixed width of monospace; anything longer would wrap and
 *  break the line grid the tape steps through. */
const clip = (s: string, n = 58) => (s.length > n ? s.slice(0, n - 1) + '…' : s);
const up = (s: string) => plain(s).toUpperCase();

const head = (t: string): Line => ({ k: 'head', t: '> ' + t });
const row = (t: string): Line => ({ k: 'row', t: '  ' + clip(t) });
const lock = (t: string): Line => ({ k: 'lock', t: '* ' + clip(t) });

/** Pad so the columns line up the way a readout's do. The left cell is clipped
 *  to its own width, not just padded — a venue like "ICML 2022 Workshop" ran
 *  straight through the gap and butted against the next column. */
const col = (a: string, b: string, w = 15) =>
  (a.length > w - 2 ? a.slice(0, w - 2) : a).padEnd(w) + b;

/** Break a list across rows instead of clipping it. The serving stack is nine
 *  tools; as one row it lost four of them to the ellipsis, and a readout that
 *  truncates the answer to "what do you work with" is answering badly. */
function wrap(items: string[], w = 56): string[] {
  const out: string[] = [];
  let cur = '';
  for (const it of items) {
    const next = cur ? `${cur}  ${it}` : it;
    if (next.length > w && cur) { out.push(cur); cur = it; } else cur = next;
  }
  if (cur) out.push(cur);
  return out;
}

function build(): Line[] {
  const L: Line[] = [];

  L.push(head('MAGI / PROFILE'));
  L.push(row(col('SUBJECT', up(basics.name))));
  L.push(row(col('DESIGNATION', up(basics.label))));

  L.push(head('RECORD / EDUCATION'));
  education.forEach((e, i) => {
    // Abbreviated so the whole line survives the clip: this is a lock, and a
    // line the tape parks on for a third of a second has to be readable to its
    // last character.
    const deg = up(e.degree).replace('ENGINEERING', 'ENG.').replace(', ', ' ');
    // Narrow column and years only. At the default width the line ran past the
    // clip and the lock lost its dates — the exact half of the fact that makes
    // it worth parking on.
    const line = col(up(e.org), `${deg}  ${e.start.slice(0, 4)}-${e.end.slice(0, 4)}`, 8);
    L.push(i === 0 ? lock(line) : row(line));
    if (e.note) L.push(row(col('', up(e.note), 8)));
  });

  const withVenue = publications.filter((p) => p.venue);
  const led = withVenue.filter((p) => !p.minor);
  L.push(head(`RESEARCH / ${String(withVenue.length).padStart(2, '0')}   LED ${String(led.length).padStart(2, '0')}`));
  withVenue.forEach((p) => {
    L.push(row(col(p.venue!.toUpperCase().replace(' WORKSHOP',' WS'), `${(p.acronym ?? '--').padEnd(6)} ${(p.role ?? '').toUpperCase()}`)));
    L.push(row(col('', up(p.title))));
    if (p.angle) L.push(row(col('', up(p.angle))));
  });

  // The throughline, assembled from the levers the four led papers name — the
  // one line that says what the research IS rather than listing what it was.
  L.push(lock(led.map((p) => up(p.angle ?? '').split(' / ')[0]).filter(Boolean).join(' / ')));

  L.push(head(`RESEARCH / OPEN   ${String(inProgress.length).padStart(2, '0')}   WITHHELD`));
  inProgress.forEach((w) => L.push(row(col(up(w.topic), '████████████', 30))));

  // Serving is the group that gets held: it is the longest list and the one
  // that says he takes a model all the way out to traffic.
  skills.forEach((g) => {
    L.push(head('STACK / ' + up(g.name)));
    const rows = wrap(g.items.map(up));
    const hold = /SERVING/.test(up(g.name));
    rows.forEach((r, i) => L.push(hold && i === 0 ? lock(r) : row('  ' + r)));
  });

  return L;
}

export const readout: Line[] = build();
/** Indices the tape parks on. Computed, not hand-numbered — inserting a line
 *  anywhere above a lock would otherwise silently park the tape on the wrong
 *  row, and nothing about the finished animation would look wrong. */
export const lockIndices: number[] = readout
  .map((l, i) => (l.k === 'lock' ? i : -1))
  .filter((i) => i >= 0);
