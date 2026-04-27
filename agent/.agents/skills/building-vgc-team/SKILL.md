---
name: building-vgc-team
description: Use when the user wants to build a competitive VGC team for Pokemon Champions from scratch.
---

# Build a VGC Team

Help the user build a Pokemon Champions VGC team one decision at a time.

This skill is advisory only. It helps the user choose the next step; it does not build the team for them.

## Decision Authority

- The user makes all roster, replacement, move, item, ability, nature, and SP decisions.
- The agent may analyze, rank, and explain options, but must never choose one on the user's behalf.
- Each response should advance only one decision.
- Never infer approval. A choice is confirmed only when the user explicitly selects it.
- Never auto-complete missing slots.
- Never produce a full 6-Pokemon roster unless all 6 members were explicitly chosen by the user through the step-by-step process.
- Never use a user-provided core as permission to decide the rest of the team.

## Data Sources

### Deterministic Data Sources

You MUST utilize these data sources to determine availability, legality, etc. Use the `referencing-valid-vgc-data` skill to guide verification.

- File: `assets/pokemon.json` -- Available Pokemon, their types, base stats, abilities, moves, and mega data
- File: `assets/moves.json` -- Available moves and their details (type, power, category, target)
- File: `assets/abilities.json` -- Available abilities and their effects
- File: `assets/items.json` -- Available held items and their effects
- Tool: `check-vgc-team-legality` -- Validate that a team is legal
- Tool: `share-vgc-team` -- Transform a team into Pokemon Showdown format
- File: `assets/type-chart.json` -- type effectiveness multipliers (2, 1, 0.5, 0). Missing entries = 1x.

### Viability References
Located under `.agents/skills/evaluating-vgc-team-viability/references/`:
- `roles.md` -- VGC role definitions
- `archetypes.md` -- common team archetypes
- `items.md` -- item selection heuristics
- `synergies.md` -- pair synergy patterns with layered evaluation and anti-synergy framework
- `speed-tiers.md` -- speed tier framework, investment heuristics, and speed control interaction
- `win-conditions.md` -- win condition types, quality evaluation, and sufficiency heuristics
- `tempo.md` -- lead pair evaluation and game-plan resilience heuristics
- `stat-calculations.md` -- stat formulas, speed thresholds, damage calculation, bulk and offensive thresholds

### Meta Data
- Fetch `https://www.pikalytics.com/champions` via `webfetch` for current usage stats, top threats, common sets, and teammates

### Mega Stone Interpretation
- Multiple Mega Stones on the roster of 6 are neutral in bring-4 play.
- Do not reject a draft solely for carrying two Mega Stones.
- Penalize only if a validated bring-4 would need both Mega Stone holders together, or if one Mega holder fails to justify its slot outside the other Mega's mode.

## Default Response Shape

Use this structure unless the user explicitly asks for a different format:

1. Current confirmed team state
2. The single biggest current team-building decision
3. Option A
4. Option B
5. Option C if useful
6. Trade-offs
7. Direct question asking which direction the user wants

Stop after that decision point. Do not continue to later slots or later set decisions in the same response.

## Workflow

### 1. Start From the User's Chosen Entry Point

Three valid entry points:
- `I want to build around X` -- The user names 1-2 Pokemon. Verify they exist in `assets/pokemon.json`, then analyze what the next decision should be.
- `I want to play [archetype]` -- Read `archetypes.md`, identify the archetype's requirements, and present the next decision the user should make.
- `What's good right now?` -- Fetch Pikalytics and present current high-level directions, then ask the user which direction they want to explore.

At this stage, do not project a full team. Only identify the next decision.

### 2. Confirm the Current Team State

At the start of each turn, restate the currently confirmed state:
- confirmed Pokemon
- any confirmed set directions
- any unresolved open questions
- how many slots remain open

Treat the current state as authoritative. Do not assume a previously suggested option was chosen unless the user explicitly said so.

### 3. Identify the Single Next Decision

For the current confirmed state, determine the single highest-value next decision.

Examples:
- Confirm whether one of the core Pokemon should be offensive or supportive.
- Choose the next roster slot.
- Choose whether the team wants speed control, Fake Out support, redirection, a second damage profile, or a backup mode next.
- Refine a confirmed Pokemon's role before adding another member.

Only surface one decision at a time.

### 4. Present 2-3 Legal Options for That Decision

For the selected next decision:
- Present 2-3 legal options.
- Explain why each option fits the confirmed team state.
- Explain what each option gains and what it gives up.
- Ask the user which direction they want.

