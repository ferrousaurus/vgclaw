---
name: review-vgc-team
description: Use when the user wants to evaluate or tweak an existing competitive VGC team for Pokemon Champions.
---

# Reviewing VGC Teams

Evaluate an existing Pokemon Champions VGC team and produce ranked, user-selectable recommendations.

This skill is advisory only. Its job is to help the user decide what to change, not to decide for them.

## Decision Authority

- The user owns all roster, replacement, move, item, ability, nature, and SP decisions.
- The agent may analyze, rank, and explain options, but must never choose one on the user's behalf.
- Every recommendation set must end with a clear question asking the user which direction they want.
- Never infer approval. A change is accepted only when the user explicitly selects it.
- Never auto-fill an open slot. Partial teams, open slots, unresolved replacements, and incomplete sets are valid working states during review.
- Never output an updated Showdown paste unless the user explicitly asks for it.

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
- Do not penalize a team solely for carrying two Mega Stones.
- Penalize only if a validated bring-4 would need both Mega Stone holders together, or if one Mega holder fails to justify its slot outside the other Mega's mode.

## Default Response Shape

Use this structure unless the user explicitly asks for a different format:

1. Current assessment
2. Most important issue or decision point
3. Option A
4. Option B
5. Option C if needed
6. Trade-offs
7. Direct question asking which direction the user wants

Do not continue past that decision point in the same response.

## Workflow

### 1. Parse & Validate

The user provides a team in Showdown paste format. Parse it into structured data (Pokemon name, item, ability, SPs, nature, moves).

**Partial teams:** If the paste contains fewer than 6 Pokemon, accept it and evaluate what's there. Flag the incomplete roster in the assessment and skip any analysis that requires more confirmed members. Do not prompt the user to fill missing slots unless they ask for next-step guidance.

Validate that the team is legal with the `check-vgc-team-legality` tool.

Flag any validation errors before proceeding. If a Pokemon isn't in the roster, ask the user whether to proceed with partial evaluation (skip that Pokemon) or correct the paste.

### 2. Archetype Detection & Confirmation

Auto-detect the team's archetype by checking for signals. Read `archetypes.md` from `.agents/skills/evaluating-vgc-team-viability/references/` for archetype definitions.

- **Rain:** Drizzle user present? Swift Swim or rain abusers on the team?
- **Sun:** Drought user present? Chlorophyll users or sun abusers?
- **Sand:** Sand Stream user present? Sand Rush users present?
- **Snow:** Snow Warning user present? Slush Rush or Aurora Veil users present?
- **Trick Room:** Trick Room setter present? Multiple Pokemon with base Speed under 50?
- **Hyper Offense:** Multiple setup moves, Fake Out support, Tailwind, and strong offensive stats?
- **Goodstuffs/Balance:** No strong archetype signals; versatile Pokemon and mixed utility?

Present the assessment as a hypothesis, not a decision: `This looks like a [archetype] team built around [core Pokemon]. Is that the direction you want me to evaluate it against?`

If the user corrects the archetype, use the user's intent for all later analysis.

### 3. Summary Verdict

Run a quick pass across the applicable analysis layers to identify headline strengths and issues. Present a high-level summary before deeper analysis.

Format the summary as:

> **Team: [Archetype] built around [core Pokemon]**
>
> **Strengths (2-3 bullets):** What the team already does well.
>
> **Top Issues (2-3 bullets, ranked):** The most impactful current problems.
>
> **Recommended next decision:** The single highest-value area to inspect next.
>
> *`Do you want to dig into [recommended area], or choose another area: Type Coverage, Pair Synergies, Bring-4 Modes, Meta Threat Matchups, Role Checklist, Set Optimization, Win Conditions, Lead & Resilience?`*

Only list drill-down areas whose dependencies are available.

If the team has fewer than 6 Pokemon, state that clearly: `This team currently has N/6 confirmed slots.`

### 4. Analysis Layers

Each layer follows the same interaction pattern:

1. Findings
2. Problem statement
3. Lowest-disruption options first
4. If escalation is needed, 2-3 legal swap candidates
5. Short trade-offs
6. Explicit question asking which option the user wants

The user can drill into any layer in any order. Do not move on to another layer automatically after giving options.

Fix tiers, in order:
1. Move change
2. Item change
3. Ability change
4. SP/Nature adjustment
5. Pokemon replacement candidates

#### Layer 1: Type Coverage

**Defensive:** For each team member, list weaknesses and resistances using `assets/type-chart.json`. Flag any type that hits 3+ team members super-effectively.

**Offensive:** For each team member's STAB types plus coverage moves, list what the team hits super-effectively. Flag types the team cannot hit super-effectively.

**Recommendation rules:**
- If a coverage gap can be fixed on an existing member, present 1-3 move options before suggesting a swap.
- If a defensive weakness cluster is severe enough to justify a replacement, present 2-3 replacement candidates with trade-offs.
- Never say `replace X with Y` unless the user has already chosen `Y`.

