// Static checks on the mood stylesheets and on a built site.
// Builds a preview and a relative-URL copy into var/, then reads the output.

import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { moods } from '../../src/moods/registry.mjs';
import { lintMood } from '../../tools/lint-mood.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const out = path.join(root, 'var/check-static');
const outRel = path.join(root, 'var/check-static-relative');

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]);
const htmlFiles = (dir) => walk(dir).filter((f) => f.endsWith('.html'));
const rel = (f) => path.relative(root, f);
// Splits a selector list on commas that are not inside parentheses.
const splitTop = (list) => { const out = []; let depth = 0, cur = ''; for (const ch of list) { if (ch === '(') depth++; if (ch === ')') depth--; if (ch === ',' && depth === 0) { out.push(cur); cur = ''; } else cur += ch; } out.push(cur); return out; };

before(() => {
  const env = { ...process.env, PREVIEW: '1' };
  execFileSync('node', ['src/build/build.mjs', '--out', out], { cwd: root, env, stdio: 'pipe' });
  execFileSync('node', ['src/build/build.mjs', '--out', outRel], { cwd: root, env: { ...env, BASE: 'relative' }, stdio: 'pipe' });
});

for (const mood of moods) {
  test(`${mood.id}: the stylesheet follows the mood rules`, () => {
    const errors = lintMood(mood.id);
    assert.equal(errors.length, 0, `\n${errors.join('\n')}`);
  });

  test(`${mood.id}: every compiled rule is scoped to the mood`, () => {
    const css = fs.readFileSync(path.join(out, 'moods', `${mood.id}.css`), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    assert.match(css.trim(), /^@media screen\{/);
    const scope = mood.auto ? `:root:is([data-mood=${mood.id}],:not([data-mood]))` : `:root[data-mood=${mood.id}]`;
    // Every selector list that opens a declaration block must start with the scope.
    const selectors = [...css.matchAll(/(?:^|[{}])([^{}@]+)\{(?=[^{}]*\})/g)].map((m) => m[1].trim()).filter((s) => !/^(from|to|\d+(\.\d+)?%)(\s*,\s*(from|to|\d+(\.\d+)?%))*$/.test(s));
    assert.ok(selectors.length > 0);
    for (const list of selectors) for (const sel of splitTop(list)) assert.ok(sel.trim().startsWith(scope), `unscoped selector in ${mood.id}.css: ${sel.trim()}`);
  });
}

test('the head picks the mood before anything can paint', () => {
  for (const file of htmlFiles(out)) {
    const head = fs.readFileSync(file, 'utf8').split('</head>')[0];
    const firstScript = head.indexOf('<script');
    const firstLink = head.indexOf('<link');
    assert.ok(firstScript !== -1 && firstScript < firstLink, `${rel(file)}: the inline mood script must come before any <link>`);
    assert.match(head.slice(firstScript, firstScript + 12), /^<script>!fu/, `${rel(file)}: the mood script must be inline and classic, with no src, async, defer or type`);
    for (const m of moods.filter((x) => x.auto)) {
      const media = m.auto === 'dark' ? '(prefers-color-scheme: dark)' : 'not all and (prefers-color-scheme: dark)';
      assert.ok(head.includes(`media="${media}" data-mood-auto="${m.id}"`), `${rel(file)}: missing the static ${m.id} stylesheet link`);
    }
  }
});

test('nothing is loaded from another origin', () => {
  const offenders = [];
  for (const file of walk(out).filter((f) => /\.(html|css|js|svg)$/.test(f))) {
    const text = fs.readFileSync(file, 'utf8');
    const loads = [
      ...text.matchAll(/<(?:script|img|source|iframe|video|audio|embed|object)\b[^>]*?\b(?:src|srcset|data)="([^"]*)"/g),
      ...text.matchAll(/<link\b(?![^>]*rel="(?:canonical|alternate)")[^>]*?\bhref="([^"]*)"/g),
      ...text.matchAll(/url\(\s*["']?([^"')]+)/g),
      ...text.matchAll(/@import\s+["']([^"']+)/g),
    ];
    for (const m of loads) if (/^(https?:)?\/\//.test(m[1])) offenders.push(`${rel(file)}: ${m[1]}`);
  }
  assert.deepEqual(offenders, []);
});

for (const [name, dir] of [['absolute', out], ['relative', outRel]]) {
  test(`every internal link and asset resolves (${name} URLs)`, () => {
    const broken = [];
    for (const file of htmlFiles(dir)) {
      const text = fs.readFileSync(file, 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, (m) => m.match(/^<script\b[^>]*>/)[0]);
      const refs = [...text.matchAll(/\b(?:href|src)="([^"#?][^"]*)"/g), ...[...text.matchAll(/\bsrcset="([^"]*)"/g)].flatMap((m) => m[1].split(',').map((s) => [null, s.trim().split(/\s+/)[0]]))];
      for (const [, raw] of refs) {
        if (/^(https?:|mailto:|data:)/.test(raw)) continue;
        const clean = raw.split(/[?#]/)[0];
        let target = clean.startsWith('/') ? path.join(dir, clean) : path.resolve(path.dirname(file), clean);
        if (target.endsWith(path.sep) || (fs.existsSync(target) && fs.statSync(target).isDirectory())) target = path.join(target, 'index.html');
        if (!fs.existsSync(target)) broken.push(`${rel(file)} -> ${raw}`);
      }
    }
    assert.deepEqual(broken, []);
  });
}

test('no em or en dash in content or in the built pages', () => {
  const found = [];
  for (const file of [...walk(path.join(root, 'content')).filter((f) => /\.(md|ya?ml)$/.test(f)), ...htmlFiles(out)]) {
    const text = fs.readFileSync(file, 'utf8');
    const i = text.search(/[—–]/);
    if (i !== -1) found.push(`${rel(file)}: "${text.slice(Math.max(0, i - 30), i + 30).replace(/\s+/g, ' ')}"`);
  }
  assert.deepEqual(found, []);
});

const run = (env, outName) => {
  try { execFileSync('node', ['src/build/build.mjs', '--out', path.join(root, 'var', outName)], { cwd: root, env: { ...process.env, ...env }, stdio: 'pipe' }); return { ok: true, message: '' }; }
  catch (e) { return { ok: false, message: String(e.stderr) }; }
};

test('a production build refuses to ship without an email or with draft flags left', () => {
  const site = fs.readFileSync(path.join(root, 'content/site.yaml'), 'utf8');
  const res = run({ PREVIEW: '' }, 'check-static-prod');
  if (/^email:\s*null/m.test(site)) {
    assert.ok(!res.ok, 'a production build with no email must fail');
    assert.match(res.message, /content\/site\.yaml:1: "email" is not set/);
  } else if (!res.ok) {
    assert.match(res.message, /A production build needs every draft flag resolved/);
  } else {
    for (const file of htmlFiles(path.join(root, 'var/check-static-prod'))) {
      const text = fs.readFileSync(file, 'utf8');
      assert.ok(!/class="draft"/.test(text), `${rel(file)} shows a draft tag in production`);
      assert.ok(!/class="pending"/.test(text), `${rel(file)} shows a placeholder in production`);
    }
  }
});

test('PREVIEW=0 and PREVIEW=false never build a preview', () => {
  for (const v of ['0', 'false', 'no']) {
    const res = run({ PREVIEW: v }, 'check-static-prod');
    assert.ok(!res.ok, `PREVIEW=${v} must not build`);
    assert.match(res.message, /PREVIEW must be 1/);
  }
});

test('a mood may not use @layer or @scope', async () => {
  const { compileMood } = await import('../../src/build/moods.mjs');
  const dir = path.join(root, 'var/check-static-moods');
  fs.mkdirSync(dir, { recursive: true });
  for (const [name, css, re] of [['layered', '@layer chrome { h1 { margin: 0 } }', /@layer is not allowed/], ['scoped', '@scope (.card) { img { border: 0 } }', /@scope is not allowed/]]) {
    fs.writeFileSync(path.join(dir, `${name}.css`), css);
    assert.throws(() => compileMood({ id: name, name, scheme: 'light', auto: null }, { srcDir: dir }), re);
  }
});

test('view-transition pseudo-elements stay on the root when a mood is scoped', async () => {
  const { compileMood } = await import('../../src/build/moods.mjs');
  const dir = path.join(root, 'var/check-static-moods');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'vt.css'), '::view-transition-group(root) { animation-duration: 1s }');
  const { css } = compileMood({ id: 'vt', name: 'vt', scheme: 'light', auto: null }, { srcDir: dir });
  assert.match(css, /:root\[data-mood=vt\]::view-transition-group\(root\)/);
});

test('the same input builds the same output', () => {
  const read = (dir) => Object.fromEntries(walk(dir).filter((f) => /\.(html|json|css|js)$/.test(f)).map((f) => [path.relative(dir, f), fs.readFileSync(f, 'utf8')]));
  const again = path.join(root, 'var/check-static-again');
  execFileSync('node', ['src/build/build.mjs', '--out', again], { cwd: root, env: { ...process.env, PREVIEW: '1' }, stdio: 'pipe' });
  assert.deepEqual(read(again), read(out));
});
