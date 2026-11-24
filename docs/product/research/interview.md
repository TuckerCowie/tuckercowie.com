# Interview log: portfolio site

_The interview beat, run in rounds because Tucker asked to be grilled: every
open decision in one round, each question with a recommended answer. Tucker's
words are quoted exactly. Interpretation is marked as such._

## Round 1 (asked and answered 2026-11-24)

Tucker's reply, verbatim:

> Yes to all. 2: Head of product and operations, 4: While I did a lot at Unfi and autodesk, I unfortunately don't have a lot to show. You could grill me and we could capture many projects in writing, but very few visuals. 9: yes use tuckercowie.com

"Yes to all" accepts the recommended answer on every question below, with the
three amendments he gave.

**Q1. The site's job.**
Recommended and accepted: the page you send before a first conversation, for
people deciding whether to work with you and people who already do. One
action: email you.
Past-behaviour probe: "What did you send the last time someone asked for your
work?" Guess offered: the Miro link and the PDF. Not answered separately.

**Q2. Identity line.**
Recommended and accepted: "Product and design leader", then the current role,
then Cowie Creative for independent work.
Tucker: "Head of product and operations" (current title at NarrowStack).
Start date not given.

**Q3. Shape.**
Recommended and accepted: one ledger and three doors (Work, Profile,
Systems). Three filter axes: type, organisation, skill. Collections are saved
filters with their own URL.
The proposal this question referred to, as put to Tucker: every item (case
study, product, talk, workshop, recognition) is one Markdown file with
validated frontmatter. Collections such as one employer or "workshops" are
saved filters.
_Interpretation: the brainstorm leaned toward a stand-alone section for
expertise and recognition. The accepted shape folds talks, certifications and
awards into the one ledger as entry types._

**Q4. Launch set.**
Recommended: the five existing studies plus three new ones.
Tucker: "While I did a lot at Unfi and autodesk, I unfortunately don't have a
lot to show. You could grill me and we could capture many projects in
writing, but very few visuals."
_Interpretation: post-2021 work enters as written case studies, captured by
interview. The template needs a variant that stands without images._

**Q5. Works.**
Recommended and accepted: stage and verdict instead of revenue, with parked
and killed work included, and Now / Next / Later kept in a file in this repo.
Private apps and home systems stay unnamed.

**Q6. Profile.**
Recommended and accepted: the manual first, one line per assessment in
Tucker's words, full reports private. Mission and being statement appear
verbatim.

**Q7. Systems.**
Recommended and accepted: method level only. Studios, the pipeline, tiers,
principles with their origin stories, and links to the published skills.

**Q8. Voice.**
Recommended and accepted: first person in the manual's short declarative
style, plain noun-phrase headings, and Tucker approves all copy.

**Q9. Home and stack.**
Recommended and accepted:
- This repo, on `claude/portfolio-website-build-uh58w3`, old tree replaced in
  one commit, legacy left on `develop`.
- The repo is public, so only the brainstorm is committed. The profile dump
  stays out.
- A static site with self-hosted fonts and no CMS, database or trackers,
  on a public static host, not on personal machines.
- A light gate instead of the full go, park or kill gate, and the build run
  in a fresh session.
Tucker: "yes use tuckercowie.com"

**Q10. Three approvals.** All accepted.
- A reference sweep of up to ten personal sites.
- Rendering the three directions for review.
- Sources for assessment results, talks and awards, by upload or a scoped
  search.

## Facts looked up, so never asked

| Fact | Source |
|---|---|
| VP of Product was at UNIFI Labs, May 2021 to Apr 2023 | Portfolio board, resume frame |
| Autodesk: Manager, Product Mgmt, Mar 2023 to Apr 2024; Manager, Experience Design, Dec 2023 to Apr 2026 | Portfolio board, resume frame |
| Keto A.I.: Head of Product and Design, Apr 2020 to May 2021 | Portfolio board, resume frame |
| Arundo Analytics: Design Manager, Dec 2019 to Mar 2020; four earlier roles, Jul 2016 to Feb 2019 | Portfolio board, resume frame |
| MediaFire, Jan to Jul 2016; Abstract Media, Jan 2014 to Dec 2015; BS Graphic and Web Design, John Brown University | Portfolio board, resume frame |
| Certifications: Product Management (Product Institute, May 2020); UX Management (Interaction Design Foundation, Nov 2019) | Portfolio board, resume frame |
| The personal user manual exists as "How I Work Best", 13 slides, already public on the board | Portfolio board, embedded deck |
| No assessment results are in any repo, and DISC appears nowhere | Repo discovery pass |
| No performance numbers are recorded for any product | Repo discovery pass |
| 88 agent skills; 4 published | Repo discovery pass, verified |
| There is no house default web stack; a dependency needs a stated reason | House conventions |

## Validator instruments

**Core assumption, one sentence.** People deciding whether to work with
Tucker will understand what he does and trust him faster from one calm,
well-kept site than from a Miro link, a PDF and LinkedIn.

**Competition is current behaviour.** Most likely the Miro board plus the
resume PDF (a guess; Tucker did not answer the probe). The 2021 site was a
single button to that board.

**Fatal flaws, ranked.**

| Risk | Severity | Why it matters | Fast test |
|---|---|---|---|
| Writing, not the website, is the bottleneck. Nothing is written up after 2021, and Q4 confirms few visuals exist | High | A new site with the same five studies is a reskin | Capture one post-2021 project by interview in the written format before launch |
| Scope against "minimal": five sections and multi-axis filters | Medium | Upkeep cost is what stalled the last two sites | Three doors and at most three filter axes |
| The publishing boundary: a public repo, a private profile, employer and client work | High | A leak cannot be taken back | Every entry carries a visibility field that defaults to draft |

