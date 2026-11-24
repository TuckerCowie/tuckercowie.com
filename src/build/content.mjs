// Loads and validates everything under content/. A malformed file fails the
// build with messages of the form  path:line: what is wrong and how to fix it.

import fs from 'node:fs';
import path from 'node:path';
import { parseDocument } from 'yaml';
import { z } from 'zod';
import { parseBody, renderMarkdown, ContentError } from './markdown.mjs';
import { slugify } from './html.mjs';

export const TYPES = {
  'case-study': { label: 'Case study', plural: 'Case studies' },
  workshop: { label: 'Workshop', plural: 'Workshops' },
  talk: { label: 'Talk', plural: 'Talks' },
  certification: { label: 'Certification', plural: 'Certifications' },
  award: { label: 'Award', plural: 'Awards' },
  product: { label: 'Product', plural: 'Products' },
};

export const STATUSES = {
  shipped: 'Shipped', running: 'Running', growing: 'Growing', built: 'Built',
  parked: 'Parked', killed: 'Killed', retired: 'Retired',
};

const text = z.string().trim().min(1);
const noEmDash = (s) => !/[\u2014\u2013]/.test(s);

const link = z.strictObject({ label: text, href: z.string().regex(/^(https:\/\/|\/)/, 'A link must start with https:// or /') });

const entrySchema = z.strictObject({
  title: text,
  type: z.enum(Object.keys(TYPES)),
  year: z.number().int().min(1990).max(2100),
  date_label: text.optional(),
  organisation: text.optional(),
  role: text.optional(),
  skills: z.array(text).default([]),
  status: z.enum(Object.keys(STATUSES)).optional(),
  verdict: text.optional(),
  summary: text.optional(),
  visibility: z.enum(['draft', 'public']).default('draft'),
  order: z.number().default(0),
  // case studies and workshops
  details_label: z.enum(['Details', 'Background']).default('Details'),
  goals: z.array(text).default([]),
  my_role: z.array(text).default([]),
  methodology: z.array(text).default([]),
  outcome: z.array(text).default([]),
  links: z.array(link).default([]),
  confidentiality: text.optional(),
  // an item with a known gap: shown with a DRAFT tag in preview builds
  draft_note: text.optional(),
});

const collectionSchema = z.strictObject({
  title: text,
  filter: z.strictObject({ type: z.enum(Object.keys(TYPES)).optional(), organisation: text.optional(), skill: text.optional() })
    .refine((f) => Object.keys(f).length > 0, 'A collection needs at least one of type, organisation or skill in its filter.'),
  visibility: z.enum(['draft', 'public']).default('draft'),
  order: z.number().default(0),
});

const siteSchema = z.strictObject({
  name: text,
  identity: z.array(text).min(1),
  epigraph: text,
  lead: text,
  sub: text,
  doors: z.strictObject({ work: text, profile: text, systems: text }),
  email: z.string().email().nullable(),
  email_label: text,
  description: text,
  url: z.string().url(),
  drafts: z.array(z.string()).default([]),
});

const profileSchema = z.strictObject({
  portrait: z.strictObject({ src: text, alt: text, caption: text }).nullable(),
  statements: z.array(z.strictObject({ label: text, text: text, draft: z.boolean().default(false) })).default([]),
  assessments: z.array(z.strictObject({ name: text, line: text.nullable() })).default([]),
  assessments_note: text.optional(),
  career: z.array(z.strictObject({ role: text, organisation: text, from: text.nullable(), to: text.nullable(), note: text.optional(), draft: z.boolean().default(false) })),
  education: z.array(z.strictObject({ title: text, organisation: text, when: text.optional() })).default([]),
});

const manualSchema = z.strictObject({ title: text, kicker: text, subtitle: text, epigraph: text });

const systemsSchema = z.strictObject({
  title: text,
  lede: text,
  pipeline: z.array(z.strictObject({ name: text, gate: z.boolean().default(false), note: text.optional() })).min(1),
  pipeline_note: text,
  numbers: z.array(z.strictObject({ value: text, label: text })).default([]),
  principles: z.array(text).default([]),
  published: z.array(link).default([]),
  published_note: text.optional(),
});