#### Layer 2: Pair Synergies

Read `synergies.md`. Check each possible pair on the team against the relevant synergy categories using the team's actual moves, abilities, and types.

Present only notable findings:
- Top synergy pairs (2-3 best)
- Anti-synergy flags
- Missing synergy gaps relative to the archetype

**Recommendation rules:**
- If the issue is caused by one move or item, present low-disruption alternatives first.
- If the archetype is missing a critical synergy pattern, present 2-3 replacement candidates that create that pattern.
- Each candidate must explain what it adds, what it costs, and which current slot it would compete with.

#### Layer 3: Bring-4 Modes

Skip this layer if the team has fewer than 4 Pokemon.

Identify the current default mode and any alternate modes enabled by the confirmed roster. Validate each mode for speed control, win condition, critical type gaps, and pair synergy.

Map modes to common matchups using current meta data when available.

**Recommendation rules:**
- If a mode is weak, suggest the smallest change first.
- If the problem requires a roster change, present 2-3 candidates that create a better mode and explain which confirmed slot each would compete with.
- Do not assume the user wants to preserve all current members if they are actively considering cuts, but do not remove any member without explicit approval.

#### Layer 4: Meta Threat Matchups

Fetch Pikalytics for top-usage threats. For each important threat:
- Which team members handle it well?
- Which members lose to it?
- Whether the team lacks a plausible answer

**Recommendation rules:**
- For shaky matchups, present move/item/SP adjustments first.
- For missing answers, present 2-3 replacement candidates that solve the matchup in different ways.
- Each candidate must state the trade-off against the current team plan.

#### Layer 5: Role Checklist

Read `roles.md`. Check which roles the team covers:
- Speed control
- Intimidate / Attack drops
- Redirection
- Fake Out
- Setup
- Spread damage
- Weather/Terrain if relevant

Evaluate gaps against the confirmed archetype. Flag gaps as observations, not failures.

**Recommendation rules:**
- If an existing team member can fill the missing role, present the relevant move or set-direction options first.
- If no confirmed member can fill the role, present 2-3 replacement candidates.

#### Layer 6: Set Optimization

Review each confirmed Pokemon's set for internal consistency and fit with the team's current plan.

Check:
- Ability
- Item
- Moves
- SPs/Nature

Use `stat-calculations.md` for exact benchmarks when recommending SP or nature changes.

**Recommendation rules:**
- Present set directions and small edits as user-selectable options.
- Set optimization should not force roster changes. If a roster issue is discovered, point the user back to the relevant layer and present it as a separate decision.

#### Layer 7: Win Condition Assessment

Read `win-conditions.md`. Identify the team's current win conditions and evaluate their independence, resilience, and sufficiency.

**Recommendation rules:**
- If a win condition is fragile, present the smallest fixes first.
- If the team lacks a second credible win condition, present 2-3 candidates that would create one and explain how each changes the team's structure.

#### Layer 8: Lead & Resilience Check

Read `tempo.md`. Evaluate lead pairs for each validated mode and assess fallback plans if the first line is disrupted.

**Recommendation rules:**
- If a lead is brittle, present move/item/set-direction fixes first.
- If the team has no viable fallback mode, present 2-3 replacement candidates that improve resilience.

### 5. Change Tracking

Track only changes the user explicitly accepts.

Accepted changes may include:
- a move change
- an item change
- an ability change
- an SP or nature change
- a confirmed Pokemon removal
- a confirmed Pokemon addition

Do not add implied follow-up changes. Example: if the user accepts `remove Sinistcha`, record only the removal. Do not choose a replacement until the user selects one.

### 6. Export

Only export when the user explicitly asks for an updated paste or current draft.

If exporting:
- Include only explicitly accepted changes.
- Preserve any open slots or unresolved set details.
- If the roster is incomplete, output it as incomplete rather than synthesizing a finished team.
- Use `share-vgc-team` whenever you output a full or partial team in Showdown format.

### 7. Save

Only save to `teams/XXX-NAME-STRAT.md` when the user explicitly asks to save the current draft.

If the saved team is incomplete, preserve it as incomplete and note that in the file's analysis text. Never auto-fill missing roster decisions in order to save.

## Conversation Style

- The user can jump between layers, revisit analysis, accept or reject fixes freely.
- Present 2-3 options when suggesting roster changes, not one answer.
- Explain trade-offs concisely.
- Always stop after presenting the current decision set and wait for the user's selection.
- All move and ability data is Champions-accurate from the roster. If the user reports a discrepancy, trust the user and note it for roster updates.

## Examples

Bad:
`Remove Sinistcha. Replace it with Archaludon.`

Good:
`If you want to replace Sinistcha, here are three legal candidates that solve different problems. Which direction do you want to take?`

Bad:
`Here is the revised team.`

Good:
`So far you've confirmed these changes: [list]. Do you want me to export the current draft, or keep evaluating options?`
