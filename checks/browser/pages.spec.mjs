// Every key page, in every mood, at three widths. The mood contract, items 8
// and 9: each mood stands on its own for access, and a broken layout fails.
//
// A screenshot of each combination is written to var/shots/check/ on every
// run. Assertions decide pass or fail; the screenshots are for people.

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { moods, param } from '../../src/moods/registry.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const shots = path.join(root, 'var/shots/check');
fs.mkdirSync(shots, { recursive: true });

// The first entry page with plates and images, and the first written one.
const dist = path.join(root, process.env.CHECK_DIR ?? 'dist');
const entryPages = fs.existsSync(path.join(dist, 'work')) ? fs.readdirSync(path.join(dist, 'work'), { withFileTypes: true })
  .filter((d) => d.isDirectory() && !['type', 'org', 'skill', 'c', 'ledger'].includes(d.name))
  .map((d) => ({ slug: d.name, html: fs.readFileSync(path.join(dist, 'work', d.name, 'index.html'), 'utf8') })) : [];
const visual = entryPages.find((e) => /class="artifact"/.test(e.html));
const written = entryPages.find((e) => /class="entry"[^>]*data-written/.test(e.html));

const PAGES = [
  { key: 'home', path: '/' },
  { key: 'work', path: '/work/' },
  visual && { key: 'entry', path: `/work/${visual.slug}/` },
  written && { key: 'written', path: `/work/${written.slug}/` },
  { key: 'ledger', path: '/work/ledger/' },
  { key: 'profile', path: '/profile/' },
  { key: 'systems', path: '/systems/' },
  { key: 'specimen', path: '/specimen/' },
  { key: 'resume', path: '/resume/' },
  { key: 'notfound', path: '/404.html' },
].filter(Boolean);
const WIDTHS = [320, 768, 1440];
const url = (p, mood) => `${p}?${param}=${mood}`;

async function ready(page) {
  await page.evaluate(async () => {
    for (const img of document.images) img.loading = 'eager';
    await document.fonts.ready;
    await Promise.race([
      Promise.all([...document.images].map((i) => i.complete ? null : new Promise((r) => { i.addEventListener('load', r); i.addEventListener('error', r); }))),
      new Promise((r) => setTimeout(r, 8000)),
    ]);
    await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
  });
}

// Layout problems, measured in the page.
const layoutProblems = () => {
  const out = [];
  const vw = document.documentElement.clientWidth;
  const name = (el) => `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : ''}`;
  if (document.documentElement.scrollWidth > vw + 1) out.push(`the page scrolls sideways: ${document.documentElement.scrollWidth}px of content in ${vw}px`);
  for (const el of document.querySelectorAll('[data-c]')) {
    const r = el.getBoundingClientRect();
    if (r.width && (r.left < -1 || r.right > vw + 1)) out.push(`${name(el)} runs outside the viewport (${Math.round(r.left)} to ${Math.round(r.right)} of ${vw})`);
  }
  // Ornament, and the switcher's names, which a mood may collapse to their
  // accessible name (a named exception in the markup contract).
  const ornament = (el) => el.closest('[aria-hidden="true"], .vh, [hidden], .switcher__name, .switcher__label, .skip');
  for (const el of document.querySelectorAll('body *')) {
    if (ornament(el) || !el.checkVisibility()) continue;
    const cs = getComputedStyle(el);
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.nodeValue.trim());
    if (own) {
      // text clipped by its own box
      if (/hidden|clip/.test(cs.overflowX) && el.scrollWidth > el.clientWidth + 1) out.push(`${name(el)} clips its text sideways: "${el.textContent.trim().slice(0, 40)}"`);
      if (/hidden|clip/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 2) out.push(`${name(el)} clips its text: "${el.textContent.trim().slice(0, 40)}"`);
      if (parseFloat(cs.fontSize) < 12) out.push(`${name(el)} is set at ${cs.fontSize}, under 12px: "${el.textContent.trim().slice(0, 40)}"`);
      const r = el.getBoundingClientRect();
      if (r.width && (r.right > vw + 1 || r.left < -1)) out.push(`${name(el)} text runs outside the viewport: "${el.textContent.trim().slice(0, 40)}"`);
    }
  }
  for (const img of document.querySelectorAll('img')) {
    if (ornament(img) || !img.naturalWidth) continue;
    const r = img.getBoundingClientRect();
    if (!r.width) { out.push(`an image is not shown: ${img.alt.slice(0, 50)}`); continue; }
    const dpr = window.devicePixelRatio || 1;
    const full = Number(getComputedStyle(img.closest('.artifact, .portrait') ?? img).getPropertyValue('--w')) || img.naturalWidth;
    if (r.width > full + 1) out.push(`an image is drawn at ${Math.round(r.width)}px, wider than its ${full}px: ${img.alt.slice(0, 50)}`);
    if (Math.abs((r.width / r.height) / (img.naturalWidth / img.naturalHeight) - 1) > 0.03 && getComputedStyle(img).objectFit !== 'contain') out.push(`an image is distorted or cropped: ${img.alt.slice(0, 50)}`);
    void dpr;
  }
  return out;
};

