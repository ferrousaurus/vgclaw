# VGC Agent Entrypoints Design

## Summary

This spec defines two new repo-local OpenCode primary agents for Pokemon Champions VGC doubles:

- `.opencode/agents/teambuilder.md`
- `.opencode/agents/critic.md`

These agents provide direct `Shift+Tab` access inside OpenCode while reusing the existing repo-local VGC knowledge in `.agents/skills/`. They are scoped only to Pokemon Champions VGC doubles and should assume Bring 6 / Pick 4, level 50, and doubles-oriented role language by default.

## Goals

- Add `teambuilder` and `critic` as extra primary agents alongside the built-in development agents.
- Port much of the current `building-vgc-teams` and `evaluating-vgc-teams` behavior into agent prompts.
- Reuse shared legality, viability, and meta reference material already stored under `.agents/skills/`.
- Keep the agents grounded in Pokemon Champions legality and VGC doubles assumptions.
- Preserve the current repo style of analysis-heavy, trade-off-aware outputs and Showdown paste exports.

## Non-Goals

- Multi-format support such as singles, pick-6 singles, or general Smogon formats.
- Replacing the built-in Build or Plan agents.
- Creating a generalized cross-tool agent standard in this change.
- Rewriting the existing `.agents/skills/` data model.

## Current Context

The repository already contains the core VGC knowledge in `.agents/skills/`:

- `building-vgc-teams` documents the current team-building workflow.
- `evaluating-vgc-teams` documents the current team-evaluation workflow.
- `checking-vgc-legality` provides the required legality data files.
- `evaluating-vgc-viability` provides optional strategic references.
- `evaluating-vgc-meta` provides optional meta-oriented guidance.

The repo also includes example output style in `teams/001-mega-feraligatr.md` and `teams/002-alolan-ninetails.md`, both of which use VGC doubles framing, layered analysis, and Showdown-style team formatting.

OpenCode primary agents are the correct target because the user wants these agents visible through the primary agent switcher in this repository. OpenCode documents `.opencode/agents/` as the repo-local discovery path for agents.

## Chosen Approach

Use thin OpenCode primary agents over shared VGC reference material.

The canonical deliverables are `.opencode/agents/teambuilder.md` and `.opencode/agents/critic.md`. Each file defines OpenCode frontmatter and an agent-specific prompt, while explicitly treating `.agents/skills/` as the source of truth for legality and strategic reference data.

This avoids duplicating roster legality and strategic guidance into the agent files while still making the agents directly discoverable in OpenCode.

## Alternatives Considered

### 1. Self-contained agent prompts

Copy most of the current skill workflows and domain rules directly into each `.opencode/agents/*.md` file.

Rejected because:

- it duplicates legality and VGC guidance already present in the repo
- it increases drift risk between skills and agents
- it makes future updates harder to keep consistent

### 2. Layered agent stack with helper subagents

Create `teambuilder` and `critic` as primary agents plus several helper subagents for legality lookup, meta lookup, and analysis subtasks.

Rejected for now because:

- it adds orchestration complexity before the simpler design is proven insufficient
- the current workflows can be expressed directly in two primary agents
- the user asked for better entrypoints, not a larger agent graph

## Architecture

### Agent files

Create two new primary-agent definitions:

- `.opencode/agents/teambuilder.md`
- `.opencode/agents/critic.md`

Each file should include:

- frontmatter with `description` and `mode: primary`
- a concise, specialized system prompt
- explicit repo-local paths for required and optional data sources
- a clear statement that the agent is scoped to Pokemon Champions VGC doubles only

These agents are additional conversation modes alongside Build and Plan. They do not replace the normal software-development workflow.

### Knowledge split

The system is split into two layers:

- `.opencode/agents/` for entrypoint UX and agent behavior
- `.agents/skills/` for shared VGC knowledge and workflow source material

The existing skills remain the behavioral templates and reference sources:

- `building-vgc-teams` is the source workflow for `teambuilder`
- `evaluating-vgc-teams` is the source workflow for `critic`
- `checking-vgc-legality` is the required legality source
- `evaluating-vgc-viability` is the optional strategic source
- `evaluating-vgc-meta` is the optional meta source

The agents should read shared data and references directly. They should not conceptually depend on invoking the old slash-command skills at runtime.

## Components

### `teambuilder`

`teambuilder` is a conversational team-building agent for Pokemon Champions VGC doubles.

Expected interaction model:

- start from one of three entry points:
  - build around a named Pokemon or pair
  - build around an archetype
  - ask what is good right now
- assume Bring 6 / Pick 4, doubles play, and level 50
- build the team in stages:
  - foundation pair
  - core-4
  - alternate mode slots 5-6
  - set refinement
  - team-wide analysis
  - Showdown export

Required behavioral rules:

- verify legality before suggesting Pokemon, items, abilities, or moves
- use bring-4 language when explaining roles and modes
- preserve the current skill's trade-off-oriented style instead of forcing a single "correct" answer
- degrade gracefully if optional viability or meta context is unavailable

### `critic`

`critic` is a conversational team-evaluation agent for Pokemon Champions VGC doubles.

Expected interaction model:

