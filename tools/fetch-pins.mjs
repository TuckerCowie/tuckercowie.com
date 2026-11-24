// Downloads the reference pins for one mood so a critic can look at them.
//   node tools/fetch-pins.mjs <mood> [outDir]
//
// The pins are other people's work. They are written under var/, which is
// gitignored, and must never be committed. Where a pin cannot be fetched,
// its `teaches` line in references.yaml stands in.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mood = process.argv[2];
const out = path.resolve(root, process.argv[3] ?? `var/pins/${mood}`);
if (!mood) { console.error('usage: node tools/fetch-pins.mjs <mood> [outDir]'); process.exit(1); }
fs.mkdirSync(out, { recursive: true });

const refs = parse(fs.readFileSync(path.join(root, 'docs/product/design/references/references.yaml'), 'utf8')).references
  .filter((r) => r.for.includes(mood));
const curl = (args) => execFileSync('curl', ['-sS', '-L', '--max-time', '40', '-A', 'Mozilla/5.0', ...args], { maxBuffer: 64 * 1024 * 1024 });

const lines = [];
for (const r of refs) {
  let got = null;
  try {
    const page = curl([r.url]).toString();
    // The pin's own image is the page's og:image. Prefer its full-size original.
    const og = page.match(/<meta content="(https:\/\/i\.pinimg\.com\/[^"]+)"[^>]*property="og:image"/);
    if (og) {
      const hash = og[1].replace(/^https:\/\/i\.pinimg\.com\/[^/]+\//, '').replace(/\.[a-z]+$/, '');
      const orig = page.match(new RegExp(`https://i\\.pinimg\\.com/originals/${hash}\\.(?:jpg|png|webp|gif)`));
      for (const url of [orig?.[0], og[1]].filter(Boolean)) {
        const file = path.join(out, `${r.id}${path.extname(url)}`);
        fs.writeFileSync(file, curl([url]));
        if (fs.statSync(file).size > 2000) { got = path.basename(file); break; }
        fs.rmSync(file);
      }
    }
  } catch { /* fall through to the teaches line */ }
  lines.push(`${r.id}\t${got ?? '(not fetched)'}\t${r.teaches}`);
  console.log(lines.at(-1));
}
fs.writeFileSync(path.join(out, 'index.tsv'), 'id\tfile\tteaches\n' + lines.join('\n') + '\n');
