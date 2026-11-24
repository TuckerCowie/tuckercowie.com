// An entry page. For a case study this is the grammar of Tucker's board:
// summary plate, details (goals, role, methodology, outcome), process plates
// of one heading, a few sentences and one artifact, a highlighted insight,
// the solution, the work in action, and a confidentiality marker.
//
// A plate with no image is the written variant. It is the same markup with
// no figure, and every mood styles .c-plate[data-written].

import { html, raw, slugify } from '../build/html.mjs';
import { TYPES, STATUSES } from '../build/content.mjs';
import { renderInline } from '../build/markdown.mjs';
import { orn, head, title, artifact, list, plural, draftTag } from './parts.mjs';
import { shell } from './shell.mjs';

const inline = (s) => raw(renderInline(s));

export function summaryPlate(ctx, e, { level = 'h1' } = {}) {
  const plates = e.plates.length;
  const fields = [
    e.role && { key: 'role', label: 'Role', value: e.role },
    { key: 'date', label: 'Date', value: e.date_label },
    e.organisation && { key: 'organisation', label: 'Organisation', value: e.organisation, href: `/work/org/${slugify(e.organisation)}/` },
    e.status && { key: 'status', label: 'Status', value: STATUSES[e.status], status: e.status },
  ].filter(Boolean);
  return html`<header class="c c-summary" data-c="summary" data-type="${e.type}">
${orn()}
${head({ label: 'Summary', readout: plates ? plural(plates, 'plate', 'plates') : null, draft: Boolean(e.draft_note) })}
<p class="crumb"><a href="${ctx.u('/work/')}">Work</a> <span class="crumb__sep" aria-hidden="true"></span> <a class="crumb__type" href="${ctx.u(`/work/type/${e.type}/`)}">${TYPES[e.type].label}</a></p>
<${raw(level)} class="c-title summary__title">${title(e.title)}</${raw(level)}>
${e.summary ? html`<p class="summary__line">${e.summary}</p>` : ''}
<dl class="fields" style="--n:${fields.length}">${fields.map((f, i) => html`<div class="field" data-field="${f.key}" style="--i:${i + 1}"><dt>${f.label}</dt><dd>${f.status ? html`<span class="status" data-status="${f.status}">${f.value}</span>` : f.href ? html`<a href="${ctx.u(f.href)}">${f.value}</a>` : f.value}</dd></div>`)}</dl>
${e.skills.length ? html`<div class="skills"><p class="c-sublabel">Skills</p><ul class="tags" style="--n:${e.skills.length}">${e.skills.map((s, i) => html`<li style="--i:${i + 1}"><a class="tag" href="${ctx.u(`/work/skill/${slugify(s)}/`)}">${s}</a></li>`)}</ul></div>` : ''}
${e.confidentiality ? html`<p class="marker" data-marker="confidential"><span class="marker__label">Confidentiality</span> <span class="marker__text">${e.confidentiality}</span></p>` : ''}
</header>`;
}

export function detailsBlock(ctx, e) {
  const blocks = [
    e.goals.length && { key: 'goals', label: 'Goals', body: list('ol', e.goals.map(inline), 'goals') },
    e.my_role.length && { key: 'role', label: 'My role', body: list('ul', e.my_role.map(inline), 'points') },
    e.methodology.length && { key: 'methodology', label: 'Methodology', body: list('ol', e.methodology.map(inline), 'steps') },
    e.outcome.length && { key: 'outcome', label: 'Outcome', body: e.outcome.length === 1 ? html`<p class="outcome">${inline(e.outcome[0])}</p>` : list('ul', e.outcome.map(inline), 'points') },
  ].filter(Boolean);
  if (!e.introHtml.trim() && !blocks.length) return '';
  return html`<section class="c c-details" data-c="details" style="--n:${blocks.length}">
${orn()}
${head({ label: e.details_label, tag: 'h2' })}
${e.introHtml.trim() ? html`<div class="prose details__intro">${raw(e.introHtml)}</div>` : ''}
${blocks.map((b, i) => html`<section class="block" data-block="${b.key}" style="--i:${i + 1}"><h3 class="c-sublabel">${b.label}</h3>${b.body}</section>`)}
</section>`;
}

