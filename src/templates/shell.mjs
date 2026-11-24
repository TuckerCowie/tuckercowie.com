// The page shell: head, site header with navigation and the mood switcher,
// main, footer. Every page in every mood is this markup.

import { html, raw, attrs } from '../build/html.mjs';
import { moods } from '../moods/registry.mjs';
import { orn, mark, draftTag } from './parts.mjs';

const NAV = [
  { id: 'work', label: 'Work', path: '/work/' },
  { id: 'profile', label: 'Profile', path: '/profile/' },
  { id: 'systems', label: 'Systems', path: '/systems/' },
];

export function emailLink(ctx, cls = 'email') {
  const { site } = ctx.content;
  const draft = !site.email;
  // No address is committed to this public repo. Until one is set in
  // content/site.yaml the link has no destination and is tagged as a draft.
  if (draft) return html`<a class="${cls}" aria-disabled="true" role="link">${site.email_label}</a> ${draftTag()}`;
  return html`<a class="${cls}" href="mailto:${site.email}">${site.email_label}</a>`;
}

export function shell(ctx, { title, description, page, section = null, body, noindex = false }) {
  const { site } = ctx.content;
  const u = ctx.u;
  const fullTitle = page === 'home' ? `${site.name}, product and design leader` : `${title} · ${site.name}`;
  const head = ctx.moodHead;
  return html`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<script>${raw(head.script)}</script>
<link rel="stylesheet" href="${u('/css/base.css')}">
${raw(head.links.join('\n'))}
${raw(head.metas.join('\n'))}
<title>${fullTitle}</title>
<meta name="description" content="${description ?? site.description}">
${noindex || ctx.content.preview ? raw('<meta name="robots" content="noindex">') : ''}
<link rel="canonical" href="${site.url.replace(/\/$/, '')}${ctx.page}">
<link rel="icon" href="${u('/favicon.svg')}" type="image/svg+xml">
<link rel="alternate" type="application/json" href="${u('/index.json')}" title="Index of public entries">
<script src="${u('/js/mood.js')}" defer></script>
</head>
<body data-page="${page}">
<a class="skip" href="#main">Skip to content</a>
<header class="site-head c" data-c="nav">
${orn()}
<a class="brand" href="${u('/')}"${attrs({ 'aria-current': page === 'home' ? 'page' : null })}>${mark()}<span class="brand__name">${site.name}</span></a>
<nav class="site-nav" aria-label="Site"><ul class="nav" style="--n:${NAV.length}">${NAV.map((n, i) => html`<li style="--i:${i + 1}"><a href="${u(n.path)}"${attrs({ 'aria-current': section === n.id ? (ctx.page === n.path ? 'page' : 'true') : null })}>${n.label}</a></li>`)}</ul></nav>
<div class="switcher" data-c="switcher" role="group" aria-label="Mood" hidden>
<span class="switcher__label" aria-hidden="true">Mood</span>
${moods.map((m) => html`<button type="button" class="switcher__btn" data-mood-set="${m.id}" aria-pressed="false"><span class="switcher__glyph" aria-hidden="true"></span><span class="switcher__name">${m.name}</span></button>`)}
</div>
</header>
<main id="main" tabindex="-1">
${body}
</main>
<footer class="site-foot c" data-c="foot">
${orn()}
<p class="foot__name">${site.name}</p>
<p class="foot__action">${emailLink(ctx, 'foot__email')}</p>
<p class="foot__top"><a href="#main">Back to top</a></p>
${ctx.content.preview ? html`<p class="foot__preview">Preview build. Drafts are included and nothing here is approved yet.</p>` : ''}
</footer>
<p class="vh" id="mood-status" role="status" aria-live="polite"></p>
<script type="application/json" id="mood-config">${raw(JSON.stringify(ctx.moodConfig).replace(/</g, '\\u003c'))}</script>
</body>
</html>
`;
}