for (const mood of moods) {
  test.describe(`${mood.name}`, () => {
    for (const p of PAGES) {
      for (const width of WIDTHS) {
        test(`${p.key} at ${width}: layout holds`, async ({ browser }) => {
          const context = await browser.newContext({ viewport: { width, height: width < 600 ? 720 : 900 }, colorScheme: mood.scheme });
          const page = await context.newPage();
          const foreign = [];
          page.on('request', (r) => { const u = new URL(r.url()); if (!['127.0.0.1', 'localhost'].includes(u.hostname) && u.protocol !== 'data:') foreign.push(r.url()); });
          await page.goto(url(p.path, mood.id));
          await ready(page);
          expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--mood').trim())).toBe(mood.id);
          await page.screenshot({ path: path.join(shots, `${mood.id}-${p.key}-${width}.png`), fullPage: true });
          expect(await page.evaluate(layoutProblems), 'layout problems').toEqual([]);
          expect(foreign, 'requests to another origin').toEqual([]);
          if (p.key === 'home' && width === 1440) {
            const h = await page.evaluate(() => document.documentElement.scrollHeight);
            expect(h, 'Home must fit one view at 1440 by 900').toBeLessThanOrEqual(900);
          }
          await context.close();
        });
      }

      test(`${p.key}: WCAG 2.2 AA`, async ({ browser }) => {
        const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: mood.scheme, reducedMotion: 'reduce' });
        const page = await context.newPage();
        await page.goto(url(p.path, mood.id));
        await ready(page);
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
        const found = results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length}) e.g. ${v.nodes[0].target.join(' ')} ${v.nodes[0].failureSummary?.split('\n')[1] ?? ''}`);
        expect(found, 'axe violations').toEqual([]);
        await context.close();
      });
    }

    test('reduced motion leaves nothing running', async ({ browser }) => {
      const context = await browser.newContext({ colorScheme: mood.scheme, reducedMotion: 'reduce' });
      const page = await context.newPage();
      for (const p of PAGES.slice(0, 3)) {
        await page.goto(url(p.path, mood.id));
        await ready(page);
        const running = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').map((a) => a.animationName ?? a.transitionProperty ?? 'animation'));
        expect(running, `${p.key}: animations under prefers-reduced-motion`).toEqual([]);
      }
      await context.close();
    });

    test('wider text spacing clips nothing (WCAG 1.4.12)', async ({ browser }) => {
      const target = PAGES.find((p) => p.key === 'entry') ?? PAGES[0];
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: mood.scheme });
      const page = await context.newPage();
      await page.goto(url(target.path, mood.id));
      await page.addStyleTag({ content: '* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }' });
      await ready(page);
      const problems = (await page.evaluate(layoutProblems)).filter((x) => /clips|scrolls sideways|outside the viewport/.test(x));
      expect(problems).toEqual([]);
      await context.close();
    });
  });
}

// ---- content parity: a mood changes layout, never content ----

// The pressed switcher button and the mood carried on every link differ by
// design; nothing else may.
const snapshot = async (page) => (await page.locator('body').ariaSnapshot()).replace(/ \[pressed(=\w+)?\]/g, '').replace(new RegExp(`[?&]${param}=[\\w-]+`, 'g'), '');
const visibleText = (page) => page.evaluate(() => {
  const skip = (el) => el.closest('[aria-hidden="true"], [hidden], script, style, [data-c="switcher"], #mood-status, #mood-config');
  const out = [];
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walk.nextNode(); n; n = walk.nextNode()) {
    const t = n.nodeValue.replace(/\s+/g, ' ').trim();
    if (!t || skip(n.parentElement)) continue;
    out.push(t.toLowerCase());
  }
  return out;
});
// Text that exists but cannot be seen: hidden, zero-sized, transparent or
// covered by something else.
const unseen = () => {
  const out = [];
  const skip = (el) => el.closest('[aria-hidden="true"], [hidden], .vh, script, style, #mood-status, #mood-config, .switcher__name, .switcher__label, .skip');
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walk.nextNode(); n; n = walk.nextNode()) {
    const t = n.nodeValue.replace(/\s+/g, ' ').trim();
    const el = n.parentElement;
    if (!t || skip(el)) continue;
    const range = document.createRange(); range.selectNodeContents(n);
    const r = range.getBoundingClientRect();
    const label = `"${t.slice(0, 50)}" in ${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]}`;
    if (!el.checkVisibility({ opacityProperty: true, visibilityProperty: true, contentVisibilityAuto: true })) { out.push(`hidden: ${label}`); continue; }
    if (r.width < 1 || r.height < 1) { out.push(`has no size: ${label}`); continue; }
    if (parseFloat(getComputedStyle(el).fontSize) < 1) out.push(`set at zero size: ${label}`);
  }
  for (const img of document.querySelectorAll('img[alt]:not([alt=""])')) {
    if (img.closest('[aria-hidden="true"], [hidden]')) continue;
    if (!img.checkVisibility({ opacityProperty: true, visibilityProperty: true }) || img.getBoundingClientRect().width < 8) out.push(`image not shown: ${img.alt.slice(0, 50)}`);
  }
  return out;
};

// The specimen prints each mood's own tokens, so it differs by design.
for (const p of PAGES.filter((x) => x.key !== 'specimen')) {
  test(`${p.key}: every mood carries the same content`, async ({ browser }) => {
    const seen = {};
    for (const mood of moods) {
      for (const width of [1440, 320]) {
        const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: mood.scheme });
        const page = await context.newPage();
        await page.goto(url(p.path, mood.id));
        await ready(page);
        expect(await page.evaluate(unseen), `${mood.name} at ${width}: content that cannot be seen`).toEqual([]);
        if (width === 1440) seen[mood.id] = { aria: await snapshot(page), text: await visibleText(page) };
        await context.close();
      }
    }
    const [first, ...rest] = moods;
    for (const m of rest) {
      expect(seen[m.id].aria, `${m.name} and ${first.name} read differently to a screen reader`).toBe(seen[first.id].aria);
      expect(seen[m.id].text, `${m.name} and ${first.name} show different text`).toEqual(seen[first.id].text);
    }
  });
}
