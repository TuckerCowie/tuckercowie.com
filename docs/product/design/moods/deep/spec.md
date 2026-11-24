# Mood: Deep Water

**Idea.** The same still water, seen from below the surface. A dark,
immersive ground with monumental serif type, one luminous accent and a slow
ripple. It is the boldest of the three and still has to be calm: depth, not
drama.

**Mood words.** Deep, quiet, monumental, luminous, deliberate.

**Attribute binding** (every choice carries one; cut anything that carries
none): depth, craft, foresight, steadiness.

## Tokens (starting values; tune for contrast, keep the character)

```
--ground:    oklch(0.17 0.03 250);    /* deep blue-black page */
--ground-2:  oklch(0.22 0.035 250);   /* raised panels */
--ink:       oklch(0.94 0.01 220);    /* text */
--ink-soft:  oklch(0.76 0.02 225);    /* secondary text */
--line:      oklch(0.36 0.03 245);    /* hairlines */
--light:     oklch(0.82 0.11 200);    /* the one accent, luminous teal-cyan */
--mat:       oklch(0.96 0.006 210);   /* pale mats under artifacts */
--mat-ink:   oklch(0.28 0.028 245);   /* captions that sit on a mat */
```

Lineage: his 2013 site was black with a steel blue. Status hues in the Works ledger stay
small and always carry a label.

## Type

- Display: **Newsreader 300** at monumental scale (the name and the section
  titles, roughly clamp(56px, 9vw, 150px)), very tight leading, sentence
  case. Reason: his manual's serif, pushed to the scale of an inscription.
- Running text: **IBM Plex Sans 400**, 17 to 18px, generous leading for a
  dark ground.
- Metadata and labels: **IBM Plex Mono**, uppercase, wide tracking, in
  `--ink-soft` or `--light`.

## Layout

- Full-bleed bands. Type is allowed to be huge and to sit low on the screen.
  Generous negative space; density stays low.
- Home band: the name very large, the epigraph in italic, and the ripple
  motif (thin concentric circles in `--line`, one ring in `--light`) large
  and off-centre, partly cropped by the viewport. The portrait from the
  manifest may appear here, full height on one side, if it is handled with
  restraint; a flat scrim for legibility is allowed.
- Artifacts are light screenshots, so they always sit on a `--mat` panel with
  comfortable padding, like prints mounted in a dark gallery. Captions in
  mono.
- Work index: large serif titles in a list separated by hairlines, mono
  metadata to the side. The year can be large and faint.
- The highlighted insight is `--light` text at a larger size with a thin
  `--light` rule.
- Summary plate: thin `--line` border, huge serif title.
- Radius 0.

## Motion

CSS only. The ripple rings may expand and fade very slowly (12 seconds or
more per cycle). Sections may ease in once. Everything stops under
`prefers-reduced-motion: reduce`. No parallax, no scroll-jacking.

## Dials

Variance 7, Motion 6, Density 3.

## Emulate and avoid

- Emulate: a photo-essay title sequence, a planetarium, an engraved
  monument.
- Avoid (his explicit ban): the glow-and-glass "AI dashboard" look. No neon,
  no blur, no gradients as decoration, no starfields, no particle effects.

**Known risk to manage.** Dark pages tire the eye over a long case study and
can feel theatrical. Counter with large type, short measures, bright mats
that give the eye a rest, and motion so slow it is nearly still.

## From Tucker's boards

Read from his own saved inspiration. See `../../references/README.md`.

- **Borrow:** light as the content, with one luminous ring or orb as the
  hero; dark as a material, tonal with one luminous or metallic detail;
  monumental numerals carrying scale as readily as serif titles.
- **Hold against his saves:** most of his dark pins are neutral graphite or
  black, and their light is often gold or white. The blue-black and the
  serif come from the water idea and his manual. Never neon.
- **As a pair:** this is the dark mode of Still Water. Share its structure
  and scale.

## The bar

- **Floor:** this folder's study (`home.jpg`, `case-study.jpg`,
  `specimen.jpg`). Compare the built page with it blind, like for like.
- **Ceiling:** these pins in `../../references/references.yaml`:
  `K01-26`, `K01-29`, `K06-05`, `K06-08`, `K09-01`, `D17-22`, `D19-22`, `D13-14`, `D13-05`, `A03-04`, `A03-11`, `I06-02`, `D14-04`. The critic names where the built page falls short of them.
