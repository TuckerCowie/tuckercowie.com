# Mood: Vellum

**Idea.** The drafting table. The site is a drawing set on tracing vellum:
each band is a sheet with a border, grid references in the margins, a title
block, numbered details with leader lines, and redline markups for what
matters. Tucker spent years in architecture, engineering and construction
software, facilitates with service blueprints and journey maps, and says he
sees systems as structures. This direction lets the drawing conventions
organise the content.

**Mood words.** Drafted, technical, warm, exact, constructed.

**Attribute binding** (every choice carries one; cut what carries none):
systems as structures, evidence, craft, a clear frame.

## Tokens (starting values; verify contrast, keep the character)

```
--vellum:       oklch(0.955 0.012 85);  /* warm drafting film, the page */
--vellum-2:     oklch(0.925 0.014 85);  /* title blocks, mats */
--graphite:     oklch(0.27 0.01 260);   /* text and ink lines */
--graphite-soft:oklch(0.45 0.01 260);   /* secondary text */
--blue-pencil:  oklch(0.66 0.08 240);   /* construction lines, grid, sheet borders: lines only */
--blue-ink:     oklch(0.42 0.11 250);   /* the same blue, dark enough for text and links */
--redline:      oklch(0.53 0.2 27);     /* markups only: the insight, a revision cloud, one status */
```

**Named exception.** Blue is the structural line colour and red is the single
markup accent. Red appears only where a reviewer would have marked the sheet.

## Type

- Title blocks, sheet titles, labels: **IBM Plex Sans Condensed**
  (`@fontsource/ibm-plex-sans-condensed`), uppercase, tracked, 500 or 600.
  Reason: the feel of technical lettering without a fake hand font.
- Reading text: IBM Plex Sans 400, 16 to 17px.
- Dimensions, grid references, detail numbers, dates: IBM Plex Mono.
- Newsreader italic only for the epigraph.

## Layout

- **Each band is a sheet.** A thin double-line border in `--blue-pencil`,
  grid references in the margin (letters down the side, numbers along the
  top) in tiny mono, and a **title block** in the bottom right corner with
  real fields only: sheet number (for example A-03 of 07), sheet title,
  project (Tucker Cowie, portfolio), date (2026). Do not invent a scale,
  a revision code or a checker's initials.
- A very faint 5mm-style square grid in `--blue-pencil` on the paper.
- **The summary plate is a title block.** Title large, then role, date,
  organisation and skills as ruled fields. This is the natural form of the
  case-study plate; make it the hero of the band.
- Artifacts are **details**: each sits on a `--vellum-2` mat with a detail
  marker (a circle split by a line, detail number above, sheet number below)
  and a caption such as "DETAIL 03, SERVICE BLUEPRINT".
- **The insight is a redline.** Red text inside a revision cloud (a scalloped
  outline) with a leader line to a small triangle marker. This is the
  signature element; make it precise.
- Goals: three numbered keynotes in a ruled legend.
- Work index: a drawing list (sheet index table).
- Works ledger: a revision schedule (REV, DATE, DESCRIPTION, STATUS). Status
  uses small triangle or square markers plus the label.
- Systems: the pipeline as a dimensioned line with tick marks and stage
  labels, the gate drawn as a section marker.
- Lines are 1px. Radius 0. No shadows.

## Dials

Variance 6, Motion 2, Density 6. Motion is limited to state changes.

## Emulate and avoid

- Emulate: architectural drawing sets, engineering title blocks, patent
  drawings, a well-kept set of construction documents.
- Avoid: blueprint-blue backgrounds, hand-lettering fonts, paper textures,
  coffee rings, torn edges, any skeuomorphic gimmick. The conventions must
  organise the content, not decorate it.

**Known risk to manage.** It can become a gimmick or get too dense. The
counter is restraint: generous margins inside each sheet, few line weights,
and red used only for genuine markups.
