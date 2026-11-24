# Design: one body of content, several moods

The site has one set of content and several ways of presenting it. A visitor
switches between them in one click, or arrives in one by link.

The aim, in Tucker's words: "the craftsmanship required to ensure that both
the content stands alone yet is perfectly conveyed under each mood is the aim
of the site." Each mood stands for a side of him.

This folder holds a reference study for each mood. A study is a full page
rendered from the same real content. It is a reference for look, tokens and
layout intent. It is not code to copy.

## Launch moods

| Id | Name | Role | Stands for | The idea | Variance, Motion, Density |
|---|---|---|---|---|---|
| `still` | Still Water | Light mode, the default | The steady presence | Tucker's manual extended to a whole site: a quiet reading surface | 3, 2, 3 |
| `deep` | Deep Water | Dark mode | The depth underneath | The same water from below: dark ground, monumental serif, one luminous accent | 7, 6, 3 |
| `cyber` | Cyber | Alternate | The gamer | A futuristic, virtual, cyberpunk interface with calm, legible reading | 8, 7, 7 |

"The gamer" is Tucker's own reading of Cyber. The two readings of the water
moods are a suggestion.

Each mood has a folder under [`moods/`](moods/):

- `spec.md`: the idea, mood words, tokens, type, layout rules, dials, what to
  emulate and avoid, and the known risk.
- `tokens.css`: the token block from the reference study. Starting values.
- `home.jpg`, `case-study.jpg`, `specimen.jpg`: the study at 1440 wide, scaled
  to 1200. The specimen prints every token and type style.

## Later moods

Not part of the first build. The build must make each one cheap to add.

- [`later/swiss/`](later/swiss/): a full reference pack. Stands for the
  designer.
- [`later/vellum/`](later/vellum/): a full reference pack. Stands for the
  systems thinker.
- [`mood-ideas.md`](mood-ideas.md): more suggested moods, a unifying frame
  and the questions still open. Suggestions and an invitation to brainstorm,
  not requirements.

A direction called Workbench was rendered and dropped. It is not here.

## The bar

Each launch mood is judged against two things. Both are listed at the end
of the mood's `spec.md`.

- **The floor is its reference study.** It is the same content, so the
  comparison is like for like: the built page beside the study, labels
  stripped, a fresh critic says which is better.
- **The ceiling is Tucker's own saved inspiration.** A short set of pins per
  mood, linked in [`references/references.yaml`](references/references.yaml)
  and read in [`references/README.md`](references/README.md). A pin is
  someone else's poster or dashboard, so it is not a like-for-like test. The
  critic uses the pins to name where the built page falls short in craft.

The pins need network access to Pinterest. Where they cannot be fetched,
the `teaches` line for each pin stands in.

## The mood contract

These are requirements. How they are met is the builder's call.

1. **Content is written once.** A mood changes style and layout, as
   fundamentally as it needs to. It never adds, removes or rewrites content.
   Adding or removing a mood touches no content file.
2. **A small, fixed set of components.** Every mood styles the same set:
   home, index and filters, summary plate, details, process plate, insight,
   works ledger, profile blocks, pipeline, navigation, switcher. A new
   component is designed in every mood before it ships.
3. **One stylesheet per mood**, and one registry that lists the moods. The
   registry feeds the switcher, the URL handling and the checks. Adding a
   mood is one stylesheet and one registry line.
4. **The switcher is minimal.** One small control on every page, one click to
   change mood, usable by keyboard, announced to assistive technology.
5. **A URL parameter selects the mood.** Proposed form `?mood=cyber`. Order of
   precedence: the URL parameter, then the visitor's saved choice, then
   system light or dark (Still Water or Deep Water), then Still Water. A mood
   chosen by URL carries across internal links.
6. **Seamless.** No page reload to switch. No flash of the wrong mood on first
   paint. With scripting off, the site is Still Water, or Deep Water where
   the system asks for dark.
7. **Still Water and Deep Water are a pair.** Switching between them should
   read as the light and dark of one design, so they share structure and
   scale more closely than their separate studies do.
8. **Every mood stands on its own for access.** WCAG 2.2 AA, no horizontal
   scroll at 320px, reduced motion honoured, in each mood.
9. **A check per mood.** The build takes a screenshot of the key pages in
   every mood and fails on a broken layout.

## Rules that hold in every mood

- Only real content. No invented facts, metrics or placeholder text.
- No em dashes in copy. Headings are plain noun phrases.
- Every colour, font, size step and space step is a token.
- Fonts are self-hosted. The site makes no third-party requests.
- Images are shown as they are: not recoloured, tilted or put in device
  frames.

Named exceptions live in the mood's own spec. Cyber may use two signal
colours and a restrained glow.

## Critic's notes on the studies

- **Still Water.** Raise running text to 17 or 18px. The summary plate is too
  quiet to give a case study an identity. Half the page sits empty beside
  the reading column.
- **Deep Water.** The strongest first screen. A long case study on a dark
  ground is tiring, so keep the pale mats and a generous leading.
- **Cyber.** The frame carries the spectacle and the reading stays calm,
  which is the right split. Keep readouts to real data only. Swap the second
  signal from magenta to amber, to match what Tucker saves.
- **All studies.** None renders a written case study with no images, which
  the brief requires. Lines tagged draft in a study are placeholders, not
  content.

## To confirm before launch

- One board artifact, the partner interview transcript, shows other people's
  names. Confirm it or blur it.
