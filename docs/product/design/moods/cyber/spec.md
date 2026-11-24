# Mood: Cyber
**Idea.** A futuristic, virtual, cyberpunk interface. The portfolio is seen
through a heads-up display in a near-future operating system: panels, frames,
readouts and signal colours on a dark void. It is a designed interface, not a
costume. The chrome is theatrical and the reading stays calm and legible.

**Mood words.** Electric, virtual, precise, nocturnal, alive.

**Attribute binding** (every choice carries one; cut what carries none):
foresight, systems thinking, craft, depth.

## Tokens (starting values; verify contrast, keep the character)

```
--void:   oklch(0.13 0.025 280);  /* page ground, near-black violet */
--panel:  oklch(0.18 0.035 275);  /* panel fill */
--grid:   oklch(0.32 0.06 280);   /* frame lines, grid lines */
--ink:    oklch(0.93 0.02 200);   /* reading text */
--dim:    oklch(0.74 0.04 220);   /* secondary text */
--neon:   oklch(0.85 0.15 195);   /* primary signal, cyan */
--hot:    oklch(0.70 0.24 350);   /* second signal, magenta: alerts and the insight */
--amber:  oklch(0.83 0.16 85);    /* status only */
--mat:    oklch(0.95 0.01 220);   /* pale mat behind light screenshots */
```

**Named exceptions to the shared rules, for this direction only.**
- Two signal colours are allowed (`--neon` primary, `--hot` for alerts and
  the insight). Status hues stay small and always carry a text label.
- Restrained glow is allowed on signal elements only (a soft `text-shadow` or
  `box-shadow` in the signal colour). A faint scanline or grid overlay is
  allowed. Still banned: blur and glass effects, rainbow gradients, glitch
  effects that damage legibility.

## Type

- Display and labels: one techno face from `@fontsource`. Choose one of
  Chakra Petch, Oxanium or Rajdhani and say why. Uppercase, tracked.
- Reading text: IBM Plex Sans 400 at 16 to 17px with generous leading.
  Running text is never set in the techno face.
- Data, readouts, captions: IBM Plex Mono. Tabular figures.

## Layout

- **HUD chrome.** A slim system bar at the top. Panels with chamfered
  (clipped) corners via `clip-path`, corner brackets, tick marks along edges.
  Each band is a panel or a set of panels with a title bar.
- Readouts show real data only: band numbers, plate numbers, the counts and
  dates in the content. Do not invent telemetry, coordinates, version
  numbers or fake system messages.
- Home: the name as a large display line, the descriptor as a status line,
  the three doors as selectable menu rows with a cursor marker, and one
  ambient element, for example a slow radar sweep or concentric rings that
  echo the ripple in a signal colour.
- Work index: a console table. Monospace columns, a highlighted selected
  row, type shown as a small tag.
- Summary plate: a framed "file header" panel with the title large and the
  fields as labelled readouts.
- Case-study plates: windows with a title bar. Screenshots are light, so
  each sits on a `--mat` panel inside a thin `--neon` frame so it stays
  readable. The insight is an alert panel in `--hot`.
- Works ledger: status as small indicator lights plus the label.
- Systems: the pipeline as a node line with the gate marked in `--hot`.
- A background grid or perspective floor is allowed at very low contrast.

## Motion

Allowed and expected, in the chrome only: a slow sweep or pulse on the Home
element, a soft flicker-free scan, panel edges that draw in once. Text never
moves while being read. Everything stops under
`prefers-reduced-motion: reduce`. CSS only if possible.

## Dials

Variance 8, Motion 7, Density 7.

## Emulate and avoid

- Emulate: film interface design (the screens in near-future cinema), game
  menu systems of the cyberpunk genre, flight and ops consoles.
- Avoid: illegible tiny neon text, low-contrast text on dark, binary rain,
  skulls, fake hacker jargon, stock sci-fi imagery, anything that makes the
  case study harder to read than in a plain layout.

**Known risk to manage.** Costume over content, and eye fatigue. The counter:
keep reading columns calm and well lit, put the spectacle in the frame, and
meet WCAG AA contrast everywhere.

## From Tucker's boards

Read from his own saved inspiration. See `../../references/README.md`. This
mood has the strongest evidence of the three.

- **Borrow:** structure over glow. Panels, readouts, dials and status
  lights. Concentric rings and corner-cut frames. Dark maps and node graphs
  as native imagery. Real instruments (knobs, keypads, lit hardware) as much
  as film interfaces.
- **Change from the study:** make amber the second signal in place of
  magenta. His dark interfaces use one dominant cyan with orange or amber
  second, and no magenta.
- **Keep glow sparing:** on a dial, a gauge, an arc. Never bloom across the
  screen.

## The bar

- **Floor:** this folder's study (`home.jpg`, `case-study.jpg`,
  `specimen.jpg`). Compare the built page with it blind, like for like.
- **Ceiling:** these pins in `../../references/references.yaml`:
  `B03-20`, `B03-18`, `B03-17`, `B03-11`, `D09-28`, `D01-04`, `D01-09`, `D09-15`, `D09-59`, `D09-06`, `D08-02`, `D08-04`, `T01-18`, `R03-07`, `K02-03`, `M02-02`, `I06-29`, `D10-02`, `D02-02`. The critic names where the built page falls short of them.
