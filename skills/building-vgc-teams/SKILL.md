---
name: building-vgc-teams
description: Use when the user wants to build a competitive VGC team for Pokemon Champions, needs help choosing Pokemon, checking type coverage, or evaluating meta matchups
dependencies:
  required:
    - checking-vgc-legality
  optional:
    - evaluating-vgc-viability
    - evaluating-vgc-meta
---

# Building VGC Teams

Conversational team builder for Pokemon Champions VGC. Guides intermediate players through constructing a 6-Pokemon team, analyzing its strengths and weaknesses, and exporting in Showdown paste format.

## Dependency Check

Before starting, verify that required skill directories exist.

- **checking-vgc-legality (required):** If this skill's directory is missing, stop and tell the user: "This skill requires the checking-vgc-legality skill. Please install it before continuing." Do not proceed.
- **evaluating-vgc-viability (optional):** If missing, continue without strategic reference data. Skip synergy scans, archetype references, and role checklists. Do not mention these features to the user.
- **evaluating-vgc-meta (optional):** If missing, continue without meta context. Use generic, stat-based assessments (e.g., "above-average speed") instead of meta-relative ones (e.g., "faster than Garchomp, a top threat"). Skip threat lists and meta matchup mapping.

## Data Sources

### From checking-vgc-legality (REQUIRED -- stop if skill is missing)
- `champions-roster.json` -- legal Pokemon with types, base stats, abilities, moves, and mega data
- `type-chart.json` -- type effectiveness multipliers (2, 1, 0.5, 0). Missing entries = 1x.
- `moves.json` -- move details (type, category, power, accuracy, priority, target, effect)
- `abilities.json` -- ability effects
- `items.json` -- held item details (category, effect)

### From evaluating-vgc-viability (optional -- degrade gracefully if missing)
- `reference/roles.md` -- VGC role definitions
- `reference/archetypes.md` -- common team archetypes
- `reference/items.md` -- item selection heuristics
- `reference/synergies.md` -- pair synergy patterns with layered evaluation and anti-synergy framework
- `reference/speed-tiers.md` -- speed tier framework, investment heuristics, and speed control interaction
- `reference/win-conditions.md` -- win condition types, quality evaluation, and sufficiency heuristics
- `reference/tempo.md` -- lead pair evaluation and game-plan resilience heuristics
- `reference/stat-calculations.md` -- stat formulas, speed thresholds, damage calculation, bulk and offensive thresholds

### From evaluating-vgc-meta (optional -- degrade gracefully if missing)
- Pikalytics fetch for current usage stats, top threats, common sets, and teammates

## Workflow

### 1. Ask the user how to start

Three entry points:
- **"I want to build around X"** -- User names 1-2 Pokemon. Verify they're in the roster (from checking-vgc-legality). Proceed to Foundation.
- **"I want to play [archetype]"** -- If evaluating-vgc-viability is available, load archetypes.md and present the relevant core. Otherwise, work with the user's description of the archetype. Proceed to Foundation.
- **"What's good right now?"** -- If evaluating-vgc-meta is available, fetch Pikalytics and present top-usage Pokemon and common cores. Otherwise, ask the user what Pokemon or strategies they've been seeing. Let the user pick a direction.

### 2. Foundation (slots 1-2)

Establish the team's core pair. For each Pokemon:
1. Verify it's in champions-roster.json (from checking-vgc-legality)
2. Read its abilities and moves from the roster. Look up move details in moves.json and ability effects in abilities.json as needed.
3. Suggest a competitive set (moves, ability, item) as a starting point
4. Explain why these two work together (type synergy, role coverage, archetype fit)
5. Note what role each plays in a bring-4 context -- these two will likely appear in most bring-4 groups. Example: "Garchomp is your primary attacker, Whimsicott is your speed control -- expect to bring both in most games."

### 3. Build Out (slots 3-4) -- Complete the Core-4

