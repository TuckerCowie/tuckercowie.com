# Source material

Raw material for the site's content. Nothing here is built into the site
as it stands. Entries are written from it.

| Path | What it is |
|---|---|
| `board/frames/frame-01.jpg` to `frame-41.jpg` | Tucker's public portfolio board, one image per frame, captured 2026-11-24 at 1980 by 1286 |
| `board/frames.json` | Frame numbers and titles, in board order |
| `board/<study>/case-study.md` | Exact transcription of each study's frames |
| `board/smart-pool-crm/img/` | The artifacts of that study, cropped from the frames, with `manifest.md` (alt text, captions, source frame) |
| `manual/how-i-work-best.html` and `.txt` | The "How I Work Best" manual embedded on the board: 13 slides |
| `portrait.jpg` | The portrait from the board's closing frame |

The five case studies and their frames are listed in
[`../research/portfolio-audit.md`](../research/portfolio-audit.md).

Frames 42 and 43 (the closing frame and the resume) are left out because
they carry contact details. The career dates from the resume frame are in
the audit.

All five studies are transcribed, each in its own folder under `board/`:
`smart-pool-app/`, `smart-pool-crm/`, `app-g2m-repositioning/`,
`international-design-sprints/` and `48hr-visiontype/`. Each has a
`case-study.md` (the exact transcription, with other people's names
withheld) and a manifest of the images the site uses. Those images live
beside each entry in `content/work/<slug>/`, cut from a double-resolution
capture, with names, faces and private addresses blurred.

To capture the board again, for example at a higher zoom for sharper
artifacts, see [`../../../tools/capture-board.mjs`](../../../tools/capture-board.mjs).
The board is at https://miro.com/app/board/o9J_lLhlDmc=/
