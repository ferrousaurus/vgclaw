---
name: review-vgc-team
description: Use when the user wants to evaluate or tweak an existing competitive VGC team for Pokemon Champions.
---

# Reviewing VGC Teams

Evaluate an existing  Pokemon Champions VGC team.

Auto-detect the team's archetype, present a summary verdict, and let me drill into analysis layers with tiered fix suggestions. Output a revised Showdown paste with a change diff when done.

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

## Workflow

### 1. Parse & Validate

The user provides a team in Showdown paste format. Parse it into structured data (Pokemon name, item, ability, SPs, nature, moves).

**Partial teams:** If the paste contains fewer than 6 Pokemon, accept it and evaluate what's there. Flag the incomplete roster in the summary verdict ("This team has N/6 slots filled") and skip bring-4 mode analysis if there are fewer than 4 Pokemon. Do not prompt the user to add more -- they may be evaluating a core before filling remaining slots.

Validate that the team is legal with the `check-vgc-team-legality` tool.

Flag any validation errors before proceeding. If a Pokemon isn't in the roster, ask the user whether to proceed with partial evaluation (skip that Pokemon) or correct the paste.

### 2. Archetype Detection & Confirmation

Auto-detect the team's archetype by checking for signals. Read `archetypes.md` from `.agents/skills/evaluating-vgc-team-viability/references/` for archetype definitions.

- **Rain:** Drizzle user (Politoed, Pelipper) present? Swift Swim or rain abusers on the team?
- **Sun:** Drought user (Torkoal, Ninetales) present? Chlorophyll users or sun abusers?
- **Sand:** Sand Stream user (Tyranitar, Hippowdon) present? Sand Rush users (Excadrill)?
- **Snow:** Snow Warning user (Abomasnow) present? Slush Rush or Aurora Veil users?
- **Trick Room:** TR setter present (check roster for Trick Room in moves)? Multiple Pokemon with base Speed under 50?
- **Hyper Offense:** Multiple setup moves (Swords Dance, Dragon Dance, Nasty Plot, Calm Mind, Quiver Dance), Fake Out support, Tailwind, high offensive base stats across the board?
- **Goodstuffs/Balance:** No strong archetype signals -- versatile Pokemon, mixed speed tiers, Intimidate support.

Present the assessment: *"This looks like a [archetype] team built around [core Pokemon]. Is that what you're going for?"*

If the user corrects the archetype, reframe all subsequent analysis against the stated intent. If the archetype is ambiguous (e.g., both Tailwind and Trick Room elements), name it as a dual-mode team and confirm which mode is primary.

The detected (or corrected) archetype informs all subsequent analysis -- what roles are expected, which synergy gaps matter, and how to evaluate bring-4 modes.

### 3. Summary Verdict

Run a quick pass across all applicable analysis layers to identify the headline strengths and issues. Present a high-level summary before any deep analysis.

**Format:**

> **Team: [Archetype] built around [core Pokemon]**
>
> **Strengths (2-3 bullets):** What the team does well -- e.g., "Strong Fake Out + Dragon Dance setup mode with Sableye/Feraligatr," "Good type diversity across the 6," "Multiple speed control options."
>
> **Top Issues (2-3 bullets, ranked by severity):** The most impactful problems -- e.g., "No answer to top-usage [threat]," "Only one viable bring-4 mode," "Duplicate roles with no Intimidate."
>
> **Drill-down areas:**
> 1. Type Coverage
> 2. Pair Synergies
> 3. Bring-4 Modes
> 4. Meta Threat Matchups
> 5. Role Checklist
> 6. Set Optimization
> 7. Win Condition Assessment
  > 8. Lead & Resilience Check
>
> *"Which area do you want to dig into, or should I go through them in order?"*

Only list drill-down areas whose dependencies are available.

The summary requires fetching Pikalytics via `webfetch` to identify the top issues. If the team has fewer than 6 Pokemon, note it here: "This team has N/6 slots filled."

### 4. Analysis Layers (Drill-Down)

Each layer follows the same pattern: **findings -> problems flagged -> tiered fix suggestions.** The user can drill into any layer in any order.

Fix tiers (used across all layers, in priority order -- always start with the least disruptive):
1. Move change
2. Item change
3. Ability change
4. SP/Nature adjustment
5. Pokemon swap (present 2-3 candidates from the roster with trade-offs)

