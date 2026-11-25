# The markup contract

One body of markup carries every mood. This file is the contract between the
templates in `src/templates/` and the stylesheets in `src/moods/`. A mood
styles what is listed here and nothing else.

## Rules

1. **The markup is the union of boxes any mood needs.** A quiet mood
   dissolves a box it does not want with `display: contents`. No mood adds
   an element, so no mood needs its own markup.
2. **Words live in the markup.** A mood never writes words: generated
   `content` holds counters, digits and glyphs only, written with an empty
   alternative (`content: counter(plate, decimal-leading-zero) / ""`) so
   assistive technology hears the same page in every mood.
3. **A mood never hides content.** Text, images with alt text, links and
   controls stay visible, at every width. Ornament may be hidden freely.
   Ornament is: `.c-orn`, `.motif`, `.mark`, `.switcher__glyph`,
   `.crumb__sep` and every pseudo-element.
   Two named exceptions, both controls and not content: a mood may show the
   switcher's `.switcher__name` only for the pressed button, using the
   visually-hidden pattern, and may visually hide `.switcher__label`.
4. **No reordering away from reading order.** No `order`, no
   `flex-direction: *-reverse`, no `grid-auto-flow: dense`. Placing children
   in grid areas is fine when the visual order still reads in source order,
   or when the moved thing is a label, readout or ornament.
5. **Every colour, font, size step and space step is a token** declared in
   the mood's `:root` block. After that block a mood stylesheet holds no
   colour literal and no raw length other than `0`, `1px` hairlines and
   percentages.
6. **Motion is opt-in.** Any animation or transition sits inside
   `@media (prefers-reduced-motion: no-preference)`. Text never moves while
   it is read.
7. **Images are shown as they are.** No filter, blend mode, tilt or device
   frame on an artifact. Light screenshots sit on a pale mat in dark moods.

## How a mood stylesheet is compiled

`src/moods/<id>.css` is written as if it were the only stylesheet. The build
inlines its `@import`s, flattens nesting and prefixes every selector with
`:root[data-mood="<id>"]`, so `:root {}` and `body {}` in the source mean
what they say. The whole sheet is wrapped in `@media screen`; print is
handled once in `src/styles/base.css`.

Not allowed in a mood: `@font-face` (faces are declared in
`src/build/fonts.mjs`), `@layer` and `@scope` (a layered rule would lose to
`base.css`, and the build already scopes the sheet), `!important`, and
keyframe names that do not start with the mood id (`@keyframes cyber-sweep`).
Write the root as `:root` or `html`, never inside `:is()` or `:where()`.

Available faces: `"Newsreader"` (variable, weight 200 to 800, optical size,
roman and italic), `"IBM Plex Sans"` (400, 400 italic, 500, 600, 600 italic),
`"IBM Plex Mono"` (400, 500), `"Chakra Petch"` (500, 600, 700).

## Ordinals and totals

Templates set `--i` (1-based position) on repeated items and `--n` (how
many) on their container. Use them through counters:

```css
.c-plate { counter-reset: plate var(--i) plates var(--n); }
.c-plate .c-label::after { content: " " counter(plate, decimal-leading-zero) " / " counter(plates, decimal-leading-zero) / ""; }
```

## The component anatomy

Every component root is `.c` with a `data-c` name. Inside, in source order:

| Hook | What it is |
|---|---|
| `.c-orn` | One empty, `aria-hidden` span. Chrome only: brackets, frames, glows |
| `.c-head` | The head: `.c-label` (real text, sometimes a heading) and an optional `.c-readout` of real data, and sometimes a `.draft` tag |
| `.c-title` | The title. Display titles are split into `.t-lead` and `.t-tail` (the last word) so a mood can colour the tail |
| `.c-sublabel` | A label inside a component |

Every `ul` and `ol` outside a `nav` carries `role="list"`, so a mood can
remove list markers without the list vanishing for screen-reader users.

A `.c` root, its `::before` and `::after`, `.c-orn` and its two
pseudo-elements, and `.c-head` with its two, give a mood six paint layers
per component with no extra markup.

Put `clip-path` on pseudo-elements, never on an element that holds text or
can take focus, so nothing is clipped and focus rings stay whole.

## Shell (every page)

```
body[data-page]                       home | work | entry | ledger | profile | systems | resume | specimen | notfound
  a.skip
  header.site-head.c[data-c=nav]
    span.c-orn
    a.brand > svg.mark (circle.mark__outer, circle.mark__inner) + span.brand__name
    nav.site-nav > ul.nav > li > a[aria-current]
    div.switcher[data-c=switcher][role=group]
      span.switcher__label
      button.switcher__btn[data-mood-set][aria-pressed] > span.switcher__glyph + span.switcher__name
  main#main
  footer.site-foot.c[data-c=foot]
    span.c-orn, p.foot__name, p.foot__action > a.foot__email (+ span.draft), p.foot__top > a, p.foot__preview
```

