// Screenshots of built pages, for looking at.
//   node tools/shots.mjs [--dir dist] [--out var/shots] [--moods still,deep,cyber] [--pages home,case-study] [--widths 1440,390] [--full]
//
// Without --full each shot is the first 1800px of the page (first view for
// home). With --full it is the whole page.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, serveDir, open, clip, PAGES } from './lib/capture.mjs';
import { moods } from '../src/moods/registry.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf(`--${k}`); return i === -1 ? d : argv[i + 1]; };
const dir = path.resolve(root, opt('dir', 'dist'));
const out = path.resolve(root, opt('out', 'var/shots'));
const moodIds = opt('moods', moods.map((m) => m.id).join(',')).split(',');
const pages = opt('pages', Object.keys(PAGES).join(',')).split(',');
const widths = opt('widths', '1440').split(',').map(Number);
const full = argv.includes('--full');
const scale = Number(opt('scale', '1'));
fs.mkdirSync(out, { recursive: true });

const server = await serveDir(dir);
const browser = await chromium.launch();
try {
  for (const mood of moodIds) for (const key of pages) for (const width of widths) {
    const height = width < 600 ? 844 : 900;
    const scheme = moods.find((m) => m.id === mood)?.scheme ?? 'light';
    const { context, page } = await open(browser, `${server.url}${PAGES[key].path}?mood=${mood}`, { width, height, scheme, scale });
    const file = path.join(out, `${mood}-${key}-${width}.png`);
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    await clip(page, file, { y: 0, height: full ? total : key === 'home' ? height : Math.min(1800, total), width });
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    console.log(path.relative(root, file), `${width}x${total}`, over > 0 ? `HORIZONTAL OVERFLOW by ${over}px` : 'no horizontal overflow');
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}
