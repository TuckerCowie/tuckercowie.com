// Profile leads with the "How I Work Best" manual in full, then the
// statements, one line per assessment, and a compact career history.
// Systems is the method-level map of how Tucker builds with agents.

import { html, raw } from '../build/html.mjs';
import { orn, head, title, picture, list, draftTag, plural } from './parts.mjs';
import { shell } from './shell.mjs';
import { linkList } from './case.mjs';

// <li><strong>Term</strong> text</li> becomes a term and description pair.
const pairs = (h) => h.replace(/<li><strong>([^<]+)<\/strong>\s*/g, '<li class="pair"><span class="pair__term">$1</span> <span class="pair__desc">').replace(/(<li class="pair">[\s\S]*?)<\/li>/g, '$1</span></li>');

export function profilePage(ctx) {
  const { manual, profile, site } = ctx.content;
  const n = manual.sections.length;
  const body = html`<section class="c c-pagehead c-manualhead" data-c="pagehead">
${orn()}
${head({ label: manual.kicker })}
<h1 class="c-title">${title(manual.title)}</h1>
<p class="pagehead__sub">${manual.subtitle}</p>
<blockquote class="epigraph"><p>${manual.epigraph}</p></blockquote>
${profile.portrait ? html`<figure class="portrait">${picture(ctx, profile.portrait.asset, { alt: profile.portrait.alt, sizes: '(min-width: 900px) 420px, 80vw', eager: true })}<figcaption class="portrait__caption">${profile.portrait.caption}</figcaption></figure>` : ''}
</section>
<div class="c c-manual" data-c="manual" style="--n:${n}">
${orn()}
${head({ label: 'Manual', readout: plural(n, 'section', 'sections') })}
${manual.sections.map((s, i) => html`<section class="manual__section" style="--i:${i + 1}" id="manual-${i + 1}"><h2 class="manual__title">${raw(s.title)}</h2>${s.lede ? html`<p class="manual__lede">${raw(s.lede)}</p>` : ''}<div class="prose manual__body">${ctx.md(pairs(s.html))}</div></section>`)}
</div>
${profile.statements.length ? html`<section class="c c-statements" data-c="statements">
${orn()}
${head({ label: 'Statements', tag: 'h2' })}
<dl class="statements" style="--n:${profile.statements.length}">${profile.statements.map((s, i) => html`<div class="statement" style="--i:${i + 1}"><dt>${s.label}${s.draft ? html` ${draftTag()}` : ''}</dt><dd>${s.text}</dd></div>`)}</dl>
</section>` : ''}
${profile.assessments.length ? html`<section class="c c-assessments" data-c="assessments">
${orn()}
${head({ label: 'Assessments', tag: 'h2', draft: profile.assessments.some((a) => !a.line) })}
<dl class="assessments" style="--n:${profile.assessments.length}">${profile.assessments.map((a, i) => html`<div class="assessment" style="--i:${i + 1}"><dt>${a.name}</dt><dd>${a.line ?? html`<span class="pending">One line to come.</span>`}</dd></div>`)}</dl>
${profile.assessments_note ? html`<p class="assessments__note">${profile.assessments_note}</p>` : ''}
</section>` : ''}
<section class="c c-career" data-c="career">
${orn()}
${head({ label: 'Career', tag: 'h2', readout: plural(profile.career.length, 'role', 'roles') })}
<ol class="career" role="list" style="--n:${profile.career.length}">${profile.career.map((r, i) => html`<li class="career__row" style="--i:${i + 1}"><span class="career__when">${r.from ? `${r.from} to ${r.to ?? 'now'}` : 'Now'}${r.draft ? html` ${draftTag()}` : ''}</span> <span class="career__role">${r.role}</span> <span class="career__org">${r.organisation}</span>${r.note ? html` <span class="career__note">${r.note}</span>` : ''}</li>`)}</ol>
${profile.education.length ? html`<h3 class="c-sublabel">Education and training</h3>${list('ul', profile.education.map((e) => html`<span class="edu__title">${e.title}</span> <span class="edu__org">${e.organisation}</span>${e.when ? html` <span class="edu__when">${e.when}</span>` : ''}`), 'education')}` : ''}
<p class="career__resume"><a href="${ctx.u('/resume/')}">Printable resume</a></p>
</section>`;
  return shell(ctx, { title: 'Profile', page: 'profile', section: 'profile', body, description: `How ${site.name} works best: the manual, strengths and career.` });
}

export function systemsPage(ctx) {
  const { systems } = ctx.content;
  const stages = systems.pipeline;
  const body = html`<section class="c c-pagehead" data-c="pagehead">
${orn()}
${head({ label: 'Systems' })}
<h1 class="c-title">${title(systems.title)}</h1>
<div class="prose pagehead__intro"><p>${systems.lede}</p></div>
</section>
<section class="c c-pipeline" data-c="pipeline">
${orn()}
${head({ label: 'Pipeline', tag: 'h2', readout: plural(stages.length, 'stage', 'stages') })}
<ol class="pipeline" role="list" style="--n:${stages.length}">${stages.map((s, i) => html`<li class="stage" style="--i:${i + 1}"${raw(s.gate ? ' data-gate' : '')}><span class="stage__name">${s.name}</span>${s.note ? html` <span class="stage__note">${s.note}</span>` : ''}</li>`)}</ol>
<p class="pipeline__note">${systems.pipeline_note}</p>
</section>
${systems.numbers.length ? html`<section class="c c-numbers" data-c="numbers">
${orn()}
${head({ label: 'Numbers', tag: 'h2' })}
<dl class="numbers" style="--n:${systems.numbers.length}">${systems.numbers.map((x, i) => html`<div class="number" style="--i:${i + 1}"><dt>${x.label}</dt><dd>${x.value}</dd></div>`)}</dl>
</section>` : ''}
<div class="c c-method" data-c="method" style="--n:${systems.sections.length}">
${orn()}
${head({ label: 'Method', readout: plural(systems.sections.length, 'part', 'parts') })}
${systems.sections.map((s, i) => html`<section class="method__section" style="--i:${i + 1}"><h2 class="method__title">${raw(s.title)}</h2>${s.lede ? html`<p class="method__lede">${raw(s.lede)}</p>` : ''}<div class="prose method__body">${ctx.md(pairs(s.html))}</div></section>`)}
</div>
${systems.principles.length ? html`<section class="c c-principles" data-c="principles">
${orn()}
${head({ label: 'Principles', tag: 'h2' })}
${list('ul', systems.principles, 'principles')}
</section>` : ''}
${systems.published.length || ctx.preview ? html`<section class="c c-published" data-c="published">
${orn()}
${head({ label: 'Published skills', tag: 'h2', draft: !systems.published.length })}
${systems.published.length ? linkList(ctx, systems.published) : ''}
${systems.published_note ? html`<p class="published__note">${systems.published_note}</p>` : ''}
</section>` : ''}`;
  return shell(ctx, { title: 'Systems', page: 'systems', section: 'systems', body, description: systems.lede });
}
