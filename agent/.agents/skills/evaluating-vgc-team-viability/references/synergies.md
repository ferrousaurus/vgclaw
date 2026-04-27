# VGC Pair Synergy Patterns

> **Champions Rules Reminder**
> - All IVs are fixed to 31. Never reference 0 IVs or IV manipulation.
> - Stat Points (SPs) replace EVs: 1 SP = 8 EVs, max 32 per stat, 66 total.
> - Damage is deterministic — no random rolls.
> - Level 50 for all VGC calculations.
> - Item pool is limited: no Choice Band, Choice Specs, Life Orb, Assault Vest, Safety Goggles, etc.

> **When to read this file:** This reference is invoked primarily by the **Offensive Balance**, **Defensive Cohesion**, **Pair Synergy**, and **Move Coverage & Optimization** dimensions in `SKILL.md`. Commonly read alongside `roles.md` (role redundancy is an anti-synergy pattern), `win-conditions.md` (synergy patterns feed win conditions), and `tempo.md` (lead pair evaluation overlaps with mode pairs).

How to use this doc: when evaluating a pair of Pokemon, check each category below. A pair may match multiple patterns — and the best pairs do. Use the "What to check" bullets to verify a pattern applies using data from `assets/pokemon.json`, `assets/moves.json`, and `assets/abilities.json`. Use the "Quality signals" bullets to assess how strong the match is. Use "Stacking" notes to find related patterns this one commonly layers with.

## Scoring Anchors for Pair Synergy

Use these anchors when assigning a score to the **Pair Synergy** dimension in `SKILL.md`:

- **5 (Optimal):** Multiple pairs with 3+ cross-category synergy layers. No red-flag anti-synergies in core bring-4 modes.
- **4 (Strong):** Clear synergy engine (2-3 layers) in core pairs. Minor anti-synergy that's manageable.
- **3 (Acceptable):** Some synergy exists but no strong engine. One yellow-flag anti-synergy.
- **2 (Weak):** Most pairs are 1-pattern or non-synergistic. A red-flag anti-synergy in a core mode.
- **1 (Critical flaw):** Core pairs have severe anti-synergy (friendly fire, strategy conflict, 3+ shared weaknesses) that makes them unfieldable together.

### Sampling Heuristic for Agents

Evaluating all 15 pairs is ideal but often unnecessary. Use this sampling strategy:
1. **Mandatory:** Evaluate all pairs involving the 3 most-likely-brought Pokémon (the "core").
2. **Sample:** Check remaining pairs for red-flag anti-synergies (shared weaknesses, friendly fire, strategy conflict).
3. **Deep dive:** If a red flag is found, evaluate that pair fully against all patterns.

**Identifying the "3 most-likely-brought" core:**
- **Archetype-defining Pokemon:** The Pokemon that make the archetype work (e.g., the TR setter + its abusers, the Tailwind setter + its mid-tier attackers, the weather setter + its Swift Swim user).
- **Highest layer-count pairs:** After a quick scan, the 2-3 Pokemon that appear in the most high-synergy pairs are likely core members.
- **Omnipresent slots:** Any Pokemon that appears in every viable bring-4 group is core by definition.

If the team has no clear core (e.g., a Goodstuffs team), sample the 3 Pokemon with the highest individual usage probability based on role coverage and meta matchup utility.

## Offensive Combos

Pairs where one Pokemon's moves become stronger or safer because of the partner.

### Spread Move + Immunity

One Pokemon uses a spread move that hits both sides of the field. The partner is immune to it via type or ability.

