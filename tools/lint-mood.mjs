// Lints a mood stylesheet against the rules in docs/markup-contract.md.
//   node tools/lint-mood.mjs <mood-id> [more ids]     exits 1 on any error
//
// It reads the mood with its @imports inlined, so shared partials are held
// to the same rules.

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bundle, Features } from 'lightningcss';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Splits flat CSS into leaf rules: { at: [enclosing at-rule preludes], selector, body }.
function leaves(css) {
  const out = [];
  const stack = [];
  let i = 0, start = 0;
  while (i < css.length) {
    const c = css[i];
    if (c === '"' || c === "'") { i++; while (i < css.length && css[i] !== c) { if (css[i] === '\\') i++; i++; } }
    else if (c === '{') { stack.push({ prelude: css.slice(start, i).trim(), bodyStart: i + 1, hasChild: false }); if (stack.length > 1) stack[stack.length - 2].hasChild = true; start = i + 1; }
    else if (c === '}') {
      const top = stack.pop();
      if (top && !top.hasChild) out.push({ at: stack.map((s) => s.prelude), selector: top.prelude, body: css.slice(top.bodyStart, i) });
      start = i + 1;
    } else if (c === ';' && stack.length === 0) start = i + 1;
    i++;
  }
  return out;
}

function declarations(body) {
  const out = [];
  let depth = 0, cur = '', quote = null;
  for (const ch of body) {
    if (quote) { cur += ch; if (ch === quote) quote = null; continue; }
    if (ch === '"' || ch === "'") { quote = ch; cur += ch; continue; }
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ';' && depth === 0) { out.push(cur); cur = ''; } else cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out.map((d) => { const k = d.indexOf(':'); return k === -1 ? null : { prop: d.slice(0, k).trim().toLowerCase(), value: d.slice(k + 1).trim() }; }).filter(Boolean);
}

const NAMED = /\b(white|black|red|blue|green|gray|grey|yellow|orange|purple|cyan|magenta|silver|navy|teal|aqua|lime|maroon|olive|fuchsia|pink|gold|brown|beige|ivory|indigo|violet|crimson|coral|salmon|khaki|tan|turquoise)\b/i;
const COLOUR_FN = /\b(rgba?|hsla?|oklch|oklab|lab|lch|hwb|color)\(\s*(?!from\s+var\()/i;
const HEX = /#[0-9a-f]{3,8}\b/i;
const LENGTH = /(?<![\w.#-])(\d*\.?\d+)(px|rem|em|pt)\b/gi;
const COLOUR_PROPS = /^(color|background|background-color|border|border-.*|outline|outline-color|fill|stroke|box-shadow|text-shadow|caret-color|accent-color|text-decoration|text-decoration-color|column-rule)$/;

export function lintMood(id) {
  const file = path.join(root, 'src/moods', `${id}.css`);
  const errors = [];
  let css;
  try { css = bundle({ filename: file, include: Features.Nesting, minify: false }).code.toString(); }
  catch (e) { return [`${id}.css does not parse: ${e.message}`]; }
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  if (/@font-face/.test(css)) errors.push('@font-face is not allowed in a mood. Faces are declared in src/build/fonts.mjs.');
  if (/url\(\s*["']?https?:/i.test(css)) errors.push('A mood may not load anything from another origin.');

  for (const rule of leaves(css)) {
    const where = `${rule.at.length ? rule.at.join(' ') + ' ' : ''}${rule.selector}`.replace(/\s+/g, ' ').slice(0, 110);
    const fail = (msg) => errors.push(`${where} { … }  ${msg}`);
    if (rule.at.some((a) => /^@keyframes/.test(a))) continue;
    if (/^@keyframes\s+(\S+)/.test(rule.selector)) continue;
    const isRoot = /^(:root|html)$/.test(rule.selector.trim());
    const motionOk = rule.at.some((a) => /prefers-reduced-motion:\s*no-preference/.test(a));
    for (const { prop, value } of declarations(rule.body)) {
      const custom = prop.startsWith('--');
      const bare = value.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, '""');
      if (/!important/i.test(value)) fail(`${prop}: !important is not allowed.`);
      if (prop === 'order' || /-reverse\b/.test(bare) || (prop.startsWith('grid-auto-flow') && /dense/.test(bare))) fail(`${prop}: ${value}  Do not reorder content away from reading order.`);
      if (prop === 'backdrop-filter' || prop === 'filter' || prop === 'mix-blend-mode') fail(`${prop} is not allowed: no blur, glass or recolouring.`);
      if (prop === 'outline' && /^(none|0)\b/.test(bare)) fail('outline: none removes the focus ring. Restyle it instead.');
      if (prop === 'content') {
        const strings = value.match(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g) ?? [];
        if (strings.some((s) => /[A-Za-z]/.test(s.replace(/\\[0-9a-fA-F]{1,6}\s?/g, '')))) fail(`content: ${value}  Words belong in the markup, not in a stylesheet.`);
        if (/attr\(/.test(bare)) fail('content: attr() pulls words into a stylesheet. Use a counter, or ask for the text in the markup.');
      }
      if ((prop === 'animation' || prop === 'animation-name' || prop === 'transition' || prop === 'transition-property') && !/^(none|unset|initial)$/.test(bare) && !motionOk && !custom) fail(`${prop} must sit inside @media (prefers-reduced-motion: no-preference).`);
      if (!isRoot) {
        if (HEX.test(bare) || COLOUR_FN.test(bare)) fail(`${prop}: ${value}  A colour literal outside the :root token block. Add a token.`);
        else if ((COLOUR_PROPS.test(prop) || custom) && NAMED.test(bare.replace(/var\([^)]*\)/g, ''))) fail(`${prop}: ${value}  A named colour outside the :root token block. Add a token.`);
        if (prop === 'font-family' && !/^var\(/.test(bare) && bare !== 'inherit') fail(`font-family: ${value}  Use a font token.`);
        if (prop === 'font' && /["']|serif|sans|mono/.test(value) && !/var\(/.test(value)) fail(`font: ${value}  Use font and size tokens.`);
        const stripped = bare.replace(/var\([^()]*(\([^()]*\))*[^()]*\)/g, 'VAR');
        for (const m of stripped.matchAll(LENGTH)) {
          const n = Number(m[1]);
          if (n === 0 || (m[2] === 'px' && n === 1)) continue;
          fail(`${prop}: ${value}  The raw length ${m[0]} should be a size or space token (0, 1px and percentages are fine).`);
          break;
        }
      }
    }
  }
  for (const m of css.matchAll(/@keyframes\s+([\w-]+)/g)) if (!m[1].startsWith(`${id}-`)) errors.push(`@keyframes ${m[1]}: keyframe names must start with "${id}-" so moods cannot collide.`);
  return errors;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const ids = process.argv.slice(2);
  if (!ids.length) { console.error('usage: node tools/lint-mood.mjs <mood-id> [more ids]'); process.exit(1); }
  let bad = 0;
  for (const id of ids) {
    const errors = lintMood(id);
    bad += errors.length;
    console.log(errors.length ? `${id}: ${errors.length} problem${errors.length === 1 ? '' : 's'}\n` + errors.map((e) => '  ' + e).join('\n') : `${id}: clean`);
  }
  process.exit(bad ? 1 : 0);
}
