// Home: the identity, the epigraph, three doors and one action. One view.

import { html } from '../build/html.mjs';
import { orn, head, title, motif, draftTag } from './parts.mjs';
import { shell, emailLink } from './shell.mjs';

export function homePage(ctx) {
  const { site } = ctx.content;
  const doors = [
    { name: 'Work', path: '/work/', desc: site.doors.work },
    { name: 'Profile', path: '/profile/', desc: site.doors.profile },
    { name: 'Systems', path: '/systems/', desc: site.doors.systems },
  ];
  const body = html`<section class="c c-home" data-c="home">
${orn()}
${head({ label: 'Home' })}
<h1 class="c-title home__name">${title(site.name)}</h1>
<p class="home__identity">${site.identity.map((line, i) => html`<span class="id-line" style="--i:${i + 1}">${line}</span> `)}${site.drafts.includes('identity') ? draftTag() : ''}</p>
<blockquote class="home__epigraph"><p>${site.epigraph}</p></blockquote>
<p class="home__lead">${site.lead}</p>
<p class="home__sub">${site.sub}</p>
<nav class="doors" aria-label="Destinations"><ul class="doors__list" style="--n:${doors.length}">${doors.map((d, i) => html`<li class="door" style="--i:${i + 1}"><a class="door__link" href="${ctx.u(d.path)}"><span class="door__name">${d.name}</span> <span class="door__desc">${d.desc}</span></a></li>`)}</ul></nav>
<p class="home__action">${emailLink(ctx)}</p>
${motif({ contacts: doors.length })}
</section>`;
  return shell(ctx, { title: site.name, page: 'home', body });
}
