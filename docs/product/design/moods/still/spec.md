# Mood: Still Water

**Idea.** Tucker's own 2026 "How I Work Best" manual, extended to a whole
site. A quiet reading surface where the work artifacts supply the visual
energy. Reads like a well-set document by someone with nothing to prove.

**Mood words.** Calm, deep, exact, unhurried, generous.

**Attribute binding** (every choice carries one of these; cut anything that
carries none): steadiness, depth, craft, evidence.

## Tokens (start here; these are the values from his manual's own CSS)

```
--paper:     oklch(0.972 0.006 210);   /* page ground, cool pale */
--paper-2:   oklch(0.945 0.009 210);   /* panels behind artifacts */
--ink:       oklch(0.28 0.028 245);    /* text, deep slate */
--ink-soft:  oklch(0.44 0.026 240);    /* secondary text */
--ink-faint: oklch(0.62 0.02 235);     /* decorative only, not body text */
--teal:      oklch(0.56 0.072 205);    /* the one accent */
--line:      oklch(0.82 0.014 220);    /* hairlines */
```

Check contrast yourself. If teal or a soft ink fails 4.5:1 for text at its
size, add a darker text variant token (for example `--teal-text`) and keep
the original for rules and marks. Status colours for the Works ledger are
small, muted and always paired with a label.

## Type

- Display and headings: **Newsreader**, weight 400 (300 for the largest
  size), tight leading, sentence case. Reason: it is the face he chose for
  his manual; bookish and calm.
- Running text and interface: **IBM Plex Sans** 400, 17 to 18px, leading
  about 1.6.
- Eyebrows, metadata, dates, plate numbers: **IBM Plex Mono**, uppercase,
  wide letterspacing, small. Reason: one mono detail voice.
- The epigraph is Newsreader italic.

## Layout

- One reading column, 60 to 70 characters, flush left on a wider page with a
  generous left margin. Index tables may run wider, to about 1080px.
- Hairline rules, lots of air. Vertical rhythm on a consistent baseline step.
- Work index is a typographic list: year in mono, title in the serif,
  organisation and type in small sans. No cards.
- Case-study plates: the artifact sits on a `--paper-2` panel with a hairline
  border and a mono caption. The highlighted insight is teal text with a thin
  teal rule on the left, not a filled highlight.
- Summary plate: a hairline-bordered block with the title in the serif. Quiet.
- One motif, used once on the Home band: a few thin concentric circles, like
  a ripple, in `--line`, drawn with inline SVG. Static.
- Radius 2px or none. No fills heavier than `--paper-2`.

## Dials

Variance 3, Motion 2, Density 3. Motion is limited to focus and hover state
changes.

## Emulate and avoid

- Emulate: a beautifully typeset monograph or essay. His manual deck.
- Avoid: anything card-heavy, anything that looks like a SaaS landing page,
  hero imagery, big buttons.

**Known risk to manage.** This can read as merely a document and undersell
his visual range. Counter it with typographic precision and by giving the
artifacts real size, never with decoration.

## From Tucker's boards

Read from his own saved inspiration. See `../../references/README.md`.

- **Borrow:** one oversized numeral or ring as a page's hero; huge numerals
  beside tiny uppercase labels; specimen grids for collections; dense
  tables made calm with low contrast and thin rules.
- **Hold against his saves:** the cool paper, the teal accent and the serif
  come from his manual. His saves lean to warm cream, orange or yellow, and
  no serif display. The manual wins unless he says otherwise.

## The bar

- **Floor:** this folder's study (`home.jpg`, `case-study.jpg`,
  `specimen.jpg`). Compare the built page with it blind, like for like.
- **Ceiling:** these pins in `../../references/references.yaml`:
  `K01-02`, `K01-17`, `K02-10`, `K04-04`, `K10-11`, `D20-11`, `D02-10`, `D17-07`, `D17-06`, `D07-07`, `D13-13`, `D21-01`, `A04-08`. The critic names where the built page falls short of them.