const KIND_LABEL = { process: 'Plate', solution: 'Solution', 'in-action': 'In action' };

export function plate(ctx, e, p, i, n, { written = false } = {}) {
  const images = written ? [] : p.images;
  const links = p.kind === 'solution' ? e.links : [];
  return html`<section class="c c-plate" data-c="plate" data-kind="${p.kind}" id="plate-${i + 1}" style="--i:${i + 1};--n:${n}"${raw(images.length ? '' : ' data-written')}${raw(images.length > 1 ? ` data-set="${images.length}"` : '')}>
${orn()}
${head({ label: 'Plate' })}
<h2 class="c-title plate__title">${p.title}</h2>
${p.html.trim() ? html`<div class="prose plate__text">${raw(p.html)}</div>` : ''}
${images.length ? html`<div class="plate__figures" style="--n:${images.length}">${images.map((img, k) => artifact(ctx, { img: img.asset, alt: img.alt, caption: img.caption }, { eager: i === 0 && k === 0 }))}</div>` : ''}
${p.quote ? html`<blockquote class="pullquote">${raw(p.quote)}</blockquote>` : ''}
${p.insight ? html`<aside class="c c-insight" data-c="insight">${orn()}${head({ label: 'Insight' })}<div class="insight__text">${raw(p.insight)}</div></aside>` : ''}
${links.length ? html`<ul class="links" style="--n:${links.length}">${links.map((l, k) => html`<li style="--i:${k + 1}"><a class="link" href="${l.href}" rel="noopener">${l.label}</a></li>`)}</ul>` : ''}
</section>`;
}

export function pager(ctx, e) {
  const pages = ctx.content.entries.filter((x) => x.hasPage);
  const at = pages.findIndex((x) => x.slug === e.slug);
  const prev = pages[at - 1], next = pages[at + 1];
  return html`<nav class="c c-pager" data-c="pager" aria-label="More work">
${orn()}
${head({ label: 'More work' })}
<ul class="pager">
${prev ? html`<li class="pager__item" data-dir="prev"><a href="${ctx.u(`/work/${prev.slug}/`)}"><span class="pager__label">Newer</span> <span class="pager__title">${prev.title}</span></a></li>` : ''}
${next ? html`<li class="pager__item" data-dir="next"><a href="${ctx.u(`/work/${next.slug}/`)}"><span class="pager__label">Older</span> <span class="pager__title">${next.title}</span></a></li>` : ''}
<li class="pager__item" data-dir="index"><a href="${ctx.u('/work/')}"><span class="pager__label">Index</span> <span class="pager__title">All work</span></a></li>
</ul>
</nav>`;
}

export function entryBody(ctx, e, { written = false, level = 'h1', withPager = true } = {}) {
  const n = e.plates.length;
  return html`<article class="entry" data-type="${e.type}"${raw(written || e.written ? ' data-written' : '')}>
${summaryPlate(ctx, e, { level })}
${detailsBlock(ctx, e)}
${n ? html`<div class="plates" style="--n:${n}">${e.plates.map((p, i) => plate(ctx, e, p, i, n, { written }))}</div>` : ''}
${!n && e.links.length ? html`<ul class="links" style="--n:${e.links.length}">${e.links.map((l, k) => html`<li style="--i:${k + 1}"><a class="link" href="${l.href}" rel="noopener">${l.label}</a></li>`)}</ul>` : ''}
${withPager ? pager(ctx, e) : ''}
</article>`;
}

export function entryPage(ctx, e) {
  return shell(ctx, {
    title: e.title, page: 'entry', section: 'work',
    description: [TYPES[e.type].label, e.organisation, e.date_label].filter(Boolean).join(', ') + '.',
    body: entryBody(ctx, e),
  });
}
