// Shared capture helpers for tools/shots.mjs and tools/blind-pair.mjs.

import { chromium } from '@playwright/test';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif' };

// Serves a directory on a free port. Returns { url, close }.
export function serveDir(dir) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (p.endsWith('/')) p += 'index.html';
      const file = path.join(dir, p);
      if (!file.startsWith(dir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404).end('Not found'); return; }
      res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => resolve({ url: `http://127.0.0.1:${server.address().port}`, close: () => server.close() }));
  });
}

export const PAGES = {
  home: { path: '/', band: 'home' },
  'case-study': { path: '/work/smart-pool-crm/', band: 'case-study' },
  work: { path: '/work/', band: 'work' },
  works: { path: '/work/ledger/', band: 'works' },
  profile: { path: '/profile/', band: 'profile' },
  systems: { path: '/systems/', band: 'systems' },
  specimen: { path: '/specimen/', band: 'specimen' },
};

export async function open(browser, url, { width = 1440, height = 900, scheme = 'light', scale = 1 } = {}) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: scale, colorScheme: scheme });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'load' });
  await settle(page);
  return { context, page };
}

// Scrolls the whole page once so lazy images load and one-time entrance
// effects have run, then returns to the top and waits for fonts and images.
export async function settle(page) {
  await page.evaluate(async () => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    for (const img of document.images) img.loading = 'eager';
    const step = Math.max(200, window.innerHeight * 0.8);
    const total = Math.min(document.documentElement.scrollHeight, 60000);
    for (let y = 0; y < total; y += step) { window.scrollTo(0, y); await wait(40); }
    window.scrollTo(0, 0);
    await Promise.race([document.fonts.ready, wait(4000)]);
    await Promise.race([
      Promise.all([...document.images].map((img) => img.complete ? null : new Promise((r) => { img.addEventListener('load', r); img.addEventListener('error', r); }))),
      wait(8000),
    ]);
  });
  await page.waitForTimeout(700);
}

export async function box(page, selector) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { top: r.top + scrollY, height: r.height, bottom: r.top + scrollY + r.height };
  }, selector);
}

// The page offset of the first heading whose text matches, inside `scope`.
export async function headingTop(page, scope, pattern) {
  return page.evaluate(([sel, src]) => {
    const re = new RegExp(src, 'i');
    const root = document.querySelector(sel);
    if (!root) return null;
    const h = [...root.querySelectorAll('h1,h2,h3,h4')].find((x) => re.test(x.textContent));
    return h ? h.getBoundingClientRect().top + scrollY : null;
  }, [scope, pattern]);
}

export async function clip(page, file, { y, height, width }) {
  const max = await page.evaluate(() => document.documentElement.scrollHeight);
  const top = Math.max(0, Math.round(y));
  const h = Math.max(1, Math.min(Math.round(height), max - top));
  await page.screenshot({ path: file, fullPage: true, clip: { x: 0, y: top, width, height: h }, animations: 'allow' });
}

export { chromium };
