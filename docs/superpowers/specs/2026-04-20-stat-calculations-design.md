# Stat Calculations: Mathematical Analysis Layer

## Summary

Add a mathematical analysis layer to the evaluating-vgc-viability skill. The existing heuristic reference files (speed-tiers.md, win-conditions.md, tempo.md, synergies.md) remain the default reasoning framework. The new reference file provides exact formulas for stat calculation, speed thresholds, damage calculation, bulk thresholds, and offensive thresholds. Entry-point skills invoke the math on demand when precision matters -- suggesting specific EV spreads, comparing candidates in the same tier, or answering "can X survive Y?"

## Approach

Single monolithic reference file (`reference/stat-calculations.md`) in evaluating-vgc-viability, following the same pattern as the other reference files. Each section is self-contained; skills read only the section they need. Item and ability multipliers are added as numeric fields in the data files (items.json, abilities.json) rather than encoded in the reference file, keeping data in data files and logic in the reference file.

## Changes

### 1. New file: reference/stat-calculations.md

A formula reference that teaches the entry-point skills how to calculate stats, damage, and thresholds. Contains exact formulas with floor operations, worked examples using Pokemon/moves from the roster data files, and usage guidance. Results are presented as thresholds and binary KO determinations (damage is deterministic in Champions -- no random roll).

**Usage guidance (top of file):**

The entry-point skills should invoke these calculations when they need a precise answer that the qualitative heuristics in speed-tiers.md, win-conditions.md, or tempo.md cannot provide. Common triggers: suggesting specific EV spreads, comparing two candidates in the same speed tier, answering "can X survive Y?", or determining exact investment thresholds. Present results as thresholds and survival determinations, not raw damage numbers. Default to heuristic reasoning; use math to sharpen decisions.

#### Section 1: Stat Calculation (Level 50)

The foundation. All other sections depend on this.

**Contents:**

- The Gen 9 stat formula for HP and non-HP stats at Level 50. HP uses a different equation from the other five stats. Both formulas written out with floor operations.
- Nature multiplier rules: 1.1x for the boosted stat, 0.9x for the hindered stat, 1.0x for neutral stats. A lookup table of competitively relevant natures mapped to their boosted/hindered stats (Adamant = +Atk/-SpA, Modest = +SpA/-Atk, Jolly = +Spe/-SpA, Timid = +Spe/-Atk, Bold = +Def/-Atk, Calm = +SpD/-Atk, Brave = +Atk/-Spe, Quiet = +SpA/-Spe, etc.).
- The formula for final stat after stage modifiers: +1 = 1.5x, +2 = 2.0x, +3 = 2.5x, +4 = 3.0x, +5 = 3.5x, +6 = 4.0x, and the inverse for negative stages (-1 = 0.67x, -2 = 0.5x, etc.). Used for post-boost calculations (Swords Dance = +2 Atk, Dragon Dance = +1 Atk and +1 Spe, etc.).
- Worked example: Feraligatr with Adamant nature, 252 Atk EVs, 31 IVs -- calculate the final Atk stat at Lv50.

#### Section 2: Speed Thresholds

Builds on Section 1 to answer "how fast is X, and what does it take to outspeed Y?"

**Contents:**

- **Base speed calculation procedure:** Given a Pokemon's base Speed from champions-roster.json, IVs, EVs, and nature, calculate the final Speed stat at Lv50. Direct application of Section 1, called out explicitly since speed is the most common calculation.

- **Outspeeding a target:** Given your Pokemon and a target, calculate the minimum Speed EVs (and whether a boosting nature is needed) to outspeed the target at a given investment level. Procedure: calculate the target's Speed stat at the assumed investment, then solve backwards for the minimum EVs to exceed it by 1.

- **Speed modifier interactions** -- how to calculate effective speed under:
  - Tailwind (2x)
  - Trick Room (move order inverted -- lower Speed moves first)
  - Choice Scarf (1.5x, look up from items.json `speedModifier` field)
  - Dragon Dance / other +1 Speed boosts (1.5x via stage modifier)
  - Paralysis (0.5x)
  - Icy Wind / Electroweb (-1 Speed stage = 0.67x)
  - Stacking: Tailwind + Dragon Dance, Choice Scarf + Icy Wind, etc.

