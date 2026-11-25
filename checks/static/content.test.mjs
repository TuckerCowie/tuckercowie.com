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

test('a value YAML reads as an alias is reported, not crashed on', () => {
  const [m] = errorsFor('yaml-alias');
  assert.match(m, /yaml-alias\/index\.md:\d+: YAML: .*Put quotes around a value that starts with/);
});

test('a wrong type is named as a wrong type, not as a missing field', () => {
  const m = errorsFor('wrong-type');
  assert.ok(m.some((x) => /index\.md:4: "year" must be a number\./.test(x)), m.join('\n'));
  assert.ok(m.some((x) => /index\.md:5: "date_label" must be a string\. Put it in quotes\./.test(x)), m.join('\n'));
});

test('an image must be a file beside its entry', () => {
  const m = errorsFor('image-path');
  assert.ok(m.some((x) => /index\.md:12: Image "\.\.\/two-images\/a\.jpg" must be a JPEG, PNG, WebP or AVIF file beside the entry/.test(x)), m.join('\n'));
});

test('two real skills that differ by one letter are both allowed', () => {
  const c = loadContent(root, { preview: true, extraEntryDirs: [path.join(root, 'checks/fixtures/ok')] });
  assert.ok(c.entries.some((e) => e.skills.includes('UX Design')) && c.entries.some((e) => e.skills.includes('UI Design')));
});

test('an image written outside a plate never becomes a request', async () => {
  const { renderInline, renderMarkdown } = await import('../../src/build/markdown.mjs');
  assert.ok(!/<img/.test(renderInline('A remote image ![x](https://example.com/x.png)')));
  assert.ok(!/<img/.test(renderMarkdown('Text.\n\n![x](https://example.com/x.png)')));
});

test('text before the first heading and stray headings are refused in the manual and systems pages', async () => {
  const { sections } = await import('../../src/build/content.mjs');
  const errors = [];
  sections('Intro\n\n## First\n\ntext\n\n# Shouty\n\n![a](./x.jpg)', { file: 'x.md', errors });
  const m = errors.map((e) => e.message);
  assert.ok(m.some((x) => /x\.md:1: Text must sit under a "## " heading/.test(x)), m.join('\n'));
  assert.ok(m.some((x) => /x\.md:7: Only "## " headings are allowed here; found <h1>/.test(x)), m.join('\n'));
  assert.ok(m.some((x) => /x\.md:9: Images are only supported inside the plates of an entry/.test(x)), m.join('\n'));
});
