# What only Tucker can answer

Everything on the site is a draft until you approve it. This is the list of
decisions and facts the build could not settle. Each item says what the build
did in the meantime. Nothing here blocks the preview; all of it blocks launch.

This file is public, so it describes private items without stating them.
The private specifics are in the build session's final message and on the
private preview's cover page.

## Blocks a production build

A production build refuses to run until these are resolved.

| # | Question | What the build did |
|---|---|---|
| 1 | The email address for the one action on the site | `email: null` in `content/site.yaml`. The link shows a Draft tag in preview |
| 2 | The identity line. It reads "Product and design leader. Head of Product and Operations, NarrowStack. Independent work as Cowie Creative." | Shown with a Draft tag. Remove `identity` from `drafts` in `content/site.yaml` to approve |
| 3 | Your NarrowStack start date | The career row reads "Now" with a Draft tag |
| 4 | The mission line. It is quoted in the brief as "to explore deeply and share faithfully" but its source is not in this repo | Shown on Profile with a Draft tag |
| 5 | Now, next, later. I filled it from the brief: this site now; three written studies and the skill links next; more moods later | Shown with a Draft tag |
| 6 | Approval of every entry. Each one is `visibility: draft` | Only preview builds show them. Change to `public` entry by entry |

## Facts I could not find

| # | Question | What the build did |
|---|---|---|
| 7 | One line per assessment, in your words. The brief names MBTI, Enneagram, StrengthsQuest, Adobe Creative Types and DISC. No DISC result was found | Four are listed with "One line to come". DISC is left out. Production leaves out any without a line |
| 8 | The names and addresses of the four published skills | Systems says four are published and links to none |
| 9 | Works ledger: stage and verdict for each row. I wrote six rows from facts in the brief and inferred two verdicts | Every row has a Draft tag. The reference studies showed more rows that are not in this repo; I left them out (see the private list) |
| 10 | The date of the Design Ops panel talk at Station Houston, and of the first place at the Iceland offsite | Both appear inside the Design Sprints study. Neither is its own entry, because an entry needs a year |
| 11 | "Best in show at an international IoT hackathon" is in the audit but on none of the 41 board frames | Left out everywhere |
| 12 | Store and site links. The board shows App Store and Google Play badges, a Company Video button and four printed addresses. None could be checked from the build environment | No outbound links on any entry |
| 13 | A location line and one talk appear in the reference studies but not in this repo | Left out (see the private list) |

## Dates that disagree

| # | Question | What the build did |
|---|---|---|
| 14 | App G2M & Repositioning: the board plate says "Current"; the audit says 2021; the content says spring 2021 | Dated 2021 |
| 15 | B2B 48hr Visiontype: the plate says 2019; its screens show 2018 dates; the resume frame leaves February to December 2019 open | Dated 2019, as on the plate |
| 16 | B2C IoT Smart Pool App: the plate says Early 2020; its wireframes show dates into January 2021 | Dated Early 2020, as on the plate |

## Privacy calls I made for you

Confirm or reverse each. The originals are untouched in `docs/product/source/`.

| # | Question | What the build did |
|---|---|---|
| 17 | Other people's names in artifacts: interview partners, names on app screens, a technician | Blurred in every image the site uses. The images are otherwise as they are |
| 18 | Document and note addresses visible in browser screenshots | Blurred |
| 19 | International Design Sprints: five photos show colleagues' faces | The study is written only, with its confidentiality line. The photos are not on the site |
| 20 | B2B 48hr Visiontype: three screens show an operator's pipeline, station names and savings figures. The plate carries a confidentiality line, and the board blurs the first of them | The study is written only. The screens are not on the site |
| 21 | App G2M & Repositioning, In action: four field photos show a technician | Two photos where his face cannot be made out are used. The other two and the video still are not |
| 22 | The Visionboard includes stock and third-party imagery, one with a stock watermark | Used as it is on the board. Confirm the licence |
| 23 | The portrait is the one from the board's closing frame | Used on Profile only |
| 24 | "Wordmark designed by Primer Grey" is credited on the board | The credit is kept in the Logo design plate |

## Copy I changed

| # | Question | What the build did |
|---|---|---|
| 25 | Em dashes in the manual | Replaced with commas or full stops, as the existing transcription did. The words are otherwise yours |
| 26 | Typos on the board: "where absorbed", "undo friction", "costs too much", "had already began", "getting the way of", "costs implications", "session in (afternoon)" | Corrected on the site. The transcriptions keep the originals, marked "as written" |
| 27 | Headings are sentence case ("Work environment") where the board uses title case | Changed to match the site's plain headings |
| 28 | Captions and alt text for every artifact are mine: the board has none | Short noun phrases that say what the image shows |
| 29 | Collection introductions, the Works ledger summaries and the Systems page are my wording from `research/systems-map.md` and the audit | Draft |

## Design questions from the brief, still open

These are the five questions at the end of `design/references/README.md`
and the six in `design/mood-ideas.md`. The build took the brief's defaults:
teal accent and cool paper for Still Water, the manual's serif, amber as
Cyber's second signal, the circle as the motif every mood shares, and the
portrait on Profile instead of Home.

## Launch

| # | Question | What the build did |
|---|---|---|
| 30 | Domain registrar and host | None configured. `npm run build` writes a static `dist/` that any static host serves |
| 31 | First readers: the brief asks for three people to say back what you do after two minutes | Not done. It needs people |
