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

// ---- regressions found by the foundation review ----

test('reaching for the switcher changes nothing until a mood is picked', async ({ browser }) => {
  for (const scheme of ['light', 'dark']) {
    const context = await browser.newContext({ colorScheme: scheme });
    const page = await context.newPage();
    await page.goto('/');
    await page.locator('[data-c="switcher"]').hover();
    await page.locator('[data-mood-set]').first().focus();
    await page.waitForLoadState('networkidle');
    expect(await sentinel(page)).toBe(autoFor(scheme));
    expect(await page.evaluate(() => document.documentElement.hasAttribute('data-mood'))).toBe(false);
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe(scheme);
    await context.close();
  }
});

test('picking the other system default works on either system scheme', async ({ browser }) => {
  for (const scheme of ['light', 'dark']) {
    const context = await browser.newContext({ colorScheme: scheme });
    const page = await context.newPage();
    await page.goto('/');
    const target = autoFor(scheme === 'light' ? 'dark' : 'light');
    await page.locator(`[data-mood-set="${target}"]`).click();
    await expect.poll(() => sentinel(page)).toBe(target);
    await page.reload();
    expect(await sentinel(page)).toBe(target);
    await context.close();
  }
});

test('a stylesheet that fails to load leaves the mood as it was and says so', async ({ page }) => {
  await page.route(`**/moods/${explicit}.css`, (route) => route.abort());
  await page.goto('/');
  const before = await sentinel(page);
  await page.locator(`[data-mood-set="${explicit}"]`).click();
  await expect(page.locator('#mood-status')).toContainText('did not change');
  expect(await sentinel(page)).toBe(before);
  expect(await page.evaluate((k) => localStorage.getItem(k), storageKey)).toBeNull();
  // A saved mood whose sheet is gone falls back to the system default on load.
  await page.evaluate(([k, v]) => localStorage.setItem(k, v), [storageKey, explicit]);
  await page.reload();
  expect(await sentinel(page)).toBe(before);
});

test('with storage blocked the choice travels in the URL', async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: 'light' });
  await context.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }); });
  const page = await context.newPage();
  await page.goto('/');
  await page.locator(`[data-mood-set="${explicit}"]`).click();
  await expect.poll(() => sentinel(page)).toBe(explicit);
  expect(new URL(page.url()).searchParams.get(param)).toBe(explicit);
  await page.locator('.site-nav a').first().click();
  await page.waitForLoadState();
  expect(await sentinel(page)).toBe(explicit);
  await context.close();
});

test('the last of two quick picks wins', async ({ page }) => {
  await page.route(`**/moods/${explicit}.css`, async (route) => { await new Promise((r) => setTimeout(r, 700)); await route.continue(); });
  await page.goto('/');
  await page.locator(`[data-mood-set="${explicit}"]`).click();
  await page.locator(`[data-mood-set="${other}"]`).click();
  await expect.poll(() => sentinel(page)).toBe(other);
  await page.waitForTimeout(1200);
  expect(await sentinel(page)).toBe(other);
  expect(await page.evaluate((k) => localStorage.getItem(k), storageKey)).toBe(other);
});

test('pressing the mood that came from the URL saves it', async ({ page }) => {
  await page.goto(`/?${param}=${explicit}`);
  await page.locator(`[data-mood-set="${explicit}"]`).click();
  await expect.poll(() => page.evaluate((k) => localStorage.getItem(k), storageKey)).toBe(explicit);
  expect(new URL(page.url()).searchParams.get(param)).toBeNull();
});

test('the browser toolbar colour is right before any script has run', async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: 'light' });
  const page = await context.newPage();
  await page.route('**/js/mood.js', (route) => route.abort());
  await page.goto(`/?${param}=${explicit}`);
  const first = await page.evaluate(() => document.querySelector('meta[name="theme-color"]').content);
  const config = JSON.parse(await page.locator('#mood-config').textContent());
  expect(first).toBe(config.moods.find((m) => m.id === explicit).theme);
  expect(first).toMatch(/^#[0-9a-f]{6}$/);
  await context.close();
});

test('a page restored from the back/forward cache picks up a choice made elsewhere', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(([k, v]) => localStorage.setItem(k, v), [storageKey, explicit]);
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
  await expect.poll(() => sentinel(page)).toBe(explicit);
  await expect(page.locator(`[data-mood-set="${explicit}"]`)).toHaveAttribute('aria-pressed', 'true');
});