The switcher is small enough to ignore and must work by keyboard. The
pressed button has `aria-pressed="true"`. It is `hidden` until the script
runs.

`.draft` is a small tag that marks a placeholder waiting on Tucker. It only
appears in preview builds.

## Home (`data-page=home`)

```
section.c.c-home[data-c=home]
  span.c-orn
  div.c-head > p.c-label
  h1.c-title.home__name > span.t-lead + span.t-tail
  p.home__identity > span.id-line[--i] x3 (+ span.draft)
  blockquote.home__epigraph > p
  p.home__lead
  p.home__sub
  nav.doors > ul.doors__list[--n] > li.door[--i] > a.door__link > span.door__name + span.door__desc
  p.home__action > a.email (+ span.draft)
  div.motif > svg.motif__svg
```

Home fits one view at 1440 by 900 and reads well on a phone.

The motif is the circle every mood shares: a ripple, a luminous ring, a
radar. One SVG, `viewBox="-100 -100 200 200"`, strokes never scale:

| Part | Hook |
|---|---|
| Five concentric rings, radius 12, 27, 45, 68, 94 | `circle.motif__ring[data-i=1..5]` |
| An outer tick ring, radius 97, `pathLength=360` (dash it with `stroke-dasharray`) | `circle.motif__ticks` |
| Two axes | `line.motif__axis` |
| A wedge from the centre | `path.motif__sweep` |
| The centre | `circle.motif__core` |
| Three numbered contacts, one per door | `g.motif__contact[data-i=1..3] > circle.motif__blip + text.motif__num` |

Hide the parts a mood does not use. Link a door to its contact with
`.c-home:has(.door:nth-child(1) a:is(:hover, :focus-visible)) .motif__contact[data-i="1"]`.

## Entry page (`data-page=entry`)

```
article.entry[data-type][data-written?]
  header.c.c-summary[data-c=summary][data-type]
    span.c-orn
    div.c-head > p.c-label "Summary" + p.c-readout "9 plates" (+ span.draft)
    p.crumb > a + span.crumb__sep + a.crumb__type
    h1.c-title.summary__title > span.t-lead + span.t-tail
    p.summary__line?
    dl.fields[--n] > div.field[data-field=role|date|organisation|status][--i] > dt + dd (dd may hold a or span.status[data-status])
    div.skills > p.c-sublabel + ul.tags[--n] > li[--i] > a.tag
    p.marker[data-marker=confidential]? > span.marker__label + span.marker__text
  section.c.c-details[data-c=details][--n]
    span.c-orn
    div.c-head > h2.c-label "Details" or "Background"
    div.prose.details__intro
    section.block[data-block=goals][--i] > h3.c-sublabel + ol.goals[--n] > li[--i]
    section.block[data-block=role] > h3.c-sublabel + ul.points > li
    section.block[data-block=methodology] > h3.c-sublabel + ol.steps > li
    section.block[data-block=outcome]? > h3.c-sublabel + p.outcome or ul.points
  div.plates[--n]
    section.c.c-plate[data-c=plate][data-kind=process|solution|in-action][--i][--n][data-written?][data-set?]
      span.c-orn
      div.c-head > p.c-label "Plate" (> span.vh " 3 of 9", read out, never shown)
      h2.c-title.plate__title
      div.prose.plate__text?                 two or three sentences, may hold a list
      div.plate__figures[--n]? > figure.artifact[data-shape=wide|strip|tall][--w][--h] x1 (several for solution and in-action)
        a.artifact__mat > picture > img
        figcaption.artifact__caption > span.fig-label "Figure" + span.fig-text
      blockquote.pullquote?
      aside.c.c-insight[data-c=insight]? > span.c-orn + div.c-head > p.c-label "Insight" ; div.insight__text
      ul.links? > li > a.link
  nav.c.c-pager[data-c=pager] > span.c-orn + div.c-head + ul.pager > li.pager__item[data-dir=prev|next|index] > a > span.pager__label + span.pager__title
```

- `--w` and `--h` on `.artifact` are the image's pixel size. Never show an
  artifact wider than `--w` pixels. `data-shape="strip"` is wider than
  2.6:1, `tall` is narrower than about square.
- `.artifact__mat` is a link to the full-size file. Give artifacts real
  size: the diagrams need about 900px of width to be read.
- `.c-plate[data-written]` has no figure. It must be designed, not left as a
  plate with a hole: this is the written case-study variant.
- `.c-insight` is the highlighted insight. It is the one loud moment in a
  case study.

## Work index (`data-page=work`)