const nnlSchema = z.strictObject({
  updated: text,
  now: z.array(text), next: z.array(text), later: z.array(text),
  draft: z.boolean().default(false),
});

// ---------- helpers ----------

function splitFrontmatter(source, file) {
  const m = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) throw new ContentError(file, 1, 'The file must start with a frontmatter block between two lines of "---".');
  return { yaml: m[1], body: source.slice(m[0].length), bodyLine: m[0].split('\n').length - 1 };
}

function lineOf(doc, lineCounter, pathArr) {
  for (let n = pathArr.length; n >= 0; n--) {
    const node = n === 0 ? doc.contents : doc.getIn(pathArr.slice(0, n), true);
    if (node && node.range) return lineCounter(node.range[0]);
  }
  return 1;
}

function validateYaml(yamlSource, schema, file, startLine, errors) {
  const doc = parseDocument(yamlSource);
  const lines = yamlSource.split('\n');
  const offsets = []; let o = 0; for (const l of lines) { offsets.push(o); o += l.length + 1; }
  const lineCounter = (pos) => { let i = offsets.findLastIndex((x) => x <= pos); return i + startLine; };
  for (const e of doc.errors) errors.push(new ContentError(file, lineCounter(e.pos?.[0] ?? 0), `YAML: ${e.message.split('\n')[0]}`));
  if (doc.errors.length) return null;
  const data = doc.toJS() ?? {};
  const res = schema.safeParse(data);
  if (res.success) {
    // no em or en dashes anywhere in content
    const walk = (v, p) => {
      if (typeof v === 'string' && !noEmDash(v)) errors.push(new ContentError(file, lineOf(doc, lineCounter, p), `"${p.join('.')}" contains an em or en dash. Use a comma, a colon or "to".`));
      else if (Array.isArray(v)) v.forEach((x, i) => walk(x, [...p, i]));
      else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, [...p, k]);
    };
    walk(data, []);
    return res.data;
  }
  for (const issue of res.error.issues) {
    const where = issue.path.join('.');
    let msg;
    if (issue.code === 'unrecognized_keys') {
      const known = Object.keys(schema.shape ?? {});
      msg = issue.keys.map((k) => {
        const near = known.find((n) => distance(n, k) <= 2);
        return `Unknown field "${[...issue.path, k].join('.')}".${near ? ` Did you mean "${near}"?` : known.length ? ` Known fields: ${known.join(', ')}.` : ''}`;
      }).join(' ');
      errors.push(new ContentError(file, lineOf(doc, lineCounter, [...issue.path, issue.keys[0]]), msg));
      continue;
    }
    if (issue.code === 'invalid_value' && issue.values) msg = `"${where}" must be one of: ${issue.values.join(', ')}.`;
    else if (issue.code === 'invalid_type' && issue.input === undefined) msg = `Missing required field "${where}".`;
    else if (issue.code === 'invalid_type') msg = `"${where}" must be ${issue.expected}.`;
    else msg = where ? `"${where}": ${issue.message}` : issue.message;
    errors.push(new ContentError(file, lineOf(doc, lineCounter, issue.path), msg));
  }
  return null;
}