**First readers.** Three manual actions: send the preview to two people who
hired or worked with Tucker and to one who has never met him; ask each to say
back what he does after two minutes; note where they stopped reading.

**Pressure-test verdict: Strong, with one named weakness.** As a home for the
manual, the systems map and an honest works ledger, this is ready to build
and nothing public does that job today. As a showcase of the last five years
it is weak until the written captures exist, because the newest finished
case study is from 2021.

**Direction check.** One choice came out of the findings: make the written
case study a first-class format and capture post-2021 projects by interview,
in parallel with the build, without gating the build on them.
Tucker's decision (2026-11-24): proceed, with projects captured in writing.

## Round 1 follow-up: direction review and a feature request (2026-11-24)

Three direction studies were shown: Still Water (mild), Workbench (medium)
and Deep Water (hot). Tucker's reply, verbatim:

> I'd like to add a feature request. These initial studies are great, but you need to drop the workbench aesthetic as is. Craft 3 more studies in its place including futuristic virtual cyber punk ui, an extremely rigorous and precise minimalist geo Swiss design aesthetic, and a third style of your own choice and making. Still water and deep water should act like light and dark modes of the site but a minimal mood switcher should allow users to switch the aesthetic in one click. Architect the site in a way where the styles and layout can fundamentally change but the content stays the same. I want url parameters to control it too in case I want to share a certain look with others by default. Still water can be the default starting point, but it sold seamlessly shift if Swiss or cyber are selected etc. also all three of your written case study project capture suggestions are good; pin those for later. Let's move on with the design and build first, then we'll add additional content, coming back to those

Decisions this records:

- Workbench is dropped as rendered.
- The site has several moods. Still Water and Deep Water are its light and
  dark modes. Swiss and Cyber are added, plus a third of the designer's
  choosing.
- A minimal mood switcher changes the look in one click.
- A URL parameter selects the mood, so a link can share a look.
- Still Water is the default.
- Styles and layout may change fundamentally between moods. Content does not.
- Design and build come first. Content capture follows.

_Interpretation: the third mood proposed is Vellum, the site as a drawing set
on drafting film. One caution was given once: five moods means every
component is designed and checked five times, so the build keeps a small
fixed set of components, one stylesheet per mood and a screenshot check per
mood._

## Moods as sides of Tucker (2026-11-24)

Tucker, verbatim:

> Let's stretch this even further: each mood should symbolically represent an aspect of me or my personality. For example, the cyber punk is a representation of my inner gander while Swiss represents my design side. What other themes and moods might you infer or propose based on my experience, strengths, and attributes? Grill me if needed. Yes, the craftsmanship required to ensure that both the content stands alone yet is perfectly conveyed under each mood is the aim of the site: I am a shape shifter who can empathize and see multiple perspectives. I am also a designer with strong pattern recognition and systems thinking. I will not compromise on any of it and want to flex it all.

_Interpretation: "inner gander" is read as "inner gamer"._

A frame, a shared motif and a roster of ten moods were proposed, with six
questions. Tucker's reply, verbatim:

> Include those as suggestions not requirements and as an invitation to brainstorm more- but not block forward progress. Start with light dark and cyber for now. We'll follow up later to implement the rest. Land the goal and prompt now

Decisions this records:

- Each mood stands for a side of Tucker. Cyber is the gamer. Swiss is the
  designer.
- The aim of the site is craft: content that stands alone and is fully
  conveyed under every mood.
- The site launches with three moods: light (Still Water), dark (Deep Water)
  and Cyber. The rest follow later.
- The proposed frame, motif and roster are suggestions and an invitation to
  brainstorm, not requirements. They are in `../design/mood-ideas.md`.
- The six questions stay open and do not block the build.

## Pinterest as a source (2026-11-24)

Tucker, verbatim:

> Finally, use my Pinterest boards for additional sources of visual inspiration

A link to his public profile came with it. Then, verbatim:

> Of course once it lands update the prompt, bars, and outputs so I clear and get going. Grill me about it if you need.

Three choices were put to him with recommendations and a note that silence
would mean yes. He did not answer, so the recommendations stand as
assumptions:

- The reference study stays the blind, like-for-like comparison. His pins
  are the craft ceiling the critic measures against.
- The design boards, Aquascaping and Miniatures are named in this repo. A
  few personal boards inform the taste rules and are not named.
- The studies are not re-rendered. The build absorbs the new input.

The read is in `../design/references/README.md`. Five questions it raised
for Tucker are listed at the end of that file.

## The privacy line, as Tucker gave it

From the withheld part of his opening message and from Round 1. Never on the
site or in this repo: full assessment reports; anything about health, money
or family; private apps and home systems; the contents of his notes or ideas
backlog; employer-confidential work; client names without permission; review
feedback; fees.

## Round 2 (pinned until after the build)

Project capture. One project at a time, five questions each: the situation,
what you did, what changed, what you would do differently, and what can be
shown or named.

Tucker accepted all three suggested projects and pinned them for later:

1. UNIFI Labs: customer insights and continuous discovery.
2. Autodesk: AEC journey mapping and workshops.
3. NarrowStack: the AI Agent and Data Advisory Playbook.

Also open from the blindspot list: what success honestly looks like in twelve
months, the address to publish for the email link, and which portrait to use.
