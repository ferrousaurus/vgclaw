---
name: review-vgc-team
description: Use when the user wants to review an existing VGC team for Pokemon Champions.
---

# Reviewing VGC Teams

Evaluate an existing Pokemon Champions VGC team; produce ranked, user-selectable recommendations.

## Decision Authority

`AGENTS.md` > Advisory Contract governs authority. This skill adds:

- Every recommendation set must end with a clear question asking the user which direction they want.
- Never output an updated Showdown paste unless the user explicitly asks for it.

## Data Sources

- **Legality & availability:** Use the `referencing-valid-vgc-data` skill for every Pokemon, move, ability, item, and type-chart lookup.
- **Viability heuristics:** Roles, archetypes, items, synergies, speed tiers, win conditions, tempo, and stat calculations live in the `evaluating-vgc-team-viability` skill and its `references/`. Use them across the analysis layers below.
- **Meta data:** Fetch `https://www.pikalytics.com/champions` via `webfetch` when available; use documented static proxy only when unavailable.
- **Mega Stones:** See `evaluating-vgc-team-viability` > `items.md` > Mega Stones for the bring-4 interpretation, including when two Megas become a problem.

## Default Response Shape

Use this structure unless the user explicitly asks for a different format:

1. Current assessment
2. Most important issue or decision point
3. Option A
4. Option B
5. Option C if needed
6. Trade-offs
7. Direct question asking which direction the user wants

Stop after that decision.

## Workflow

### 1. Parse & Validate

Parse Showdown paste into Pokemon name, item, ability, SPs, nature, and moves:

1. **Convert EVs to SPs:** Divide each EV value by 8 and round down. Verify the total does not exceed 66 SPs. Example: `252 HP EVs` = `31 HP SPs` (since 252 / 8 = 31.5, round down to 31).
2. **Ignore IV lines:** All IVs are fixed to 31 in Champions. Never reference IV manipulation.
3. **Interpret `IVs: 0 Spe`:** In Champions, this means 0 Speed SPs + a Speed-hindering nature (Brave, Quiet, Relaxed, or Sassy). **Verify the nature is one of these four.** If the nature is neutral or Speed-boosting, flag a **Stat Efficiency** conflict — do not assume the nature should be changed.
4. **Assume Level 50:** If the paste lacks a level line, assume Level 50.
5. **Validate totals:** After conversion, ensure no stat exceeds 32 SPs and the sum of all SPs does not exceed 66.

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

Each layer is a user-selected **drill-down**. Run its pattern, then stop; never auto-advance.

Layer interaction pattern:

1. Findings
2. Problem statement
3. Lowest-disruption options first
4. If escalation is needed, 2-3 legal swap candidates
5. Short trade-offs
6. Explicit question asking which option the user wants

Within a layer, escalate by **fix-tier**; try least-disruptive option before replacement:

1. Move change
2. Item change
3. Ability change
4. SP/Nature adjustment
5. Pokemon replacement candidates

Present fix-tier 1–4 options before any tier-5 swap candidate; only offer a swap if the lower tiers cannot solve the problem.

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

Track only explicitly accepted changes.

Accepted changes may include:
- a move change
- an item change
- an ability change
- an SP or nature change
- a confirmed Pokemon removal
- a confirmed Pokemon addition

Do not add implied follow-up changes. Example: if the user accepts `remove Sinistcha`, record only the removal. Do not choose a replacement until the user selects one.

### 6. Export & Save

Export only on explicit updated-paste/current-draft request. Follow `AGENTS.md` > Team Output & Storage and `teams/XXX-NAME.md`; include only accepted changes and mark incomplete teams incomplete.

## Conversation Style

- The user can jump between layers, revisit analysis, accept or reject fixes freely.
- Always stop after presenting the current decision set and wait for the user's selection.

## Examples

Bad:
`Remove Sinistcha. Replace it with Archaludon.`

Good:
`If you want to replace Sinistcha, here are three legal candidates that solve different problems. Which direction do you want to take?`

Bad:
`Here is the revised team.`

Good:
`So far you've confirmed these changes: [list]. Do you want me to export the current draft, or keep evaluating options?`