The goal is to complete your default bring-4 group. Identify gaps in the current pair:
1. **Type gaps** -- Read type-chart.json + roster types (from checking-vgc-legality). Which types can the team not resist? Which types can't the team hit super-effectively?
2. **Role gaps** -- If evaluating-vgc-viability is available, load roles.md. Does the team have speed control? Intimidate? Redirection? Fake Out? If unavailable, assess role coverage based on the team's moves and abilities directly.
3. **Speed tier fit** -- If evaluating-vgc-viability is available, load `reference/speed-tiers.md`. Does the candidate's speed tier fit the team's speed control plan? A mid-tier attacker is ideal for a Tailwind team; a Trick Room-tier attacker suits a TR team. Avoid adding Pokemon whose speed tier conflicts with the team's speed control mode (e.g., a blazing-tier Pokemon on a Trick Room team with no fast mode). If evaluating-vgc-viability is unavailable, assess speed fit by comparing the candidate's base Speed in the roster against the team's speed control options.
4. **Win condition contribution** -- If evaluating-vgc-viability is available, load `reference/win-conditions.md`. Does the candidate contribute to an existing win condition (e.g., a spread attacker that adds to spread pressure) or enable a new one (e.g., a setup sweeper that gives the team a second path to winning)? Prefer candidates that strengthen existing win conditions or add independent ones over candidates that just fill a type gap. If evaluating-vgc-viability is unavailable, assess win condition contribution based on the candidate's offensive stats, setup moves, and how it interacts with existing team members.
5. **Stat-based comparison** -- If evaluating-vgc-viability is available and two candidates are in the same speed tier or fill a similar role, load `reference/stat-calculations.md`. Use Speed Thresholds to determine exactly which threats each candidate outspeeds. Use Offensive Thresholds to compare what each candidate can KO at equivalent investment levels. This turns "both hit hard" into concrete matchup comparisons. If evaluating-vgc-viability is unavailable, compare base stats directly from the roster.
6. **Meta threats** -- If evaluating-vgc-meta is available, fetch Pikalytics to identify which top-usage Pokemon threaten the current core. If unavailable, identify threats based on type matchups and common offensive types.

For each gap, suggest 2-3 Pokemon from the roster that address it. Evaluate candidates as "which Pokemon makes the strongest group of 4 with your existing core pair?" Prefer Pokemon that fill multiple gaps. Present trade-offs. When suggesting, if evaluating-vgc-viability is available, load `reference/synergies.md` and call out offensive combos (e.g., "Garchomp gives you Earthquake + your Corviknight is immune to it"), defensive pivot pairs, or mode pairs that the new Pokemon enables.

**After slot 4 is chosen, present a core-4 summary:** "Your default bring is [A, B, C, D]. This group has [roles covered: speed control, Fake Out, spread damage, etc.]. It struggles against [specific threats or archetypes the core-4 can't handle]." This summary frames slots 5-6 as solving those problems.

### 4. Alternate Mode Slots (5-6)

Slots 5-6 enable alternate modes for matchups the core-4 struggles against. Reference the core-4 summary from step 3.

For each slot, suggest 2-3 Pokemon framed as swap-ins:
- **Name which core-4 member it replaces** and in what matchup. Example: "Swap Torkoal in for Whimsicott against Trick Room teams -- Torkoal gives you a Trick Room mode with Hatterene instead of a Tailwind mode."
- **Describe the alternate mode it creates.** What is the game plan for the resulting group of 4? How does it differ from the core-4's plan?
- **Pair synergy** -- does the new Pokemon form strong mode pairs or offensive combos with the remaining core members? If evaluating-vgc-viability is available, reference synergy patterns from synergies.md. A Pokemon that enables a coherent alternate mode is better than one that just fills a type gap.

If the team only has one viable mode after both slots are filled, flag it: "Your team currently brings the same 4 every game. Consider [alternative Pokemon] for slot [N] to give you a [description] mode against [matchup]."