- **Common benchmarks procedure:** How to generate a speed tier list for a given team -- calculate each team member's Speed stat at their current EVs, then compare against common base Speed values from the roster. Replaces eyeballing tier placement with exact numbers.

- **Worked example:** "How many Speed EVs does Adamant Feraligatr need to outspeed max Speed Garchomp under Tailwind?" -- walks through both calculations and finds the minimum investment.

**Cross-ref to speed-tiers.md:** The qualitative tiers (Blazing/Fast/Mid/Slow/TR) remain the reasoning framework. This section provides the math when the heuristic says "a few extra EVs might let you cross into the next tier" and the skill needs to determine exactly how many.

#### Section 3: Damage Calculation

The core engine. Sections 4 and 5 both depend on this.

**Contents:**

- **The Gen 9 damage formula**, written out step by step with floor operations:
  1. Base damage: `floor(floor(floor(2 * 50 / 5 + 2) * power * atk / def) / 50 + 2)`
  2. Modifier chain applied sequentially: each modifier multiplied and floored individually (the order of floor operations affects results).

- **Modifier chain** in application order:
  1. Spread penalty (0.75x if the move targets both opponents in doubles)
  2. Weather (1.5x for Fire in Sun / Water in Rain, 0.5x for Fire in Rain / Water in Sun)
  3. STAB (1.5x, or look up Adaptability = 2.0x from abilities.json `stabModifier` field)
  4. Type effectiveness (from type-chart.json, multiply for dual types)
  5. Burn (0.5x on physical moves if attacker is burned)
  6. Item modifier (look up from items.json `damageModifier` field -- Life Orb, Choice Band/Specs, type-boosting items, etc. If no `damageModifier` field, modifier is 1.0x)
  7. Ability modifier (look up from abilities.json `damageModifier` or `atkModifier` field -- Huge Power, Flash Fire, etc. If no modifier field, modifier is 1.0x)

- **Deterministic damage:** Champions damage has no random factor. The formula produces one exact damage value. KO determination is binary: compare the damage value against the defender's HP stat. "OHKOs" or "does not OHKO." For 2HKOs, compare `damage * 2` against the defender's HP (adjusted for recovery items if applicable).

- **Stat stage modifiers in damage context:** If the attacker has a stat stage boost (e.g., +2 Atk from Swords Dance, +1 Atk from Dragon Dance), multiply the attack stat by the stage modifier from Section 1 before plugging into the formula.

- **Worked example:** "252+ Atk Life Orb Feraligatr Liquidation vs. 252 HP / 0 Def Incineroar" -- walks through every step of the formula with actual numbers from the data files.

#### Section 4: Bulk Thresholds

Builds on Section 3 to answer "how much defensive investment does X need to survive Y?"

**Contents:**

