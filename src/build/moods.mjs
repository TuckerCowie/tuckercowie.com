// Compiles each mood stylesheet to one scoped file and produces the head
// snippet that selects a mood before first paint.
//
// A mood stylesheet is written as if it were the only one on the site.
// The compile:
//   1. bundles its @imports and flattens nesting,
//   2. prefixes every selector with the mood's scope, so several mood sheets
//      can be loaded at once and only one applies,
//   3. wraps the result in @media screen, so print is mood-free.
//
// Scope: :root[data-mood="x"]. For the two moods that are a system default
// ("auto" in the registry) the scope also matches a root with no data-mood,
// which is how the site works with scripting off.

import { bundle, transform, Features } from 'lightningcss';
import path from 'node:path';
import { moods, param, storageKey } from '../moods/registry.mjs';

const attr = (id) => ({ type: 'attribute', name: 'data-mood', operation: { operator: 'equal', value: id } });
const ROOT = { type: 'pseudo-class', kind: 'root' };

function scopeFor(mood) {
  if (!mood.auto) return [ROOT, attr(mood.id)];
  return [ROOT, {
    type: 'pseudo-class', kind: 'is',
    selectors: [[attr(mood.id)], [{ type: 'pseudo-class', kind: 'not', selectors: [[{ type: 'attribute', name: 'data-mood' }]] }]],
  }];
}

function scopeSelector(sel, scope) {
  const first = sel[0];
  const isRoot = first && ((first.type === 'pseudo-class' && first.kind === 'root') || (first.type === 'type' && first.name === 'html'));
  if (isRoot) return [...scope, ...sel.slice(1)];
  return [...scope, { type: 'combinator', value: 'descendant' }, ...sel];
}

export function compileMood(mood, { srcDir, minify = true }) {
  const filename = path.join(srcDir, `${mood.id}.css`);
  // Pass 1: bundle imports, flatten nesting. No colour or syntax lowering.
  const flat = bundle({ filename, include: Features.Nesting, minify: false });
  const scope = scopeFor(mood);
  // Pass 2: scope every style rule.
  const scoped = transform({
    filename,
    code: flat.code,
    minify,
    // Only selectors pass through JavaScript. (Returning whole rules from a
    // visitor breaks on var() in lightningcss 1.33.)
    visitor: { Selector: (sel) => scopeSelector(sel, scope) },
  });
  if (/@font-face/.test(flat.code.toString())) throw new Error(`${mood.id}.css: @font-face belongs in src/build/fonts.mjs, not in a mood`);
  // A sentinel the checks read, the colour scheme for form controls, and a
  // rule that keeps the specimen page to this mood's own token table.
  const sentinel = transform({
    filename: 'sentinel.css',
    code: Buffer.from(`:root{--mood:${mood.id};color-scheme:${mood.scheme}} [data-specimen-mood]:not([data-specimen-mood="${mood.id}"]){display:none}`),
    minify,
    visitor: { Selector: (sel) => scopeSelector(sel, scope) },
  });
  const css = `/* ${mood.name}. Compiled from src/moods/${mood.id}.css. */\n@media screen{${sentinel.code}${scoped.code}}\n`;
  return { css, flat: flat.code.toString() };
}

// Reads a custom property's value from a mood's flattened source.
export function readToken(flatCss, token) {
  const m = flatCss.match(new RegExp(`${token.replace(/[-]/g, '\\-')}\\s*:\\s*([^;}]+)`));
  return m ? m[1].trim() : null;
}

// The <head> fragment that loads mood stylesheets. `u` maps a site path to a
// URL for the current page (absolute or relative, see build.mjs).
//
// Order matters and is checked by checks/static: the inline script comes
// first, is classic and synchronous, and writes the explicit mood's link so
// that the parser creates it. A parser-created stylesheet link blocks
// rendering, so the first paint is never the wrong mood.
export function moodHead({ u, themeColors }) {
  const map = Object.fromEntries(moods.map((m) => [m.id, m.scheme]));
  const base = u('/moods/');
  const script =
    `!function(d,M,B){var r=d.documentElement,m,f,h=Object.prototype.hasOwnProperty;` +
    `try{m=new URLSearchParams(location.search).get(${JSON.stringify(param)})}catch(e){}` +
    `if(m&&h.call(M,m))f="url";else{try{m=localStorage.getItem(${JSON.stringify(storageKey)})}catch(e){m=null}` +
    `if(m&&h.call(M,m))f="saved";else return}` +
    `d.write('<link rel="stylesheet" data-mood-sheet="'+m+'" href="'+B+m+'.css">');` +
    `if(d.querySelector('link[data-mood-sheet="'+m+'"]')){r.setAttribute("data-mood",m);r.setAttribute("data-mood-from",f)}` +
    `}(document,${JSON.stringify(map)},${JSON.stringify(base)});`;
  const autos = moods.filter((m) => m.auto);
  const links = autos.map((m) => {
    const media = m.auto === 'dark' ? '(prefers-color-scheme: dark)' : 'not all and (prefers-color-scheme: dark)';
    return `<link rel="stylesheet" href="${base}${m.id}.css" media="${media}" data-mood-auto="${m.id}">`;
  });
  const metas = autos.map((m) => {
    const media = m.auto === 'dark' ? '(prefers-color-scheme: dark)' : '(prefers-color-scheme: light)';
    return `<meta name="theme-color" content="${themeColors[m.id]}" media="${media}">`;
  });
  return { script, links, metas };
}

// Data the client script needs, generated from the registry.
export function moodClientConfig({ themeColors }) {
  return {
    param, storageKey,
    moods: moods.map((m) => ({ id: m.id, name: m.name, scheme: m.scheme, auto: m.auto, theme: themeColors[m.id] })),
  };
}
