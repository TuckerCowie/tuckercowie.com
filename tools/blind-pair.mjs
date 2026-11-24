// Makes a blind, like-for-like pair for a critic: the built page beside the
// same band of the mood's reference study, as images named A and B.
//
//   node tools/blind-pair.mjs --mood cyber --page home --dir dist --out var/blind/cyber-home-r1
//
// Both sides are rendered by this script, at the same viewport, cropped to
// the same band and encoded the same way. The study's "study" label is
// replaced so neither image says which it is. Which of A and B is ours is
// random; the key is printed to stdout as JSON and saved under
// var/blind-keys/, never beside the images.
//
// The study pages are not in this repo. Copy them to var/study/<mood>.html
// from the reference artifact named in docs/product/build-goal.md.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium, serveDir, open, box, headingTop, clip, PAGES } from './lib/capture.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1]]] : acc), []));
const { mood, page: pageKey } = args;
if (!mood || !PAGES[pageKey]) { console.error(`usage: node tools/blind-pair.mjs --mood <id> --page <${Object.keys(PAGES).join('|')}> [--dir dist] [--out dir]`); process.exit(1); }
const dir = path.resolve(root, args.dir ?? 'dist');
const id = args.id ?? `${mood}-${pageKey}-${crypto.randomBytes(3).toString('hex')}`;
const out = path.resolve(root, args.out ?? `var/blind/${id}`);
const study = path.join(root, 'var/study', `${mood}.html`);
if (!fs.existsSync(study)) { console.error(`Missing ${path.relative(root, study)}. See the header of this file.`); process.exit(1); }
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const SEG_H = 1800;
const def = PAGES[pageKey];
const oursIs = crypto.randomInt(2) === 0 ? 'A' : 'B';
const name = (side, seg) => path.join(out, `${side === 'ours' ? oursIs : (oursIs === 'A' ? 'B' : 'A')}-${seg}.png`);
const scheme = mood === 'still' ? 'light' : 'dark';

// Neither side may say which it is.
const stripLabel = (page) => page.evaluate(() => {
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walk.nextNode(); n; n = walk.nextNode()) {
    if (/\b(design\s+)?study\b/i.test(n.nodeValue) && n.parentElement.closest('header, footer')) n.nodeValue = n.nodeValue.replace(/.*\bstudy\b.*/i, 'Tucker Cowie');
  }
});

async function capture(side, page, scope, width) {
  const mobile = width < 600;
  const suffix = mobile ? '-mobile' : '';
  const segs = [];
  if (pageKey === 'home') {
    // Home is one view, header included.
    const h = mobile ? 844 : 900;
    await clip(page, name(side, `1-first-view${suffix}`), { y: 0, height: h, width });
    segs.push(`1-first-view${suffix}`);
    return segs;
  }
  const b = await box(page, scope);
  await clip(page, name(side, `1-top${suffix}`), { y: b.top, height: Math.min(SEG_H, b.height), width });
  segs.push(`1-top${suffix}`);
  if (mobile) return segs;
  if (pageKey === 'case-study') {
    const y = await headingTop(page, scope, 'partner insights');
    if (y !== null) { await clip(page, name(side, '2-insight'), { y: y - 140, height: Math.min(SEG_H, b.bottom - y + 140), width }); segs.push('2-insight'); }
    const s = await headingTop(page, scope, '^\\s*solution');
    if (s !== null) { await clip(page, name(side, '3-solution'), { y: s - 140, height: Math.min(SEG_H, b.bottom - s + 140), width }); segs.push('3-solution'); }
  } else if (b.height > SEG_H * 1.15) {
    await clip(page, name(side, '2-next'), { y: b.top + SEG_H, height: Math.min(SEG_H, b.height - SEG_H), width });
    segs.push('2-next');
  }
  return segs;
}

const server = await serveDir(dir);
const browser = await chromium.launch();
let segments = [];
try {
  for (const width of [1440, 390]) {
    const height = width < 600 ? 844 : 900;
    const ours = await open(browser, `${server.url}${def.path}?mood=${mood}`, { width, height, scheme });
    const a = await capture('ours', ours.page, 'main', width);
    await ours.context.close();
    const theirs = await open(browser, pathToFileURL(study).href, { width, height, scheme });
    await stripLabel(theirs.page);
    const b = await capture('study', theirs.page, `#${def.band}`, width);
    await theirs.context.close();
    segments.push(...a.filter((s) => b.includes(s)));
    for (const s of [...a, ...b]) if (!(a.includes(s) && b.includes(s))) for (const side of ['A', 'B']) fs.rmSync(path.join(out, `${side}-${s}.png`), { force: true });
  }
} finally {
  await browser.close();
  server.close();
}

const key = { id, mood, page: pageKey, dir: path.relative(root, out), segments, ours: oursIs };
fs.mkdirSync(path.join(root, 'var/blind-keys'), { recursive: true });
fs.writeFileSync(path.join(root, 'var/blind-keys', `${id}.json`), JSON.stringify(key, null, 2) + '\n');
console.log(JSON.stringify(key));
