# Intent: tuckercowie.com

> **This is the build anchor.** Every later stage reads this file as ground
> truth. A contradiction found later is resolved here, not papered over
> downstream. Every claim carries a source tag: `[braindump]`, `[interview]`,
> `[research]` (looked up on the board or in the repos; see
> `research/portfolio-audit.md` and `research/systems-map.md`) or
> `[assumption]`. An untagged claim is an assumption.

_Synthesized 2026-11-24 from `research/braindump.md` and
`research/interview.md`. Verdict at synthesis: Strong, with one named
weakness. Tucker chose to proceed, with post-2021 projects captured in
writing._

## Problem

Tucker has no current public home for his work. `[research]` The 2021 site
was one button that opened a Miro board, and the board holds five case
studies, the newest from 2021. `[research]` Everything since is missing: VP
of Product at UNIFI Labs, two management roles at Autodesk, the current role
as Head of Product and Operations at NarrowStack, and the agent system he has
built. `[research]` `[interview]` When someone asks to see his work, he sends
the board link and a PDF. `[assumption]`

Two earlier sites, from 2013 and 2021, were each left behind. `[research]` A
likely reason: the tools he already worked in were cheaper to update than a
website. `[assumption]`

## Vision

One calm, well-kept place that shows three things: the work and how it was
made, the person and how to work with him, and the system he builds with.
`[braindump]` `[interview]` It stays current because adding an entry is one
file, written by him or by an agent. `[assumption]`

## Target users and jobs

**1. Someone deciding whether to work with Tucker.** `[interview]` For
example a client, a partner, a hiring leader or an event organiser.
`[assumption]`
When I am about to have a first conversation with him, I want to see how he
thinks and what he has actually done, so I can judge fit in a few minutes.
Today: a Miro link, a PDF and LinkedIn. `[assumption]`

**2. Someone who already works with him.** `[interview]` For example a
report, a peer or a client in an engagement. `[assumption]`
When I start working with Tucker, I want to know how he works best, so we get
to good work sooner. Today: the manual is embedded on the board, beside the
resume frame. `[research]`

**3. Tucker, as the keeper of the site.** `[braindump]`
When I finish something, I want it on the site in minutes, so the site never
goes stale again. Today: he does not, and the site ages. `[assumption]`

## Core assumption (one sentence)

People deciding whether to work with Tucker will understand what he does and
trust him faster from one calm, well-kept site than from a Miro link, a PDF
and LinkedIn. `[assumption]`

## Requirements

### Must

- Three destinations: **Work**, **Profile**, **Systems**, and one action, an
  email link. `[interview]` The home screen fits one view. `[assumption]`
- The identity line reads "Product and design leader", then the current role
  (Head of Product and Operations, NarrowStack), then Cowie Creative for
  independent work. `[interview]`
- One content model. Every item is one Markdown file with validated
  frontmatter. `[interview]` Proposed fields: type, organisation, year, role,
  skills, status, visibility. `[assumption]`
- The Work index filters on three axes: type, organisation, skill. A
  collection, such as one employer or "workshops", is a saved filter with its
  own URL and a short introduction. `[braindump]` `[interview]`
- Talks, certifications and awards are entry types in the same index.
  `[interview]` The brainstorm leaned toward a stand-alone section; the
  accepted shape folds it in. `[braindump]`
- A case-study template in the grammar of Tucker's board: summary plate,
  details with goals, role, methodology and outcome, then process plates of
  one heading, two or three sentences and one real artifact, a highlighted
  insight, the solution, the work in action, and a confidentiality marker
  where needed. `[interview]` `[research]`
- A written case-study variant that holds up with no images at all.
  `[interview]`
- Launch content: the five board case studies, the "How I Work Best" manual,
  a Works ledger and the Systems map. `[interview]` The manual appears in
  full, with a compact career history. `[assumption]`
- Works shows stage and verdict, not revenue, and keeps parked and killed
  work in view. Now / Next / Later is kept in a file in this repo.
  `[interview]`
- Profile leads with the manual. Each assessment gets one line in Tucker's
  words. The mission and being statement appear verbatim. `[interview]`
