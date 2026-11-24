# Mood: Swiss
**Idea.** The International Typographic Style taken literally and executed
with extreme rigor. A strict modular grid, one neo-grotesque family, black on
white with one signal red, and elementary geometry as the only ornament. The
discipline is the design: every edge lands on the grid, every size is a step
on one scale, every gap is a multiple of one unit.

**Mood words.** Exact, objective, rational, spare, confident.

**Attribute binding** (every choice carries one; cut what carries none):
evidence, precision, a clear frame, craft.

## Tokens (starting values; verify contrast, keep the character)

```
--white:  oklch(0.99 0 0);
--black:  oklch(0.16 0 0);
--grey:   oklch(0.46 0 0);      /* secondary text; must pass 4.5:1 on white */
--tint:   oklch(0.95 0 0);      /* the only fill besides white, black and red */
--red:    oklch(0.56 0.22 27);  /* the one accent; verify 4.5:1 where it is text */
--unit:   8px;                  /* everything is a multiple of this */
```

Status marks in the Works ledger are black geometric glyphs (filled circle,
outlined circle, filled square, outlined square, triangle, cross) with the
text label. No extra hues.

## Type

- **One family for everything**: a neo-grotesque in the Akzidenz and
  Helvetica tradition. Choose one of Inter Tight, Archivo or Hanken Grotesk
  from `@fontsource`, whichever gives the tightest, most neutral result at
  display sizes, and say why. Weights: 400, 500 and 700 only.
- No serif and no monospace anywhere. Numerals are tabular. Labels are the
  same family, small, 500, with slight tracking; uppercase only for the
  smallest labels.
- A strict modular scale (state the ratio, for example 1.5) on an 8px
  baseline. Line heights are multiples of the unit. No in-between sizes.
- Display sizes are large and set tight, flush left, ragged right. Never
  centred, never justified.

## Layout

- A 12 column grid with fixed gutters. State the column and gutter widths in
  the Specimen band. Asymmetric composition: labels and numerals in the first
  columns, content from the fourth or fifth column, large areas of white kept
  empty on purpose.
- Section numbers 01 to 07 as large numerals. Rules are 1px or 2px black.
- **Geo.** Elementary shapes are the only graphics: circle, square, triangle,
  line. Use them with restraint and at scale, for example one large red
  circle on the Home band composed against the name like a Swiss poster, and
  small squares as list markers. No illustration, no icons.
- Work index: a rigorous table. Year in tabular figures, strict column
  alignment, a 2px rule above the header, hairlines between rows.
- Summary plate: the title at display size under a 2px rule, then role, date,
  organisation and skills in an exact four column row.
- Goals: three equal columns, each headed by a numeral, separated by vertical
  hairlines. No chips, no rounded corners.
- Case-study plates: the artifact spans an exact number of columns and its
  top edge aligns to the text block's first baseline. Caption in small
  grotesque on the grid. The highlighted insight is set large in black with a
  small red square before it.
- Radius 0 everywhere. No shadows, no gradients, no textures.

## Dials

Variance 4, Motion 1, Density 5. No animation at all beyond focus and hover
state changes.

## Emulate and avoid

- Emulate: Josef Muller-Brockmann's concert posters and grid systems, Massimo
  Vignelli's Unigrid, Emil Ruder's typography.
- Avoid: brutalism, giant type for its own sake, anything centred, more than
  one accent, a generic "Helvetica template" look.

**Known risk to manage.** It can read as cold or generic. The counter is
exactness a reader can feel: perfect alignment, optical corrections,
consistent rhythm, and one confident geometric gesture.
