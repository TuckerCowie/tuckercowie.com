# Systems map: how Tucker builds with AI agents

_Source material for the Systems page. Distilled 2026-11-24 from a read of
Tucker's private working repos. Method level only. Everything here was
checked against the rule that decides what may be public (see the end)._

## The shape in one paragraph

One person runs a small fleet of AI agents with the discipline of a small
engineering team. Two bodies of knowledge sit side by side and never merge:
an **executable canon** (skills, prompts and conventions that tools read) and
a **knowledge canon** (a plain-Markdown notes vault that a person reads). A
small **control plane** sits above both as a lens: it reads status ledgers
and health, and it can trigger a guarded agent run. It stores nothing itself.

## The executable canon

- **88 skills.** A skill is a complete operating procedure an agent can run,
  not a prompt snippet.
- **Six studios:** Product (27), Marketing and go-to-market (5), Design and
  UX (6), App development and deploy (9), Content and video (3), Vault and
  knowledge (4).
- **Two further groups (18)** cover private, always-on work. They are not
  described here.
- **Meta (16):** skills that tend the system itself.
- **Three tags on every skill:** the studio it belongs to, the lifecycle
  phases it serves (14 of them, from capture to portfolio), and the
  disciplines it draws on (7).
- **Kits are not skills.** Six kits hold 41 workshop exercises as templates
  that a skill fills in.
- **One canon, many hosts.** The same files load into more than one coding
  agent and editor, so a change to a skill is live everywhere after one push.
- **A public slice.** Four skills are published as open source through a
  generated, read-only repo. A skill is exported only when it is explicitly
  flagged, and a scan blocks the publish if anything private is found.

## The pipeline

Eleven stages take an idea from a one-line capture to a launch. One idea is
in the pipeline at a time.

Capture, Ideate, Scout, Case, **Gate**, Define, Brand, Design, Scaffold,
Build, Launch.

The gate has three verdicts: go, park or kill. It asks four questions and
each needs a cited line of evidence: is there demand, is there a wedge, are
the economics acceptable in the worst case, and is there capacity. It opens
as a premortem. A cheap kill counts as a success. A go is checked by a second
agent that sees only the evidence.

Every stage ends by appending one line to the project's status ledger. The
control plane renders those ledgers. Nothing is tracked anywhere else.

## How quality is judged

- **A check you graded yourself is the weakest green.** Durable work gets a
  fresh reader that did not write it.
- **Craft is judged against a real, named reference.** A separate critic
  compares the output with the reference, labels stripped, says which is
  better and names the single biggest gap. There are no scores and no round
  limit. It ends when the critic picks ours.
- **"Deployed" means a request returned 200,** not that a push succeeded.

## Tiers and effort

Work is matched to one of four capability tiers by how many decisions it
holds, not by its size: frontier, coding, mechanical and glue. Effort is a
second, cheaper dial. The standing correction: a frontier model doing glue
work is the common waste, and a glue model doing frontier work is the rare
disaster.

Two origin stories, with their numbers:

- An early triage fan-out burned 1.33 million tokens across 89 agents and
  stopped at the session limit without producing its plan. Six finders
  returned 82 findings, so 82 verifiers started, and 79 findings were
  refuted. Rebuilt as a funnel, the same job takes about 14 agents and
  150 to 200 thousand tokens.
- A two-week audit of real sessions found 91 percent of turns running at high
  effort or above and the cheapest tier used for about 1 percent of turns.
  The defaults were flipped.

## Agents

"Five agents. Not twenty." An agent exists only when it needs its own context
and its own permission envelope. Otherwise the job is a skill. Each agent has
a written contract: what it may touch, what it must never do and the
mechanism that enforces that, a kill test, and a budget. Autonomy is earned
on a ladder (defined, invoked, scheduled, resident) and lost automatically.
No single agent may hold private data, untrusted content and outside
communication at once.

## How the human stays in charge

- Facts are the agent's job. Decisions are Tucker's.
- Agents propose and stop. One-way decisions are written into the document
  they govern, dated and attributed.
- Act freely on what can be undone. Stop and ask before anything destructive
  or outward-facing.
- Tucker's attention is the scarce resource, not tokens.
- The repo is the memory. Sessions end with a written resume point so the
  next one starts itself.

## Lines worth quoting (exact)

- "Ground every claim in real command output."
- "An honest red beats an optimistic blank."
- "Ids are for registries; prose is for humans."
- "Use them, fork the ideas, build your own foundry."

## What stays off the page

The rule that decides this is Tucker's own export rule: private by default,
public only when flagged. So the Systems page shows method, counts and
principles, and links only to the published skills. It does not show the
names or contents of unpublished skills, anything about home systems
or machines, the contents of the notes vault or the ideas backlog, employer
or client work, or anything about family, health or money.