**Alternate Mega candidates:** If the core-4 includes a Mega Stone carrier (the primary Mega), at least one slot 5-6 candidate across both rounds should be Mega-eligible (has a `mega` field in champions-roster.json) with a Mega form that addresses the primary Mega's bad matchups. If none of the organic candidates are Mega-eligible, add one as an additional option (the list grows from 2-3 to 3-4 candidates for that slot). Prioritize candidates whose Mega form counter-types what counters the primary Mega. Note if the candidate also enables a different game plan as a secondary benefit.

When presenting a Mega-eligible candidate:
- Note it carries a Mega Stone and **replaces the primary Mega in the bring-4** -- two Mega Stone carriers must never appear in the same bring-4 group.
- Explain what the Mega form addresses and which specific counters to the primary Mega it handles. Example: "Mega Scizor threatens the Fairy types that wall Mega Feraligatr's Dragonize."
- If the user declines the alternate Mega for both slots, accept the decision and move on. The alternate Mega is always a recommendation, never forced.

### 5. Set Refinement

For each of the 6 Pokemon, suggest a starting set:
- Ability
- Held item
- 4 moves
- Nature
- EVs: If evaluating-vgc-viability is available, load `reference/stat-calculations.md` and use the Benchmark-First EV Spread Procedure (Section 4). For each Pokemon: (1) identify 1-2 key attacks it must survive and calculate minimum HP/Def/SpD investment, (2) identify 1-2 key speed targets and calculate minimum Speed investment, (3) allocate remaining EVs to offense, (4) verify the resulting offensive stat still achieves needed KOs. If evaluating-vgc-viability is unavailable, suggest a simple spread like 252/252/4 as a baseline.

Build sets from the Pokemon's available moves and abilities in champions-roster.json (from checking-vgc-legality). Look up move details (type, power, category) in moves.json.

**Item selection:** If evaluating-vgc-viability is available, load `reference/items.md` for selection heuristics. For each Pokemon, suggest an item based on its role and the team's existing items. Verify the item exists in `items.json` (from checking-vgc-legality). Enforce no duplicate items across the team. If a Pokemon is Mega-eligible and the team doesn't already have a Mega, consider whether the Mega Stone is worth the item slot.

If evaluating-vgc-meta is available, cross-reference with Pikalytics common sets. The user customizes from here.

**Mode-aware sets:** Consider which bring-4 groups each Pokemon participates in. Pokemon appearing in multiple modes should have versatile sets (e.g., balanced EV spreads, moves useful in both game plans). Pokemon appearing in only one mode can be more specialized (e.g., min-speed Torkoal for Trick Room mode only). Mention this trade-off when it's relevant to the set choice, not for every Pokemon.

### 6. Team Analysis

Run all applicable analysis layers. Present results clearly.

**Type Coverage Matrix:**

Defensive -- for each team member, list weaknesses and resistances using type-chart.json (from checking-vgc-legality). Flag any type that hits 3+ team members super-effectively.

Offensive -- for each team member's STAB types + main coverage moves, list what types the team hits super-effectively. Flag types the team has no super-effective coverage against.

**Pair Synergy Scan (requires evaluating-vgc-viability):**

If evaluating-vgc-viability is available, load `reference/synergies.md`. For each of the 15 possible pairs on the team, check the pair against each synergy category (offensive combos, defensive pivot pairs, mode pairs) using the team's actual moves, abilities, and types from the data files (from checking-vgc-legality).

Do not list all 15 pairs. Present only the notable findings:

*Top synergy pairs (2-3 best):* Identify the pairs with the strongest synergies. For each, name the pair, state the synergy category, and explain what they do together. Example: "Sableye + Feraligatr (Mode Pair: Fake Out + Dragon Dance setup. Sableye also has Helping Hand to boost Feraligatr's attacks after it's set up.)"

