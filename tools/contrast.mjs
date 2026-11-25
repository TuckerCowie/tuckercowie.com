// WCAG contrast ratio between two CSS colours, including oklch().
//   node tools/contrast.mjs "oklch(0.28 0.028 245)" "oklch(0.972 0.006 210)"
// Text needs 4.5:1. Large text (24px, or 18.66px bold) and the edges of
// controls and focus rings need 3:1.

import { fileURLToPath } from 'node:url';
import { contrast, toHex } from '../src/build/colour.mjs';

export { contrast, toHex };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [a, b] = process.argv.slice(2);
  if (!a || !b) { console.error('usage: node tools/contrast.mjs "<colour>" "<colour>"'); process.exit(1); }
  const r = contrast(a, b);
  console.log(`${r.toFixed(2)}:1  ${r >= 4.5 ? 'passes for text' : r >= 3 ? 'passes for large text and control edges only' : 'FAILS'}   (${toHex(a)} on ${toHex(b)})`);
}
