// Shared parts of the markup contract. See docs/markup-contract.md.
//
// Rules every template follows:
//   - The markup holds the union of boxes any mood needs. A quiet mood
//     dissolves a box with display: contents; no mood adds one.
//   - Words live here, never in a stylesheet. Ordinals and totals come from
//     the --i and --n custom properties through CSS counters.
//   - Each component root is .c with data-c, and carries one aria-hidden
//     .c-orn slot for chrome. Moods draw frames with pseudo-elements.

import { html, raw, attrs, pad2 } from '../build/html.mjs';

export const orn = () => raw('<span class="c-orn" aria-hidden="true"></span>');

// The component head: a label and an optional readout of real data.
export function head({ label, readout = null, tag = 'p', draft = false }) {
  return html`<div class="c-head"><${raw(tag)} class="c-label">${label}</${raw(tag)}>${readout ? html`<p class="c-readout">${readout}</p>` : ''}${draft ? draftTag() : ''}</div>`;
}

export const draftTag = (note = 'Draft') => html`<span class="draft" title="Placeholder. Waiting on Tucker.">${note}</span>`;

// Splits a display title so a mood can colour its last word.
export function title(text) {
  const words = String(text).trim().split(/\s+/);
  if (words.length < 2) return html`<span class="t-lead">${text}</span>`;
  const tail = words.pop();
  return html`<span class="t-lead">${words.join(' ')}</span> <span class="t-tail">${tail}</span>`;
}

// The circle every mood shares: a ripple, a luminous ring or a radar.
// Purely ornamental: no text reaches assistive technology.
export function motif({ contacts = 0 } = {}) {
  const rings = [12, 27, 45, 68, 94];
  const spots = [[42, -50], [28, 44], [-58, 26]].slice(0, contacts);
  return html`<div class="motif" aria-hidden="true"><svg class="motif__svg" viewBox="-100 -100 200 200" focusable="false">
<g class="motif__rings">${rings.map((r, i) => html`<circle class="motif__ring" data-i="${i + 1}" r="${r}"/>`)}</g>
<circle class="motif__ticks" r="97" pathLength="360"/>
<line class="motif__axis" x1="-94" y1="0" x2="94" y2="0"/><line class="motif__axis" x1="0" y1="-94" x2="0" y2="94"/>
<path class="motif__sweep" d="M0 0 L0 -94 A94 94 0 0 1 60.4 -72 Z"/>
<circle class="motif__core" r="2.4"/>
${spots.map(([x, y], i) => html`<g class="motif__contact" data-i="${i + 1}" transform="translate(${x} ${y})"><circle class="motif__blip" r="3"/><text class="motif__num" x="7" y="2.6">${pad2(i + 1)}</text></g>`)}
</svg></div>`;
}

export const mark = () => raw('<svg class="mark" viewBox="-12 -12 24 24" aria-hidden="true" focusable="false"><circle class="mark__outer" r="10"/><circle class="mark__inner" r="4"/></svg>');

// A responsive picture. `sizes` is an upper bound that holds in every mood.
export function picture(ctx, img, { alt, sizes = '(min-width: 1280px) 1200px, 96vw', eager = false, cls = '' }) {
  const set = (list) => list.map((v) => `${ctx.u(v.path)} ${v.w}w`).join(', ');
  const fb = img.variants.jpg[0];
  return html`<picture class="${cls}"><source type="image/avif" srcset="${set(img.variants.avif)}" sizes="${sizes}"><source type="image/webp" srcset="${set(img.variants.webp)}" sizes="${sizes}"><img src="${ctx.u(fb.path)}" alt="${alt}" width="${img.width}" height="${img.height}"${attrs({ loading: eager ? null : 'lazy', decoding: 'async' })}></picture>`;
}

// One artifact: the image on its mat, linked to the full-size file, with a
// caption. Shown as it is: never recoloured, tilted or framed in a device.
export function artifact(ctx, { img, alt, caption }, { eager = false } = {}) {
  const shape = img.width / img.height > 2.6 ? 'strip' : img.width / img.height < 1.05 ? 'tall' : 'wide';
  return html`<figure class="artifact" data-shape="${shape}" style="--w:${img.width};--h:${img.height}"><a class="artifact__mat" href="${ctx.u(img.full)}">${picture(ctx, img, { alt, eager })}<span class="vh"> Open the image at full size</span></a><figcaption class="artifact__caption"><span class="fig-label">Figure</span> <span class="fig-text">${caption}</span></figcaption></figure>`;
}

export function list(tag, items, cls = '') {
  return html`<${raw(tag)}${attrs({ class: cls || null })} role="list" style="--n:${items.length}">${items.map((it, i) => html`<li style="--i:${i + 1}">${it}</li>`)}</${raw(tag)}>`;
}

export const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
