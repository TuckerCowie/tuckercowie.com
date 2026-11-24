// Builds the site into dist/ (or --out <dir>).
//
//   node src/build/build.mjs                production: public entries only
//   PREVIEW=1 node src/build/build.mjs      includes drafts, tagged as drafts
//   BASE=relative ...                       relative URLs, for a subpath or file host
//   --out <dir>   --serve [port]   --no-images (fast CSS-only rebuild)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform, bundle } from 'lightningcss';
import { loadContent, TYPES } from './content.mjs';
import { compileMood, readToken, moodHead, moodClientConfig } from './moods.mjs';
import { createImages } from './images.mjs';
import { moods } from '../moods/registry.mjs';
import { raw } from './html.mjs';
import { homePage } from '../templates/home.mjs';
import { entryPage } from '../templates/case.mjs';
import { workPage, ledgerPage, facets, normalise } from '../templates/work.mjs';
import { profilePage, systemsPage } from '../templates/profile.mjs';
import { resumePage, specimenPage, notFoundPage } from '../templates/extra.mjs';
import { FONT_FILES, fontCss } from './fonts.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const argv = process.argv.slice(2);
const arg = (name) => { const i = argv.indexOf(name); return i === -1 ? null : (argv[i + 1] ?? true); };
const outDir = path.resolve(root, arg('--out') && arg('--out') !== true ? arg('--out') : 'dist');
const preview = Boolean(process.env.PREVIEW);
const BASE = process.env.BASE ?? '/';
const relative = BASE === 'relative';
const skipImages = argv.includes('--no-images');

function write(rel, data) {
  const file = path.join(outDir, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, data);
}