```
section.c.c-pagehead[data-c=pagehead] > span.c-orn + div.c-head > p.c-label ; h1.c-title ; div.prose.pagehead__intro?
div.c.c-filters[data-c=filters]
  div.c-head > h2.c-label "Filters"
  div.filter[data-axis=type|org|skill][--i] > p.c-sublabel + ul.filter__list > li > a.chip[aria-current?] (> span.chip__n)
div.c.c-index[data-c=index]
  div.c-head > h2.c-label "Index"
  p.index__count
  table.index > caption.index__caption + thead + tbody[--n]
    tr.row[--i][data-type][hidden?]
      td.row__year[data-col=year]
      th.row__title[data-col=title] > a.row__link or span.row__link        the title only
      td.row__about[data-col=about] > span.row__summary?, span.row__note?, span.draft?   may be empty
      td.row__org[data-col=org]
      td.row__type[data-col=type] > span.type-tag[data-type]
      td.row__role[data-col=role]
  p.index__empty[hidden]
section.c.c-collections[data-c=collections] > div.c-head > h2.c-label ; ul.collections > li.collection > a > span.collection__name + span.collection__n
```

The index lists case studies, workshops, talks, certifications and awards.
Products are listed on the Works ledger instead. It stays a table in every
mood, with six columns: Year, Title,
About, Organisation, Type, Role. The tables never scroll sideways. At narrow
widths restyle the rows (`display: grid` on `tr` is fine, and the About cell
can sit under the title) but keep every cell that has text visible.

## Works ledger (`data-page=ledger`)

```
section.c.c-pagehead
div.c.c-ledger[data-c=ledger]
  div.c-head > h2.c-label "Ledger" + p.c-readout
  table.ledger > caption + thead + tbody > tr.row[data-status] > th.row__title + td[data-col=status] > span.status[data-status] + td[data-col=when] + td[data-col=what] (> span.verdict > span.verdict__label)
  div.legend > p.c-sublabel + ul.legend__list > li > span.status[data-status]
section.c.c-nnl[data-c=nnl] > div.c-head > h2.c-label + p.c-readout ; div.nnl > section.nnl__col[data-when=now|next|later] > h3.c-sublabel + ul.points
```

`span.status[data-status]` takes one of shipped, running, growing, built,
parked, killed, retired. A status hue is small and always sits beside its
text label.

## Profile (`data-page=profile`)

```
section.c.c-pagehead.c-manualhead > c-head ; h1.c-title ; p.pagehead__sub ; blockquote.epigraph > p ; figure.portrait > picture + figcaption.portrait__caption
div.c.c-manual[data-c=manual][--n] > c-head ; section.manual__section[--i] > h2.manual__title + p.manual__lede? + div.prose.manual__body
    lists inside .manual__body: ol or ul; li.pair > span.pair__term + span.pair__desc for term and description pairs
section.c.c-statements[data-c=statements] > c-head ; dl.statements > div.statement > dt + dd
section.c.c-assessments[data-c=assessments] > c-head ; dl.assessments > div.assessment > dt + dd (> span.pending) ; p.assessments__note
section.c.c-career[data-c=career] > c-head ; ol.career > li.career__row > span.career__when + span.career__role + span.career__org + span.career__note? ; h3.c-sublabel ; ul.education > li > span.edu__title + span.edu__org + span.edu__when? ; p.career__resume > a
```

## Systems (`data-page=systems`)

```
section.c.c-pagehead
section.c.c-pipeline[data-c=pipeline] > c-head ; ol.pipeline[--n] > li.stage[--i][data-gate?] > span.stage__name + span.stage__note? ; p.pipeline__note
section.c.c-numbers[data-c=numbers] > c-head ; dl.numbers > div.number > dt + dd
div.c.c-method[data-c=method] > c-head ; section.method__section[--i] > h2.method__title + p.method__lede? + div.prose.method__body
section.c.c-principles[data-c=principles] > c-head ; ul.principles > li
section.c.c-published[data-c=published] > c-head ; ul.links? ; p.published__note
```

## Specimen (`data-page=specimen`)

`section.c.c-tokens[data-specimen-mood]` (one per mood; the compiled sheet
hides the others), `ul.swatches > li.swatch > span.swatch__chip +
code.swatch__name + code.swatch__value`, `dl.tokenlist`, `section.c.c-type >
div.type__rows > div.type__row`, `section.c.c-motifspec`, then a whole entry
rendered as the written variant.

## Hook budget

Hooks that exist only so a mood can do something visual, and why:

| Hook | For |
|---|---|
| `.t-lead`, `.t-tail` | A second colour on a title's last word |
| `.c-orn` | Corner brackets and frames |
| `.crumb__sep` | A separator glyph a mood draws |
| `.switcher__glyph` | The switcher's per-mood mark |
| `data-shape` on `.artifact` | Sizing strips and tall artifacts differently |

Adding a hook means adding it for every mood. Ask before adding one.
