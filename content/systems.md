---
title: Systems
lede: How I build with AI agents. One person, a small fleet of agents, and the discipline of a small engineering team.
pipeline:
  - { name: Capture }
  - { name: Ideate }
  - { name: Scout }
  - { name: Case }
  - { name: Gate, gate: true, note: "Go, park or kill" }
  - { name: Define }
  - { name: Brand }
  - { name: Design }
  - { name: Scaffold }
  - { name: Build }
  - { name: Launch }
pipeline_note: Eleven stages take an idea from a one-line capture to a launch. One idea is in the pipeline at a time.
numbers:
  - { value: "88", label: Skills }
  - { value: "6", label: Studios }
  - { value: "11", label: Pipeline stages }
  - { value: "5", label: Agents }
  - { value: "4", label: Skills published }
principles:
  - Ground every claim in real command output.
  - An honest red beats an optimistic blank.
  - Ids are for registries; prose is for humans.
  - Use them, fork the ideas, build your own foundry.
published: []
published_note: Four skills are published as open source through a generated, read-only repo. Links to come.
---

## The shape

*Two bodies of knowledge and one lens.*

- **An executable canon** Skills, prompts and conventions that tools read.
- **A knowledge canon** A plain-Markdown notes vault that a person reads.
- **A control plane** A lens above both. It reads status ledgers and health, and it can trigger a guarded agent run. It stores nothing itself.

The two canons sit side by side and never merge.

## The executable canon

*A skill is a complete operating procedure an agent can run, not a prompt snippet.*

- Six studios hold 54 of the 88 skills: Product 27, Marketing and go-to-market 5, Design and UX 6, App development and deploy 9, Content and video 3, Vault and knowledge 4.
- Sixteen more tend the system itself. The remaining 18 cover private work and are not described here.
- Every skill carries three tags: its studio, the lifecycle phases it serves, and the disciplines it draws on.
- Kits are not skills. Six kits hold 41 workshop exercises as templates that a skill fills in.
- One canon, many hosts. The same files load into more than one coding agent and editor, so a change is live everywhere after one push.
- A skill is published only when it is explicitly flagged, and a scan blocks the publish if anything private is found.

## The gate

*A cheap kill counts as a success.*

The gate asks four questions, and each needs a cited line of evidence.

1. Is there demand?
2. Is there a wedge?
3. Are the economics acceptable in the worst case?
4. Is there capacity?

It opens as a premortem. A go is checked by a second agent that sees only the evidence. Every stage ends by appending one line to the project's status ledger, and nothing is tracked anywhere else.

## How quality is judged

*A check you graded yourself is the weakest green.*

- Durable work gets a fresh reader that did not write it.
- Craft is judged against a real, named reference. A separate critic compares the two with labels stripped, says which is better and names the biggest gap.
- There are no scores and no round limit. It ends when the critic picks ours.
- "Deployed" means a request returned 200, not that a push succeeded.

## Tiers and effort

*Work is matched to a tier by how many decisions it holds, not by its size.*

- Four capability tiers: frontier, coding, mechanical and glue. Effort is a second, cheaper dial.
- A frontier model doing glue work is the common waste. A glue model doing frontier work is the rare disaster.
- An early triage fan-out burned 1.33 million tokens across 89 agents and stopped without producing its plan. Rebuilt as a funnel, the same job takes about 14 agents.
- A two-week audit of real sessions found 91 percent of turns running at high effort or above. The defaults were flipped.

## Agents

*Five agents. Not twenty.*

- An agent exists only when it needs its own context and its own permission envelope. Otherwise the job is a skill.
- Each agent has a written contract: what it may touch, what it must never do, a kill test and a budget.
- Autonomy is earned on a ladder and lost automatically: defined, invoked, scheduled, resident.
- No single agent may hold private data, untrusted content and outside communication at once.

## The human in charge

*Facts are the agent's job. Decisions are mine.*

- Agents propose and stop. One-way decisions are written into the document they govern, dated and attributed.
- Act freely on what can be undone. Stop and ask before anything destructive or outward-facing.
- My attention is the scarce resource, not tokens.
- The repo is the memory. Sessions end with a written resume point so the next one starts itself.