- Systems stays at method level and links only to published skills.
  `[interview]`
- A visibility field on every entry that defaults to draft. Only entries
  marked public are built into the site. `[assumption]`
- Static output. Self-hosted fonts. No CMS, database or trackers.
  `[interview]` Zero requests to third parties. `[research]`
- WCAG 2.2 AA, no horizontal scroll at 320px, reduced motion honoured.
  `[research]`
- An agent can add an entry safely: a malformed entry fails the build with a
  clear message, and `AGENTS.md` explains how to add one. `[braindump]`
  `[assumption]`
- Copy is first person, in the manual's short declarative style, with plain
  noun-phrase headings. Tucker approves copy before it is published.
  `[interview]` No em dashes. `[research]`

### Must: moods

- The site launches with three moods: **Still Water** (light, the default),
  **Deep Water** (dark) and **Cyber**. `[interview]`
- More moods follow later. Swiss and Vellum have reference material ready,
  and further ideas are in `design/mood-ideas.md`. All of them are
  suggestions and an invitation to brainstorm, not requirements.
  `[interview]`
- Each mood stands for a side of Tucker. Cyber is the gamer. Swiss, when it
  comes, is the designer. `[interview]`
- The aim of the site is craft: the content stands alone, and it is fully
  conveyed under every mood. Tucker will not compromise on this.
  `[interview]`
- Still Water and Deep Water act as the light and dark modes of the site.
  `[interview]` With no parameter and no saved choice, a visitor sees Still
  Water, or Deep Water if their system asks for dark. `[assumption]`
- A minimal mood switcher changes the look in one click, on every page.
  `[interview]` It is small enough to ignore. `[assumption]`
- A URL parameter selects the mood, so a link can share a look.
  `[interview]` Proposed form: `?mood=swiss`. Order of precedence: URL
  parameter, then the visitor's saved choice, then system light or dark,
  then Still Water. `[assumption]`
- Content is written once. A mood may change style and layout fundamentally.
  It never changes content. `[interview]` Adding or removing a mood touches
  no content file. `[assumption]`
- The switch is seamless: no reload, no flash of the wrong mood on first
  paint. `[interview]`
- Every mood meets the accessibility bar on its own, and with scripting off
  the site is Still Water. `[assumption]`
- Each mood is one stylesheet over a small, fixed set of components, and the
  build checks a screenshot of the key pages in every mood. `[assumption]`

### Should

- A print resume generated from the same content. `[assumption]`
- A machine-readable index of public entries. `[assumption]`
- Historic assessment results, shown as change over time. `[braindump]`
- Downloads and links on entries. `[braindump]`

## Constraints

- **Home.** `TuckerCowie/tuckercowie.com`, branch
  `claude/portfolio-website-build-uh58w3`. The legacy site stays on
  `develop`. `[interview]`
- **This repo is public.** Nothing private is committed, including in docs,
  fixtures and commit messages. `[interview]`
- **The privacy line.** Never on the site or in this repo: full assessment
  reports; anything about health, money or family; private apps and home
  systems; the contents of his notes or ideas backlog; employer-confidential
  work; client names without permission; review feedback; fees.
  `[braindump]` `[interview]`
- **Dependencies.** There is no house default stack. Each dependency needs a
  stated reason, recorded where it is added. `[research]`
- **Hosting.** A public static host, not personal machines. `[interview]`
  Registrar and current host are not yet known, so launch on the real domain
  is a separate, human step. `[assumption]`
- **Attention.** Tucker's attention is the scarce resource. The build should
  ask him for decisions, not lookups. `[research]`
- **Visuals after 2021 are scarce.** `[interview]`

## Non-goals

- Not a revenue dashboard. Works shows stage and verdict. `[interview]`
- Not an audience-growth site. No newsletter or follower counts.
  `[assumption]`
- No blog engine in the first version. `[assumption]`
- No CMS. `[interview]` No accounts, comments or contact form.
  `[assumption]`
- No full assessment documents. `[interview]`
- No sales page for Cowie Creative. `[assumption]`
- No free pan-and-zoom canvas. The board's grammar is kept; its medium is
  not. `[assumption]`
