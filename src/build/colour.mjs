// Colour maths with no dependency: parse a CSS colour (oklch, hex or rgb),
// convert to sRGB hex, and compute WCAG contrast.

const toLinear = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const toGamma = (v) => (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055);

// Returns linear sRGB [r, g, b], each 0 to 1, clipped to gamut.
export function parse(input) {
  const s = String(input).trim().toLowerCase();
  let m = s.match(/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)(%?)\s+([\d.-]+)(?:deg)?\s*(?:\/\s*[\d.]+%?)?\)$/);
  if (m) {
    const L = m[2] ? Number(m[1]) / 100 : Number(m[1]);
    const C = m[4] ? (Number(m[3]) / 100) * 0.4 : Number(m[3]);
    const h = (Number(m[5]) * Math.PI) / 180;
    const a = C * Math.cos(h), b = C * Math.sin(h);
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const mm = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const ss = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3;
    return [
      +4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * ss,
      -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * ss,
      -0.0041960863 * l - 0.7034186147 * mm + 1.7076147010 * ss,
    ].map((v) => Math.min(1, Math.max(0, v)));
  }
  m = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/);
  if (m) {
    const hex = m[1].length === 3 ? [...m[1]].map((c) => c + c).join('') : m[1];
    return [0, 2, 4].map((i) => toLinear(parseInt(hex.slice(i, i + 2), 16) / 255));
  }
  m = s.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
  if (m) return [1, 2, 3].map((i) => toLinear(Number(m[i]) / 255));
  throw new Error(`Cannot parse colour: ${input}`);
}

export const toHex = (input) => '#' + parse(input).map((v) => Math.round(toGamma(v) * 255).toString(16).padStart(2, '0')).join('');
export const luminance = (c) => { const [r, g, b] = parse(c); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
