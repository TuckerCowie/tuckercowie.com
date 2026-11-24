# Build goal

The prompt for the session that builds the site. Paste it into a fresh session
that has this repository attached. Written 2026-11-24.

```
Fable seat, high effort. Builders on Sonnet, critic on this seat.

I want you to build my new portfolio site, tuckercowie.com. It is the page I send people before a first conversation, and the proof of my craft: one body of content that stands alone and is fully conveyed under every mood. The brief is in the repo TuckerCowie/tuckercowie.com on the branch claude/portfolio-website-build-uh58w3. docs/product/intent.md is ground truth, including the privacy line, and the repo is public. docs/product/design/README.md is the mood contract: launch with Still Water as the light default, Deep Water as dark, and Cyber, with a minimal one-click mood switcher and a ?mood= URL parameter. Layout may change completely between moods; content never does.

Excellent means calm, exact typography, artifacts large enough to read, and every mood fully designed, never re-skinned. Prove the riskiest part first: the home screen and one case study in all three moods from the same markup. Then build everything intent.md asks for, writing up the five board case studies from docs/product/source.

You choose the stack and architecture. Keep it small, static and self-hosted, and record each dependency with its reason. Take stock of your tools and skills, and go find any references, libraries or fonts you need. The full reference studies are at https://claude.ai/artifact/3Ypc2jdy1kdhHz3ZUSh4St. Every judgment call is yours. List anything only I can answer, mark it draft, and keep going.

The bar for each mood is its own reference study. For each page in each mood, run a builder and a separate harsh critic with fresh context: the critic puts our real rendered page beside the study, labels stripped, says which is better and names the single biggest gap. Keep looping until the critic picks ours.

Push to that branch as you go. Serve me a private preview link, screenshots of the home screen and one case study in each mood, and the list of what needs me.

A complete three-mood tuckercowie.com on that branch, every mood beating its reference study blind, with a preview link, is your /goal. Work completely autonomously and do not ask me for anything until you are all done.
```

## Assumptions behind it

- **Seat.** The frontier seat at high effort, because the architecture and the
  taste calls are the work. Builders are handed down a tier.
- **The bar.** Each mood is judged against its own reference study, since no
  outside reference site was chosen. The loop has no round limit, so this is
  a long run.
- **Delivery.** A private preview and the pushed branch. Launch on the real
  domain is a separate, human step.
- **Scope.** Three moods. The later moods and the post-2021 case studies
  follow in their own sessions.
