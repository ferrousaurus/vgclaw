---
name: evaluating-vgc-teams
description: Use when the user wants to evaluate, rate, or get feedback on an existing VGC team for Pokemon Champions, including team analysis, fix suggestions, and meta matchup review
dependencies:
  required:
    - checking-vgc-legality
  optional:
    - evaluating-vgc-viability
    - evaluating-vgc-meta
---

# Evaluating VGC Teams

Evaluates existing Pokemon Champions VGC teams from Showdown paste format. Auto-detects the team's archetype, presents a summary verdict, and lets the user drill into analysis layers with tiered fix suggestions. Outputs a revised Showdown paste with a change diff when done.

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
- `reference/synergies.md` -- pair synergy patterns (offensive combos, defensive pivots, mode pairs)

### From evaluating-vgc-meta (optional -- degrade gracefully if missing)
- Pikalytics fetch for current usage stats, top threats, common sets, and teammates

## Workflow

### 1. Parse & Validate

The user provides a team in Showdown paste format. Parse it into structured data (Pokemon name, item, ability, EVs, nature, moves).

**Partial teams:** If the paste contains fewer than 6 Pokemon, accept it and evaluate what's there. Flag the incomplete roster in the summary verdict ("This team has N/6 slots filled") and skip bring-4 mode analysis if there are fewer than 4 Pokemon. Do not prompt the user to add more -- they may be evaluating a core before filling remaining slots.