- **What to check:** Does one Pokemon have Earthquake, Discharge, Surf, or Sludge Wave in its moves? Does the partner have a type immunity (Flying for Earthquake, Ground for Discharge) or ability immunity (Levitate for Earthquake, Lightning Rod/Volt Absorb for Discharge, Water Absorb/Storm Drain for Surf)?
- **Examples:** Garchomp (Earthquake) + Corviknight (Flying), Rotom (Discharge) + Garchomp (Ground-type), Politoed (Surf) + Gastrodon (Storm Drain)
- **Quality signals:**
  - Strong: the immune partner also benefits offensively from being on the field with the spread move (e.g., Gastrodon's Storm Drain boosts Sp.Atk when hit by Surf).
  - Strong: the spread move is the attacker's primary STAB rather than off-type coverage, so it gets used frequently.
  - Weak: the spread move is a backup option the attacker rarely clicks. The immunity exists on paper but rarely matters in practice.
- **Stacking:** Often layers with Defensive Pivot Pairs > Type Complement. Also see `win-conditions.md` > Spread Pressure for how this pattern feeds a win condition.

### Helping Hand + Power Move

One Pokemon has Helping Hand. The partner has a high-power attack (especially spread moves that benefit from the 50% boost).

- **What to check:** Does one Pokemon have Helping Hand in its moves? Does the partner have Heat Wave, Rock Slide, Muddy Water, Dazzling Gleam, Earthquake, Eruption, or another high-base-power move?
- **Examples:** Clefable (Helping Hand) + Volcarona (Heat Wave), Sableye (Helping Hand) + Feraligatr (Liquidation)
- **Quality signals:**
  - Strong: the Helping Hand user has other useful support beyond Helping Hand (Follow Me, Fake Out, Intimidate).
  - Strong: the partner's boosted move threatens KOs it would otherwise miss. Helping Hand turns a 2HKO into an OHKO on a common threat.
  - Weak: the Helping Hand user contributes nothing else on the field. It clicks Helping Hand every turn because it has nothing better to do — sign of a dead slot.
- **Stacking:** Commonly layers with Mode Pairs > Fake Out + Setup and Redirector + Sweeper if the Helping Hand user also has Follow Me.

### Ability-Boosted Attacks

One Pokemon has an ability that activates when hit by a specific type. The partner can intentionally trigger it.

- **What to check:** Does one Pokemon have Flash Fire, Lightning Rod, Storm Drain, Sap Sipper, or Motor Drive? Does the partner have a move of that type (especially a weak or spread move to trigger it safely)?
- **Examples:** Armarouge (Flash Fire) + Torkoal (Heat Wave hits Armarouge to boost its Fire moves), Gastrodon (Storm Drain) + Politoed (Surf boosts Gastrodon's Sp.Atk)
- **Quality signals:**
  - Strong: the trigger happens naturally through the partner's normal game plan.
  - Strong: the boosted Pokemon becomes a major threat after activation.
  - Weak: triggering the ability requires the partner to use a suboptimal move, wasting a turn.
- **Stacking:** Often layers with Defensive Pivot Pairs > Ability-Based Protection.

### Setup + Enabler

One Pokemon has a setup move. The partner can protect it during setup.

- **What to check:** Does one Pokemon have a stat-boosting move? Does the partner have Fake Out, Follow Me, Rage Powder, or Intimidate to buy a free turn?
- **Examples:** Feraligatr (Dragon Dance) + Sableye (Fake Out + Helping Hand), Volcarona (Quiver Dance) + Clefable (Follow Me)
- **Quality signals:**
  - Strong: the enabler provides value beyond Turn 1 (Helping Hand after Fake Out, Intimidate that stays useful, Follow Me that can be repeated).
  - Strong: the setup sweeper threatens a sweep after a single boost.
  - Strong: the enabler and sweeper have good type complement.
  - Weak: the sweeper needs 2+ boosts to threaten anything.
  - Weak: the enabler is dead weight after Turn 1.
- **Stacking:** Often layers with Mode Pairs > Fake Out + Setup and Helping Hand + Power Move. See `tempo.md` > Lead Pair Evaluation and `win-conditions.md` > Setup Sweeper.

## Defensive Pivot Pairs

Pairs that cover each other's weaknesses when fielded together.

### Type Complement

Each partner resists or is immune to the other's weaknesses.

- **What to check:** List Partner A's weaknesses. Does Partner B resist or take neutral damage from most of those types? Repeat in reverse. Flag pairs where both are weak to the same type.
- **Examples:** Garchomp (weak to Ice, Dragon, Fairy) + Incineroar (resists Ice, Fairy), Corviknight (weak to Fire, Electric) + Gastrodon (resists Fire, immune to Electric)
- **Quality signals:**
  - Strong: mutual coverage — each partner covers most or all of the other's weaknesses.
  - Strong: the covered weaknesses are common offensive types in VGC (Ground, Ice, Fairy, Rock).
  - Weak: coverage is one-directional.
- **Stacking:** Layers with every other pattern. Strong type complement is a foundation. Cross-ref Anti-Synergy Evaluation > Shared Weakness Clustering for the inverse.

### Intimidate + Frail Partner

An Intimidate user lowers the opponent's Attack, making a physically frail partner safer.

- **What to check:** Does one Pokemon have the Intimidate ability? Does the partner have low physical Defense or HP and benefit from reduced incoming physical damage?
- **Examples:** Incineroar (Intimidate) + Gardevoir (low Def), Gyarados (Intimidate) + Volcarona (low Def)
- **Quality signals:**
  - Strong: the frail partner is primarily threatened by physical attacks.
  - Strong: the Intimidate user brings additional utility (Fake Out, Snarl, U-turn).
  - Weak: the frail partner is primarily threatened by special attacks. Intimidate doesn't help.
- **Stacking:** Often layers with Mode Pairs > Fake Out + Setup.

### Ability-Based Protection

One Pokemon's ability draws or blocks attacks that would threaten the partner.

- **What to check:** Does one Pokemon have Lightning Rod, Storm Drain, or Flash Fire? Is the partner weak to that type?
- **Examples:** Gastrodon (Storm Drain) + Incineroar (Water-weak), Pachirisu (Lightning Rod) + Gyarados (Electric-weak)
- **Quality signals:**
  - **Strong:** the protected partner has a critical 4x weakness to the type being redirected.
  - **Strong:** the ability user also benefits from absorbing the hit (Storm Drain boosts Sp.Atk).
  - **Weak:** the protected partner's weakness is only 2x and it has enough bulk to survive anyway.
- **Stacking:** Often layers with Offensive Combos > Ability-Boosted Attacks.

## Ability-Based Synergy & Anti-Synergy

Abilities can fundamentally alter a pair's defensive and offensive profile. Evaluate them as a distinct synergy layer.

### Defensive Ability Synergies

Abilities that grant immunities or resistances modify the shared weakness calculus:

- **Levitate / Flying-type** — immune to Ground. A Ground-weak partner next to a Levitate/Flying partner is protected from Earthquake and Ground-type attacks.
- **Flash Fire** — immune to Fire. Blocks Heat Wave, Flamethrower, and other Fire attacks for itself; if the partner is Fire-weak, the immunity still removes one shared weakness vector.
- **Storm Drain / Water Absorb / Dry Skin** — immune or healed by Water. Removes Water as a shared weakness.
- **Lightning Rod / Volt Absorb / Motor Drive** — immune or healed by Electric. Removes Electric as a shared weakness.
- **Sap Sipper** — immune to Grass. Removes Grass as a shared weakness.
- **Thick Fat** — takes half damage from Fire and Ice. Effectively removes both as critical shared weaknesses.
- **Water Bubble** — takes half damage from Fire; immune to burn.

**Rule for Shared Weakness Clustering:** When counting shared weaknesses, first apply immunities and resistances from abilities. A Pokemon with Levitate does **not** count as Ground-weak. A Pokemon with Thick Fat does **not** count as Fire-weak or Ice-weak for clustering purposes. Only count weaknesses that the Pokemon actually takes super-effective damage from.

### Offensive Ability Synergies

Abilities that boost damage when hit by a specific type create setup opportunities:

- **Flash Fire** + partner Fire move → boosts Fire attacks.
- **Storm Drain** + partner Water move → boosts Sp.Atk.
- **Lightning Rod** + partner Electric move → boosts Sp.Atk.
- **Sap Sipper** + partner Grass move → boosts Atk.
- **Justified** + partner Dark move → boosts Atk.

**Quality signal:** The trigger happens naturally through the partner's normal game plan, not by wasting a turn on a suboptimal move.

### Ability Anti-Synergies

- **Sand Stream** on a non-Rock/Ground/Steel partner causes chip damage. Flag as Friendly Fire if the partner lacks sand immunity.
- **Drought / Drizzle / Snow Warning** can overwrite a partner's preferred weather or activate an opponent's ability (e.g., Rain Dish, Dry Skin).
- **Intimidate** + partner with Defiant / Competitive — the partner gets boosted when Intimidate drops its Attack. This is actually positive synergy, not anti-synergy.

## Team-Wide Ability Anti-Synergy Audit

Evaluate abilities at the team level, not just the pair level. Some abilities create structural liabilities that affect 3+ team members.

### Passive Chip Abilities

Abilities that deal passive damage to non-immune teammates:

- **Sand Stream** — damages non-Rock/Ground/Steel Pokemon at end of turn.
- **Snow Warning / Hail** — damages non-Ice Pokemon at end of turn.

**Severity heuristics:**
- **Yellow flag:** 1-2 non-immune teammates take chip. Manageable but adds up over long games.
- **Red flag:** 3+ non-immune teammates take chip. The ability actively harms the team's longevity.

### Weather / Terrain Conflict with Teammate STABs

A weather or terrain ability that weakens a teammate's primary STAB:

- **Drought** (Sun) weakens Water-type moves. Problematic if a teammate relies on Water STAB.
- **Drizzle** (Rain) weakens Fire-type moves. Problematic if a teammate relies on Fire STAB.
- **Electric Terrain** blocks grounded Pokemon from using priority moves. Problematic if teammates rely on Mach Punch, Sucker Punch, etc.

**Severity heuristics:**
- **Yellow flag:** One teammate's secondary STAB is weakened.
- **Red flag:** A core attacker's primary STAB is weakened or blocked.

### Redundant Intimidate

Multiple Intimidate users on the same team:

- **Within a bring-4:** Harmful redundancy (see Role Redundancy below).
- **Across the team of 6:** Usually insurance, but if both appear in the same bring-4 and one lacks follow-up utility, it's wasteful.

### Shared Ability Vulnerability

Multiple team members relying on the same ability-based immunity:

- **3+ Pokemon with Levitate:** A single Mold Breaker, Gravity, or Thousand Arrows user bypasses all of them.
- **3+ Pokemon with Flash Fire:** A single Pokemon with Mold Breaker or a non-Fire attack bypasses the immunity.
- **3+ Pokemon with Storm Drain / Water Absorb:** Electric or Grass coverage bypasses the Water immunity.

**Severity heuristics:**
- **Yellow flag:** 2-3 Pokemon share an ability-based immunity and the counterplay is uncommon.
- **Red flag:** 3+ Pokemon share an ability-based immunity and the counterplay is common in the meta.

### Evaluation Rule

Before scoring **Defensive Cohesion** or **Pair Synergy**, run this audit. If any red flag is found, downgrade the relevant dimension by one tier. If multiple red flags are found, downgrade by two tiers (minimum 1).

## Team-Wide Friendly Fire Audit

Evaluate friendly fire at the team level, not just the pair level. Spread moves that hit allies create cumulative risk when multiple team members use them.

### Spread Move Clustering

If **3+ team members** use spread moves that hit allies (Earthquake, Discharge, Surf, Sludge Wave, etc.) and the team has **≤1 immunity** to those moves via type or ability, the team has structural friendly-fire risk even if no individual pair is flagged.

**Severity heuristics:**
- **Yellow flag:** 2–3 spread-move users with 1 immunity. Manageable but limits fielding flexibility.
- **Red flag:** 3+ spread-move users with 0–1 immunity, or the immunity belongs to a non-core slot. The team cannot safely field its full offensive toolkit.

**Cross-ref:** See `Anti-Synergy Evaluation` > Friendly Fire for pair-level analysis. This audit supplements, not replaces, pair-level checks.

## Mode Pairs

Pairs with a coherent Turn 1 game plan when led together.

### Fake Out + Setup

One Pokemon uses Fake Out to flinch an opponent. The partner uses the free turn to boost stats.

- **What to check:** Does one Pokemon have Fake Out? Does the partner have Dragon Dance, Swords Dance, Calm Mind, Nasty Plot, Quiver Dance, Tailwind, or Trick Room?
- **Examples:** Sableye (Fake Out) + Feraligatr (Dragon Dance), Incineroar (Fake Out) + Hatterene (Trick Room)
- **Quality signals:**
  - Strong: the Fake Out user has follow-up utility after Turn 1.
  - Strong: the setup move only needs one turn to become threatening.
  - Weak: the Fake Out user has nothing useful to do on Turn 2+.
  - Weak: the opponent has two threatening leads, and flinching one still leaves the other free to KO or disrupt.
- **Stacking:** Layers with Offensive Combos > Setup + Enabler and Helping Hand + Power Move. See `tempo.md` > Lead Pair Evaluation > Fake Out + Attacker/Setter.

### Redirector + Sweeper

One Pokemon uses Follow Me or Rage Powder to absorb single-target attacks. The partner attacks freely.

- **What to check:** Does one Pokemon have Follow Me or Rage Powder? Does the partner have high offensive stats or a setup move?
- **Examples:** Clefable (Follow Me) + Volcarona (Quiver Dance or Heat Wave), Amoonguss (Rage Powder) + Kingambit (Swords Dance)
- **Quality signals:**
  - Strong: the redirector is bulky enough to take 2+ redirected hits.
  - Strong: the redirector has recovery or defensive utility beyond redirection.
  - Weak: the redirector goes down to one redirected hit.
  - Weak: the sweeper's main threats use spread moves that bypass redirection.
- **Stacking:** Layers with Offensive Combos > Setup + Enabler. Cross-ref Anti-Synergy Evaluation > Friendly Fire.

### Speed Control + Slow Attacker

One Pokemon sets Tailwind or Trick Room. The partner benefits from the speed change.

- **What to check:** Does one Pokemon have Tailwind or Trick Room? For Tailwind: does the partner sit in the mid speed tier where Tailwind shifts it to effectively blazing? For Trick Room: does the partner sit in the Trick Room speed tier with high offenses?
- **Examples:** Corviknight (Tailwind) + Feraligatr (mid tier), Hatterene (Trick Room) + Torkoal (TR tier)
- **Quality signals:**
  - Strong: the attacker is in the ideal tier for the speed control type.
  - Strong: the speed control setter is bulky enough or has protection to reliably get the move off.
  - Weak: the attacker is already in the blazing tier — Tailwind is redundant.
  - Weak: the speed control setter is too frail to survive Turn 1.
- **Stacking:** See `speed-tiers.md` > Speed Control Interaction. Layers with Offensive Combos > Setup + Enabler. See `tempo.md` and `win-conditions.md`.

### Dual Offensive Pressure

Two Pokemon that together threaten a wide range of defensive profiles, forcing the opponent into difficult Protect/switch decisions on Turn 1.

- **What to check:** Do the two Pokemon's STAB types and main coverage moves together threaten most common VGC defensive profiles? Do they hit different types super-effectively with minimal overlap? Do they threaten different defensive profiles (one handles physical walls, the other special walls)?
- **Examples:** Garchomp (Ground/Dragon STAB) + Gardevoir (Psychic/Fairy STAB) — together they hit Fighting, Poison, Dragon, Ground, Fire, Electric, Rock, Steel, Dark super-effectively
- **Quality signals:**
  - Strong: both Pokemon threaten KOs independently.
  - Strong: the pair's STAB types have minimal overlap in what they hit super-effectively.
  - Strong: one is physical and the other special, making it hard to wall both with Intimidate or a single defensive Pokemon.
  - Weak: both Pokemon are the same attack category. A single Intimidate or Snarl weakens both.
  - Weak: significant type overlap — they both threaten the same types and leave the same types unchecked.
- **Stacking:** See `tempo.md` > Lead Pair Evaluation > Dual Offense. Layers with Defensive Pivot Pairs > Type Complement.

## Evaluating Layered Synergy

When assessing a pair, don't stop at the first pattern match. Count how many patterns the pair satisfies across all three categories, and note which categories they span.

**Layer count heuristics:**

- **1 pattern:** Functional. The pair has a reason to be fielded together, but it's a single-dimensional relationship.
- **2-3 patterns across categories:** Strong core pair. These pairs justify building around.
- **4+ patterns:** Exceptional. Likely a meta-proven combination. These pairs are load-bearing.

**Cross-category layers are more valuable than same-category layers.** A pair with one offensive combo, one defensive pivot pattern, and one mode pair (3 categories) is more robust than a pair with three offensive combos (1 category).

**How to use this in team evaluation:**

1. For each pair on the team, count pattern matches and note the categories (using the sampling heuristic above).
2. The team's top 2-3 pairs by layer count are its "engine" — they should appear in the core-4.
3. If no pair exceeds 1 pattern, the team lacks a synergy engine and is relying on individual Pokemon strength. This is a flag.
4. If a pair has high synergy layers but also has an anti-synergy flag, evaluate the trade-off explicitly.

## Coverage for Common Immunities

A pair (and by extension the full team) must be able to damage everything it faces. Immunities create free switch-ins and dead turns if the team cannot answer them.

**Common immunities to check:**
- **Ghost-types** immune to Normal and Fighting.
- **Flying-types / Levitate** immune to Ground.
- **Ground-types / Lightning Rod / Volt Absorb / Motor Drive** immune to Electric.
- **Water-types / Storm Drain / Water Absorb / Dry Skin** immune or healed by Water.
- **Fire-types / Flash Fire** immune to Fire.
- **Grass-types / Sap Sipper** immune to Grass.
- **Steel-types** immune to Poison.
- **Fairy-types** immune to Dragon.

**What to check:**
- For each common immunity, does the pair have at least one move that can hit the immune Pokemon super-effectively or for neutral damage?
- At the team level, does every viable bring-4 have an answer to Ghost immunities (Normal/Fighting immunity)? This is the most common coverage hole.
- Does any Pokemon on the team rely on a single STAB type that is fully immune to by a common type in the meta?

**Severity heuristics:**
- **Ignorable:** One immunity in the format is not covered, but the team rarely faces that type.
- **Yellow flag:** One immunity is uncovered and the team faces it in common matchups (e.g., no way to hit Ghost-types when common Ghosts are prevalent).
- **Red flag:** Two or more common immunities are uncovered, or a core pair has no way to damage a prevalent defensive type.

## Anti-Synergy Evaluation

Anti-synergies are reasons a pair is actively bad together on the field. Not every pair needs to be synergistic, but pairs with anti-synergies cost something when fielded together.

### Shared Weakness Clustering

Both Pokemon are weak to the same type, and neither resists it.

- **What to check:** List each Pokemon's weaknesses. Identify types that appear as a weakness for both. Does either Pokemon resist that type?
- **Severity heuristics:**
  - **Ignorable (1 shared weakness):** Normal. Only a concern if the shared weakness is a very common offensive type AND neither Pokemon has notable bulk.
  - **Yellow flag (2 shared weaknesses):** Worth noting. Check whether the team's other bring-4 members cover both gaps.
  - **Red flag (3+ shared weaknesses):** Serious problem, especially if any shared weakness is common offensively. This pair creates a liability when fielded together.
- **Context:** Shared weakness matters more within a bring-4 than across the full team of 6.

**Cross-ref:** See `Team-Wide Ability Anti-Synergy Audit` > Shared Ability Vulnerability for when multiple team members rely on the same ability-based immunity.

**Cross-reference:** For a team-level audit of whether the team can hit common defensive types super-effectively, see `SKILL.md` > Move Coverage & Optimization > Offensive Coverage Audit.

### Role Redundancy

Two Pokemon fill the same role with nothing to differentiate their contributions when fielded together.

- **What to check:** Do both Pokemon perform the same function — two Fake Out users, two redirectors, two Tailwind setters, two setup sweepers targeting the same defensive profile?
- **Severity heuristics:**
  - **Ignorable:** The redundancy serves different modes.
  - **Yellow flag:** Both appear in the same bring-4, but one has secondary utility the other lacks.
  - **Red flag:** Both appear in the same bring-4 and offer essentially the same contribution. One is a wasted slot.
- **Context:** Redundancy is only a problem if it costs the team a role it needs. Check `roles.md` > Speed Control or `roles.md` > Intimidate / Attack Drops for the specific role.

### Strategy Conflict

Two Pokemon's optimal game plans contradict each other when fielded together.

- **What to check:** Do the two Pokemon want different things from the game state? Tailwind setter + Trick Room attacker in the same mode. Weather setter + a different weather setter. A Pokemon that wants to stall + a Pokemon that wants to rush.
- **Severity heuristics:**
  - **Ignorable:** The conflicting Pokemon are in different bring-4 modes.
  - **Yellow flag:** They appear in the same mode, but one Pokemon can function suboptimally under the other's preferred game state.
  - **Red flag:** They appear in the same mode and actively sabotage each other.
- **Context:** Strategy conflict within a mode is the issue. Across modes, "conflict" is flexibility. See `tempo.md` > Plan B Resilience.

### Tempo Mismatch

One Pokemon needs to act immediately while the partner needs a setup turn, and neither can support the other during the gap.

- **What to check:** Does one Pokemon's value decay sharply after Turn 1 (e.g., Eruption Torkoal)? Does the partner need a turn to set up? Does the immediate-pressure Pokemon have no way to protect or enable the partner?
- **Severity heuristics:**
  - **Ignorable:** The immediate-pressure Pokemon can Protect on Turn 1 while the partner sets up.
  - **Yellow flag:** The immediate-pressure Pokemon loses significant value by waiting.
  - **Red flag:** Leading both together forces a lose-lose Turn 1.
- **Context:** This is specifically about lead dynamics. See `tempo.md` > Lead Pair Evaluation.

### Friendly Fire

One Pokemon's spread moves or abilities damage or hinder the partner.

- **What to check:**
  1. Does one Pokemon run Earthquake, Discharge, Surf, or another spread move? Check `assets/moves.json` for the `target` field — some moves labeled as spread in mainline games may only target opponents in Champions.
  2. If the move hits allies, is the partner immune via type or ability? Check `assets/abilities.json` for Levitate, Telepathy, Lightning Rod, Storm Drain, Water Absorb, etc.
  3. Does one Pokemon have an ability that negatively affects the partner (e.g., Sand Stream chip on a non-Rock/Ground/Steel partner)?
- **Severity heuristics:**
  - **Ignorable:** The friendly fire is minor chip and doesn't threaten a KO.
  - **Yellow flag:** The friendly fire deals moderate damage but the spread move is important enough to accept the cost. Check for single-target alternatives (e.g., High Horsepower instead of Earthquake).
  - **Red flag:** The friendly fire threatens to KO the partner or deals super-effective damage. The pair cannot safely be on the field together.
- **Context:** Friendly fire is only relevant when both Pokemon are on the field simultaneously. If the spread move user learns a single-target equivalent, the anti-synergy may be fixable with a move swap.
