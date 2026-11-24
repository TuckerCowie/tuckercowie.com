# Portfolio audit: what the past portfolios already say

_Read 2026-11-24. Sources: the public Miro board "Tucker Cowie Portfolio 2021"
(all 43 frames and the embedded manual), the 2013 one-page site (repo
`dotcom`), and the 2021 landing page (this repo, branch `develop`)._

## The board: the case-study grammar to keep

Tucker named the board as the example of how he wants to showcase past
projects. Its five case studies share one grammar.

1. **Summary plate.** A category-level title ("B2B SaaS Smart Pool CRM", not
   the client's name), then role, date, organisation and skill tags. Set as a
   heavy black frame around a grey plate.
2. **Background or Details.** Two short paragraphs, three goal chips, then
   three short lists: My Role, Methodology, Outcome.
3. **Process plates.** One per step. Each is a plain heading, two or three
   first-person sentences, and one real working artifact copied from where
   the work happened: sketch photos, the actual service blueprint, a
   transcript with the quote highlighted, a wireframe flow.
4. **The insight.** A customer quote, then the conclusion drawn from it,
   marked with a highlighter.
5. **Solution.** The shipped screens, with store or site links.
6. **In Action.** Photos or video of the thing in the world.
7. **Confidentiality marker.** Where visuals cannot be shown, a small lock
   and the line: "Due to confidentiality agreements or other extenuating
   circumstances, visual aids may be unavailable for this project.
   Representational data may be obfuscated."

The board is linear (presentation mode, frame by frame) with free pan and
zoom as an option. One idea per frame.

### The five case studies

| Title | Organisation | When | Role | Skill tags | Frames |
|---|---|---|---|---|---|
| B2C IoT Smart Pool App | Keto A.I. | Early 2020 | Contracting, then full time | Brand Strategy, User Research, Rapid Prototyping, Visual Design, Communications Design | 1 to 10 |
| B2B SaaS Smart Pool CRM | Keto A.I. | Mid 2020 | Head of Product and Design | Product/Design Operations, Market and User Research, Service Design, UX Architecture, Rapid Prototyping, Visual Design | 11 to 24 |
| App G2M and Repositioning (Keto to Clyr) | Keto A.I. | 2021 | Head of Product and Design | Product/Design Operations, Market and User Research, Service Design, UX Architecture, Rapid Prototyping, Visual Design | 25 to 32 |
| International Design Sprints | Arundo Analytics | January 2019 | Design Team Lead | Design Thinking, Management and Coaching, Facilitation, Public Speaking | 33 to 35 |
| B2B 48hr Visiontype | Arundo Analytics | 2019 | Senior Product Designer | Design Thinking, Rapid Prototyping, Visual Design | 36 to 41 |

Process steps that appear as plates: Collecting Inspiration, Visionboard,
User Insights, Facilitated Ideation, Wireframing, User Testing, Work
Environment, Process, Competitive Analysis, Partner Insights, Service
Blueprinting, Story Mapping, User Flow and Information Architecture,
Component Exploration, Renaming, Logo Design, Design System, Communications
Design, UI Refresh.

Recognition and talks mentioned inside the studies: a Design Ops panel talk
at Station Houston; first place in a team offsite competition in Iceland with
a design sprint solution; best in show at an international IoT hackathon.

### Resume frame (career dates)

| Role | Organisation | Dates |
|---|---|---|
| Manager, Experience Design | Autodesk | Dec 2023 to Apr 2026 |
| Manager, Product Mgmt | Autodesk | Mar 2023 to Apr 2024 |
| VP of Product | UNIFI Labs Inc. (acquired) | May 2021 to Apr 2023 |
| Head of Product and Design | Keto A.I. | Apr 2020 to May 2021 |
| Design Manager | Arundo Analytics | Dec 2019 to Mar 2020 |
| Four earlier positions | Arundo Analytics | Jul 2016 to Feb 2019 |
| Software Developer | MediaFire | Jan 2016 to Jul 2016 |
| Director of Design and Development | Abstract Media Co. | Jan 2014 to Dec 2015 |

Education: B.S. Graphic and Web Design, John Brown University.
Training: Product Management, Product Institute, May 2020. UX Management,
Interaction Design Foundation, Nov 2019.

Not on the resume frame: the current role, Head of Product and Operations at
NarrowStack (from the interview).

To confirm with Tucker: the board dates the 48hr Visiontype study to 2019,
and the resume frame leaves Feb to Dec 2019 open.

### The manual: "How I Work Best"

Thirteen slides, already public on the board. Slide titles, in order: How I
Work Best; The one-line version; What I bring that is rare; My five signature
strengths; How I am wired to think; My three motivational threads; How I
communicate; How I make decisions; Where I do my best work; How to get my
best work; What I care about in the work; What you can count on; In one line.

Epigraph: "Still water that runs deep. Unhurried, yet flowing freely."

Its own design tokens, which are Tucker's most recent self-made visual
language:

```
--paper:     oklch(0.972 0.006 210)
--paper-2:   oklch(0.945 0.009 210)
--ink:       oklch(0.28 0.028 245)
--ink-soft:  oklch(0.44 0.026 240)
--ink-faint: oklch(0.62 0.02 235)
--teal:      oklch(0.56 0.072 205)
--line:      oklch(0.82 0.014 220)
```

Type: Newsreader for titles, IBM Plex Sans for text, IBM Plex Mono for small
uppercase labels. One motif: thin concentric circles, like a ripple.

## The arc across four portfolios

| When | What | Look |
|---|---|---|
| 2013 | One-page "hire me" site, pitched as "The Ultimate Multipurpose Tool" | Black ground, white type, one steel blue (`#5b7998`), Proxima Nova, parallax slides |
| 2021 | A single dark column whose only action was "Launch Portfolio", a link to the board | Charcoal (`#222`), one yellow (`#ffd02f`), Mr Eaves Sans |
| 2021 | The board | Light grey canvas, heavy black-framed title plates, bold sans headings, teal highlighter |
| 2026 | The manual | Cool pale paper, deep slate ink, one teal, a serif for titles, mono labels |

Reading (an inference, not a stated preference): every version is one accent
on a quiet ground, flush left, with plain noun-phrase headings, and each
rebuild is quieter than the last. Each website also lost to a tool Tucker
already worked in. The lesson for this build is upkeep cost: adding an entry
has to be as cheap as adding a frame to a board.

## Design rules found in Tucker's own canon

- One blunt display voice plus one mono detail voice, flush left.
- Every hue pinned as a token and labelled. No hand-copied colour values.
- Titles are plain noun phrases of about five words. No clever pairings.
- Flat. No shadows. No "glow and glass AI dashboard" look.
- Fonts vendored locally. Zero external requests.
- Diagrams only when they earn their place.
- No em dashes in copy. His style guide calls them the tell of
  machine-written text.
- Accessibility bar: WCAG 2.2 AA, no horizontal scroll at 320px wide, reduced
  motion honoured.
- Three design dials on a 1 to 10 scale: variance, motion, density.

## The reference Tucker named

marclou.com (fetched 2026-11-24) is a one-line hook, follower counts, a
twelve-month revenue chart, then a long list of products, each a name, a
tagline and a monthly revenue figure. Older entries read "Sold for $35K" or
"Shut down", with a candid line about why.

What transfers: an honest ledger that keeps sold, parked and dead work in
view. What does not: revenue-led framing, because there are no performance
numbers to show, and the density.