For each Pokemon, validate:
1. Verify it exists in `champions-roster.json` (from checking-vgc-legality)
2. Verify its listed ability is legal for it (exists in the roster entry's abilities)
3. Verify its listed moves are legal for it (exist in the roster entry's moves)
4. Verify its item exists in `items.json` (from checking-vgc-legality)
5. Check for duplicate items across the team
6. Verify EV totals don't exceed 508

Flag any validation errors before proceeding. If a Pokemon isn't in the roster, ask the user whether to proceed with partial evaluation (skip that Pokemon) or correct the paste.

### 2. Archetype Detection & Confirmation

Auto-detect the team's archetype by checking for signals. If evaluating-vgc-viability is available, load `reference/archetypes.md` for archetype definitions. If unavailable, detect archetypes based on team composition signals directly.

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
> 2. Pair Synergies *(requires evaluating-vgc-viability)*
> 3. Bring-4 Modes
> 4. Meta Threat Matchups *(requires evaluating-vgc-meta)*
> 5. Role Checklist *(requires evaluating-vgc-viability)*
> 6. Set Optimization
>
> *"Which area do you want to dig into, or should I go through them in order?"*

Only list drill-down areas whose dependencies are available. If evaluating-vgc-viability is unavailable, omit Pair Synergies and Role Checklist from the list. If evaluating-vgc-meta is unavailable, omit Meta Threat Matchups from the list.

The summary requires reading data files (from checking-vgc-legality) and, if evaluating-vgc-meta is available, fetching Pikalytics to identify the top issues. If evaluating-vgc-meta is unavailable, base the summary on type matchups and stat analysis only. If the team has fewer than 6 Pokemon, note it here: "This team has N/6 slots filled."

### 4. Analysis Layers (Drill-Down)

Each layer follows the same pattern: **findings -> problems flagged -> tiered fix suggestions.** The user can drill into any layer in any order.

Fix tiers (used across all layers, in priority order -- always start with the least disruptive):
1. Move change
2. Item change
3. Ability change
4. EV/Nature adjustment
5. Pokemon swap (present 2-3 candidates from the roster with trade-offs)

#### Layer 1: Type Coverage

**Defensive:** For each team member, list weaknesses and resistances using type-chart.json (from checking-vgc-legality). Flag any type that hits 3+ team members super-effectively.

**Offensive:** For each team member's STAB types (determined by the Pokemon's types in the roster) + coverage moves (non-STAB attacking moves in the set), list what types the team hits super-effectively. Look up move types in moves.json (from checking-vgc-legality). Flag types the team has no super-effective coverage against.

**Fixes:**
- Offensive type hole -> suggest a coverage move swap on the team member best positioned to learn a move of the missing type (check their available moves in champions-roster.json). Tier 1 fix.
- A type hitting 3 members SE -> flag as a concern, suggest resistance berry or item change if applicable. Tier 2 fix.
- A type hitting 4+ members SE with no resist on the team -> escalate to a Pokemon swap suggestion. Identify 2-3 roster Pokemon that resist the problematic type and fill a similar role to the weakest link. Tier 5 fix.

#### Layer 2: Pair Synergies (requires evaluating-vgc-viability)

If evaluating-vgc-viability is unavailable, skip this layer entirely.

Load `reference/synergies.md` (from evaluating-vgc-viability). For each of the 15 possible pairs on the team (or fewer for partial teams), check the pair against each synergy category using the team's actual moves, abilities, and types from the data files (from checking-vgc-legality).

Do not list all pairs. Present only the notable findings:

**Top synergy pairs (2-3 best):** Identify the pairs with the strongest synergies. For each, name the pair, state the synergy category, and explain what they do together. Example: "Sableye + Feraligatr (Mode Pair: Fake Out + Dragon Dance setup. Sableye also has Helping Hand to boost Feraligatr's attacks after it's set up.)"

**Anti-synergy flags:** Identify pairs that are actively bad together on the field. Shared weaknesses with no cross-coverage, redundant roles (two redirectors, two Fake Out users with nothing to enable), or conflicting strategies (Tailwind setter paired with a Trick Room setter and no plan to use both modes). Only flag pairs where the anti-synergy is meaningful -- two Pokemon sharing one weakness is normal, two Pokemon sharing three weaknesses with no cross-coverage is a flag.

**Missing synergy gaps:** Check whether the team is missing synergy patterns that its archetype typically wants. Reference the detected archetype from `reference/archetypes.md` (from evaluating-vgc-viability). Examples: a hyper offense team with no Fake Out + setup pair, a rain team with no spread move + immunity combo, a team with setup sweepers but no redirector or Fake Out user to enable them. Not every team needs every pattern -- flag gaps as observations, not failures.

**Fixes:**
- Anti-synergy from a specific move (e.g., Earthquake hitting partner) -> suggest an alternative move the Pokemon learns (e.g., High Horsepower). Tier 1 fix.
- Anti-synergy from item conflict -> suggest an item swap. Tier 2 fix.
- Missing synergy the archetype fundamentally needs -> escalate to a slot swap with 2-3 candidates that provide the missing pattern. Tier 5 fix.

#### Layer 3: Bring-4 Modes

Skip this layer if the team has fewer than 4 Pokemon.

**1. Identify modes.** Determine the core-4 (the group of 4 that represents the team's default game plan) and any alternate modes enabled by the remaining slots. A "mode" is a group of 4 with a coherent game plan (fast offense, Trick Room, anti-weather, etc.). Alternate modes swap 1-2 members from the core-4.

List each mode with its 4 members and one-line game plan. If the team has two Mega Stone carriers, identify any mode that swaps the primary Mega out for the alternate Mega. Name it explicitly as a Mega-swap mode. Example: "Alternate Mega mode: swap Feraligatr for Scizor. Mega evolve Scizor. Game plan: Steel-type offensive pressure against Fairy-heavy teams."

Two Mega Stone carriers must never appear in the same bring-4 group.

**2. Validate each mode.** For each mode, check:
- Does this group of 4 have speed control (Tailwind, Trick Room, Icy Wind, Thunder Wave, or Choice Scarf)?
- Does it have a win condition (setup sweeper, spread damage dealer, etc.)?
- Are there critical type gaps (a type hitting 3+ of the 4 super-effectively with no resist among them)?
- Does it have pair synergy (Fake Out + setup, redirect + sweeper, etc.)?

Flag modes missing something critical. If a mode fails validation (e.g., no speed control and no way to deal damage before the opponent moves), say so directly and suggest a fix.

When validating an alternate-Mega mode, evaluate using the alternate Mega's Mega stats and ability from champions-roster.json (not its base form). The primary Mega is benched in this mode and irrelevant to validation.

**3. Map modes to matchups.** If evaluating-vgc-meta is available, use Pikalytics meta data to suggest which mode to bring against common archetypes. Format as: "Against [archetype/threat]: bring [mode name] -- swap [Pokemon] in for [Pokemon]. [One sentence explaining why.]"

Explicitly map alternate-Mega modes to the matchups that counter the primary Mega. Example: "Against Fairy-heavy teams: bring Alternate Mega mode -- swap Feraligatr for Mega Scizor. Scizor's Steel STAB threatens Fairies that wall Dragonize."

If evaluating-vgc-meta is unavailable, map modes to general type-based matchups instead of specific meta archetypes.

**4. Mode coverage gaps.** If evaluating-vgc-meta is available and a common meta archetype (from Pikalytics top-usage trends) has no good mode answer, flag it.

If evaluating-vgc-meta is unavailable, assess mode coverage gaps based on type matchups only.

**Fixes:**
- Weak mode missing speed control -> suggest adding Tailwind/Icy Wind to a Pokemon in that mode that learns it (check roster). Tier 1 fix.
- Weak mode missing a win condition -> suggest a move change (setup move) or item change on existing members. Tier 1-2 fix.
- No mode covers a common meta archetype -> suggest a slot 5-6 swap that would create a viable mode for that matchup. Tier 5 fix.
- Team has a primary Mega countered by a common archetype and no alternate Mega -> flag it specifically: "Your primary Mega [X] is countered by [archetype] and you have no alternate Mega mode. Consider adding [Mega-eligible Pokemon] in slot [N]." Identify 2-3 Mega-eligible candidates from the roster whose Mega form counter-types what counters the primary Mega. Tier 5 fix.

#### Layer 4: Meta Threat Matchups (requires evaluating-vgc-meta)

If evaluating-vgc-meta is unavailable, skip this layer entirely.

Fetch Pikalytics (via evaluating-vgc-meta) for top-usage Pokemon. For each high-usage threat (focus on the top 10-15 by usage rate):
- Which team members handle it well? (resist its STAB, outspeed and KO it, have Intimidate against physical threats, etc.)
- Which team members lose to it? (weak to its STAB, slower, can't deal meaningful damage)
- If the team has no good answer, suggest counterplay

**Fixes:**
- Team has a shaky answer (handles it but not cleanly) -> suggest a move or item change to shore up the matchup. Tier 1-2 fix.
- A top-3 usage threat has zero answers on the team -> escalate to a swap suggestion with 2-3 specific roster candidates that handle the threat and explain which team member they'd replace and why. Tier 5 fix.

#### Layer 5: Role Checklist (requires evaluating-vgc-viability)

If evaluating-vgc-viability is unavailable, skip this layer entirely.

Load `reference/roles.md` (from evaluating-vgc-viability). Check which roles the team covers:

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
- Missing role that an existing team member could fill -> check if any team member learns the relevant move in champions-roster.json and suggest a move swap. Tier 1 fix.
- Missing role with no current member able to fill it -> suggest a Pokemon swap with 2-3 candidates that provide the role. Tier 5 fix.

#### Layer 6: Set Optimization

Review each Pokemon's individual set for internal consistency and efficiency. Read the Pokemon's full data from champions-roster.json (from checking-vgc-legality) and cross-reference with the team's archetype and game plan.

**Ability:** Does the Pokemon have a better ability available for this team context? Check all abilities listed in the roster entry. Example: a Corviknight running Pressure when Mirror Armor is available and the team faces Intimidate users.

**Item:** Check for:
- Duplicate items across the team (VGC rules prohibit this)
- Missed Mega Stone opportunity (Pokemon has a `mega` field in the roster but isn't holding its Mega Stone -- worth it?)
- Better item for the role. If evaluating-vgc-viability is available, load `reference/items.md` for heuristics. Example: a lead Trick Room setter without Mental Herb or Focus Sash.

**Moves:** Check for:
- Moves that don't serve the team's game plan. If evaluating-vgc-meta is available, check whether coverage moves hit relevant meta threats. If unavailable, evaluate coverage based on type chart utility.
- Missing Protect on a Pokemon that should have it (not a Fake Out user, Choice holder, or Assault Vest holder)
- Better move options available in the roster entry for the Pokemon's role

**EVs/Nature:** Check for:
- Nature that conflicts with the Pokemon's role (Adamant on a special attacker)
- EV spread that doesn't serve the set (Speed investment on a Trick Room Pokemon, no HP investment on a tank)
- When suggesting changes, provide specific benchmarks: "84 Spe EVs lets Feraligatr outspeed base 130s after +1 Dragon Dance" or "196 HP / 60 Def survives Adamant Garchomp Earthquake"

**Fixes:** Always specific and justified with benchmarks or matchup reasoning. Tier 1-4 fixes (move, item, ability, EV changes). Set optimization never escalates to a Pokemon swap -- that's handled by other layers.

### 5. Fix Tracking & Export

As the user works through drill-down layers and accepts or rejects fix suggestions, track all accepted changes as a running changelist.

When the user is done exploring (or asks for the updated team), output:

**1. Revised Showdown paste** -- the full team in paste format with all accepted changes applied:

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
