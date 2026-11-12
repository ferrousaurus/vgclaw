---
name: building-vgc-team
description: Use when the user wants to build a VGC team for Pokemon Champions — from a core, an archetype, or a blank slate.
---

# Build a VGC Team

Build a Pokemon Champions VGC team one user decision at a time. This advisory skill enforces the **single-decision gate**.

## Decision Authority

`AGENTS.md` > Advisory Contract governs authority. This skill adds:

- **Single-decision gate:** Advance exactly one decision per response. Never bundle slots, project a full team, or complete unchosen members; a supplied core authorizes nothing beyond it. Keep gate through 6/6.

Unless stated otherwise, every workflow step completes only after one decision, 2–3 legal options with trade-offs, and a user-choice question.

## Data Sources

- **Legality & availability:** Use the `referencing-valid-vgc-data` skill for every Pokemon, move, ability, item, and type-chart lookup.
- **Viability heuristics:** Roles, archetypes, items, synergies, speed tiers, win conditions, tempo, and stat calculations live in the `evaluating-vgc-team-viability` skill and its `references/`. Use them when analyzing the confirmed state or ranking next-slot candidates.
- **Meta data:** Fetch `https://www.pikalytics.com/champions` via `webfetch` when available for usage, threats, sets, and teammates; use documented static proxy only when unavailable.
- **Mega Stones:** See `evaluating-vgc-team-viability` > `items.md` > Mega Stones for the bring-4 interpretation, including when two Megas become a problem.

## Default Response Shape

Use this structure unless the user explicitly asks for a different format:

1. Current confirmed team state
2. The single biggest current team-building decision
3. Option A
4. Option B
5. Option C if useful
6. Trade-offs
7. Direct question asking which direction the user wants

Stop after that question; do not discuss later slots or set decisions.

## Workflow

### 1. Start From the User's Chosen Entry Point

Valid entry points:
- `I want to build around X` -- The user names 1-2 Pokemon. Verify they exist in `assets/pokemon.json`, then analyze what the next decision should be.
- `I want to play [archetype]` -- Read `archetypes.md`, identify the archetype's requirements, and present the next decision the user should make.
- `What's good right now?` -- Fetch Pikalytics and present current high-level directions, then ask the user which direction they want to explore.

### 2. Confirm the Current Team State

Start each turn by restating:
- confirmed Pokemon
- any confirmed set directions
- any unresolved open questions
- how many slots remain open

### 3. Identify the Single Next Decision

Identify current state's highest-value next decision.

Examples:
- Confirm whether one of the core Pokemon should be offensive or supportive.
- Choose the next roster slot.
- Choose whether the team wants speed control, Fake Out support, redirection, a second damage profile, or a backup mode next.
- Refine a confirmed Pokemon's role before adding another member.

### 4. Present 2-3 Legal Options for That Decision

For it:
- Present 2-3 legal options.
- Explain why each option fits the confirmed team state.
- Explain what each option gains and what it gives up.
- Ask the user which direction they want.

### 5. Slot-by-Slot Team Building Rules

For an open roster slot:
- Recommend candidates for the next open slot only.
- Evaluate candidates using current type gaps, role gaps, speed profile, win conditions, and meta matchups.
- Frame the question as `Which slot-[N] candidate do you want to try next?`
- After the user chooses, stop and reassess before discussing the following slot.

### 6. Set-Direction Rules

For a confirmed Pokemon's use:
- Present role or set directions before presenting a fully locked set.
- Examples: offensive attacker, supportive utility, bulky pivot, dedicated speed control, setup sweeper.
- Explain how each direction changes the team's remaining needs.

### 7. Current-State Analysis

Analyze only confirmed roster and set directions.

Examples:
- With 1-2 confirmed Pokemon: analyze core synergy, archetype fit, biggest missing role, and likely pressure points.
- With 3 confirmed Pokemon: analyze what slot 4 needs to solve.
- With 4 confirmed Pokemon: identify which matchups or alternate modes still need support.
- With 5 confirmed Pokemon: identify the single most valuable final slot role.
- With 6 confirmed Pokemon: proceed to full-team refinement, but still one decision at a time.

### 8. Full-Team Refinement After Six Confirmed Members

After user explicitly chooses all 6 Pokemon, continue one decision at a time.

Allowed next-decision categories:
- choose which confirmed Pokemon to refine next
- choose between set directions for a confirmed Pokemon
- choose between move options for a confirmed Pokemon
- choose between item options for a confirmed Pokemon
- choose between SP / nature benchmark plans for a confirmed Pokemon
- choose which matchup hole to address first

### 9. Legality Checks

Use `check-vgc-team-legality` once confirmed state supports a meaningful pass; partial checks report only confirmed state.

### 10. Export & Save

Export only on explicit request; follow `AGENTS.md` > Team Output & Storage and `teams/XXX-NAME.md`.

## Evaluation Guidance for Next-Slot Recommendations

When recommending the next open slot, use the confirmed state to evaluate:
- **Type gaps** -- Which threats the current core resists poorly or cannot hit effectively
- **Role gaps** -- Speed control, Intimidate, redirection, Fake Out, setup, spread damage, weather/terrain if relevant
- **Speed tier fit** -- Whether the candidate matches the team's current speed plan
- **Win condition contribution** -- Whether the candidate strengthens an existing path to winning or creates a distinct backup path
- **Stat-based comparison** -- Use `stat-calculations.md` when exact benchmarks materially differentiate options
- **Meta threats** -- Use Pikalytics to identify what currently pressures the confirmed core

Present as next-slot options only — hold the single-decision gate.

## Conversation Style

- The user can revisit earlier decisions at any time.

## Examples

Bad:
`You want Aegislash and Alolan Ninetales, so here is the rest of the team: Incineroar, Farigiraf, Sinistcha, and Garchomp.`

Good:
`With Aegislash and Alolan Ninetales confirmed, the biggest next decision is what slot 3 should solve. Here are three legal candidates that support that core in different ways. Which one do you want to explore?`

Bad:
`Here is your full draft.`

Good:
`Right now you have 3 confirmed members and one unresolved Aegislash set direction. Do you want to lock Aegislash's role first, or pick a slot-4 candidate next?`
