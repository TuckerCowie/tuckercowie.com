// The mood contract, items 5 and 6: precedence, no wrong-mood first paint,
// no reload on switch, scripting off, and carry-over across links.

import { test, expect } from '@playwright/test';
import { moods, param, storageKey } from '../../src/moods/registry.mjs';

const autoFor = (scheme) => moods.find((m) => m.auto === scheme).id;
const sentinel = (page) => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--mood').trim());
const explicit = moods.find((m) => !m.auto).id;      // a mood that is no system default
const other = moods.find((m) => m.auto === 'dark').id;

for (const scheme of ['light', 'dark']) {
  for (const p of [null, explicit, 'bogus']) {
    for (const saved of [null, other, explicit]) {
      const want = p && moods.some((m) => m.id === p) ? p : saved ?? autoFor(scheme);
      test(`precedence: system ${scheme}, param ${p}, saved ${saved} -> ${want}`, async ({ browser }) => {
        const context = await browser.newContext({ colorScheme: scheme });
        if (saved) await context.addInitScript(([k, v]) => { try { localStorage.setItem(k, v); } catch {} }, [storageKey, saved]);
        const page = await context.newPage();
        await page.goto(p ? `/?${param}=${p}` : '/');
        expect(await sentinel(page)).toBe(want);
        await context.close();
      });
    }
  }
  test(`scripting off: system ${scheme} -> ${autoFor(scheme)}, whatever the URL says`, async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: scheme, javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`/?${param}=${explicit}`);
    expect(await sentinel(page)).toBe(autoFor(scheme));
    await expect(page.locator('[data-c="switcher"]')).toBeHidden();
    await context.close();
  });
}

test('first paint is never the wrong mood, even when the chosen sheet is slow', async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: 'light' });
  const page = await context.newPage();
  await page.route(`**/moods/${explicit}.css`, async (route) => { await new Promise((r) => setTimeout(r, 1200)); await route.continue(); });
  await page.addInitScript(() => {
    window.__seen = [];
    const tick = () => { window.__seen.push(getComputedStyle(document.documentElement).getPropertyValue('--mood').trim()); requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  await page.goto(`/?${param}=${explicit}`);
  await page.waitForTimeout(300);
  const { seen, fcp, cssEnd } = await page.evaluate((id) => ({
    seen: [...new Set(window.__seen)],
    fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null,
    cssEnd: performance.getEntriesByType('resource').find((r) => r.name.endsWith(`/moods/${id}.css`))?.responseEnd ?? null,
  }), explicit);
  expect(seen).toEqual([explicit]);
  expect(cssEnd).not.toBeNull();
  expect(fcp).toBeGreaterThanOrEqual(cssEnd);
  await context.close();
});

test('a page load fetches at most three mood stylesheets', async ({ page }) => {
  const sheets = [];
  page.on('request', (r) => { if (/\/moods\/[^/]+\.css/.test(r.url())) sheets.push(r.url()); });
  await page.goto(`/?${param}=${explicit}`);
  await page.waitForLoadState('networkidle');
  expect(new Set(sheets).size).toBeLessThanOrEqual(3);
});

test('switching is one click, with no reload, and it is saved', async ({ page }) => {
  await page.goto('/');
  let navigations = 0;
  page.on('framenavigated', () => navigations++);
  const start = await sentinel(page);
  const target = moods.find((m) => m.id !== start);
  const button = page.locator(`[data-mood-set="${target.id}"]`);
  await expect(page.locator(`[data-mood-set="${start}"]`)).toHaveAttribute('aria-pressed', 'true');
  await button.click();
  await expect.poll(() => sentinel(page)).toBe(target.id);
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#mood-status')).toHaveText(`Mood: ${target.name}`);
  expect(navigations).toBe(0);
  await page.reload();
  expect(await sentinel(page)).toBe(target.id);
});

test('the switcher works from the keyboard', async ({ page }) => {
  await page.goto('/');
  const last = moods.at(-1);
  await page.locator(`[data-mood-set="${last.id}"]`).focus();
  await page.keyboard.press('Enter');
  await expect.poll(() => sentinel(page)).toBe(last.id);
});

test('a mood chosen by URL carries across internal links and is not saved', async ({ page }) => {
  await page.goto(`/?${param}=${explicit}`);
  await page.locator('.site-nav a').first().click();
  await page.waitForLoadState();
  expect(new URL(page.url()).searchParams.get(param)).toBe(explicit);
  expect(await sentinel(page)).toBe(explicit);
  expect(await page.evaluate((k) => localStorage.getItem(k), storageKey)).toBeNull();
  // Choosing in the switcher takes over from the URL.
  const pick = moods.find((m) => m.id !== explicit);
  await page.locator(`[data-mood-set="${pick.id}"]`).click();
  await expect.poll(() => sentinel(page)).toBe(pick.id);
  expect(new URL(page.url()).searchParams.get(param)).toBeNull();
});

test('with no choice made, the mood follows the system when it changes', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  expect(await sentinel(page)).toBe(autoFor('light'));
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect.poll(() => sentinel(page)).toBe(autoFor('dark'));
  await expect(page.locator(`[data-mood-set="${autoFor('dark')}"]`)).toHaveAttribute('aria-pressed', 'true');
});
