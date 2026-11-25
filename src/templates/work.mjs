// The Work index, its filters, the saved filters (collections) and the Works
// ledger. One table of every entry; a filter is a link to a prerendered page,
// so filtering works with scripting off. With scripting on, src/client/filter.js
// combines the three axes in place.

import { html, raw, attrs, slugify } from '../build/html.mjs';
import { TYPES, STATUSES } from '../build/content.mjs';
import { orn, head, title, plural, draftTag } from './parts.mjs';
import { shell } from './shell.mjs';

// The index holds the work a reader can open: case studies, workshops,
// talks, certifications and awards. Products have their own view, the ledger.
export const indexed = (entries) => entries.filter((e) => e.type !== 'product');

export function facets(entries) {
  const count = (map, key, label) => { const c = map.get(key) ?? { key, label, n: 0 }; c.n++; map.set(key, c); };
  const type = new Map(), org = new Map(), skill = new Map();
  for (const e of entries) {
    count(type, e.type, TYPES[e.type].label);
    if (e.organisation) count(org, slugify(e.organisation), e.organisation);
    for (const s of e.skills) count(skill, slugify(s), s);
  }
  const order = Object.keys(TYPES);
  return {
    type: [...type.values()].sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key)),
    org: [...org.values()].sort((a, b) => b.n - a.n || a.label.localeCompare(b.label)),
    skill: [...skill.values()].sort((a, b) => b.n - a.n || a.label.localeCompare(b.label)),
  };
}

export const matches = (e, f) =>
  (!f.type || e.type === f.type) &&
  (!f.org || (e.organisation && slugify(e.organisation) === f.org)) &&
  (!f.skill || e.skills.some((s) => slugify(s) === f.skill));

const AXES = [
  { key: 'type', label: 'Type', seg: 'type' },
  { key: 'org', label: 'Organisation', seg: 'org' },
  { key: 'skill', label: 'Skill', seg: 'skill' },
];

function filters(ctx, all, active, collection) {
  const f = facets(all);
  return html`<div class="c c-filters" data-c="filters" data-filters${raw(collection ? ' data-collection' : '')}>
${orn()}
${head({ label: 'Filters', tag: 'h2' })}
${AXES.map((ax, a) => html`<div class="filter" data-axis="${ax.key}" style="--i:${a + 1}"><p class="c-sublabel" id="filter-${ax.key}">${ax.label}</p><ul class="filter__list" role="list" aria-labelledby="filter-${ax.key}" style="--n:${f[ax.key].length + 1}">
<li><a class="chip" href="${ctx.u('/work/')}" data-filter-value=""${attrs({ 'aria-current': active[ax.key] ? null : 'true' })}>All</a></li>
${f[ax.key].map((v) => html`<li><a class="chip" href="${ctx.u(`/work/${ax.seg}/${v.key}/`)}" data-filter-value="${v.key}" data-filter-title="${ax.key === 'type' ? TYPES[v.key].plural : v.label}"${attrs({ 'aria-current': active[ax.key] === v.key ? 'true' : null })}>${v.label} <span class="chip__n">${v.n}</span></a></li>`)}
</ul></div>`)}
</div>`;
}

function row(ctx, e, i, shown) {
  const name = e.hasPage ? html`<a class="row__link" href="${ctx.u(`/work/${e.slug}/`)}">${e.title}</a>` : html`<span class="row__link">${e.title}</span>`;
  return html`<tr class="row" style="--i:${i + 1}" data-type="${e.type}" data-org="${e.organisation ? slugify(e.organisation) : ''}" data-skills="${e.skills.map(slugify).join(' ')}"${attrs({ hidden: !shown })}>
<td class="row__year" data-col="year">${e.year}</td>
<th class="row__title" data-col="title" scope="row">${name}</th>
<td class="row__about" data-col="about">${e.summary ? html`<span class="row__summary">${e.summary}</span> ` : ''}${e.confidentiality ? html`<span class="row__note">Visuals limited by confidentiality</span> ` : ''}${e.draft_note ? draftTag() : ''}</td>
<td class="row__org" data-col="org">${e.organisation ?? ''}</td>
<td class="row__type" data-col="type"><span class="type-tag" data-type="${e.type}">${TYPES[e.type].label}</span></td>
<td class="row__role" data-col="role">${e.role ?? ''}</td>
</tr>`;
}

export function indexTable(ctx, all, active, { caption = 'Work, newest first' } = {}) {
  const shown = all.filter((e) => matches(e, active)).length;
  return html`<div class="c c-index" data-c="index">
${orn()}
${head({ label: 'Index', tag: 'h2' })}
<p class="index__count" data-count aria-live="polite">${plural(shown, 'entry', 'entries')}</p>
<table class="index"><caption class="index__caption">${caption}</caption>
<thead><tr><th scope="col" data-col="year">Year</th><th scope="col" data-col="title">Title</th><th scope="col" data-col="about">About</th><th scope="col" data-col="org">Organisation</th><th scope="col" data-col="type">Type</th><th scope="col" data-col="role">Role</th></tr></thead>
<tbody style="--n:${all.length}">${all.map((e, i) => row(ctx, e, i, matches(e, active)))}</tbody>
</table>
<p class="index__empty" data-empty${attrs({ hidden: shown > 0 })}>Nothing matches these filters yet.</p>
</div>`;
}