- accept a Showdown paste, including partial teams
- parse and validate legality first
- detect and confirm archetype
- produce a summary-first verdict
- offer drill-down layers similar to the current evaluator skill
- track accepted changes through the conversation
- output a revised Showdown paste and change diff when requested or when the review is complete

Analysis layers to preserve where dependencies allow:

- type coverage
- pair synergies
- bring-4 modes
- meta threat matchups
- role checklist
- set optimization
- win condition assessment
- lead and resilience check

Required behavioral rules:

- keep the summary-first flow as the default interaction
- validate legality findings before deeper strategic analysis
- preserve partial-team handling from the current skill
- use VGC doubles framing consistently

### Shared prompt contract

Each agent prompt should include a short contract section with explicit must/must-not rules. This is needed because prompt drift is the main failure mode.

Must rules:

- assume Pokemon Champions VGC doubles by default
- use Bring 6 / Pick 4 framing
- validate legality against repo data before making claims
- keep outputs concise but substantive
- explain trade-offs when suggesting changes

Must-not rules:

- do not switch silently into singles assumptions
- do not suggest out-of-roster Pokemon
- do not fabricate moves, items, or ability legality
- do not imply meta certainty if optional meta data is unavailable

## Data Flow

Both agents should follow this lookup and reasoning order.

### 1. User input

- `teambuilder`: a starting Pokemon, pair, archetype, or "what's good right now?"
- `critic`: a Showdown paste or partial team paste

### 2. Required legality validation

Read from `.agents/skills/checking-vgc-legality/`:

- `champions-roster.json`
- `moves.json`
- `abilities.json`
- `items.json`
- `type-chart.json`

If this required data is missing, the agent must stop and say it cannot proceed.

### 3. Optional strategic reference layer

Read from `.agents/skills/evaluating-vgc-viability/` when available:

- roles
- archetypes
- synergies
- speed tiers
- win conditions
- tempo
- items
- stat calculations

If unavailable, continue using direct roster, type, move, and stat analysis without presenting the missing reference layer as a hard failure.

### 4. Optional meta layer

Use `.agents/skills/evaluating-vgc-meta/` guidance when available. If the workflow expects live meta fetches, the agent should use them when supported; otherwise it should fall back to non-meta-relative language.

### 5. Conversation state

`teambuilder` keeps:

- the evolving roster
- current roles covered
- current core-4 summary
- unresolved slot decisions

`critic` keeps:

- parsed team state
- validation findings
- accepted and rejected changes
- current revised team state

### 6. Output formatting

- intermediate outputs remain conversational and analysis-first
- final team outputs use Showdown paste format
- `critic` also outputs a human-readable change diff

## Error Handling

The agents should fail clearly and narrowly.

### `teambuilder`

- If required legality data is missing, stop immediately and say the legality data is required.
- If the user names a Pokemon not present in `champions-roster.json`, do not suggest it anyway; tell the user it is not in the current roster data and ask for another direction.
- If optional viability or meta references are unavailable, continue with narrower analysis.
- If the user asks for non-VGC or singles-style behavior, state that the agent is scoped to Pokemon Champions VGC doubles and cannot reliably switch formats.

### `critic`

- If the paste is malformed, ask for a corrected paste rather than guessing.
- If some Pokemon are legal and others are not, offer partial evaluation for the legal subset.
- If items, abilities, EV totals, or moves are illegal, surface those findings before deeper analysis.
- If there are fewer than 4 Pokemon, skip bring-4 mode analysis.
- If there are fewer than 6 Pokemon, evaluate the partial roster but flag incompleteness in the summary verdict.

### Shared guardrails

- no fabricated legality
- no fabricated matchup certainty without meta support
- no silent fallback from doubles framing to another format

## Testing And Acceptance

These deliverables are prompt and agent-definition changes, so the main verification method is manual behavior testing.

### Acceptance checks

- OpenCode loads both agents from `.opencode/agents/`.
- Both agents are reachable via the primary agent switcher.
- `teambuilder` starts a VGC doubles team-building conversation without extra setup.
- `critic` accepts a valid Showdown paste and uses a summary-first evaluation flow.
- Both agents use Bring 6 / Pick 4 doubles language consistently.
- Both agents refuse out-of-roster suggestions unless legality data allows them.
- `critic` handles partial teams and malformed teams according to this spec.
- Both agents degrade gracefully when optional viability or meta references are absent.
- Final team outputs remain in Showdown paste format.
- `critic` preserves a change diff for accepted revisions.

### Suggested manual fixtures

- `teams/001-mega-feraligatr.md` as a critic behavior and style reference
- `teams/002-alolan-ninetails.md` as a second critic behavior and style reference
- invalid or edge prompts covering:
  - out-of-roster Pokemon
  - illegal moves or items
  - singles-oriented requests
  - incomplete 3-mon cores

## Implementation Notes For The Next Step

The implementation plan should focus on:

- defining the exact frontmatter and prompt structure for `.opencode/agents/teambuilder.md`
- defining the exact frontmatter and prompt structure for `.opencode/agents/critic.md`
- deciding how explicitly each agent references repo-local file paths in its prompt
- validating that the prompts preserve near-parity with the current slash-command workflows without over-copying them
- testing OpenCode discovery and primary-agent switching behavior in this repo