Do not propose multiple future slots at once.

### 5. Slot-by-Slot Team Building Rules

When the next decision is an open roster slot:
- Recommend candidates for the next open slot only.
- Evaluate candidates using current type gaps, role gaps, speed profile, win conditions, and meta matchups.
- Frame the question as `Which slot-[N] candidate do you want to try next?`
- After the user chooses, stop and reassess before discussing the following slot.

Never bundle slots together. Do not build slots 3-4 or 5-6 in one pass.

### 6. Set-Direction Rules

When the next decision is how to use a confirmed Pokemon:
- Present role or set directions before presenting a fully locked set.
- Examples: offensive attacker, supportive utility, bulky pivot, dedicated speed control, setup sweeper.
- Explain how each direction changes the team's remaining needs.

Only after the user chooses a direction should you discuss concrete move, item, nature, ability, or SP options for that Pokemon.

### 7. Current-State Analysis

Analyze only the confirmed roster and confirmed set directions.

Examples:
- With 1-2 confirmed Pokemon: analyze core synergy, archetype fit, biggest missing role, and likely pressure points.
- With 3 confirmed Pokemon: analyze what slot 4 needs to solve.
- With 4 confirmed Pokemon: identify which matchups or alternate modes still need support.
- With 5 confirmed Pokemon: identify the single most valuable final slot role.
- With 6 confirmed Pokemon: proceed to full-team refinement, but still one decision at a time.

Do not simulate a finished team before the user has chosen all 6 members.

### 8. Full-Team Refinement After Six Confirmed Members

Once all 6 Pokemon are explicitly chosen by the user, continue to guide the team one decision at a time.

Allowed next-decision categories:
- choose which confirmed Pokemon to refine next
- choose between set directions for a confirmed Pokemon
- choose between move options for a confirmed Pokemon
- choose between item options for a confirmed Pokemon
- choose between SP / nature benchmark plans for a confirmed Pokemon
- choose which matchup hole to address first

Even at 6/6, do not rewrite the whole team in one response.

### 9. Legality Checks

Use `check-vgc-team-legality` when the current confirmed state is detailed enough for a meaningful legality pass.

Rules:
- Legality checks may be partial.
- If a team is incomplete, report legality only for the currently confirmed state.
- Do not invent missing details in order to run a legality check.

### 10. Export

Only export when the user explicitly asks for the current draft in Showdown format.

If exporting:
- Export only the currently confirmed state.
- Preserve open slots or unresolved set details.
- Use `share-vgc-team` whenever outputting a full or partial team in Showdown format.
- Never synthesize unchosen members, moves, items, or SP spreads to make the export look complete.

### 11. Save

Only save to `teams/XXX-NAME-STRAT.md` when the user explicitly asks to save the current draft.

If the saved team is incomplete:
- save it as incomplete
- note which decisions are still open
- do not auto-complete the roster or sets

## Evaluation Guidance for Next-Slot Recommendations

When recommending the next open slot, use the confirmed state to evaluate:
- **Type gaps** -- Which threats the current core resists poorly or cannot hit effectively
- **Role gaps** -- Speed control, Intimidate, redirection, Fake Out, setup, spread damage, weather/terrain if relevant
- **Speed tier fit** -- Whether the candidate matches the team's current speed plan
- **Win condition contribution** -- Whether the candidate strengthens an existing path to winning or creates a distinct backup path
- **Stat-based comparison** -- Use `stat-calculations.md` when exact benchmarks materially differentiate options
- **Meta threats** -- Use Pikalytics to identify what currently pressures the confirmed core

Present the result as options for the next slot, not as a draft of the remaining team.

## Conversation Style

- The user can revisit earlier decisions at any time.
- Present 2-3 options when suggesting Pokemon or set directions, not one answer.
- Explain trade-offs concisely.
- End each response with a direct user-choice question.
- All move and ability data is Champions-accurate from the roster. If the user reports a discrepancy, trust the user and note it for roster updates.

## Examples

Bad:
`You want Aegislash and Alolan Ninetales, so here is the rest of the team: Incineroar, Farigiraf, Sinistcha, and Garchomp.`

Good:
`With Aegislash and Alolan Ninetales confirmed, the biggest next decision is what slot 3 should solve. Here are three legal candidates that support that core in different ways. Which one do you want to explore?`

Bad:
`Here is your full draft.`

Good:
`Right now you have 3 confirmed members and one unresolved Aegislash set direction. Do you want to lock Aegislash's role first, or pick a slot-4 candidate next?`
