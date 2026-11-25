// Capture every frame of Tucker's public portfolio board as a PNG.
//
//   node tools/capture-board.mjs <out-dir>
//   SCALE=2 node tools/capture-board.mjs <out-dir>     twice the pixels, for sharper artifacts
//   FRAMES=24,27,35 node tools/capture-board.mjs <out-dir>   only these frames
//
// Needs Playwright with Chromium. The board loads from several hosts, so a
// restricted network must allow: miro.com, mirostatic.com, r.miro.com,
// svc.eu01.miro.com, eventhub.eu01.miro.com,
// experimentation-evaluator.eu01.miro.com. Set HTTPS_PROXY if there is one.
//
// It opens the board's Frames panel and clicks each frame in turn, which
// zooms the canvas to fit that frame, then screenshots the canvas.
// Frames 42 and 43 carry contact details. Do not commit them.

import { chromium } from 'playwright';
import fs from 'node:fs';

const BOARD = 'https://miro.com/app/board/o9J_lLhlDmc=/';
const out = process.argv[2];
if (!out) { console.error('usage: node tools/capture-board.mjs <out-dir>'); process.exit(1); }
fs.mkdirSync(out, { recursive: true });

const VW = 2400, VH = 1350, ROW = 174; // ROW: height of one entry in the Frames panel
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
const browser = await chromium.launch({ proxy, args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: Number(process.env.SCALE ?? 1) })).newPage();

await page.goto(BOARD, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(30000); // the canvas and its images take a while
await page.click('[data-testid="notes-close-button"]').catch(() => {});
await page.click('[data-testid="action-item__FRAMES_LIST"]');
await page.waitForTimeout(3000);

const total = await page.evaluate((row) => {
  const list = document.querySelector('[data-testid="frames-sidebar__list"]');
  return list ? Math.round(list.getBoundingClientRect().height / row) : 0;
}, ROW);

// Miro paints a frame with low-resolution tiles first and sharpens them as
// they load. Wait until two screenshots in a row are identical.
async function settled(clip) {
  let last = null;
  for (let tries = 0; tries < 16; tries++) {
    await page.waitForTimeout(3000);
    const shot = await page.screenshot({ clip });
    if (last && shot.equals(last)) return shot;
    last = shot;
  }
  return last;
}

const only = process.env.FRAMES ? new Set(process.env.FRAMES.split(',').map(Number)) : null;
const titles = [];
for (let i = 0; i < total; i++) {
  // The list is virtualised, so scroll each entry into existence first.
  await page.evaluate(([i, row]) => {
    const list = document.querySelector('[data-testid="frames-sidebar__list"]');
    let s = list && list.parentElement;
    while (s && s.scrollHeight <= s.clientHeight + 5) s = s.parentElement;
    if (s) s.scrollTop = Math.max(0, i * row - 200);
  }, [i, ROW]);
  await page.waitForTimeout(500);
  const el = await page.$(`[data-testid="frame${i}"]`);
  // The list only renders entries near the selected one, so a skipped frame
  // is still selected briefly to keep the list moving.
  if (only && !only.has(i + 1)) { if (el) { await el.click(); await page.waitForTimeout(400); } continue; }
  if (!el) { console.warn('missing frame', i + 1); continue; }
  const title = (await el.innerText()).replace(/\n/g, ' ').trim();
  await el.click();
  await page.waitForTimeout(2500);
  const n = String(i + 1).padStart(2, '0');
  fs.writeFileSync(`${out}/frame-${n}.png`, await settled({ x: 60, y: 64, width: VW - 420, height: VH - 64 }));
  titles.push({ frame: n, title });
}
fs.writeFileSync(`${out}/frames.json`, JSON.stringify(titles, null, 1));
console.log(`captured ${titles.length} of ${total} frames`);
await browser.close();
