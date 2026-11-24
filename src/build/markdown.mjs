// Markdown for entries. A case-study body has a fixed grammar, taken from
// Tucker's board:
//
//   intro paragraphs                      -> the Details text
//   ## Heading                            -> one plate
//   two or three sentences, lists allowed
//   ![alt](./file.jpg "caption")          -> the plate's artifact
//   > "A quote."                          -> a pulled quote
//   > [!INSIGHT]                          -> the highlighted insight
//   > The conclusion drawn.
//
// "Solution" and "In action" are reserved headings; they may hold several
// images. Every other plate holds at most one. A plate with no image is the
// written variant.

import MarkdownIt from 'markdown-it';

// html: false so content cannot inject markup. typographer off so the
// renderer never manufactures a dash or a curly quote the author did not type.
export const md = new MarkdownIt({ html: false, typographer: false, linkify: false });

const RESERVED = { solution: 'solution', 'in action': 'in-action' };

export class ContentError extends Error {
  constructor(file, line, message) {
    super(`${file}:${line}: ${message}`);
    this.file = file; this.line = line; this.detail = message;
  }
}

function renderTokens(tokens) {
  return md.renderer.render(tokens, md.options, {});
}

// Splits a token list into top-level blocks: [{ tokens, type, line }]
function blocks(tokens) {
  const out = [];
  let depth = 0, start = 0;
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (depth === 0) start = i;
    depth += t.nesting;
    if (depth === 0) out.push({ tokens: tokens.slice(start, i + 1), type: tokens[start].type, line: (tokens[start].map?.[0] ?? 0) });
  }
  return out;
}

function inlineText(block) {
  const inline = block.tokens.find((t) => t.type === 'inline');
  return inline ? inline.content.trim() : '';
}

// A paragraph that holds only one image.
function soleImage(block) {
  if (block.type !== 'paragraph_open') return null;
  const inline = block.tokens[1];
  const kids = (inline?.children ?? []).filter((c) => !(c.type === 'text' && c.content.trim() === '') && c.type !== 'softbreak');
  if (kids.length === 1 && kids[0].type === 'image') return kids[0];
  return null;
}

function strayImage(block) {
  return block.tokens.some((t) => t.type === 'inline' && (t.children ?? []).some((c) => c.type === 'image'));
}

export function parseBody(source, { file, lineOffset = 0, allowPlates = true }) {
  const errors = [];
  const err = (line, msg) => errors.push(new ContentError(file, line + lineOffset + 1, msg));
  const tokens = md.parse(source, {});
  const all = blocks(tokens);

  const intro = [];
  const plates = [];
  let current = null;

  for (const b of all) {
    if (b.type === 'heading_open') {
      const level = b.tokens[0].tag;
      if (level !== 'h2') { err(b.line, `Only "## " headings are allowed in an entry body; found <${level}>. Each "## " starts a plate.`); continue; }
      if (!allowPlates) { err(b.line, 'This entry type has no plates. Remove the "## " heading or change the type to case-study.'); continue; }
      const title = inlineText(b);
      if (!title) { err(b.line, 'A plate heading is empty.'); continue; }
      current = { title, kind: RESERVED[title.toLowerCase()] ?? 'process', line: b.line, prose: [], images: [], quote: null, insight: null };
      plates.push(current);
      continue;
    }
    const img = soleImage(b);
    if (img) {
      if (!current) { err(b.line, 'An image must sit inside a plate, under a "## " heading. The intro takes no images.'); continue; }
      const alt = img.content.trim();
      const src = img.attrGet('src');
      const caption = (img.attrGet('title') ?? '').trim();
      if (!alt) err(b.line, `Image "${src}" has no alt text. Write ![what the image shows](${src} "caption").`);
      if (!caption) err(b.line, `Image "${src}" has no caption. Write ![alt](${src} "caption").`);
      current.images.push({ src, alt, caption, line: b.line });
      continue;
    }
    if (strayImage(b)) { err(b.line, 'An image must be alone in its own paragraph, with a blank line above and below.'); continue; }
    if (b.type === 'blockquote_open') {
      const inner = b.tokens.slice(1, -1);
      const first = inner.find((t) => t.type === 'inline');
      const isInsight = first && /^\[!INSIGHT\]/i.test(first.content);
      if (!current) { err(b.line, 'A quote or insight must sit inside a plate, under a "## " heading.'); continue; }
      if (isInsight) {
        if (current.insight) { err(b.line, 'A plate holds at most one insight.'); continue; }
        first.content = first.content.replace(/^\[!INSIGHT\]\s*/i, '');
        first.children = md.parseInline(first.content, {})[0].children;
        if (!first.content.trim()) { err(b.line, 'The insight is empty. Put its text on the lines after "> [!INSIGHT]".'); continue; }
        current.insight = renderTokens(inner);
      } else {
        if (current.quote) { err(b.line, 'A plate holds at most one pulled quote.'); continue; }
        current.quote = renderTokens(inner);
      }
      continue;
    }
    (current ? current.prose : intro).push(...b.tokens);
  }

  for (const p of plates) {
    const many = p.kind !== 'process';
    if (!many && p.images.length > 1) err(p.line, `Plate "${p.title}" has ${p.images.length} images. A process plate takes one artifact. Split the plate, or use the "Solution" or "In action" heading for a set.`);
    p.html = renderTokens(p.prose);
    delete p.prose;
  }
  if (plates.filter((p) => p.kind === 'solution').length > 1) err(0, 'An entry has at most one "Solution" plate.');
  if (plates.filter((p) => p.kind === 'in-action').length > 1) err(0, 'An entry has at most one "In action" plate.');

  return { introHtml: renderTokens(intro), plates, errors };
}

export const renderInline = (s) => md.renderInline(String(s));
export const renderMarkdown = (s) => md.render(String(s));