#### Layer 1: Type Coverage

**Defensive:** For each team member, list weaknesses and resistances using `assets/type-chart.json`. Flag any type that hits 3+ team members super-effectively.

**Offensive:** For each team member's STAB types (determined by the Pokemon's types from `assets/pokemon.json`) + coverage moves (non-STAB attacking moves in the set), list what types the team hits super-effectively. Look up move types using `assets/moves.json`. Flag types the team has no super-effective coverage against.

**Fixes:**
- Offensive type hole -> suggest a coverage move swap on the team member best positioned to learn a move of the missing type (check their available moves via `assets/pokemon.json`). Tier 1 fix.
- A type hitting 3 members SE -> flag as a concern, suggest resistance berry or item change if applicable. Tier 2 fix.
- A type hitting 4+ members SE with no resist on the team -> escalate to a Pokemon swap suggestion. Identify 2-3 roster Pokemon that resist the problematic type and fill a similar role to the weakest link. Tier 5 fix.

#### Layer 2: Pair Synergies

Read `synergies.md` from `.agents/skills/evaluating-vgc-team-viability/references/`. For each of the 15 possible pairs on the team (or fewer for partial teams), check the pair against each synergy category using the team's actual moves, abilities, and types via the deterministic tools.

Do not list all pairs. Present only the notable findings:

**Top synergy pairs (2-3 best):** Identify the pairs with the strongest synergies. For each, name the pair, state the synergy category, and explain what they do together. Example: "Sableye + Feraligatr (Mode Pair: Fake Out + Dragon Dance setup. Sableye also has Helping Hand to boost Feraligatr's attacks after it's set up.)"

**Anti-synergy flags:** Identify pairs that are actively bad together on the field. Shared weaknesses with no cross-coverage, redundant roles (two redirectors, two Fake Out users with nothing to enable), or conflicting strategies (Tailwind setter paired with a Trick Room setter and no plan to use both modes). Only flag pairs where the anti-synergy is meaningful -- two Pokemon sharing one weakness is normal, two Pokemon sharing three weaknesses with no cross-coverage is a flag.

**Missing synergy gaps:** Check whether the team is missing synergy patterns that its archetype typically wants. Reference the detected archetype from `archetypes.md`. Examples: a hyper offense team with no Fake Out + setup pair, a rain team with no spread move + immunity combo, a team with setup sweepers but no redirector or Fake Out user to enable them. Not every team needs every pattern -- flag gaps as observations, not failures.

**Fixes:**
- Anti-synergy from a specific move (e.g., Earthquake hitting partner) -> suggest an alternative move the Pokemon learns (e.g., High Horsepower). Tier 1 fix.
- Anti-synergy from item conflict -> suggest an item swap. Tier 2 fix.
- Missing synergy the archetype fundamentally needs -> escalate to a slot swap with 2-3 candidates that provide the missing pattern. Tier 5 fix.

#### Layer 3: Bring-4 Modes

Skip this layer if the team has fewer than 4 Pokemon.