- No automatic sync from his notes or from project ledgers in the first
  version. `[assumption]`
- The build is not gated on the post-2021 case studies. `[interview]`
- The Workbench direction, as rendered in the first studies, is dropped.
  `[interview]`

## Magic moment (smallest testable version)

Someone opens the link before a first call, reads one screen, opens one case
study, and can say in a sentence what Tucker does and how he works.
`[assumption]`

And its twin for the keeper: Tucker adds one Markdown file and the new entry
appears, correctly filed and filtered, with no layout work. `[assumption]`

## Success criteria

Twelve months, honest (not yet confirmed with Tucker): `[assumption]`

- It is the link in his email signature and speaker bios. `[assumption]`
- Every new talk, project or product is on the site within a week.
  `[assumption]`
- At least three post-2021 written case studies are live within 90 days of
  launch. `[assumption]`
- Now / Next / Later is never more than a quarter out of date. `[assumption]`

Nearer markers: three first readers can each say back what he does after two
minutes; adding an entry takes under ten minutes. `[assumption]`

## Risky assumptions (pre-registered)

| # | Assumption | Severity | Cheapest test | Would kill it if |
|---|---|---|---|---|
| 1 | Post-2021 work can be captured in writing by interview `[interview]` | High | Capture one project in the five-question format this week | Two attempts yield nothing publishable. Then the site leads with Profile and Systems |
| 2 | A written case study holds a reader with no images `[assumption]` | Medium | Two readers retell one written study after reading it | Neither can retell it |
| 3 | The site stays maintained `[assumption]` | High | Time one new entry, and have an agent add one from a sentence | Adding an entry needs layout or code work |
| 4 | The manual and the systems map help the first reader instead of distracting `[assumption]` | Medium | First-click test on the home screen with three people | Readers looking for work examples cannot find them in one click |
| 5 | Employers and clients allow what is shown `[assumption]` | High | Confirm per entry before its visibility changes to public | An entry cannot be cleared. It stays draft |
| 6 | One body of markup can carry fundamentally different layouts `[assumption]` | High | Build the home screen and one case study in all three launch moods before anything else | A mood needs its own markup. That mood becomes a styling-only variant or is cut |
| 7 | The mood switcher helps first readers and does not distract them `[assumption]` | Medium | Watch three first readers on the home screen | They play with moods and do not open the work. The switcher moves to the footer |

## Open questions

- NarrowStack start date, for the career history.
- The three post-2021 projects are chosen and pinned until after the build:
  UNIFI Labs, Autodesk, NarrowStack.
- The board dates one Arundo study to 2019, in a stretch the resume frame
  leaves open.
- Whether a DISC result exists. None was found.
- One line per assessment, in Tucker's words.
- The address to publish for the email link, and the portrait to use.
- Domain registrar and current host.
- Which moods come after the first three, and what each stands for. Ideas
  and six open questions are in `design/mood-ideas.md`. Tucker invited more.
- The quality bar is each mood's own reference study, in `design/`. Tucker
  has not chosen an outside reference site.

## Source links

- `research/braindump.md`: raw capture, 2026-11-24
- `research/interview.md`: interview log and verdict, 2026-11-24
- `research/portfolio-audit.md`: the board, the past sites, the grammar
- `research/systems-map.md`: source material for the Systems page
- `design/README.md`: the moods, their reference studies and the switching
  contract
- `design/mood-ideas.md`: suggested moods for later, and what each stands for
- `source/`: the board frames, the case-study artifacts and the manual
- The public portfolio board: https://miro.com/app/board/o9J_lLhlDmc=/
- The legacy 2021 site: branch `develop` of this repo

---

## Crosswalk to the foundry idea brief

| Idea-brief field | Lives here as |
|---|---|
| The itch | Problem |
| Who else | Target users and jobs |
| The wedge | Magic moment |
| Why now | Problem (no current home since 2021; a new role and a built system with nowhere to point) |
| Why us | Launch content and the research files: the grammar, the manual and the system already exist `[research]` |
| Prior art | `research/portfolio-audit.md`, including the site Tucker named for the Works ledger |
| What would kill it | Risky assumptions, last column |
| Success looks like | Success criteria |
