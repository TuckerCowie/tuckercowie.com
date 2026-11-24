// A malformed entry must fail the build with a message that names the file,
// the line and the fix. These are the messages an agent or Tucker would see.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContent } from '../../src/build/content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function errorsFor(fixture) {
  try {
    loadContent(root, { preview: true, extraEntryDirs: [path.join(root, 'checks/fixtures/bad')] });
  } catch (e) {
    return (e.contentErrors ?? []).map((x) => x.message).filter((m) => m.includes(`/${fixture}/`));
  }
  return [];
}

test('real content loads cleanly', () => {
  const c = loadContent(root, { preview: true });
  assert.ok(c.entries.length > 0);
});

test('a missing required field names the field', () => {
  assert.deepEqual(errorsFor('missing-field'), ['checks/fixtures/bad/missing-field/index.md:2: Missing required field "title".']);
});

test('a bad type lists the allowed values', () => {
  const [m] = errorsFor('bad-enum');
  assert.match(m, /bad-enum\/index\.md:3: "type" must be one of: case-study, workshop, talk, certification, award, product\./);
});

test('a misspelt field is caught and corrected, not ignored', () => {
  assert.deepEqual(errorsFor('typo-key'), ['checks/fixtures/bad/typo-key/index.md:5: Unknown field "visiblity". Did you mean "visibility"?']);
});

test('a plate with two artifacts, a missing alt, a missing caption and a missing file each get a line', () => {
  const m = errorsFor('two-images');
  assert.ok(m.some((x) => /index\.md:16: Image "\.\/c\.jpg" has no alt text/.test(x)), m.join('\n'));
  assert.ok(m.some((x) => /index\.md:16: Image "\.\/c\.jpg" has no caption/.test(x)));
  assert.ok(m.some((x) => /index\.md:8: Plate "Research" has 3 images\. A process plate takes one artifact/.test(x)));
  assert.ok(m.some((x) => /index\.md:12: Image file not found: checks\/fixtures\/bad\/two-images\/a\.jpg/.test(x)));
});
