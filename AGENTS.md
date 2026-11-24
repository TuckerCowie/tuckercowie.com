# Working in this repo

The site is static. Content is Markdown and YAML under `content/`. A build
that passes means the content is valid; a mistake fails the build with a
message of the form `path:line: what is wrong and how to fix it`.

Read `docs/product/intent.md` first. Three rules from it apply to every change:

1. **This repo is public.** Never commit anything about health, money or
   family, private apps or home systems, notes or an ideas backlog,
   employer-confidential work, client names without permission, review
   feedback, fees, or full assessment reports. That includes docs, fixtures
   and commit messages.
2. **Only real content.** No invented facts, metrics or placeholder text. If
   a fact is missing, leave it out and add a line to
   `docs/product/build/needs-tucker.md`.
3. **Tucker approves copy.** New entries stay `visibility: draft`. Copy is
   first person, short and declarative, with plain noun-phrase headings and
   no em dashes.

## Add an entry

One file: `content/work/<slug>.md`, or `content/work/<slug>/index.md` when it
has images, which sit beside it.

```md
---
title: B2B SaaS Smart Pool CRM      # required
type: case-study                    # case-study, workshop, talk, certification, award, product
year: 2020                          # required, used for sorting
date_label: Mid 2020                # optional, shown instead of the year
organisation: Keto A.I.
role: Head of Product & Design
skills: [Service Design, UX Architecture]
status: shipped                     # products only: shipped, running, growing, built, parked, killed, retired
verdict: One honest line.           # products only
summary: One line under the title in the index.
visibility: draft                   # draft (default) or public
goals: [...]                        # case studies: goals, my_role, methodology, outcome
confidentiality: Why visuals are limited.   # optional, shows the marker
---

Intro paragraphs: the Details text. No images here.

## A plate heading

Two or three sentences in the first person.

![What the image shows, for someone who cannot see it](./artifact.jpg "A short caption")

> “A pulled quote.”

> [!INSIGHT]
> The conclusion drawn from it.

## Solution

## In action
```

- Each `##` is one plate. A process plate takes at most one image. The
  reserved headings `Solution` and `In action` may hold several.
- A plate with no image is the written variant. It needs no special markup.
- Alt text and a caption are required on every image.
- Use the same spelling for an organisation or a skill as existing entries.
  A near-duplicate fails the build and names the existing spelling.
- An entry with a body gets its own page. One with only frontmatter (a
  certification, say) appears in the index without a page.

Then run `npm run preview` and `npm run check`.

## Add a collection

A collection is a saved filter with its own URL and a short introduction:
`content/collections/<slug>.md`.

```md
---
title: Keto A.I.
filter: { organisation: Keto A.I. }     # any of type, organisation, skill
visibility: draft
---
One or two sentences of introduction.
```

## Add a mood

One stylesheet and one registry line. No content file changes.

1. Write `src/moods/<id>.css` as if it were the only stylesheet on the site.
   Start with a token block on `:root`; after it, every colour, font, size
   and space is a `var()`. The build scopes the file to
   `:root[data-mood="<id>"]`.
2. Add one line to `src/moods/registry.mjs`.
3. Style every component in `docs/markup-contract.md`. A mood may change
   layout as far as it likes. It may not hide content, reorder it with
   `order`, or put words in generated `content`.
4. `npm run preview && npm run check`. The checks run every key page in the
   new mood, compare its visible text with the other moods, and test
   contrast, 320px, reduced motion and scripting off.

## Layout of the repo

| Path | What it is |
|---|---|
| `content/` | Everything a visitor reads |
| `src/moods/` | One stylesheet per mood, and the registry |
| `src/templates/` | The shared markup, the same in every mood |
| `src/build/` | The build: content validation, mood compile, images |
| `src/client/` | The two scripts the site ships |
| `checks/` | Static lints and browser checks |
| `docs/product/` | The brief, the design references and the build record |