// Maps a site path ("/work/", "/css/base.css") to a URL for the page at `from`.
function urlFor(from) {
  return (target) => {
    if (/^(https?:|mailto:|#)/.test(target)) return target;
    if (!relative) return BASE.replace(/\/$/, '') + target;
    const [pathname, hash = ''] = target.split('#');
    const fromDir = from.endsWith('/') ? from : path.posix.dirname(from) + '/';
    const file = pathname.endsWith('/') ? pathname + 'index.html' : pathname;
    let rel = path.posix.relative(fromDir, file) || 'index.html';
    return rel + (hash ? '#' + hash : '');
  };
}

async function main() {
  const t0 = Date.now();
  let content;
  try {
    content = loadContent(root, { preview });
  } catch (e) {
    if (e.contentErrors) { console.error('\n' + e.message + '\n'); process.exit(1); }
    throw e;
  }
  if (!preview && !content.site.email) {
    console.error('\ncontent/site.yaml:1: "email" is not set. A production build needs the address for the one action on the site. Set it, or build a preview with PREVIEW=1.\n');
    process.exit(1);
  }

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  // ---- moods ----
  const themeColors = {};
  const tokenDump = {};
  for (const mood of moods) {
    const { css, flat } = compileMood(mood, { srcDir: path.join(root, 'src/moods') });
    write(`moods/${mood.id}.css`, css);
    themeColors[mood.id] = readToken(flat, mood.themeToken) ?? (mood.scheme === 'dark' ? '#000' : '#fff');
    tokenDump[mood.id] = [...flat.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;}]+)[;}]/g)].reduce((acc, m) => { if (!(m[1] in acc)) acc[m[1]] = m[2].trim(); return acc; }, {});
  }

  // ---- base css, fonts, client scripts ----
  const base = bundle({ filename: path.join(root, 'src/styles/base.css'), minify: true });
  const fonts = transform({ filename: 'fonts.css', code: Buffer.from(fontCss('../fonts/')), minify: true });
  write('css/base.css', Buffer.concat([fonts.code, base.code]));
  for (const f of FONT_FILES) fs.mkdirSync(path.join(outDir, 'fonts'), { recursive: true }), fs.copyFileSync(path.join(root, 'node_modules', f.from), path.join(outDir, 'fonts', f.name));
  for (const js of ['mood.js', 'filter.js']) write(`js/${js}`, fs.readFileSync(path.join(root, 'src/client', js)));
  write('favicon.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 24 24"><style>circle{fill:none;stroke:#1f2b3d;stroke-width:1.4}@media (prefers-color-scheme:dark){circle{stroke:#e6ecf2}}</style><circle r="10"/><circle r="4"/></svg>\n');

  // ---- images ----
  const images = createImages({ root, outDir });
  const stub = { width: 1600, height: 900, variants: { avif: [{ w: 1600, path: '/img/stub.avif' }], webp: [{ w: 1600, path: '/img/stub.webp' }], jpg: [{ w: 1600, path: '/img/stub.jpg' }] }, full: '/img/stub.jpg' };
  for (const e of content.entries) for (const p of e.plates) for (const img of p.images) img.asset = skipImages ? stub : await images.prepare(img.file, e.slug);
  if (content.profile.portrait) content.profile.portrait.asset = skipImages ? stub : await images.prepare(content.profile.portrait.file, 'profile');
  await images.flush();

  // ---- pages ----
  const pages = [];
  const page = (p, render) => pages.push({ path: p, render });
  page('/', homePage);
  page('/work/', (ctx) => workPage(ctx));
  const f = facets(content.entries);
  for (const v of f.type) page(`/work/type/${v.key}/`, (ctx) => workPage(ctx, { active: { type: v.key }, docTitle: `${TYPES[v.key].plural}, Work` }));
  for (const v of f.org) page(`/work/org/${v.key}/`, (ctx) => workPage(ctx, { active: { org: v.key }, docTitle: `${v.label}, Work` }));
  for (const v of f.skill) page(`/work/skill/${v.key}/`, (ctx) => workPage(ctx, { active: { skill: v.key }, docTitle: `${v.label}, Work` }));
  for (const c of content.collections) page(`/work/c/${c.slug}/`, (ctx) => workPage(ctx, { active: normalise(c.filter), heading: c.title, kicker: 'Collection', intro: raw(c.introHtml), collection: true }));
  page('/work/ledger/', ledgerPage);
  for (const e of content.entries.filter((x) => x.hasPage)) page(`/work/${e.slug}/`, (ctx) => entryPage(ctx, e));
  page('/profile/', profilePage);
  page('/systems/', systemsPage);
  page('/resume/', resumePage);
  page('/specimen/', (ctx) => specimenPage(ctx, { tokenDump }));
  page('/404.html', notFoundPage);

  const reserved = new Set(['type', 'org', 'skill', 'c', 'ledger']);
  for (const e of content.entries) if (reserved.has(e.slug)) { console.error(`\n${e.file}:1: The slug "${e.slug}" is reserved. Rename the file or folder.\n`); process.exit(1); }

  for (const p of pages) {
    const u = urlFor(p.path);
    const ctx = {
      content, u, page: p.path, preview,
      moodHead: moodHead({ u, themeColors }),
      moodConfig: { ...moodClientConfig({ themeColors }), base: u('/moods/') },
    };
    const out = p.path.endsWith('/') ? p.path + 'index.html' : p.path;
    write(out.replace(/^\//, ''), String(ctx ? p.render(ctx) : ''));
  }

  // ---- machine-readable index of public entries ----
  const index = {
    site: content.site.url, name: content.site.name, generated: new Date().toISOString().slice(0, 10),
    entries: content.entries.filter((e) => e.visibility === 'public').map((e) => ({
      title: e.title, type: e.type, year: e.year, date: e.date_label, organisation: e.organisation ?? null,
      role: e.role ?? null, skills: e.skills, status: e.status ?? null,
      url: e.hasPage ? `${content.site.url.replace(/\/$/, '')}/work/${e.slug}/` : null,
    })),
  };
  write('index.json', JSON.stringify(index, null, 2) + '\n');
  write('robots.txt', preview ? 'User-agent: *\nDisallow: /\n' : 'User-agent: *\nAllow: /\n');

  const r = content.report;
  console.log(`Built ${pages.length} pages to ${path.relative(root, outDir)}/ in ${Date.now() - t0}ms. Entries: ${r.built} of ${r.total} built${preview ? ' (preview, drafts included)' : ''}.`);
  if (!preview && r.drafts.length) console.log(`Skipped ${r.drafts.length} draft${r.drafts.length === 1 ? '' : 's'}:\n` + r.drafts.map((d) => '  ' + d).join('\n'));
}

await main();

if (argv.includes('--serve')) {
  const { serve } = await import('./serve.mjs');
  const port = Number(arg('--serve')) || 4173;
  serve(outDir, port);
}