function collectionList(ctx) {
  const { collections, entries } = ctx.content;
  if (!collections.length) return '';
  return html`<section class="c c-collections" data-c="collections">
${orn()}
${head({ label: 'Collections', tag: 'h2' })}
<ul class="collections" role="list" style="--n:${collections.length + 1}">
${collections.map((c, i) => {
    const n = indexed(entries).filter((e) => matches(e, normalise(c.filter))).length;
    return html`<li class="collection" style="--i:${i + 1}"><a href="${ctx.u(`/work/c/${c.slug}/`)}"><span class="collection__name">${c.title}</span> <span class="collection__n">${plural(n, 'entry', 'entries')}</span></a></li>`;
  })}
<li class="collection" style="--i:${collections.length + 1}"><a href="${ctx.u('/work/ledger/')}"><span class="collection__name">Works ledger</span> <span class="collection__n">Products and systems, with an honest status</span></a></li>
</ul>
</section>`;
}

export const normalise = (f) => ({ type: f.type ?? null, org: f.organisation ? slugify(f.organisation) : (f.org ?? null), skill: f.skill ? slugify(f.skill) : null });

export function workPage(ctx, { active = {}, heading = 'Work', docTitle = null, intro = null, kicker = null, collection = false } = {}) {
  const all = indexed(ctx.content.entries);
  const body = html`<section class="c c-pagehead" data-c="pagehead">
${orn()}
${head({ label: kicker ?? 'Work' })}
<h1 class="c-title">${title(heading)}</h1>
${intro ? html`<div class="prose pagehead__intro">${ctx.md(intro)}</div>` : ''}
</section>
${filters(ctx, all, active, collection)}
${indexTable(ctx, all, active)}
${collectionList(ctx)}
<script src="${ctx.u('/js/filter.js')}" defer></script>`;
  return shell(ctx, { title: docTitle ?? heading, page: 'work', section: 'work', body, description: 'Case studies, workshops, talks and products.' });
}

// ---------- Works ledger ----------

export function ledgerPage(ctx) {
  const { entries, nnl } = ctx.content;
  const products = entries.filter((e) => e.type === 'product');
  const used = Object.keys(STATUSES);
  const body = html`<section class="c c-pagehead" data-c="pagehead">
${orn()}
${head({ label: 'Work' })}
<h1 class="c-title">${title('Works ledger')}</h1>
<div class="prose pagehead__intro"><p>Products and systems, with an honest status. Parked and killed work stays in view.</p></div>
</section>
<div class="c c-ledger" data-c="ledger">
${orn()}
${head({ label: 'Ledger', tag: 'h2', readout: plural(products.length, 'work', 'works') })}
<table class="ledger"><caption class="index__caption">Products and systems, with status and date</caption>
<thead><tr><th scope="col" data-col="name">Name</th><th scope="col" data-col="status">Status</th><th scope="col" data-col="when">When</th><th scope="col" data-col="what">What it is</th></tr></thead>
<tbody style="--n:${products.length}">${products.map((e, i) => html`<tr class="row" style="--i:${i + 1}" data-status="${e.status}">
<th class="row__title" data-col="name" scope="row">${e.hasPage ? html`<a class="row__link" href="${ctx.u(`/work/${e.slug}/`)}">${e.title}</a>` : html`<span class="row__link">${e.title}</span>`}${e.draft_note ? html` ${draftTag()}` : ''}</th>
<td data-col="status"><span class="status" data-status="${e.status}">${STATUSES[e.status]}</span></td>
<td data-col="when">${e.date_label}</td>
<td data-col="what">${e.summary ?? ''}${e.verdict ? html` <span class="verdict"><span class="verdict__label">Verdict</span> ${e.verdict}</span>` : ''}</td>
</tr>`)}</tbody>
</table>
<div class="legend"><p class="c-sublabel" id="legend-label">Status key</p><ul class="legend__list" role="list" aria-labelledby="legend-label" style="--n:${used.length}">${used.map((s, i) => html`<li style="--i:${i + 1}"><span class="status" data-status="${s}">${STATUSES[s]}</span></li>`)}</ul></div>
</div>
<section class="c c-nnl" data-c="nnl">
${orn()}
${head({ label: 'Now, next, later', tag: 'h2', readout: `Updated ${nnl.updated}`, draft: nnl.draft })}
<div class="nnl" style="--n:3">
${[['Now', nnl.now], ['Next', nnl.next], ['Later', nnl.later]].map(([label, items], i) => html`<section class="nnl__col" data-when="${label.toLowerCase()}" style="--i:${i + 1}"><h3 class="c-sublabel">${label}</h3><ul class="points" role="list">${items.map((t) => html`<li>${t}</li>`)}</ul></section>`)}
</div>
</section>`;
  return shell(ctx, { title: 'Works ledger', page: 'ledger', section: 'work', body, description: 'Products and systems with stage and verdict, and what is now, next and later.' });
}
