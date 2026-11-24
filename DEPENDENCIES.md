# Dependencies

There is no house default stack. Each dependency is here for a stated reason.
Add a line to this file in the same commit that adds a dependency.

The site is a hand-rolled Node build (`src/build/`, under a thousand lines)
with no framework. The parts that matter here (compiling one stylesheet per
mood, the head snippet that picks a mood before first paint, validating
structured Markdown, the checks) are custom in any stack. A framework would
supply routing and Markdown at the cost of several hundred transitive
packages and a major-version upgrade every year or two, on a site that has
been left behind twice. The trade: this repo owns its HTML escaping, its
image cache and its watch loop.

## Runtime of the build

| Package | Why it is here |
|---|---|
| `markdown-it` | Parses entry bodies to CommonMark tokens with line numbers, so a mistake is reported as `file:line`. Raw HTML and typographic replacement are off, so content cannot inject markup and the renderer cannot manufacture a dash |
| `yaml` | Parses frontmatter and the small data files, and keeps source positions for error messages |
| `zod` | Strict schemas. A misspelt field fails the build instead of being silently ignored, which is what makes it safe for an agent to add an entry |
| `lightningcss` | Compiles each mood stylesheet: inlines its imports, flattens nesting, prefixes every selector with the mood's scope, minifies |
| `sharp` | Makes AVIF and WebP at several widths from each artifact, never upscaled, so artifacts are sharp and large enough to read without shipping multi-megabyte images |
| `@fontsource-variable/newsreader` | The serif of Tucker's manual, self-hosted, with its optical-size axis |
| `@fontsource/ibm-plex-sans` | Running text in every launch mood, self-hosted |
| `@fontsource/ibm-plex-mono` | Labels, metadata and readouts, self-hosted |
| `@fontsource/chakra-petch` | Cyber's display face, self-hosted. Chosen over Oxanium and Rajdhani: its squared forms read as an interface, it keeps open counters in uppercase at small sizes, and it has the widest weight range of the three |

Fonts come from npm because the site makes no third-party requests, and the
build copies only the files listed in `src/build/fonts.mjs`.

## Checks only

| Package | Why it is here |
|---|---|
| `@playwright/test` | Screenshots of every key page in every mood, layout assertions, the mood-switching contract and the content-parity check. Pinned to an exact version so it matches an installed browser |
| `@axe-core/playwright` | WCAG 2.2 AA assertions in each mood |

## What is deliberately absent

No client framework, no CSS framework, no bundler, no CMS, no database, no
analytics. The site ships two small hand-written scripts
(`src/client/mood.js`, `src/client/filter.js`) and works without either.
