// Writes docs/product/build/critic-log.md from the saved results of the
// blind rounds (var/critic-runs/*.json, one file per run, in name order).
//   node tools/critic-log.mjs
//
// Each run file is the list a mood-loop workflow returns: per lane, its
// rounds, and per round one result for each mood and page that was judged.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'var/critic-runs');
const MOOD = { still: 'Still Water', deep: 'Deep Water', cyber: 'Cyber' };
const PAGE = { home: 'Home', 'case-study': 'Case study', work: 'Work index', works: 'Works ledger', profile: 'Profile', systems: 'Systems', specimen: 'Specimen' };

const rows = [];
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) {
  const run = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  for (const lane of run) for (const r of lane.rounds ?? []) for (const x of r.results ?? []) rows.push({ run: f.replace(/\.json$/, ''), round: r.round, ...x });
}

const clean = (s) => String(s).replace(/\s+/g, ' ').replace(/—/g, ', ').replace(/\bours's\b/g, 'our page\'s').trim();
const latest = new Map();
for (const r of rows) latest.set(`${r.mood}/${r.page}`, r);

let out = `# Critic log

Every blind comparison, losses included. For each page and mood a fresh
critic was shown our rendered page beside the same band of that mood's
reference study, as images named A and B with the study's label removed and
the sides chosen at random. The critic picked one, then named the defects of
both and where each falls short of the saved reference pins. "Ours" and "the
reference" below replace A and B after the fact.

Written by \`tools/critic-log.mjs\` from the saved results.

## Standing

| Mood | Page | Last verdict | Margin | Round |
|---|---|---|---|---|
${[...latest.values()].sort((a, b) => Object.keys(MOOD).indexOf(a.mood) - Object.keys(MOOD).indexOf(b.mood) || Object.keys(PAGE).indexOf(a.page) - Object.keys(PAGE).indexOf(b.page)).map((r) => `| ${MOOD[r.mood]} | ${PAGE[r.page] ?? r.page} | ${r.oursWon ? 'Ours' : 'The reference'}${r.votes ? ` (${r.votes})` : ''} | ${r.margin} | ${r.round} |`).join('\n')}

## Rounds
`;
let last = '';
for (const r of rows) {
  const h = `Round ${r.round}`;
  if (h !== last) { out += `\n### ${h}\n`; last = h; }
  out += `\n#### ${MOOD[r.mood]}, ${PAGE[r.page] ?? r.page}: ${r.oursWon ? 'ours picked' : 'the reference picked'} (${r.margin}${r.votes ? `, ${r.votes}` : ''})\n\n${clean(r.why)}\n`;
  if (r.oursDefects?.length) out += `\nDefects of ours, most damaging first:\n\n${r.oursDefects.map((d, i) => `${i + 1}. ${clean(d)}`).join('\n')}\n`;
  if (r.oursPins?.length) out += `\nWhere ours falls short of the pins:\n\n${r.oursPins.map((d, i) => `${i + 1}. ${clean(d)}`).join('\n')}\n`;
}
fs.mkdirSync(path.join(root, 'docs/product/build'), { recursive: true });
fs.writeFileSync(path.join(root, 'docs/product/build/critic-log.md'), out);
console.log(`${rows.length} verdicts written to docs/product/build/critic-log.md`);