- **Survive-a-hit procedure:** Given a defending Pokemon and a specific attack (attacker + move + attacker's investment), calculate the damage using Section 3. Compare against the defender's HP stat. If it doesn't survive, solve backwards: what's the minimum combination of HP/Def/SpD EVs to bring the damage below the HP stat?

- **HP vs. Defense investment efficiency:** When HP EVs are more efficient than Def/SpD EVs and vice versa. The general principle: HP investment benefits both physical and special bulk simultaneously, so it's more efficient when the Pokemon faces mixed damage. Dedicated Def or SpD investment is better when the survival problem is one-sided. The file provides the procedure to compare: calculate the damage with +4 HP EVs vs. +4 Def EVs and see which reduces damage taken more for that specific attack.

- **Multi-hit benchmarking:** When the goal is surviving two hits (2HKO threshold), calculate single-hit damage and compare `damage * 2` against HP. If the Pokemon has recovery (Sitrus Berry restoring 25% HP from items.json `hpRestore` field, Leftovers, etc.), factor the recovery into the 2HKO calculation.

- **Benchmark-first procedure for entry-point skills:** When suggesting EV spreads:
  1. Identify 1-2 key attacks the Pokemon needs to survive (from meta context if available, or from type matchups)
  2. Calculate the minimum defensive investment to survive each
  3. Allocate remaining EVs to offense or speed
  
  This replaces generic 252/252/4 spreads with threat-informed spreads.

- **Worked example:** "How many HP/SpD EVs does Adamant Feraligatr need to survive 252 SpA Gardevoir's Dazzling Gleam?" -- solves backwards from the damage formula to find the minimum investment.

#### Section 5: Offensive Thresholds

Builds on Section 3 in the other direction -- "how much offensive investment to guarantee a KO?"

**Contents:**

- **OHKO threshold procedure:** Given an attacker, a move, and a target (with assumed defensive investment), find the minimum Atk/SpA EVs (and whether a boosting nature is needed) to OHKO the target. Procedure: start from the damage formula, plug in the target's defensive stats, and solve backwards for the minimum attack stat that produces damage >= target's HP.

- **2HKO threshold procedure:** Same approach but the threshold is `damage >= ceil(target HP / 2)`. If the target holds Sitrus Berry, the threshold adjusts to account for the heal between hits.

- **Post-boost thresholds:** Calculate offensive thresholds assuming stat stage boosts. Common boost amounts:
  - Swords Dance = +2 Atk (2.0x)
  - Nasty Plot = +2 SpA (2.0x)
  - Dragon Dance = +1 Atk (1.5x) and +1 Spe (1.5x)
  - Quiver Dance = +1 SpA (1.5x), +1 SpD (1.5x), +1 Spe (1.5x)
  - Calm Mind = +1 SpA (1.5x) and +1 SpD (1.5x)
  
  This answers "after one Dragon Dance, does Feraligatr OHKO X with Y investment?" -- the skill can then determine whether a Pokemon can run less offensive investment because it plans to boost.

- **Comparing candidates:** When the entry-point skills are choosing between two Pokemon for a slot, calculate what each one can OHKO/2HKO at equivalent investment levels. This turns "both hit hard" into "A OHKOs threats X and Y, B only 2HKOs X but OHKOs Z that A can't touch." Concrete matchup comparison instead of base stat eyeballing.

- **Worked example:** "How much Atk investment does Adamant Feraligatr need to OHKO 252 HP / 0 Def Incineroar with Liquidation after +1 Dragon Dance?" -- solves backwards through the damage formula with the +1 stage modifier applied.

---

### 2. Data file changes: items.json

Add numeric fields to items that affect calculations. Items without these fields are assumed to have no numeric effect (1.0x modifier).

**New fields:**

- `damageModifier` (number): Multiplier applied to damage. Examples:
  - Choice Band: `1.5` (with `damageCondition`: "physical moves only")
  - Choice Specs: `1.5` (with `damageCondition`: "special moves only")
  - Life Orb: `1.3`
  - Type-boosting items (Charcoal, Mystic Water, Black Belt, Black Glasses, Dragon Fang, Fairy Feather, etc.): `1.2` (with `damageCondition`: "[type]-type moves only")
  - Expert Belt: `1.2` (with `damageCondition`: "super-effective hits only")

- `damageCondition` (string): When the damageModifier applies. Only present when the modifier is conditional.

- `speedModifier` (number): Multiplier applied to Speed stat. Examples:
  - Choice Scarf: `1.5`

- `hpRestore` (number): Fraction of max HP restored. Examples:
  - Sitrus Berry: `0.25`

**Example updated entry:**

```json
"Choice Band": {
  "category": "Hold Item",
  "effect": "An item to be held by a Pokemon. This curious band boosts the holder's Attack stat but only allows the use of a single move.",
  "damageModifier": 1.5,
  "damageCondition": "physical moves only"
}
```

---

### 3. Data file changes: abilities.json

Add numeric fields to abilities that affect calculations. Abilities without these fields are assumed to have no numeric effect.

**New fields:**

- `damageModifier` (number): General damage multiplier. Examples:
  - Flash Fire (activated): `1.5` (with `damageCondition`: "Fire-type moves when activated")

- `atkModifier` (number): Multiplier applied to the Attack stat. Examples:
  - Huge Power: `2.0`
  - Pure Power: `2.0`
  - Intimidate: `0.67` (with `damageCondition`: "applied to opponents on switch-in")

- `stabModifier` (number): Replaces the default 1.5x STAB multiplier. Examples:
  - Adaptability: `2.0`

- `damageCondition` (string): When the modifier applies. Only present when the modifier is conditional.

---

### 4. Updates to evaluating-vgc-viability/SKILL.md

Add the new file to the reference file listing:

```
- reference/stat-calculations.md -- stat formulas, speed thresholds, damage calculation, bulk and offensive thresholds
```

---

### 5. Updates to building-vgc-teams/SKILL.md

#### Data Sources section

Add to the evaluating-vgc-viability optional block:

```
- reference/stat-calculations.md -- stat formulas, speed thresholds, damage calculation, bulk and offensive thresholds
```

#### Step 3 (Build Out, slots 3-4)

When comparing candidates in the same speed tier, reference stat-calculations.md > Speed Thresholds to determine exactly which threats each candidate outspeeds and by how much. When two candidates fill a similar role, reference stat-calculations.md > Offensive Thresholds to compare what each can KO at equivalent investment levels.

Integration is gated behind evaluating-vgc-viability availability, same as existing speed-tiers.md and win-conditions.md references.

#### Step 5 (Set Refinement)

Replace the generic 252/252/4 baseline with a benchmark-driven approach when evaluating-vgc-viability is available:

1. Identify 1-2 key threats the Pokemon needs to outspeed (stat-calculations.md > Speed Thresholds)
2. Identify 1-2 key attacks the Pokemon needs to survive (stat-calculations.md > Bulk Thresholds)
3. Identify 1-2 key targets the Pokemon needs to KO (stat-calculations.md > Offensive Thresholds)
4. Calculate minimum investment for each benchmark, then allocate remaining EVs

If evaluating-vgc-viability is unavailable, continue using 252/252/4 as a fallback baseline.

---

### 6. Updates to evaluating-vgc-teams/SKILL.md

#### Data Sources section

Add to the evaluating-vgc-viability optional block (same as building-vgc-teams):

```
- reference/stat-calculations.md -- stat formulas, speed thresholds, damage calculation, bulk and offensive thresholds
```

#### Layer 6 (Set Optimization)

The EVs/Nature subsection already instructs "provide specific benchmarks." This change gives it the tools to calculate them. When suggesting EV changes, reference stat-calculations.md to produce exact numbers. The existing instruction ("84 Spe EVs lets Feraligatr outspeed base 130s after +1 Dragon Dance") becomes a procedure the skill can execute for any Pokemon/target pair, not a pre-known example.

Integration is gated behind evaluating-vgc-viability availability.

---

## What Doesn't Change

- **reference/speed-tiers.md** -- stays as-is. The qualitative tiers remain the reasoning framework. stat-calculations.md provides the math when precision is needed; speed-tiers.md provides the strategic context for when speed investment matters.
- **reference/win-conditions.md** -- stays as-is. Win condition evaluation is structural, not stat-dependent.
- **reference/tempo.md** -- stays as-is. Lead evaluation and resilience are strategic assessments.
- **reference/synergies.md** -- stays as-is. Synergy patterns are qualitative.
- **reference/roles.md** -- stays as-is. Role definitions don't need math.
- **reference/archetypes.md** -- stays as-is.
- **reference/items.md** -- stays as-is. Item selection heuristics are separate from item multiplier data.
- **checking-vgc-legality** -- no changes to SKILL.md or type-chart.json or moves.json. Items.json and abilities.json get new fields but existing fields are unchanged.
- **evaluating-vgc-meta** -- no changes.
- **evaluating-vgc-teams Layers 1-5, 7-8** -- no direct integration. These layers continue using heuristics.
- **evaluating-vgc-teams Layer 6** -- gains calculation support but the layer's structure and fix-tier system don't change.

## Cross-Reference Map

| Source file | References | Section referenced |
|---|---|---|
| stat-calculations.md | champions-roster.json | Base stats for all calculations |
| stat-calculations.md | moves.json | Move power, type, category for damage formula |
| stat-calculations.md | type-chart.json | Type effectiveness multipliers for damage formula |
| stat-calculations.md | items.json | damageModifier, speedModifier, hpRestore fields |
| stat-calculations.md | abilities.json | damageModifier, atkModifier, stabModifier fields |
| stat-calculations.md | speed-tiers.md | Cross-ref: qualitative tiers as reasoning framework |
| building-vgc-teams SKILL.md | stat-calculations.md | Speed Thresholds (Step 3), Bulk/Offensive Thresholds (Step 5) |
| evaluating-vgc-teams SKILL.md | stat-calculations.md | All sections (Layer 6: Set Optimization) |
