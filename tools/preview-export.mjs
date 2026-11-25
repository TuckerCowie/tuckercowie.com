// Builds a copy of the site that can be served from any folder or file host:
// every URL is relative. Used for the private preview.
//
//   node tools/preview-export.mjs [outDir]        default var/preview
//
// Writes <outDir>/site/ (the site, drafts included), one small entry page per
// mood (site/mood-<id>.html, which saves that mood and opens the home page,
// for hosts that drop query strings), and <outDir>/files.json: the files in
// batches that respect a host's per-upload limits.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { moods, storageKey } from '../src/moods/registry.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.resolve(root, process.argv[2] ?? 'var/preview');
const site = path.join(out, 'site');
const MAX_FILES = 240, MAX_BYTES = 56 * 1024 * 1024;

execFileSync('node', ['src/build/build.mjs', '--out', site], { cwd: root, env: { ...process.env, PREVIEW: '1', BASE: 'relative' }, stdio: 'inherit' });

for (const m of moods) {
  fs.writeFileSync(path.join(site, `mood-${m.id}.html`), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${m.name}</title>
<script>try{localStorage.setItem(${JSON.stringify(storageKey)},${JSON.stringify(m.id)})}catch(e){}location.replace("index.html")</script>
</head><body><p><a href="index.html">Open the site</a>. Choose ${m.name} with the mood switcher at the top of the page.</p></body></html>
`);
}

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]);
const files = walk(site).map((f) => ({ path: 'site/' + path.relative(site, f).split(path.sep).join('/'), from: path.relative(root, f), bytes: fs.statSync(f).size }));
// Pages, styles, scripts and fonts first, so the first batch alone is a working site.
const rank = (f) => (/\.(html|css|js|json|svg|txt|woff2)$/.test(f.path) ? 0 : 1);
files.sort((a, b) => rank(a) - rank(b) || a.path.localeCompare(b.path));
const batches = [[]];
let bytes = 0;
for (const f of files) {
  if (batches.at(-1).length >= MAX_FILES || bytes + f.bytes > MAX_BYTES) { batches.push([]); bytes = 0; }
  batches.at(-1).push(f); bytes += f.bytes;
}
fs.writeFileSync(path.join(out, 'files.json'), JSON.stringify(batches.map((b) => Object.fromEntries(b.map((f) => [f.path, f.from]))), null, 1));
console.log(`${files.length} files, ${(files.reduce((n, f) => n + f.bytes, 0) / 1048576).toFixed(1)} MB, in ${batches.length} batch${batches.length === 1 ? '' : 'es'} (${batches.map((b) => b.length).join(', ')}). Entry pages: ${moods.map((m) => `site/mood-${m.id}.html`).join(', ')}`);