*Anti-synergy flags:* Identify pairs that are actively bad together on the field. Shared weaknesses with no cross-coverage, redundant roles (two redirectors, two Fake Out users with nothing to enable), or conflicting strategies (Tailwind setter paired with a Trick Room setter and no plan to use both modes). Only flag pairs where the anti-synergy is meaningful -- two Pokemon sharing one weakness is normal, two Pokemon sharing three weaknesses with no cross-coverage is a flag.

*Missing synergy gaps:* Check whether the team is missing synergy patterns that its archetype typically wants. Reference the team's archetype from `reference/archetypes.md` (from evaluating-vgc-viability) if one was chosen in step 1. Examples: a hyper offense team with no Fake Out + setup pair, a rain team with no spread move + immunity combo, a team with setup sweepers but no redirector or Fake Out user to enable them. Not every team needs every pattern -- flag gaps as observations, not failures.

If evaluating-vgc-viability is unavailable, skip the Pair Synergy Scan entirely.

**Bring-4 Mode Analysis:**

Identify and validate the team's bring-4 groups.

*1. Identify modes.* Name the core-4 (the default bring group established in step 3) and any alternate modes enabled by slots 5-6. A "mode" is a group of 4 with a coherent game plan (fast offense, Trick Room, anti-weather, etc.). Alternate modes swap 1-2 members from the core-4. List each mode with its 4 members and one-line game plan. If the team has two Mega Stone carriers, identify any mode that swaps the primary Mega out for the alternate Mega. Name it explicitly as a Mega-swap mode. Example: "Alternate Mega mode: swap Feraligatr for Scizor. Mega evolve Scizor. Game plan: Steel-type offensive pressure against Fairy-heavy teams." Two Mega Stone carriers must never appear in the same bring-4 group.

*2. Validate each mode.* For each mode, check:
- Does this group of 4 have speed control?
- Does it have a win condition (setup sweeper, spread damage, etc.)?
- Are there critical type gaps (a type hitting 3+ of the 4 super-effectively with no resist among them)?
- Does it have pair synergy (Fake Out + setup, redirect + sweeper, etc.)?

Flag modes missing something critical. If a mode fails validation (e.g., no speed control and no way to deal damage before the opponent moves), say so directly and suggest a fix. When validating an alternate-Mega mode, evaluate using the alternate Mega's Mega stats and ability from champions-roster.json (not its base form). The primary Mega is benched in this mode and irrelevant to validation.

*3. Map modes to matchups.* If evaluating-vgc-meta is available, use Pikalytics meta threats to suggest which mode to bring against common archetypes. Format as: "Against [archetype/threat]: bring [mode name] -- swap [Pokemon] in for [Pokemon]. [One sentence explaining why.]" Explicitly map alternate-Mega modes to the matchups that counter the primary Mega. Example: "Against Fairy-heavy teams: bring Alternate Mega mode -- swap Feraligatr for Mega Scizor. Scizor's Steel STAB threatens Fairies that wall Dragonize."

If evaluating-vgc-meta is unavailable, map modes to general type-based matchups instead of specific meta archetypes.

*4. Mode coverage gaps.* If evaluating-vgc-meta is available and a common meta archetype (from Pikalytics top-usage trends) has no good mode answer, flag it and suggest a fix: a move/item change on an existing member, or a slot 5-6 replacement that would create a viable mode for that matchup. If the team has no alternate Mega and the primary Mega is countered by a common meta archetype, flag it specifically: "Your primary Mega [X] is countered by [archetype] and you have no alternate Mega mode. Consider adding [Mega-eligible Pokemon] in slot [N]."

If evaluating-vgc-meta is unavailable, assess mode coverage gaps based on type matchups only.

**Threat List (requires evaluating-vgc-meta):**

If evaluating-vgc-meta is available, fetch Pikalytics top-usage Pokemon. For each high-usage threat:
- Which team members handle it well?
- Which team members lose to it?
- If the team has no good answer, suggest counterplay (move change, item swap, or team member replacement)

If evaluating-vgc-meta is unavailable, skip the Threat List entirely.