function distance(a, b) {
  a = a.toLowerCase(); b = b.toLowerCase();
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

const rel = (root, f) => path.relative(root, f);

// ---------- loaders ----------

function loadEntry(file, root, errors) {
  const shown = rel(root, file);
  const source = fs.readFileSync(file, 'utf8');
  let fm;
  try { fm = splitFrontmatter(source, shown); } catch (e) { errors.push(e); return null; }
  const data = validateYaml(fm.yaml, entrySchema, shown, 2, errors);
  if (!data) return null;
  if (/[\u2014\u2013]/.test(fm.body)) {
    const i = fm.body.split('\n').findIndex((l) => /[\u2014\u2013]/.test(l));
    errors.push(new ContentError(shown, fm.bodyLine + i + 1, 'The body contains an em or en dash. Use a comma, a colon or "to".'));
  }
  const hasPlates = data.type === 'case-study' || data.type === 'workshop';
  const body = parseBody(fm.body, { file: shown, lineOffset: fm.bodyLine, allowPlates: hasPlates });
  errors.push(...body.errors);
  const dir = path.dirname(file);
  const isIndex = path.basename(file) === 'index.md';
  const slug = isIndex ? path.basename(dir) : path.basename(file, '.md');
  for (const p of body.plates) for (const img of p.images) {
    if (!img.src || /^[a-z]+:/i.test(img.src) || img.src.startsWith('/')) { errors.push(new ContentError(shown, fm.bodyLine + img.line + 1, `Image "${img.src}" must be a file beside the entry, written as ./name.jpg.`)); continue; }
    if (!isIndex) { errors.push(new ContentError(shown, fm.bodyLine + img.line + 1, 'An entry with images must live in its own folder as content/work/<slug>/index.md.')); continue; }
    img.file = path.join(dir, img.src);
    if (!fs.existsSync(img.file)) errors.push(new ContentError(shown, fm.bodyLine + img.line + 1, `Image file not found: ${rel(root, img.file)}.`));
  }
  if (data.type === 'product' && !data.status) errors.push(new ContentError(shown, 2, `A product needs a "status": one of ${Object.keys(STATUSES).join(', ')}.`));
  if (slug !== slugify(slug)) errors.push(new ContentError(shown, 1, `The file or folder name "${slug}" must be lowercase letters, digits and hyphens.`));
  return {
    ...data, slug, file: shown,
    date_label: data.date_label ?? String(data.year),
    introHtml: body.introHtml, plates: body.plates,
    hasPage: hasPlates || body.introHtml.trim() !== '',
    written: hasPlates && body.plates.length > 0 && body.plates.every((p) => p.images.length === 0),
  };
}

function loadYamlFile(file, schema, root, errors) {
  if (!fs.existsSync(file)) { errors.push(new ContentError(rel(root, file), 1, 'This file is required and is missing.')); return null; }
  return validateYaml(fs.readFileSync(file, 'utf8'), schema, rel(root, file), 1, errors);
}

function loadMarkdownFile(file, schema, root, errors) {
  const shown = rel(root, file);
  if (!fs.existsSync(file)) { errors.push(new ContentError(shown, 1, 'This file is required and is missing.')); return null; }
  const source = fs.readFileSync(file, 'utf8');
  let fm;
  try { fm = splitFrontmatter(source, shown); } catch (e) { errors.push(e); return null; }
  const data = validateYaml(fm.yaml, schema, shown, 2, errors);
  if (/[\u2014\u2013]/.test(fm.body)) {
    const i = fm.body.split('\n').findIndex((l) => /[\u2014\u2013]/.test(l));
    errors.push(new ContentError(shown, fm.bodyLine + i + 1, 'The body contains an em or en dash. Use a comma, a colon or "to".'));
  }
  return data ? { ...data, body: fm.body, bodyLine: fm.bodyLine } : null;
}

// Splits rendered Markdown into sections at each h2.
export function sections(bodyMarkdown) {
  const htmlStr = renderMarkdown(bodyMarkdown);
  const parts = htmlStr.split(/(?=<h2>)/).map((s) => s.trim()).filter(Boolean);
  return parts.map((p) => {
    const m = p.match(/^<h2>([\s\S]*?)<\/h2>\s*([\s\S]*)$/);
    if (!m) return { title: null, html: p };
    let rest = m[2], lede = null;
    const l = rest.match(/^<p><em>([\s\S]*?)<\/em><\/p>\s*([\s\S]*)$/);
    if (l) { lede = l[1]; rest = l[2]; }
    return { title: m[1], lede, html: rest };
  });
}

// Fails on two spellings of what is probably the same organisation or skill.
function nearDuplicates(entries, field, errors) {
  const seen = new Map();
  for (const e of entries) {
    const values = field === 'skills' ? e.skills : e.organisation ? [e.organisation] : [];
    for (const v of values) {
      const key = slugify(v);
      for (const [k, first] of seen) {
        if (first.value === v) continue;
        if (k === key || (key.length > 5 && distance(k, key) <= 1)) {
          errors.push(new ContentError(e.file, 2, `${field === 'skills' ? 'Skill' : 'Organisation'} "${v}" looks like "${first.value}" in ${first.file}. Use one spelling.`));
        }
      }
      if (!seen.has(key)) seen.set(key, { value: v, file: e.file });
    }
  }
}

export function loadContent(root, { preview = false, extraEntryDirs = [] } = {}) {
  const errors = [];
  const dir = path.join(root, 'content');
  const site = loadYamlFile(path.join(dir, 'site.yaml'), siteSchema, root, errors);
  const profile = loadYamlFile(path.join(dir, 'profile', 'profile.yaml'), profileSchema, root, errors);
  const manual = loadMarkdownFile(path.join(dir, 'profile', 'manual.md'), manualSchema, root, errors);
  const systems = loadMarkdownFile(path.join(dir, 'systems.md'), systemsSchema, root, errors);
  const nnl = loadYamlFile(path.join(dir, 'now-next-later.yaml'), nnlSchema, root, errors);

  const entryFiles = [];
  for (const d of [path.join(dir, 'work'), ...extraEntryDirs]) {
    if (!fs.existsSync(d)) continue;
    for (const name of fs.readdirSync(d).sort()) {
      const p = path.join(d, name);
      if (fs.statSync(p).isDirectory()) {
        const idx = path.join(p, 'index.md');
        if (fs.existsSync(idx)) entryFiles.push(idx);
        else errors.push(new ContentError(rel(root, p), 1, 'An entry folder needs an index.md.'));
      } else if (name.endsWith('.md')) entryFiles.push(p);
    }
  }
  let entries = entryFiles.map((f) => loadEntry(f, root, errors)).filter(Boolean);
  const slugs = new Map();
  for (const e of entries) {
    if (slugs.has(e.slug)) errors.push(new ContentError(e.file, 1, `Two entries share the slug "${e.slug}": ${slugs.get(e.slug)} and ${e.file}.`));
    slugs.set(e.slug, e.file);
  }
  nearDuplicates(entries, 'organisation', errors);
  nearDuplicates(entries, 'skills', errors);

  const collections = [];
  const cdir = path.join(dir, 'collections');
  if (fs.existsSync(cdir)) for (const name of fs.readdirSync(cdir).sort()) {
    if (!name.endsWith('.md')) continue;
    const c = loadMarkdownFile(path.join(cdir, name), collectionSchema, root, errors);
    if (c) collections.push({ ...c, slug: path.basename(name, '.md'), introHtml: renderMarkdown(c.body), file: rel(root, path.join(cdir, name)) });
  }

  if (profile?.portrait) {
    profile.portrait.file = path.join(dir, 'profile', profile.portrait.src);
    if (!fs.existsSync(profile.portrait.file)) errors.push(new ContentError('content/profile/profile.yaml', 1, `Portrait file not found: content/profile/${profile.portrait.src}.`));
  }

  if (errors.length) {
    const e = new Error(`Content is not valid. ${errors.length} problem${errors.length === 1 ? '' : 's'}:\n` + errors.map((x) => '  ' + x.message).join('\n'));
    e.contentErrors = errors;
    throw e;
  }

  const total = entries.length;
  const drafts = entries.filter((e) => e.visibility !== 'public');
  if (!preview) entries = entries.filter((e) => e.visibility === 'public');
  entries.sort((a, b) => b.year - a.year || b.order - a.order || a.title.localeCompare(b.title));
  const visibleCollections = (preview ? collections : collections.filter((c) => c.visibility === 'public')).sort((a, b) => a.order - b.order);

  return {
    site, profile, manual: { ...manual, sections: sections(manual.body) }, systems: { ...systems, sections: sections(systems.body) },
    nnl, entries, collections: visibleCollections, preview,
    report: { total, built: entries.length, drafts: drafts.map((d) => d.file) },
  };
}
