// WCAG contrast ratio between two CSS colours, including oklch().
//   node tools/contrast.mjs "oklch(0.28 0.028 245)" "oklch(0.972 0.006 210)"
// Text needs 4.5:1. Large text (24px, or 18.66px bold) and the edges of
// controls and focus rings need 3:1.

export function parse(input) {
  const s = input.trim().toLowerCase();
  let m = s.match(/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)(%?)\s+([\d.-]+)(?:deg)?\s*(?:\/\s*[\d.]+%?)?\)$/);
  if (m) {
    const L = m[2] ? Number(m[1]) / 100 : Number(m[1]);
    const C = m[4] ? Number(m[3]) / 100 * 0.4 : Number(m[3]);
    const h = Number(m[5]) * Math.PI / 180;
    const a = C * Math.cos(h), b = C * Math.sin(h);
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
    const l = l_ ** 3, mm = m_ ** 3, ss = s_ ** 3;
    return [
      +4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * ss,
      -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * ss,
      -0.0041960863 * l - 0.7034186147 * mm + 1.7076147010 * ss,
    ].map((v) => Math.min(1, Math.max(0, v)));   // linear sRGB, clipped to gamut
  }
  m = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/);
  if (m) {
    const hex = m[1].length === 3 ? [...m[1]].map((c) => c + c).join('') : m[1];
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  }
  m = s.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
  if (m) return [1, 2, 3].map((i) => Number(m[i]) / 255).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  throw new Error(`Cannot parse colour: ${input}`);
}

export const luminance = (c) => { const [r, g, b] = parse(c); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

import { fileURLToPath } from 'node:url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [a, b] = process.argv.slice(2);
  if (!a || !b) { console.error('usage: node tools/contrast.mjs "<colour>" "<colour>"'); process.exit(1); }
  const r = contrast(a, b);
  console.log(`${r.toFixed(2)}:1  ${r >= 4.5 ? 'passes for text' : r >= 3 ? 'passes for large text and control edges only' : 'FAILS'}`);
}