**Role Checklist (requires evaluating-vgc-viability):**

If evaluating-vgc-viability is available, load roles.md. Check which roles the team covers:
- [ ] Speed control
- [ ] Intimidate / Attack drops
- [ ] Redirection
- [ ] Fake Out
- [ ] Setup
- [ ] Spread damage
- [ ] Weather/Terrain (if relevant to the archetype)

Not every team needs every role. Flag gaps as information, not failures.

If evaluating-vgc-viability is unavailable, skip the Role Checklist entirely.

**Win Condition Assessment (requires evaluating-vgc-viability):**

If evaluating-vgc-viability is available, load `reference/win-conditions.md`. Identify the team's win conditions and evaluate them.

*1. Identify win conditions.* For each win condition type in win-conditions.md, check whether the team has it:
- Setup sweeper? Which Pokemon, which setup move, which enabler?
- Spread pressure? Which pair, which spread moves?
- Weather/terrain engine? Which setter + abuser?
- Trick Room flip? Which setter + which slow attackers?
- Attrition elements? Intimidate cycling, recovery, status?
- Single-target burst? Fast attackers that can focus-fire?

*2. Evaluate quality.* For each identified win condition, assess dependency count, disruption resilience, turn count, and independence per win-conditions.md. Flag win conditions that are high-dependency or vulnerable to common counterplay.

*3. Check sufficiency.* Does the team have at least 2 independent win conditions? Are they in different bring-4 modes? Do they share failure points? Reference archetype expectations from win-conditions.md.

If the team has only one win condition, flag it: "This team has one path to winning — [description]. If [common disruption] shuts it down, there's no backup. Consider adding [type of win condition] through [specific suggestion]."

If evaluating-vgc-viability is unavailable, skip the Win Condition Assessment entirely.

**Lead & Resilience Check (requires evaluating-vgc-viability):**

If evaluating-vgc-viability is available, load `reference/tempo.md`. Evaluate lead pairs and Plan B resilience for each bring-4 mode identified in the Bring-4 Mode Analysis above.

*1. Evaluate leads.* For each mode's natural lead pair, assess:
- Complementary Turn 1 actions (do both Pokemon have useful, non-conflicting Turn 1 moves?)
- Threat projection (does the lead force the opponent into difficult choices?)
- Flexibility under disruption (what happens if the opponent blocks the primary plan?)
- Match the lead to a lead-pair pattern from tempo.md (Fake Out + Attacker/Setter, Dual Offense, Redirect + Setup, Speed Control + Attacker) and note strengths/weaknesses of that pattern.

*2. Assess Plan B resilience.* Run through tempo.md's disruption scenarios:
- Lead Pokemon KO'd Turn 1: does an alternate mode survive?
- Speed control denied: is there a backup?
- Weather overwritten (if relevant): can the team function without weather?
- Setup denied (if relevant): is there a non-setup win condition?

Flag any scenario where the team has zero path to winning. Suggest structural fixes (alternate mode Pokemon, backup speed control, non-setup attackers).

If evaluating-vgc-viability is unavailable, skip the Lead & Resilience Check entirely.

### 7. Export

Output the team in Showdown paste format:

```
[Pokemon] @ [Item]
Ability: [Ability]
Level: 50
EVs: [HP] HP / [Atk] Atk / [Def] Def / [SpA] SpA / [SpD] SpD / [Spe] Spe
[Nature] Nature
- [Move 1]
- [Move 2]
- [Move 3]
- [Move 4]
```

Rules: Level 50, EVs total 508 max, no duplicate items, no duplicate Pokemon.

## Conversation Style

- The user can jump around: swap a Pokemon, revisit an earlier slot, re-run analysis, or change direction at any time
- Present 2-3 options when suggesting Pokemon, not a single "correct" answer
- Explain trade-offs concisely -- the user understands VGC basics
- All move and ability data is Champions-accurate from Serebii. If the user reports a discrepancy, trust the user and note it for roster updates.
