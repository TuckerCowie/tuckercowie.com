// Escaped tagged templates. Everything interpolated is escaped unless it is
// already a Raw value (the result of html`` or raw()).

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export class Raw {
  constructor(value) { this.value = value; }
  toString() { return this.value; }
}

export const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ESC[c]);
export const raw = (v) => new Raw(String(v ?? ''));

function render(v) {
  if (v === null || v === undefined || v === false || v === true) return '';
  if (v instanceof Raw) return v.value;
  if (Array.isArray(v)) return v.map(render).join('');
  return esc(v);
}

export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i++) out += render(values[i]) + strings[i + 1];
  return new Raw(out);
}

// attrs({ class: 'a', hidden: true, 'data-x': null }) -> ' class="a" hidden'
export function attrs(map) {
  let out = '';
  for (const [k, v] of Object.entries(map)) {
    if (v === null || v === undefined || v === false) continue;
    out += v === true ? ` ${k}` : ` ${k}="${esc(v)}"`;
  }
  return raw(out);
}

export const slugify = (s) =>
  String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export const pad2 = (n) => String(n).padStart(2, '0');
