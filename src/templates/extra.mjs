// The printable resume, the specimen (every token and component, used by the
// checks and by anyone building a new mood) and the 404 page.

import { html, raw } from '../build/html.mjs';
import { TYPES, STATUSES } from '../build/content.mjs';
import { moods } from '../moods/registry.mjs';
import { orn, head, title, list, draftTag, plural, motif } from './parts.mjs';
import { shell, emailLink } from './shell.mjs';
import { entryBody } from './case.mjs';

export function resumePage(ctx) {
  const { site, profile, entries } = ctx.content;
  const work = entries.filter((e) => e.type !== 'product' && e.type !== 'certification');
  const body = html`<article class="resume">
<header class="c c-pagehead c-resumehead" data-c="pagehead">
${orn()}
${head({ label: 'Resume' })}
<h1 class="c-title">${title(site.name)}</h1>
<p class="resume__identity">${site.identity.map((l) => html`<span class="id-line">${l}</span> `)}</p>
<p class="resume__contact">${emailLink(ctx, 'resume__email', { showAddress: true })} <span class="resume__url">${site.url.replace(/^https:\/\//, '')}</span></p>
<p class="resume__lead">${site.lead} ${site.sub}</p>
</header>
<section class="c c-career" data-c="career">
${orn()}
${head({ label: 'Experience', tag: 'h2' })}
<ol class="career" role="list" style="--n:${profile.career.length}">${profile.career.map((r, i) => html`<li class="career__row" style="--i:${i + 1}"><span class="career__when">${r.from ? `${r.from} to ${r.to ?? 'now'}` : 'Now'}${r.draft ? html` ${draftTag()}` : ''}</span> <span class="career__role">${r.role}</span> <span class="career__org">${r.organisation}</span>${r.note ? html` <span class="career__note">${r.note}</span>` : ''}</li>`)}</ol>
</section>
${work.length ? html`<section class="c c-resumework" data-c="resumework">
${orn()}
${head({ label: 'Selected work', tag: 'h2' })}
<ul class="resume__work" role="list" style="--n:${work.length}">${work.map((e, i) => html`<li style="--i:${i + 1}"><span class="career__when">${e.date_label}</span> <span class="career__role">${e.hasPage ? html`<a href="${ctx.u(`/work/${e.slug}/`)}">${e.title}</a>` : e.title}</span> <span class="career__org">${[TYPES[e.type].label, e.organisation].filter(Boolean).join(', ')}</span></li>`)}</ul>
</section>` : ''}
<section class="c c-education" data-c="education">
${orn()}
${head({ label: 'Education and training', tag: 'h2' })}
${list('ul', profile.education.map((e) => html`<span class="edu__title">${e.title}</span> <span class="edu__org">${e.organisation}</span>${e.when ? html` <span class="edu__when">${e.when}</span>` : ''}`), 'education')}
</section>
</article>`;
  return shell(ctx, { title: 'Resume', page: 'resume', section: 'profile', body, description: `Resume of ${site.name}.` });
}

