// Self-hosted fonts. Files come from @fontsource packages on npm and are
// copied into dist/fonts/. A face is only downloaded by the browser when a
// mood uses it, so listing a face here costs nothing until then.
//
// Fallback faces are metric-matched so a late font swap moves no text.

const face = (family, file, weight, style = 'normal', extra = '') =>
  `@font-face{font-family:"${family}";src:url("FONTS${file}") format("woff2");font-weight:${weight};font-style:${style};font-display:swap;${extra}}`;

export const FONT_FILES = [
  // Newsreader: the serif of Tucker's manual. Variable, with optical sizes.
  { from: '@fontsource-variable/newsreader/files/newsreader-latin-opsz-normal.woff2', name: 'newsreader-latin-opsz-normal.woff2' },
  { from: '@fontsource-variable/newsreader/files/newsreader-latin-opsz-italic.woff2', name: 'newsreader-latin-opsz-italic.woff2' },
  // IBM Plex Sans: running text in every launch mood.
  ...[['400', 'normal'], ['400', 'italic'], ['500', 'normal'], ['600', 'normal'], ['600', 'italic']].map(([w, s]) => ({ from: `@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-${w}-${s}.woff2`, name: `ibm-plex-sans-latin-${w}-${s}.woff2` })),
  // IBM Plex Mono: labels, metadata and readouts.
  ...['400', '500'].map((w) => ({ from: `@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-${w}-normal.woff2`, name: `ibm-plex-mono-latin-${w}-normal.woff2` })),
  // Chakra Petch: Cyber's display face.
  ...['500', '600', '700'].map((w) => ({ from: `@fontsource/chakra-petch/files/chakra-petch-latin-${w}-normal.woff2`, name: `chakra-petch-latin-${w}-normal.woff2` })),
];

export function fontCss(fontsUrl) {
  const css = [
    face('Newsreader', 'newsreader-latin-opsz-normal.woff2', '200 800'),
    face('Newsreader', 'newsreader-latin-opsz-italic.woff2', '200 800', 'italic'),
    face('IBM Plex Sans', 'ibm-plex-sans-latin-400-normal.woff2', 400),
    face('IBM Plex Sans', 'ibm-plex-sans-latin-400-italic.woff2', 400, 'italic'),
    face('IBM Plex Sans', 'ibm-plex-sans-latin-500-normal.woff2', 500),
    face('IBM Plex Sans', 'ibm-plex-sans-latin-600-normal.woff2', 600),
    face('IBM Plex Sans', 'ibm-plex-sans-latin-600-italic.woff2', 600, 'italic'),
    face('IBM Plex Mono', 'ibm-plex-mono-latin-400-normal.woff2', 400),
    face('IBM Plex Mono', 'ibm-plex-mono-latin-500-normal.woff2', 500),
    face('Chakra Petch', 'chakra-petch-latin-500-normal.woff2', 500),
    face('Chakra Petch', 'chakra-petch-latin-600-normal.woff2', 600),
    face('Chakra Petch', 'chakra-petch-latin-700-normal.woff2', 700),
  ].join('\n');
  return css.replaceAll('FONTS', fontsUrl);
}
