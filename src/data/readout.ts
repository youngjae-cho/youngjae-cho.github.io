// The profile the console reads on the way up.
//
// Every line is DERIVED, never written here. The boot streams a few dozen rows
// past too fast to read, and the one thing that makes that honest rather than
// decorative is that all of it is true — so it is generated from the same files
// the pages render from. Change a venue in publications.ts and the boot changes
// with it; there is no second copy to drift.
//
// Three of the rows are marked `lock`. The stream holds on each one long enough
// to read, and they are chosen to be things the intro panel does NOT already
// say: the degree, the auto-labeling delta, the hackathon result. The panel
// behind this overlay covers ICML/AAAI and the four-paper line already, and a
// boot that repeats the page it is covering is worth nothing.
import { basics, work, education, skills, awards } from './cv';
import { publications, inProgress } from './publications';
import { projects } from './projects';

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

/** The two numeric locks are quoted from the case studies rather than derived,
 *  because the figures live inside prose there. So they are VERIFIED instead:
 *  if the sentence they came from stops containing them, the build fails rather
 *  than the boot quietly asserting a number the site no longer makes. */
function assertQuoted(key: string, needles: string[]) {
  const src = plain(projects.find((p) => p.key === key)?.resultHtml ?? '');
  for (const n of needles) {
    if (!src.includes(n))
      throw new Error(`readout.ts: "${n}" is no longer in the ${key} result — the boot would be quoting a figure the site dropped.`);
  }
}

function build(): Line[] {
  const L: Line[] = [];

  L.push(head('MAGI / PROFILE'));
  L.push(row(col('SUBJECT', up(basics.name))));
  L.push(row(col('DESIGNATION', up(basics.label))));
  L.push(row(col('LOCATION', up(basics.location))));
  L.push(row(col('CONTACT', basics.email.toUpperCase())));

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

  L.push(head('RECORD / SERVICE'));
  work.forEach((w) =>
    L.push(row(col(up(w.org), `${up(w.role)}  ${w.start}-${w.end.toUpperCase()}`))));

  const withVenue = publications.filter((p) => p.venue);
  const led = withVenue.filter((p) => !p.minor);
  L.push(head(`PUB / ${String(withVenue.length).padStart(2, '0')}   LED ${String(led.length).padStart(2, '0')}`));
  withVenue.forEach((p) => {
    L.push(row(col(p.venue!.toUpperCase(), `${(p.acronym ?? '--').padEnd(6)} ${(p.role ?? '').toUpperCase()}`)));
    L.push(row(col('', up(p.title))));
    if (p.angle) L.push(row(col('', up(p.angle))));
  });

  L.push(head(`PUB / OPEN   ${String(inProgress.length).padStart(2, '0')}   WITHHELD`));
  inProgress.forEach((w) => L.push(row(col(up(w.topic), '████████████', 30))));

  const chipsOf = (key: string) => (projects.find((p) => p.key === key)?.chips ?? []).map(up);
  assertQuoted('autolabel', ['0.777', '0.857', '+0.080']);
  L.push(head('METRIC / CONTENT-SAFETY'));
  L.push(lock('MACRO F1  0.777 -> 0.857   DELTA +0.080'));
  L.push(row(chipsOf('autolabel').slice(2).join('   ')));

  L.push(head('OWNERSHIP'));
  projects.forEach((p) => {
    L.push(row(col(p.track.toUpperCase(), up(p.titleHtml))));
    L.push(row(col('', up(p.resultHtml))));
  });

  // Deliberately after OWNERSHIP rather than next to the other metric block.
  // Back to back, two of the three locks sat three lines apart and the tape
  // barely moved between them — two holds with no run in between is one hold
  // that stutters.
  assertQuoted('hackathon', ['0.927']);
  L.push(head('METRIC / NEMOTRON'));
  L.push(lock('TEMPORAL IOU 0.927   TRACK B  1ST'));
  awards.forEach((a) => L.push(row(col(a.date, up(a.name)))));

  skills.forEach((g) => {
    L.push(head('STACK / ' + up(g.name)));
    L.push(row(g.items.map(up).join('  ')));
  });

  L.push(head('ELSEWHERE'));
  L.push(row(col('MOODRAINBOW', 'LO-FI / JAZZ   3.5M + 3.2M VIEWS')));

  return L;
}

export const readout: Line[] = build();
/** Indices the tape parks on. Computed, not hand-numbered — inserting a line
 *  anywhere above a lock would otherwise silently park the tape on the wrong
 *  row, and nothing about the finished animation would look wrong. */
export const lockIndices: number[] = readout
  .map((l, i) => (l.k === 'lock' ? i : -1))
  .filter((i) => i >= 0);