const isColour = (v) => /^(oklch|oklab|rgb|hsl|#|color\()/.test(v);

export function specimenPage(ctx, { tokenDump }) {
  const sample = 'Still water that runs deep.';
  const { entries, site } = ctx.content;
  const study = entries.find((e) => e.plates.length > 0);
  const body = html`<section class="c c-pagehead" data-c="pagehead">
${orn()}
${head({ label: 'Specimen' })}
<h1 class="c-title">${title('Specimen')}</h1>
<div class="prose pagehead__intro"><p>Every token and component, in the mood you are viewing. Used by the checks and by anyone adding a mood.</p></div>
</section>
${moods.map((m) => {
    const tokens = Object.entries(tokenDump[m.id] ?? {});
    const colours = tokens.filter(([, v]) => isColour(v));
    const rest = tokens.filter(([, v]) => !isColour(v));
    return html`<section class="c c-tokens" data-c="tokens" data-specimen-mood="${m.id}">
${orn()}
${head({ label: 'Tokens', tag: 'h2', readout: `${m.name}. ${m.stands}.` })}
<ul class="swatches" role="list" style="--n:${colours.length}">${colours.map(([k, v]) => html`<li class="swatch"><span class="swatch__chip" style="background:${v}"></span> <code class="swatch__name">${k}</code> <code class="swatch__value">${v}</code></li>`)}</ul>
<dl class="tokenlist">${rest.map(([k, v]) => html`<div><dt><code>${k}</code></dt><dd><code>${v}</code></dd></div>`)}</dl>
</section>`;
  })}
<section class="c c-type" data-c="type">
${orn()}
${head({ label: 'Type', tag: 'h2' })}
<div class="type__rows">
<div class="type__row"><p class="c-sublabel">Display</p><p class="c-title home__name">${title(site.name)}</p></div>
<div class="type__row"><p class="c-sublabel">Page title</p><p class="c-title">${title(sample)}</p></div>
<div class="type__row"><p class="c-sublabel">Plate title</p><p class="c-title plate__title">${sample}</p></div>
<div class="type__row"><p class="c-sublabel">Epigraph</p><blockquote class="epigraph"><p>${site.epigraph}</p></blockquote></div>
<div class="type__row"><p class="c-sublabel">Lead</p><p class="home__lead">${site.lead}</p></div>
<div class="type__row"><p class="c-sublabel">Text</p><div class="prose"><p>${site.sub} <strong>Strong text.</strong> <em>Emphasis.</em> <a href="${ctx.u('/work/')}">A link</a>.</p></div></div>
<div class="type__row"><p class="c-sublabel">Label</p><p class="c-label">Plate</p></div>
<div class="type__row"><p class="c-sublabel">Caption</p><p class="artifact__caption"><span class="fig-label">Figure</span> <span class="fig-text">A caption under an artifact.</span></p></div>
<div class="type__row"><p class="c-sublabel">Status</p><ul class="legend__list" role="list">${Object.entries(STATUSES).map(([k, v]) => html`<li><span class="status" data-status="${k}">${v}</span></li>`)}</ul></div>
<div class="type__row"><p class="c-sublabel">Tags</p><p>${draftTag()} <span class="type-tag" data-type="case-study">Case study</span> <a class="chip" href="${ctx.u('/work/')}" aria-current="true">All</a> <a class="chip" href="${ctx.u('/work/')}">Talk <span class="chip__n">1</span></a> <a class="tag" href="${ctx.u('/work/')}">Service Design</a></p></div>
</div>
</section>
<section class="c c-motifspec" data-c="motifspec">
${orn()}
${head({ label: 'Motif', tag: 'h2', readout: 'The circle every mood shares' })}
${motif({ contacts: 3 })}
</section>
${study ? html`<section class="c c-pagehead" data-c="pagehead">
${orn()}
${head({ label: 'Written variant' })}
<h2 class="c-title">${title('A case study with no images')}</h2>
<div class="prose pagehead__intro"><p>The same entry, rendered without its artifacts. ${plural(study.plates.length, 'plate', 'plates')}.</p></div>
</section>
${entryBody(ctx, study, { written: true, level: 'h2', withPager: false })}` : ''}`;
  return shell(ctx, { title: 'Specimen', page: 'specimen', body, noindex: true, description: 'Tokens and components in every mood.' });
}

export function notFoundPage(ctx) {
  const body = html`<section class="c c-pagehead" data-c="pagehead">
${orn()}
${head({ label: 'Error 404' })}
<h1 class="c-title">${title('Page not found')}</h1>
<div class="prose pagehead__intro"><p>That address has nothing behind it. Start again from <a href="${ctx.u('/')}">home</a> or the <a href="${ctx.u('/work/')}">work index</a>.</p></div>
</section>`;
  return shell(ctx, { title: 'Page not found', page: 'notfound', body, noindex: true });
}