**1. Identify modes.** Determine the core-4 (the group of 4 that represents the team's default game plan) and any alternate modes enabled by the remaining slots. A "mode" is a group of 4 with a coherent game plan (fast offense, Trick Room, anti-weather, etc.). Alternate modes swap 1-2 members from the core-4.

List each mode with its 4 members and one-line game plan. If the team has two Mega Stone carriers, identify any mode that swaps the primary Mega out for the alternate Mega. **2. Validate each mode.** For each mode, check:
- Does this group of 4 have speed control (Tailwind, Trick Room, Icy Wind, Thunder Wave, or Choice Scarf)?
- Does it have a win condition (setup sweeper, spread damage dealer, etc.)?
- Are there critical type gaps (a type hitting 3+ of the 4 super-effectively with no resist among them)?
- Does it have pair synergy (Fake Out + setup, redirect + sweeper, etc.)?

Flag modes missing something critical. If a mode fails validation (e.g., no speed control and no way to deal damage before the opponent moves), say so directly and suggest a fix.

When evaluating a mode that includes a Mega-evolved Pokemon, use that Pokemon's Mega stats and ability from `assets/pokemon.json`.

**3. Map modes to matchups.** Use Pikalytics meta data to suggest which mode to bring against common archetypes. Format as: "Against [archetype/threat]: bring [mode name] -- swap [Pokemon] in for [Pokemon]. [One sentence explaining why.]"

Explicitly map alternate-Mega modes to the matchups that counter the primary Mega. Example: "Against Fairy-heavy teams: bring Alternate Mega mode -- swap Feraligatr for Mega Scizor. Scizor's Steel STAB threatens Fairies that wall Dragonize."

**4. Mode coverage gaps.** If a common meta archetype (from Pikalytics top-usage trends) has no good mode answer, flag it.

**Fixes:**
- Weak mode missing speed control -> suggest adding Tailwind/Icy Wind to a Pokemon in that mode that learns it (check roster). Tier 1 fix.
- Weak mode missing a win condition -> suggest a move change (setup move) or item change on existing members. Tier 1-2 fix.
- No mode covers a common meta archetype -> suggest a slot 5-6 swap that would create a viable mode for that matchup. Tier 5 fix.

#### Layer 4: Meta Threat Matchups

Fetch Pikalytics via `webfetch` for top-usage Pokemon. For each high-usage threat (focus on the top 10-15 by usage rate):
- Which team members handle it well? (resist its STAB, outspeed and KO it, have Intimidate against physical threats, etc.)
- Which team members lose to it? (weak to its STAB, slower, can't deal meaningful damage)
- If the team has no good answer, suggest counterplay

**Fixes:**
- Team has a shaky answer (handles it but not cleanly) -> suggest a move or item change to shore up the matchup. Tier 1-2 fix.
- A top-3 usage threat has zero answers on the team -> escalate to a swap suggestion with 2-3 specific roster candidates that handle the threat and explain which team member they'd replace and why. Tier 5 fix.

#### Layer 5: Role Checklist

Read `roles.md` from `.agents/skills/evaluating-vgc-team-viability/references/`. Check which roles the team covers:

- [ ] Speed control (Tailwind, Trick Room, Icy Wind, Thunder Wave, Choice Scarf)
- [ ] Intimidate / Attack drops (Intimidate ability, Snarl)
- [ ] Redirection (Follow Me, Rage Powder)
- [ ] Fake Out
- [ ] Setup (Swords Dance, Dragon Dance, Calm Mind, Nasty Plot, Quiver Dance, etc.)
- [ ] Spread damage (Earthquake, Rock Slide, Heat Wave, Dazzling Gleam, etc.)
- [ ] Weather/Terrain (only flag if relevant to the detected archetype)

Not every team needs every role. Evaluate gaps against the detected archetype:
- A hyper offense team missing Fake Out is a problem. A goodstuffs team missing it is a note.
- A rain team missing a weather setter is critical. A balance team without weather is fine.

Flag gaps as observations with context, not failures.

**Fixes:**
- Missing role that an existing team member could fill -> check if any team member learns the relevant move via `assets/pokemon.json` and suggest a move swap. Tier 1 fix.
- Missing role with no current member able to fill it -> suggest a Pokemon swap with 2-3 candidates that provide the role. Tier 5 fix.

#### Layer 6: Set Optimization

Review each Pokemon's individual set for internal consistency and efficiency. Read the Pokemon's full data via `assets/pokemon.json` and cross-reference with the team's archetype and game plan.

**Ability:** Does the Pokemon have a better ability available for this team context? Check all abilities listed in the roster entry. Example: a Corviknight running Pressure when Mirror Armor is available and the team faces Intimidate users.

**Item:** Check for:
- Duplicate items across the team (VGC rules prohibit this)
- Missed Mega Stone opportunity (Pokemon has a `mega` field in the roster but isn't holding its Mega Stone -- worth it?)
- Better item for the role. Read `items.md` for heuristics. Example: a lead Trick Room setter without Mental Herb or Focus Sash.

**Moves:** Check for:
- Moves that don't serve the team's game plan. Check whether coverage moves hit relevant meta threats.
- Missing Protect on a Pokemon that should have it (not a Fake Out user, Choice holder, or Assault Vest holder)
- Better move options available in the roster entry for the Pokemon's role

**SPs/Nature:** Check for:
- Nature that conflicts with the Pokemon's role (Adamant on a special attacker)
- SP spread that doesn't serve the set (Speed investment on a Trick Room Pokemon, no HP investment on a tank)
- When suggesting changes, calculate exact benchmarks using `stat-calculations.md`. Use Speed Thresholds (Section 2) for speed benchmarks, Bulk Thresholds (Section 4) for survival benchmarks, and Offensive Thresholds (Section 5) for KO benchmarks. Example: "10 Spe SPs gives Feraligatr 109 Speed, outspeeding max Speed Adamant Excadrill (base 88 = 106 Speed) after +1 Dragon Dance (109 * 1.5 = 163 vs 106)" or "24 HP / 8 Def lets Feraligatr survive 32+ Atk SPs Garchomp Earthquake (calculate damage via Section 3)."

**Fixes:** Always specific and justified with benchmarks or matchup reasoning. Tier 1-4 fixes (move, item, ability, SP/nature changes). Set optimization never escalates to a Pokemon swap -- that's handled by other layers.

#### Layer 7: Win Condition Assessment

Read `win-conditions.md`. Identify and evaluate the team's win conditions.

**1. Identify win conditions.** For each win condition type in win-conditions.md, check whether the team has it:
- Setup sweeper? Which Pokemon, which setup move, which enabler?
- Spread pressure? Which pair, which spread moves?
- Weather/terrain engine? Which setter + abuser?
- Trick Room flip? Which setter + which slow attackers?
- Attrition elements? Intimidate cycling, recovery, status?
- Single-target burst? Fast attackers that can focus-fire?

**2. Evaluate quality.** For each identified win condition, assess:
- Dependency count: how many things need to go right?
- Disruption resilience: what common counterplay shuts it down?
- Turn count: how many turns until it's online?
- Independence: how many team members can execute it?

Flag win conditions that are high-dependency or vulnerable to common counterplay (Intimidate, Taunt, Fake Out).

**3. Check sufficiency.** Does the team have at least 2 independent win conditions? Are they in different bring-4 modes? Do they share failure points? Reference archetype expectations from win-conditions.md — weather teams need a non-weather backup, Trick Room teams need a fast fallback, hyper offense teams need multiple independent threats.

**Fixes:**
- Win condition is fragile due to a fixable dependency (e.g., setup sweeper has no protection from Taunt) -> suggest a move or item change that reduces the dependency (Mental Herb on the setter, a Taunt blocker). Tier 1-2 fix.
- Team has only one win condition -> suggest a Pokemon swap that adds a second independent path to winning. Identify 2-3 roster Pokemon that provide a different win condition type and explain which slot they'd replace and what the team gains/loses. Tier 5 fix.

#### Layer 8: Lead & Resilience Check

Read `tempo.md`. Evaluate lead pairs for each bring-4 mode identified in Layer 3 (Bring-4 Modes) and assess Plan B resilience.

**1. Evaluate leads.** For each mode's natural lead pair, assess per tempo.md:
- Complementary Turn 1 actions: do both Pokemon have useful, non-conflicting Turn 1 moves?
- Threat projection: does the lead force the opponent into difficult choices?
- Flexibility under disruption: what happens if the opponent blocks the primary Turn 1 plan?
- Match the lead to a lead-pair pattern (Fake Out + Attacker/Setter, Dual Offense, Redirect + Setup, Speed Control + Attacker) and note strengths/weaknesses.

Flag leads that are brittle (one line, no fallback) or passive (one Pokemon contributes nothing on Turn 1).

**2. Assess Plan B resilience.** Run through tempo.md's disruption scenarios against the full team:
- Lead Pokemon KO'd Turn 1: does an alternate mode survive without the lost Pokemon?
- Speed control denied: is there backup speed control or naturally fast Pokemon?
- Weather overwritten (if relevant): can the team function without weather?
- Setup denied (if relevant): is there a non-setup win condition?

Flag any scenario where the team has zero path to winning.

**Fixes:**
- Brittle lead pair -> suggest a move change that gives the lead fallback options (e.g., adding Protect to a Pokemon that currently has 4 attacks, or adding a secondary attack to a pure support lead). Tier 1 fix.
- No alternate mode survives a specific common disruption -> suggest a slot 5-6 swap that adds resilience. Identify 2-3 roster Pokemon that provide a fallback for the scenario and explain the trade-offs. Tier 5 fix.

### 5. Fix Tracking & Export

As the user works through drill-down layers and accepts or rejects fix suggestions, track all accepted changes as a running changelist.

When the user is done exploring (or asks for the updated team), output:

**1. Revised Showdown paste** -- the full team in paste format with all accepted changes applied:

```
[Pokemon] @ [Item]
Ability: [Ability]
Level: 50
SPs: [HP] HP / [Atk] Atk / [Def] Def / [SpA] SpA / [SpD] SpD / [Spe] Spe
[Nature] Nature
- [Move 1]
- [Move 2]
- [Move 3]
- [Move 4]
```

Rules: Level 50, 66 SPs total max, no duplicate items, no duplicate Pokemon.

**2. Change diff** -- a summary of what changed from the original paste:

Example:
> - Feraligatr: Double-Edge -> Ice Punch (coverage for Garchomp/Salamence)
> - Clefable: Sitrus Berry -> Lum Berry (status immunity for Follow Me longevity)
> - Corviknight: 252 HP / 252 Def / 4 SpD -> 252 HP / 148 Def / 108 SpD (survives Modest Gardevoir Thunderbolt)
> - Slot 5: Volcarona -> Incineroar (adds Intimidate + Fake Out)

If no changes were accepted, re-output the original paste with a note that no modifications were made.

The user can request a partial export at any time (e.g., "show me the team with just the move changes, not the swap").

## Conversation Style

- The user can jump between layers, revisit analysis, accept or reject fixes freely
- Present 2-3 options when suggesting Pokemon swaps, not a single "correct" answer
- Explain trade-offs concisely -- the user understands VGC basics
- Tiered fixes: always start with the least disruptive option before escalating
- All move and ability data is Champions-accurate from the roster. If the user reports a discrepancy, trust the user and note it for roster updates.

## After Build

After building the team, persist the team in Showdown format, and a summary of its playstyle, to `teams/XXX-NAME-STRAT.md`. In that template, XXX is the next index within the directory, NAME is the slug of the Pokemon the team is built around, and STRAT is an extremely short description of the playstyle. Some examples of potential file names are:
- 001-mega-feraligatr-hyper-offense.md
- 002-archaludon-rain.md
- 003-mega-charizard-y-sun.md

The format of that file should be:

```markdown
# [Name of team]

## Roster

````txt
[team in Pokemon Showdown format]
````

## Playing this Team

### Primary Mode
[4 team members in mode]
Game Plan: [summary of game plan]

### Conditional Mode 1
[4 team members in mode]
Use When: [description of when to use this mode over the primary mode]
Game Plan: [summary of game plan]

[any other Conditional modes]

## Analysis

### Strengths
[list of strengths of the team]

### Weaknesses
[list of weaknesses of the team]

### Roles

[If the role exists, note that it is covered here]

[If the role does not exist, provide reasons why this may be acceptable. If unacceptable, provide suggestions on how to address this gap.]

#### Speed control

[If the role exists, note that it is covered here]

[If the role does not exist, provide reasons why this may be acceptable. If unacceptable, provide suggestions on how to address this gap.]

#### Intimidate / Attack drops

[If the role exists, note that it is covered here]

[If the role does not exist, provide reasons why this may be acceptable. If unacceptable, provide suggestions on how to address this gap.]

#### Redirection

[If the role exists, note that it is covered here]

[If the role does not exist, provide reasons why this may be acceptable. If unacceptable, provide suggestions on how to address this gap.]

#### Fake Out

[If the role exists, note that it is covered here]

[If the role does not exist, provide reasons why this may be acceptable. If unacceptable, provide suggestions on how to address this gap.]

#### Setup

[If the role exists, note that it is covered here]

[If the role does not exist, provide reasons why this may be acceptable. If unacceptable, provide suggestions on how to address this gap.]

#### Spread damage

[If the role exists, note that it is covered here]

[If the role does not exist, provide reasons why this may be acceptable. If unacceptable, provide suggestions on how to address this gap.]

#### Weather/Terrain

[If the role exists, note that it is covered here]

[If the role does not exist, provide reasons why this may be acceptable. If unacceptable, provide suggestions on how to address this gap.]
```
