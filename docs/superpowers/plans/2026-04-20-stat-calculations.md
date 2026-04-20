# Stat Calculations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a mathematical analysis layer (stat formulas, damage calculation, speed/bulk/offensive thresholds) to the VGC skills, complementing existing heuristics with exact math invoked on demand.

**Architecture:** A new reference file (`reference/stat-calculations.md`) in evaluating-vgc-viability provides the formulas. Numeric modifier fields are added to items.json and abilities.json so the formulas can look up multipliers from data. Two consumer skills (building-vgc-teams, evaluating-vgc-teams) get light integration at their existing EV/set suggestion points.

**Tech Stack:** Markdown skill files + JSON data files. No code, no tests. Validation is manual review — verify worked examples produce correct numbers.

---

## File Map

| Action | File | Responsibility |
|--------|------|---------------|
| Create | `skills/evaluating-vgc-viability/reference/stat-calculations.md` | Stat formulas, speed thresholds, damage calculation, bulk and offensive thresholds |
| Modify | `skills/checking-vgc-legality/items.json` | Add damageModifier, damageCondition, speedModifier, hpRestore fields to relevant items |
| Modify | `skills/checking-vgc-legality/abilities.json` | Add damageModifier, atkModifier, stabModifier, damageCondition, speedModifier fields to relevant abilities |
| Modify | `skills/evaluating-vgc-viability/SKILL.md` | Add stat-calculations.md to reference listing |
| Modify | `skills/building-vgc-teams/SKILL.md` | Add data source, Step 3 calc references, Step 5 benchmark-driven EVs |
| Modify | `skills/evaluating-vgc-teams/SKILL.md` | Add data source, Layer 6 calc references |

---

### Task 1: Create stat-calculations.md — Stat Calculation and Speed Thresholds

**Files:**
- Create: `skills/evaluating-vgc-viability/reference/stat-calculations.md`

This task writes the first two sections of the reference file. Task 2 adds the damage formula and threshold sections.

- [ ] **Step 1: Create stat-calculations.md with Sections 1-2**

Create `skills/evaluating-vgc-viability/reference/stat-calculations.md` with the following content:

```markdown
# Stat Calculations

Mathematical formulas for precise stat analysis in Pokemon Champions VGC. Use these calculations when the qualitative heuristics in speed-tiers.md, win-conditions.md, or tempo.md cannot provide a precise enough answer.

**When to use math:** Suggesting specific EV spreads, comparing two candidates in the same speed tier, answering "can X survive Y?", or determining exact investment thresholds. Present results as thresholds and survival determinations, not raw damage numbers. Default to heuristic reasoning; use math to sharpen decisions.

**Data sources:** All base stats come from champions-roster.json. Move details from moves.json. Type effectiveness from type-chart.json. Item multipliers from items.json (numeric fields: `damageModifier`, `speedModifier`, `hpRestore`). Ability multipliers from abilities.json (numeric fields: `damageModifier`, `atkModifier`, `stabModifier`, `speedModifier`).

---

## Section 1: Stat Calculation (Level 50)

The foundation for all other calculations. Pokemon Champions uses Level 50 for VGC.

### HP Formula

```
HP = floor((2 * base + IV + floor(EV / 4)) * 50 / 100) + 50 + 10
```

Where:
- `base` = base HP stat from champions-roster.json
- `IV` = individual value (assume 31 unless specified otherwise)
- `EV` = effort value (0-252, must be divisible by 4 for whole stat points)
- Level is always 50

**Note:** Shedinja always has 1 HP regardless of the formula.

### Non-HP Stat Formula

```
stat = floor((floor((2 * base + IV + floor(EV / 4)) * 50 / 100) + 5) * natureMultiplier)
```

Where:
- `base` = base stat (Atk, Def, SpA, SpD, or Spe) from champions-roster.json
- `IV` = individual value (assume 31 unless specified otherwise)
- `EV` = effort value (0-252)
- `natureMultiplier` = 1.1 (boosted), 0.9 (hindered), or 1.0 (neutral)

### Nature Multipliers

| Nature | Boosted (+10%) | Hindered (-10%) |
|--------|---------------|----------------|
| Adamant | Atk | SpA |
| Modest | SpA | Atk |
| Jolly | Spe | SpA |
| Timid | Spe | Atk |
| Bold | Def | Atk |
| Impish | Def | SpA |
| Calm | SpD | Atk |
| Careful | SpD | SpA |
| Brave | Atk | Spe |
| Quiet | SpA | Spe |
| Relaxed | Def | Spe |
| Sassy | SpD | Spe |
| Naive | Spe | SpD |
| Hasty | Spe | Def |
| Naughty | Atk | SpD |
| Lonely | Atk | Def |
| Mild | SpA | Def |
| Rash | SpA | SpD |
| Hardy | — | — |
| Docile | — | — |
| Serious | — | — |
| Bashful | — | — |
| Quirky | — | — |

### Stat Stage Modifiers

When a Pokemon's stat is raised or lowered in battle (by moves like Swords Dance, Intimidate, etc.), multiply the final stat by the stage multiplier:

| Stage | Multiplier | Common source |
|-------|-----------|--------------|
| +6 | 4.0x | — |
| +5 | 3.5x | — |
| +4 | 3.0x | — |
| +3 | 2.5x | — |
| +2 | 2.0x | Swords Dance (Atk), Nasty Plot (SpA) |
| +1 | 1.5x | Dragon Dance (Atk + Spe), Calm Mind (SpA + SpD), Quiver Dance (SpA + SpD + Spe) |
| 0 | 1.0x | Base |
| -1 | 0.67x | Intimidate (opponent Atk), Icy Wind (opponent Spe) |
| -2 | 0.5x | — |
| -3 | 0.4x | — |
| -4 | 0.33x | — |
| -5 | 0.29x | — |
| -6 | 0.25x | — |

**Important boost amounts for common moves:**
- Swords Dance: +2 Atk
- Nasty Plot: +2 SpA
- Dragon Dance: +1 Atk, +1 Spe
- Quiver Dance: +1 SpA, +1 SpD, +1 Spe
- Calm Mind: +1 SpA, +1 SpD
- Growth (in Sun): +2 Atk, +2 SpA
- Growth (no Sun): +1 Atk, +1 SpA

### Worked Example: Feraligatr's Attack Stat

Feraligatr: base Atk = 105 (from champions-roster.json). Adamant nature (+Atk). 252 Atk EVs. 31 IVs.

```
inner = 2 * 105 + 31 + floor(252 / 4) = 210 + 31 + 63 = 304
stat  = floor(304 * 50 / 100) + 5 = floor(152) + 5 = 157
final = floor(157 * 1.1) = floor(172.7) = 172
```

Adamant 252 Atk Feraligatr has **172 Atk** at Level 50.

After +1 from Dragon Dance: `floor(172 * 1.5)` = **258 Atk**.
After +2 from Swords Dance: `floor(172 * 2.0)` = **344 Atk**.

---

## Section 2: Speed Thresholds

Use these procedures to determine exact speed benchmarks — how many EVs to outspeed a target, effective speed under modifiers, and team speed tier lists.

### Calculating a Speed Stat

Apply the non-HP stat formula from Section 1 with the Pokemon's base Speed.

**Example:** Max Speed Jolly Garchomp.
- Base Spe = 102, Jolly nature (1.1x), 252 EVs, 31 IVs.

```
inner = 2 * 102 + 31 + floor(252 / 4) = 204 + 31 + 63 = 298
stat  = floor(298 * 50 / 100) + 5 = floor(149) + 5 = 154
final = floor(154 * 1.1) = floor(169.4) = 169
```

Max Speed Jolly Garchomp has **169 Spe** at Level 50.

### Outspeeding a Target

To find the minimum Speed EVs needed to outspeed a target:

1. Calculate the target's Speed stat at their assumed investment
2. Your Pokemon needs a Speed stat of at least `target + 1`
3. Solve backwards for EVs: rearrange the stat formula to find the minimum EVs that produce the required stat

**Solving for EVs given a target stat:**

```
requiredStat = targetSpeed + 1
inner = ceil((requiredStat - 5) / natureMultiplier)
rawStat = inner * 100 / 50 = inner * 2
EVs = (rawStat - 2 * base - IV) * 4
```

Round EVs up to the nearest multiple of 4 (EVs below 4 don't contribute a stat point). If EVs > 252, the Pokemon cannot outspeed the target with that nature — try a Speed-boosting nature or speed control.

**Example:** Adamant Feraligatr outspeeding max Speed Jolly Garchomp under Tailwind.

Garchomp's Speed = 169 (calculated above). Feraligatr needs 170 Spe under Tailwind, which means it needs `ceil(170 / 2)` = **85 base Speed stat** before Tailwind.

```
requiredStat = 85
inner = ceil((85 - 5) / 1.0) = 80   (Adamant doesn't affect Spe)
rawStat = 80 * 2 = 160
EVs = (160 - 2 * 78 - 31) * 4 = (160 - 156 - 31) * 4 = (-27) * 4 → negative means 0 EVs is enough
```

Check: Feraligatr with 0 Spe EVs, Adamant:
```
inner = 2 * 78 + 31 + 0 = 187
stat  = floor(187 * 50 / 100) + 5 = floor(93.5) + 5 = 98
final = floor(98 * 1.0) = 98
```

Under Tailwind: `98 * 2 = 196`. 196 > 169. Confirmed: **Adamant Feraligatr with 0 Speed EVs outspeeds max Speed Jolly Garchomp under Tailwind.**

### Speed Modifier Interactions

Speed modifiers multiply the final Speed stat. Apply them in this order:

| Modifier | Multiplier | Source |
|----------|-----------|--------|
| Paralysis | 0.5x | Status condition |
| Stat stage | See Section 1 table | Dragon Dance (+1), Icy Wind (-1), etc. |
| Choice Scarf | 1.5x | items.json `speedModifier` field |
| Tailwind | 2.0x | Team move |
| Weather speed (Chlorophyll, Swift Swim, Sand Rush, Slush Rush) | 2.0x | abilities.json `speedModifier` field |

**Stacking:** Modifiers multiply together. A +1 Speed Pokemon under Tailwind has `stat * 1.5 * 2.0 = stat * 3.0x` effective speed.

**Trick Room:** Under Trick Room, the Pokemon with the **lower** Speed stat moves first. There is no multiplier — Trick Room inverts the comparison. For Trick Room Pokemon, use a Speed-lowering nature (Brave for physical, Quiet for special) and 0 Speed EVs / 0 Speed IVs to minimize Speed.

**Minimum Speed calculation:** 0 EVs, 0 IVs, Speed-hindering nature:
```
inner = 2 * base + 0 + 0 = 2 * base
stat  = floor(2 * base * 50 / 100) + 5 = base + 5
final = floor((base + 5) * 0.9)
```

### Common Benchmarks Procedure

To generate a speed comparison for a team:

1. For each team member, calculate their Speed stat at their current EVs/nature using the formula above
2. Look up base Speed values of common threats from champions-roster.json
3. Calculate those threats' Speed stats at common investment levels (max Speed with boosting nature, max Speed with neutral nature, no investment)
4. List which threats each team member outspeeds and which outspeed it
5. Note how Tailwind/Trick Room/Choice Scarf changes each matchup

**Cross-ref to speed-tiers.md:** The qualitative tiers (Blazing/Fast/Mid/Slow/TR) remain the primary reasoning framework. Use these calculations when the heuristic says "a few extra EVs might let you cross into the next tier" and you need to determine exactly how many EVs.
```

- [ ] **Step 2: Verify the worked examples produce correct numbers**

Manually verify each calculation in the file:

1. Feraligatr Atk: base 105, Adamant, 252 EVs → should be 172. Check: `floor((floor((2*105+31+63)*50/100)+5)*1.1)` = `floor((floor(304*0.5)+5)*1.1)` = `floor((152+5)*1.1)` = `floor(157*1.1)` = `floor(172.7)` = 172. Correct.
2. Garchomp Spe: base 102, Jolly, 252 EVs → should be 169. Check: `floor((floor((2*102+31+63)*50/100)+5)*1.1)` = `floor((149+5)*1.1)` = `floor(154*1.1)` = `floor(169.4)` = 169. Correct.
3. Feraligatr 0 Spe EVs under Tailwind vs Garchomp 169: Feraligatr base 78, 0 EVs, Adamant (neutral Spe) → `floor((2*78+31+0)*50/100)+5` = `floor(93.5)+5` = `93+5` = 98. Under Tailwind: 196 > 169. Correct.

- [ ] **Step 3: Commit**

```bash
git add skills/evaluating-vgc-viability/reference/stat-calculations.md
git commit -m "feat: add stat-calculations.md sections 1-2 (stat formula + speed thresholds)"
```

---

### Task 2: Add Damage Calculation section to stat-calculations.md

**Files:**
- Modify: `skills/evaluating-vgc-viability/reference/stat-calculations.md`

- [ ] **Step 1: Append Section 3 (Damage Calculation) to stat-calculations.md**

Append the following after Section 2's closing content:

```markdown

---

## Section 3: Damage Calculation

The damage formula determines how much HP a move removes from the target. In Pokemon Champions, damage is **deterministic** — there is no random factor. Every calculation produces one exact number.

### The Damage Formula

```
baseDamage = floor(floor(floor(2 * 50 / 5 + 2) * power * atkStat / defStat) / 50 + 2)
```

Simplified (since level is always 50):

```
baseDamage = floor(floor(22 * power * atkStat / defStat) / 50 + 2)
```

Where:
- `power` = move's base power from moves.json
- `atkStat` = attacker's final Atk (for Physical moves) or SpA (for Special moves), after stat stage modifiers from Section 1
- `defStat` = defender's final Def (against Physical moves) or SpD (against Special moves), after stat stage modifiers

### Modifier Chain

After calculating baseDamage, apply modifiers **sequentially**. Each modifier is multiplied and then **floored** before applying the next. The order matters.

```
damage = baseDamage
damage = floor(damage * spreadPenalty)
damage = floor(damage * weather)
damage = floor(damage * STAB)
damage = floor(damage * typeEffectiveness)
damage = floor(damage * burn)
damage = floor(damage * itemModifier)
damage = floor(damage * abilityModifier)
```

#### 1. Spread Penalty

- 0.75x if the move's `target` field in moves.json is "All Adjacent Foes" or "All Adjacent" (hits both opponents in doubles)
- 1.0x for single-target moves

#### 2. Weather

- 1.5x if Fire-type move in Sun (Drought active) or Water-type move in Rain (Drizzle active)
- 0.5x if Fire-type move in Rain or Water-type move in Sun
- 1.0x otherwise

#### 3. STAB (Same-Type Attack Bonus)

- 1.5x if the move's type matches one of the attacker's types (from champions-roster.json)
- 2.0x if the attacker has the Adaptability ability (check abilities.json `stabModifier` field)
- 1.0x if the move type doesn't match the attacker's type
- For type-changing abilities (Aerilate, Pixilate, Refrigerate, Dragonize): the move's effective type changes before checking STAB. The 1.2x power boost from these abilities is applied as an abilityModifier (step 7), not here.

#### 4. Type Effectiveness

Look up the move's type vs. each of the defender's types in type-chart.json. Multiply the results together.

- Super effective: 2.0x per type
- Neutral: 1.0x (or missing entry = 1.0x)
- Not very effective: 0.5x per type
- Immune: 0.0x (entire damage is 0)

For a dual-type defender, multiply both effectiveness values. Example: Fairy-type move vs. Dragon/Ground: `2.0 * 1.0 = 2.0x`. Ice-type move vs. Dragon/Ground: `2.0 * 2.0 = 4.0x`.

#### 5. Burn

- 0.5x if the attacker is burned AND the move is Physical category
- 1.0x otherwise (Special moves are unaffected by burn)

#### 6. Item Modifier

Look up the attacker's held item in items.json. If the item has a `damageModifier` field, apply it. Check `damageCondition` to verify the condition is met (e.g., "physical moves only" for a Physical move, "Fire-type moves only" for a Fire-type move).

For **resistance berries** on the defender: look up the defender's held item. Resistance berries have `damageModifier: 0.5` with `damageCondition: "when hit by a supereffective [Type]-type move"`. Apply by multiplying damage by 0.5 if the move is super-effective and matches the berry's type. The berry is consumed after use (one-time effect).

If the item has no `damageModifier` field, the modifier is 1.0x.

#### 7. Ability Modifier

Look up relevant abilities in abilities.json:

- **Attacker's ability:** If it has an `atkModifier` field (e.g., Huge Power: 2.0x), this was already applied to the attack stat before the formula. Do not double-apply. If it has a `damageModifier` field (e.g., Flash Fire: 1.5x for Fire moves when activated), apply it here.
- **Defender's ability:** Some abilities reduce damage. Check abilities.json for defensive modifiers:
  - Multiscale: 0.5x when defender is at full HP
  - Filter / Solid Rock: 0.75x on super-effective hits
  - Fur Coat: 0.5x on physical moves (applied to the defense stat, effectively halving damage)
  - Thick Fat: 0.5x on Fire- and Ice-type moves
  - Heatproof: 0.5x on Fire-type moves
  - Dry Skin: 1.25x on Fire-type moves (takes more damage)
  - Purifying Salt: 0.5x on Ghost-type moves
  - Friend Guard: 0.75x (ally's ability, reduces damage to partner)

If the ability has no modifier fields, the modifier is 1.0x.

**Note on atkModifier abilities:** Abilities with `atkModifier` (Huge Power, Pure Power) modify the attack stat itself, not the damage. Apply the `atkModifier` to the stat **before** plugging it into the damage formula. The Intimidate `atkModifier: 0.67` works the same way — it modifies the opponent's Atk stat, equivalent to a -1 stage.

### KO Determination

Since damage is deterministic, KO checks are binary:

- **OHKO:** `damage >= defender's HP stat` → "OHKOs"
- **Does not OHKO:** `damage < defender's HP stat` → "does not OHKO (deals X%)" where X = `floor(damage / defenderHP * 100)`
- **2HKO:** `damage * 2 >= defender's HP stat` → "2HKOs"
- **2HKO with Sitrus Berry:** `damage * 2 >= defender's HP stat + floor(defender's HP stat * hpRestore)` where `hpRestore` is from the defender's item in items.json (Sitrus Berry: 0.25)

### Worked Example: Feraligatr Liquidation vs. Incineroar

**Setup:** 252+ Atk (Adamant) Feraligatr using Liquidation vs. 252 HP / 0 Def Incineroar.

**Step 1 — Attack stat:**
Feraligatr Atk = 172 (calculated in Section 1 worked example).

**Step 2 — Defense stat:**
Incineroar: base HP 95, base Def 90. 252 HP EVs, 0 Def EVs, assume neutral nature.
```
HP = floor((2 * 95 + 31 + floor(252/4)) * 50/100) + 60 = floor((190+31+63) * 0.5) + 60 = floor(142) + 60 = 202
Def = floor((2 * 90 + 31 + 0) * 50/100) + 5 = floor(211 * 0.5) + 5 = floor(105.5) + 5 = 110
```

**Step 3 — Base damage:**
Liquidation: Water, Physical, 85 power.
```
baseDamage = floor(floor(22 * 85 * 172 / 110) / 50 + 2)
           = floor(floor(22 * 85 * 172 / 110) / 50 + 2)
           = floor(floor(321,640 / 110) / 50 + 2)
           = floor(floor(2924) / 50 + 2)
           = floor(2924 / 50 + 2)
           = floor(58.48 + 2)
           = floor(60.48)
           = 60
```

**Step 4 — Modifiers:**
1. Spread penalty: 1.0x (single target). damage = 60
2. Weather: 1.0x (no weather assumed). damage = 60
3. STAB: 1.5x (Liquidation is Water, Feraligatr is Water). damage = floor(60 * 1.5) = 90
4. Type effectiveness: Water vs. Fire/Dark. Water vs. Fire = 2.0x, Water vs. Dark = 1.0x (check type-chart.json). Total = 2.0x. damage = floor(90 * 2.0) = 180
5. Burn: 1.0x (not burned). damage = 180
6. Item: 1.0x (no damage-modifying item assumed). damage = 180
7. Ability: 1.0x (Torrent/Sheer Force not activated). damage = 180

**Result:** 180 damage vs. 202 HP = **does not OHKO (89%)**. `180 * 2 = 360 >= 202` = **2HKOs**.
```

- [ ] **Step 2: Verify the worked example**

Check the Feraligatr vs. Incineroar calculation:
1. Incineroar HP: `floor((2*95+31+63)*50/100)+60` = `floor(284*0.5)+60` = `142+60` = 202. Correct.
2. Incineroar Def: `floor((2*90+31+0)*50/100)+5` = `floor(211*0.5)+5` = `105+5` = 110. Correct.
3. Base damage: `floor(floor(22*85*172/110)/50+2)` = `floor(floor(29260.36)/50+2)` = `floor(29260/50+2)` = `floor(585.2+2)` = `floor(587.2)` = 587... Wait, let me re-derive.

Actually, the inner product is `22 * 85 * 172 = 321,640`. Then `321,640 / 110 = 2924`. Then `2924 / 50 = 58.48`. Then `58.48 + 2 = 60.48`. Floor = 60. Then STAB 1.5x = 90, then SE 2.0x = 180. 180 vs 202 HP = does not OHKO. Correct.

- [ ] **Step 3: Commit**

```bash
git add skills/evaluating-vgc-viability/reference/stat-calculations.md
git commit -m "feat: add damage calculation section to stat-calculations.md"
```

---

### Task 3: Add Bulk and Offensive Threshold sections to stat-calculations.md

**Files:**
- Modify: `skills/evaluating-vgc-viability/reference/stat-calculations.md`

- [ ] **Step 1: Append Sections 4-5 (Bulk Thresholds, Offensive Thresholds) to stat-calculations.md**

Append the following after Section 3's closing content:

```markdown

---

## Section 4: Bulk Thresholds

Use these procedures to determine the minimum defensive investment needed to survive a specific attack.

### Survive-a-Hit Procedure

1. Choose the attack to survive: identify the attacker, their likely investment, and the move
2. Calculate the attacker's relevant offensive stat (Section 1)
3. Calculate the damage at your current HP/Def/SpD investment (Section 3)
4. Compare damage to your HP stat
5. If you don't survive, solve backwards for the minimum investment that drops damage below HP

### Solving Backwards for Defensive Investment

When damage exceeds HP, you need more bulk. Two options: more HP EVs or more Def/SpD EVs.

**Finding minimum HP EVs (with current Def/SpD):**

Calculate the damage at the current Def/SpD. You need `HP > damage`. Solve the HP formula for EVs:

```
requiredHP = damage + 1
rawHP = (requiredHP - 60) * 2       (rearranging the Lv50 HP formula)
EVs = (rawHP - 2 * baseHP - IV) * 4
```

Round EVs up to the nearest multiple of 4. If EVs > 252, HP investment alone won't save you — add Def/SpD EVs too.

**Finding minimum Def/SpD EVs (with current HP):**

You need `damage <= HP - 1`. The damage formula's dependency on Def is in the baseDamage:

```
baseDamage = floor(floor(22 * power * atkStat / defStat) / 50 + 2)
```

To reduce baseDamage, increase defStat. Find the minimum defStat that makes final damage (after all modifiers) less than HP, then solve backwards for EVs using the stat formula.

### HP vs. Defense Investment Efficiency

**General rule:** HP EVs benefit both physical and special bulk. Def/SpD EVs only help against one side.

**When HP is more efficient:**
- The Pokemon faces threats from both physical and special sides
- The Pokemon's base HP is low relative to its base defenses (more room to grow)

**When Def/SpD is more efficient:**
- The survival problem is one-sided (only physical OR only special threats matter)
- The Pokemon's base HP is already high (diminishing returns on HP investment)

**Procedure to compare:** For a specific attack, calculate the damage reduction from +4 HP EVs vs. +4 Def EVs. Whichever reduces the damage-to-HP-ratio more is the more efficient investment for that specific matchup.

### Multi-Hit Benchmarking

For 2HKO survival:
- Without recovery: you survive if `damage * 2 < HP`
- With Sitrus Berry: you survive if `damage * 2 < HP + floor(HP * 0.25)`. (Sitrus Berry `hpRestore: 0.25` from items.json heals 25% of max HP when HP drops below 50%)
- With Leftovers: you survive if `damage * 2 < HP + floor(HP / 16)`. (Leftovers restore 1/16 max HP per turn)

### Benchmark-First EV Spread Procedure

When suggesting EV spreads for entry-point skills, replace generic 252/252/4 with:

1. **Identify 1-2 key attacks** the Pokemon must survive (from meta context if available, or from type matchups — what commonly threatens this Pokemon?)
2. **Calculate minimum defensive investment** for each benchmark using the survive-a-hit procedure
3. **Identify 1-2 key speed targets** (Section 2: Speed Thresholds)
4. **Calculate minimum speed investment** to hit each target
5. **Allocate remaining EVs** to the primary offensive stat
6. **Verify offensive benchmarks** (Section 5: Offensive Thresholds) — does the remaining offensive investment still achieve the needed KOs?

If the benchmarks require more than 508 total EVs, prioritize: survival > speed > offense. A Pokemon that dies before attacking contributes nothing.

### Worked Example: Feraligatr surviving Gardevoir's Dazzling Gleam

**Question:** How many HP/SpD EVs does Adamant Feraligatr need to survive 252 SpA Gardevoir's Dazzling Gleam?

**Setup:** Gardevoir: base SpA 125. Modest nature, 252 SpA EVs.
```
inner = 2 * 125 + 31 + 63 = 344
stat  = floor(344 * 50/100) + 5 = 177
final = floor(177 * 1.1) = floor(194.7) = 194
```

Gardevoir SpA = 194.

**Damage vs. 0 HP / 0 SpD Feraligatr:**

Feraligatr HP (0 EVs): `floor((2*85+31+0)*50/100)+60` = `floor(201*0.5)+60` = `100+60` = 160.
Feraligatr SpD (0 EVs, Adamant = neutral SpD): `floor((2*83+31+0)*50/100)+5` = `floor(197*0.5)+5` = `98+5` = 103.

Dazzling Gleam: Fairy, Special, 80 power, All Adjacent Foes (spread).

```
baseDamage = floor(floor(22 * 80 * 194 / 103) / 50 + 2)
           = floor(floor(341,440 / 103) / 50 + 2)
           = floor(floor(3314.95) / 50 + 2)
           = floor(3314 / 50 + 2)
           = floor(66.28 + 2)
           = floor(68.28)
           = 68
```

Modifiers:
1. Spread: floor(68 * 0.75) = 51
2. Weather: 1.0x → 51
3. STAB: 1.5x (Fairy matches Gardevoir's Fairy type). floor(51 * 1.5) = 76
4. Type effectiveness: Fairy vs. Water = 1.0x (check type-chart.json). 76
5. Burn: 1.0x → 76
6. Item: 1.0x (no item assumed) → 76
7. Ability: 1.0x → 76

**Result at 0/0:** 76 damage vs. 160 HP = survives (47%). No additional investment needed for this specific attack.

**Alternate scenario — what if we need to survive without spread penalty (single-target Moonblast, 95 power)?**

```
baseDamage = floor(floor(22 * 95 * 194 / 103) / 50 + 2)
           = floor(floor(405,460 / 103) / 50 + 2)
           = floor(floor(3936.5) / 50 + 2)
           = floor(3936 / 50 + 2)
           = floor(78.72 + 2)
           = floor(80.72)
           = 80
```

STAB: floor(80 * 1.5) = 120. No spread penalty, so damage = 120.

120 vs 160 HP = survives (75%). Still survives at 0/0.

With 252 HP EVs: HP = `floor((2*85+31+63)*50/100)+60` = `floor(264*0.5)+60` = `132+60` = 192. 120 vs 192 = survives (62.5%). More comfortable margin.

---

## Section 5: Offensive Thresholds

Use these procedures to determine the minimum offensive investment needed to guarantee a KO.

### OHKO Threshold Procedure

1. Choose the target: identify the defender, their likely defensive investment
2. Calculate the defender's HP and relevant defensive stat (Section 1)
3. You need `finalDamage >= defenderHP`
4. Work backwards through the modifier chain (Section 3) to find the minimum baseDamage, then solve for the minimum atkStat

**Solving for minimum atkStat:**

Given the required baseDamage, power, and defStat:

```
requiredBaseDamage = (value that, after all modifiers, produces damage >= defenderHP)
```

Working backwards through modifiers: divide defenderHP by each modifier to get the required baseDamage (rounding up since each floor could have reduced the value).

Then:
```
atkStat >= ceil((requiredBaseDamage - 2) * 50 * defStat / (22 * power))
```

Convert the required atkStat to EVs using the inverse of the stat formula from Section 1.

### 2HKO Threshold Procedure

Same approach, but the target is `damage >= ceil(defenderHP / 2)`.

**With Sitrus Berry on the defender:** The target becomes `damage * 2 >= defenderHP + floor(defenderHP * 0.25)`, which means `damage >= ceil((defenderHP + floor(defenderHP * 0.25)) / 2)`.

### Post-Boost Thresholds

Calculate offensive thresholds assuming the attacker has boosted:

- **After Swords Dance (+2 Atk):** Multiply the Atk stat by 2.0x before plugging into the damage formula
- **After Nasty Plot (+2 SpA):** Multiply the SpA stat by 2.0x
- **After Dragon Dance (+1 Atk, +1 Spe):** Multiply Atk by 1.5x. Also check Speed Thresholds — the +1 Spe may let the attacker outspeed new targets
- **After Quiver Dance (+1 SpA, +1 SpD, +1 Spe):** Multiply SpA by 1.5x. The +1 SpD also improves bulk thresholds
- **After Calm Mind (+1 SpA, +1 SpD):** Multiply SpA by 1.5x

**Key insight:** Post-boost thresholds tell you whether a Pokemon can invest **less** in offense because it plans to boost. If Adamant 252 Atk Feraligatr OHKOs a target after +1 Dragon Dance, try reducing Atk EVs until it just barely OHKOs — the freed EVs go to bulk or speed.

### Comparing Candidates

When choosing between two Pokemon for a team slot, calculate what each can KO at equivalent investment:

1. For each candidate, calculate their offensive stat at 252 EVs with a boosting nature
2. For 2-3 key targets the team needs to threaten, run the damage formula for each candidate
3. Compare results: "Candidate A OHKOs X and Y but only 2HKOs Z. Candidate B OHKOs Y and Z but only 2HKOs X."
4. Factor in speed (Section 2) — OHKOing a target doesn't help if the target moves first and KOs you

This turns subjective "hits hard" assessments into concrete matchup comparisons.

### Worked Example: Feraligatr KOing Incineroar after Dragon Dance

**Question:** How much Atk investment does Adamant Feraligatr need to OHKO 252 HP / 0 Def Incineroar with Liquidation after +1 Dragon Dance?

From the Section 3 worked example, we know 252+ Atk Feraligatr does 180 damage vs. 202 HP Incineroar without any boost. That's a 2HKO.

After +1 Dragon Dance, Atk = floor(172 * 1.5) = 258.

```
baseDamage = floor(floor(22 * 85 * 258 / 110) / 50 + 2)
           = floor(floor(482,460 / 110) / 50 + 2)
           = floor(floor(4386) / 50 + 2)
           = floor(4386 / 50 + 2)
           = floor(87.72 + 2)
           = floor(89.72)
           = 89
```

Modifiers: STAB 1.5x → floor(89 * 1.5) = 133. SE 2.0x → floor(133 * 2.0) = 266.

266 vs 202 HP = **OHKOs after +1 Dragon Dance with 252+ Atk.**

Can we reduce Atk? We need final damage >= 202. Working backwards:
- Need `floor(floor(baseDamage * 1.5) * 2.0) >= 202`
- Need `floor(baseDamage * 1.5) >= 101` (since floor(101 * 2.0) = 202)
- Need `baseDamage * 1.5 >= 101`, so `baseDamage >= 68` (since floor(68 * 1.5) = 102, floor(102 * 2.0) = 204 >= 202)

We need baseDamage >= 68. From the formula:
```
floor(floor(22 * 85 * atkStat / 110) / 50 + 2) >= 68
floor(22 * 85 * atkStat / 110) >= (68 - 2) * 50 = 3300
22 * 85 * atkStat / 110 >= 3300
1870 * atkStat / 110 >= 3300
atkStat >= 3300 * 110 / 1870 = 194.12
atkStat >= 195 (after +1 Dragon Dance)
```

atkStat of 195 after +1 means base atkStat of `ceil(195 / 1.5)` = 130.

Solving for EVs: Adamant Feraligatr (base Atk 105, nature 1.1x)
```
inner = ceil(130 / 1.1) = ceil(118.18) = 119
rawStat = (119 - 5) * 2 = 228
EVs = (228 - 2*105 - 31) * 4 = (228 - 241) * 4 → negative
```

Negative means even 0 Atk EVs with Adamant is enough! Let's verify:

0 Atk EVs Adamant Feraligatr: `floor((floor((2*105+31+0)*50/100)+5)*1.1)` = `floor((floor(120.5)+5)*1.1)` = `floor((120+5)*1.1)` = `floor(137.5)` = 137.

After +1: floor(137 * 1.5) = 205.

```
baseDamage = floor(floor(22 * 85 * 205 / 110) / 50 + 2)
           = floor(floor(383,350 / 110) / 50 + 2)
           = floor(floor(3485) / 50 + 2)
           = floor(69.7 + 2)
           = floor(71.7)
           = 71
```

STAB: floor(71 * 1.5) = 106. SE: floor(106 * 2.0) = 212. 212 >= 202 = **OHKOs.**

**Conclusion:** Adamant Feraligatr with **0 Atk EVs** OHKOs 252 HP / 0 Def Incineroar with Liquidation after +1 Dragon Dance. This frees 252 EVs for bulk and speed investment.
```

- [ ] **Step 2: Verify the worked examples**

Check the Dragon Dance Feraligatr vs. Incineroar calculations:
1. 252+ Atk after DD: floor(172*1.5)=258. baseDamage: floor(floor(22*85*258/110)/50+2). Inner: 22*85*258=482,460. 482,460/110=4386. 4386/50=87.72. 87.72+2=89.72. Floor=89. STAB: floor(89*1.5)=133. SE: floor(133*2)=266. 266>202. Correct.
2. 0 Atk after DD: stat=137, boosted=205. Inner: 22*85*205=383,350. /110=3485. /50=69.7. +2=71.7. Floor=71. STAB: floor(71*1.5)=106. SE: floor(106*2)=212. 212>202. Correct.

- [ ] **Step 3: Commit**

```bash
git add skills/evaluating-vgc-viability/reference/stat-calculations.md
git commit -m "feat: add bulk and offensive threshold sections to stat-calculations.md"
```

---

### Task 4: Add numeric modifier fields to items.json

**Files:**
- Modify: `skills/checking-vgc-legality/items.json`

This task adds `damageModifier`, `damageCondition`, `speedModifier`, and `hpRestore` fields to items that affect calculations. Existing fields (`category`, `effect`) are unchanged.

- [ ] **Step 1: Add numeric fields to type-boosting Hold Items**

Add `damageModifier: 1.2` and appropriate `damageCondition` to each type-boosting item. The items and their conditions:

| Item | damageCondition |
|------|----------------|
| Black Belt | Fighting-type moves only |
| Black Glasses | Dark-type moves only |
| Charcoal | Fire-type moves only |
| Dragon Fang | Dragon-type moves only |
| Fairy Feather | Fairy-type moves only |
| Hard Stone | Rock-type moves only |
| Magnet | Electric-type moves only |
| Metal Coat | Steel-type moves only |
| Miracle Seed | Grass-type moves only |
| Mystic Water | Water-type moves only |
| Never-Melt Ice | Ice-type moves only |
| Poison Barb | Poison-type moves only |
| Sharp Beak | Flying-type moves only |
| Silk Scarf | Normal-type moves only |
| Silver Powder | Bug-type moves only |
| Soft Sand | Ground-type moves only |
| Spell Tag | Ghost-type moves only |
| Twisted Spoon | Psychic-type moves only |

For each item, add the two new fields after the existing `effect` field. Example for Black Belt:

```json
"Black Belt": {
  "category": "Hold Item",
  "effect": "An item to be held by a Pok\u00e9mon. This belt helps with focus and boosts the power of the holder's Fighting-type moves.",
  "damageModifier": 1.2,
  "damageCondition": "Fighting-type moves only"
}
```

Apply this pattern to all 18 type-boosting items listed above.

- [ ] **Step 2: Add numeric fields to Choice Scarf**

Add `speedModifier: 1.5` to Choice Scarf:

```json
"Choice Scarf": {
  "category": "Hold Item",
  "effect": "An item to be held by a Pok\u00e9mon. This curious scarf boosts the holder's Speed stat but only allows the use of a single move.",
  "speedModifier": 1.5
}
```

- [ ] **Step 3: Add numeric fields to recovery items**

Add `hpRestore` to Sitrus Berry, Oran Berry, and Leftovers:

```json
"Sitrus Berry": {
  "category": "Berry",
  "effect": "If a Pok\u00e9mon holds one of these Berries, it will be able to restore a small amount of HP to itself.",
  "hpRestore": 0.25
}
```

```json
"Oran Berry": {
  "category": "Berry",
  "effect": "If a Pok\u00e9mon holds one of these Berries, it will be able to restore 10 HP to itself.",
  "hpRestore": 10,
  "hpRestoreType": "flat"
}
```

```json
"Leftovers": {
  "category": "Hold Item",
  "effect": "An item to be held by a Pok\u00e9mon. It slowly but steadily restores the holder's HP.",
  "hpRestore": 0.0625,
  "hpRestoreType": "per-turn"
}
```

Note: Sitrus Berry is a fraction of max HP (default `hpRestoreType` is "fraction"). Oran Berry is a flat amount. Leftovers is per-turn. The `hpRestoreType` field distinguishes these.

- [ ] **Step 4: Add numeric fields to resistance berries**

Add `damageModifier: 0.5` and appropriate `damageCondition` to each resistance berry:

| Berry | damageCondition |
|-------|----------------|
| Babiri Berry | when hit by a supereffective Steel-type move |
| Charti Berry | when hit by a supereffective Rock-type move |
| Chople Berry | when hit by a supereffective Fighting-type move |
| Coba Berry | when hit by a supereffective Flying-type move |
| Colbur Berry | when hit by a supereffective Dark-type move |
| Haban Berry | when hit by a supereffective Dragon-type move |
| Kasib Berry | when hit by a supereffective Ghost-type move |
| Kebia Berry | when hit by a supereffective Poison-type move |
| Occa Berry | when hit by a supereffective Fire-type move |
| Passho Berry | when hit by a supereffective Water-type move |
| Payapa Berry | when hit by a supereffective Psychic-type move |
| Rindo Berry | when hit by a supereffective Grass-type move |
| Roseli Berry | when hit by a supereffective Fairy-type move |
| Shuca Berry | when hit by a supereffective Ground-type move |
| Tanga Berry | when hit by a supereffective Bug-type move |
| Wacan Berry | when hit by a supereffective Electric-type move |
| Yache Berry | when hit by a supereffective Ice-type move |
| Chilan Berry | when hit by a Normal-type move |

Example for Babiri Berry:

```json
"Babiri Berry": {
  "category": "Berry",
  "effect": "If a Pok\u00e9mon holding this Berry is hit with a supereffective Steel-type move, the power of that move will be weakened.",
  "damageModifier": 0.5,
  "damageCondition": "when hit by a supereffective Steel-type move"
}
```

Apply this pattern to all 18 resistance berries listed above. Note: Chilan Berry is different — it's not "supereffective" (Normal can't be SE), it just reduces Normal-type damage.

- [ ] **Step 5: Add numeric field to Light Ball**

Light Ball doubles Pikachu's Attack and Sp. Atk:

```json
"Light Ball": {
  "category": "Hold Item",
  "effect": "An item to be held by Pikachu. It's a mysterious orb that boosts Pikachu's Attack and Sp. Atk stats.",
  "atkModifier": 2.0,
  "spaModifier": 2.0,
  "damageCondition": "Pikachu only"
}
```

- [ ] **Step 6: Commit**

```bash
git add skills/checking-vgc-legality/items.json
git commit -m "feat: add numeric modifier fields to items.json for damage calculations"
```

---

### Task 5: Add numeric modifier fields to abilities.json

**Files:**
- Modify: `skills/checking-vgc-legality/abilities.json`

This task adds modifier fields to abilities that affect damage calculations. Existing `effect` fields are unchanged.

- [ ] **Step 1: Add atkModifier to attack-doubling abilities**

```json
"Huge Power": {
  "effect": "Doubles the Pok\u00e9mon's Attack stat.",
  "atkModifier": 2.0
}
```

```json
"Pure Power": {
  "effect": "Using its pure power, the Pok\u00e9mon doubles its Attack stat.",
  "atkModifier": 2.0
}
```

- [ ] **Step 2: Add stabModifier to Adaptability**

```json
"Adaptability": {
  "effect": "Powers up moves of the same type as the Pok\u00e9mon.",
  "stabModifier": 2.0
}
```

- [ ] **Step 3: Add damageModifier to Flash Fire**

```json
"Flash Fire": {
  "effect": "Powers up the Pok\u00e9mon's Fire-type moves if it's hit by one.",
  "damageModifier": 1.5,
  "damageCondition": "Fire-type moves when activated"
}
```

- [ ] **Step 4: Add atkModifier to Intimidate**

```json
"Intimidate": {
  "effect": "The Pok\u00e9mon intimidates opposing Pok\u00e9mon upon entering battle, lowering their Attack stat.",
  "atkModifier": 0.67,
  "damageCondition": "applied to opponents on switch-in"
}
```

- [ ] **Step 5: Add damageModifier to Guts and Hustle**

```json
"Guts": {
  "effect": "It's so gutsy that having a status condition boosts the Pok\u00e9mon's Attack stat.",
  "atkModifier": 1.5,
  "damageCondition": "when the Pokemon has a status condition"
}
```

```json
"Hustle": {
  "effect": "Boosts the Attack stat, but lowers accuracy.",
  "atkModifier": 1.5
}
```

- [ ] **Step 6: Add damageModifier to type-changing abilities**

These abilities change Normal-type moves to another type AND boost their power by 1.2x:

```json
"Aerilate": {
  "effect": "Normal-type moves become Flying-type moves. The power of those moves is boosted a little.",
  "damageModifier": 1.2,
  "damageCondition": "Normal-type moves changed to Flying-type"
}
```

```json
"Pixilate": {
  "effect": "Normal-type moves become Fairy-type moves. The power of those moves is boosted a little.",
  "damageModifier": 1.2,
  "damageCondition": "Normal-type moves changed to Fairy-type"
}
```

```json
"Refrigerate": {
  "effect": "Normal-type moves become Ice-type moves. The power of those moves is boosted a little.",
  "damageModifier": 1.2,
  "damageCondition": "Normal-type moves changed to Ice-type"
}
```

```json
"Dragonize": {
  "effect": "The Pok\u00e9mon's Normal-type moves become Dragon-type moves and their power is boosted by 20%.",
  "damageModifier": 1.2,
  "damageCondition": "Normal-type moves changed to Dragon-type"
}
```

- [ ] **Step 7: Add defensive ability modifiers**

```json
"Multiscale": {
  "effect": "Reduces the amount of damage the Pok\u00e9mon takes when its HP is full.",
  "damageModifier": 0.5,
  "damageCondition": "when defender is at full HP"
}
```

```json
"Filter": {
  "effect": "Reduces the power of supereffective attacks taken.",
  "damageModifier": 0.75,
  "damageCondition": "when hit by a supereffective move"
}
```

```json
"Solid Rock": {
  "effect": "Reduces the power of supereffective attacks taken.",
  "damageModifier": 0.75,
  "damageCondition": "when hit by a supereffective move"
}
```

```json
"Fur Coat": {
  "effect": "Halves the damage from physical moves onto this Pok\u00e9mon.",
  "damageModifier": 0.5,
  "damageCondition": "physical moves only"
}
```

```json
"Thick Fat": {
  "effect": "The Pok\u00e9mon is protected by a layer of thick fat, which halves the damage taken from Fire- and Ice-type moves.",
  "damageModifier": 0.5,
  "damageCondition": "Fire-type and Ice-type moves only"
}
```

```json
"Heatproof": {
  "effect": "The heatproof body of the Pok\u00e9mon halves the damage from Fire-type moves that hit it.",
  "damageModifier": 0.5,
  "damageCondition": "Fire-type moves only"
}
```

```json
"Dry Skin": {
  "effect": "Restores HP in rain or when hit by Water-type moves. Reduces HP in sunshine, and increases the damage received from Fire-type moves.",
  "damageModifier": 1.25,
  "damageCondition": "Fire-type moves (takes more damage)"
}
```

```json
"Purifying Salt": {
  "effect": "The Pok\u00e9mon's pure salt protects it from status conditions and halves the damage taken from Ghost-type moves.",
  "damageModifier": 0.5,
  "damageCondition": "Ghost-type moves only"
}
```

```json
"Friend Guard": {
  "effect": "Reduces damage done to allies.",
  "damageModifier": 0.75,
  "damageCondition": "damage dealt to ally Pokemon"
}
```

- [ ] **Step 8: Add speedModifier to weather speed abilities**

```json
"Chlorophyll": {
  "effect": "Boosts the Pok\u00e9mon's Speed stat in sunshine.",
  "speedModifier": 2.0,
  "damageCondition": "in Sun"
}
```

```json
"Swift Swim": {
  "effect": "Boosts the Pok\u00e9mon's Speed stat in rain.",
  "speedModifier": 2.0,
  "damageCondition": "in Rain"
}
```

```json
"Sand Rush": {
  "effect": "Boosts the Pok\u00e9mon's Speed stat in a sandstorm.",
  "speedModifier": 2.0,
  "damageCondition": "in Sandstorm"
}
```

```json
"Slush Rush": {
  "effect": "Boosts the Pok\u00e9mon's Speed stat in a Snowstorm.",
  "speedModifier": 2.0,
  "damageCondition": "in Snow"
}
```

- [ ] **Step 9: Add modifiers to other relevant abilities**

```json
"Analytic": {
  "effect": "Boosts move power when the Pok\u00e9mon moves last.",
  "damageModifier": 1.3,
  "damageCondition": "when the Pokemon moves last"
}
```

```json
"Iron Fist": {
  "effect": "Powers up punching moves.",
  "damageModifier": 1.2,
  "damageCondition": "punching moves only"
}
```

```json
"Reckless": {
  "effect": "Powers up moves that have recoil damage.",
  "damageModifier": 1.2,
  "damageCondition": "recoil moves only"
}
```

```json
"Sharpness": {
  "effect": "Powers up slicing moves.",
  "damageModifier": 1.5,
  "damageCondition": "slicing moves only"
}
```

```json
"Strong Jaw": {
  "effect": "The Pok\u00e9mon's strong jaw boosts the power of its biting moves.",
  "damageModifier": 1.5,
  "damageCondition": "biting moves only"
}
```

```json
"Technician": {
  "effect": "Powers up the Pok\u00e9mon's weaker moves.",
  "damageModifier": 1.5,
  "damageCondition": "moves with base power 60 or less"
}
```

```json
"Tough Claws": {
  "effect": "Powers up moves that make direct contact.",
  "damageModifier": 1.3,
  "damageCondition": "contact moves only"
}
```

```json
"Mega Launcher": {
  "effect": "Powers up aura and pulse moves.",
  "damageModifier": 1.5,
  "damageCondition": "aura and pulse moves only"
}
```

```json
"Sheer Force": {
  "effect": "Removes additional effects to increase the power of moves when attacking.",
  "damageModifier": 1.3,
  "damageCondition": "moves with secondary effects (secondary effect is removed)"
}
```

```json
"Sand Force": {
  "effect": "Boosts the power of Rock-, Ground-, and Steel-type moves in a sandstorm.",
  "damageModifier": 1.3,
  "damageCondition": "Rock-, Ground-, and Steel-type moves in Sandstorm"
}
```

- [ ] **Step 10: Commit**

```bash
git add skills/checking-vgc-legality/abilities.json
git commit -m "feat: add numeric modifier fields to abilities.json for damage calculations"
```

---

### Task 6: Update evaluating-vgc-viability SKILL.md

**Files:**
- Modify: `skills/evaluating-vgc-viability/SKILL.md`

- [ ] **Step 1: Add stat-calculations.md to the reference file listing**

In `skills/evaluating-vgc-viability/SKILL.md`, after the line:

```
- `reference/tempo.md` -- lead pair evaluation and game-plan resilience heuristics
```

Add:

```
- `reference/stat-calculations.md` -- stat formulas, speed thresholds, damage calculation, bulk and offensive thresholds
```

- [ ] **Step 2: Commit**

```bash
git add skills/evaluating-vgc-viability/SKILL.md
git commit -m "feat: add stat-calculations.md to viability skill reference listing"
```

---

### Task 7: Update building-vgc-teams SKILL.md

**Files:**
- Modify: `skills/building-vgc-teams/SKILL.md`

- [ ] **Step 1: Add stat-calculations.md to Data Sources**

In `skills/building-vgc-teams/SKILL.md`, in the "From evaluating-vgc-viability" section, after the line:

```
- `reference/tempo.md` -- lead pair evaluation and game-plan resilience heuristics
```

Add:

```
- `reference/stat-calculations.md` -- stat formulas, speed thresholds, damage calculation, bulk and offensive thresholds
```

- [ ] **Step 2: Add calculation references to Step 3 (Build Out)**

In Step 3, after the existing point 4 (Win condition contribution), add a new point 5:

```
5. **Stat-based comparison** -- If evaluating-vgc-viability is available and two candidates are in the same speed tier or fill a similar role, load `reference/stat-calculations.md`. Use Speed Thresholds to determine exactly which threats each candidate outspeeds. Use Offensive Thresholds to compare what each candidate can KO at equivalent investment levels. This turns "both hit hard" into concrete matchup comparisons. If evaluating-vgc-viability is unavailable, compare base stats directly from the roster.
```

Renumber the existing point 5 (Meta threats) to point 6.

- [ ] **Step 3: Add benchmark-driven EVs to Step 5 (Set Refinement)**

In Step 5, replace the line:

```
- EVs (suggest a simple spread like 252/252/4 as a baseline)
```

With:

```
- EVs: If evaluating-vgc-viability is available, load `reference/stat-calculations.md` and use the Benchmark-First EV Spread Procedure (Section 4). For each Pokemon: (1) identify 1-2 key attacks it must survive and calculate minimum HP/Def/SpD investment, (2) identify 1-2 key speed targets and calculate minimum Speed investment, (3) allocate remaining EVs to offense, (4) verify the resulting offensive stat still achieves needed KOs. If evaluating-vgc-viability is unavailable, suggest a simple spread like 252/252/4 as a baseline.
```

- [ ] **Step 4: Commit**

```bash
git add skills/building-vgc-teams/SKILL.md
git commit -m "feat: integrate stat-calculations into building-vgc-teams skill"
```

---

### Task 8: Update evaluating-vgc-teams SKILL.md

**Files:**
- Modify: `skills/evaluating-vgc-teams/SKILL.md`

- [ ] **Step 1: Add stat-calculations.md to Data Sources**

In `skills/evaluating-vgc-teams/SKILL.md`, in the "From evaluating-vgc-viability" section, after the line:

```
- `reference/tempo.md` -- lead pair evaluation and game-plan resilience heuristics
```

Add:

```
- `reference/stat-calculations.md` -- stat formulas, speed thresholds, damage calculation, bulk and offensive thresholds
```

- [ ] **Step 2: Update Layer 6 (Set Optimization) EVs/Nature subsection**

In Layer 6, replace the existing EVs/Nature bullet:

```
**EVs/Nature:** Check for:
- Nature that conflicts with the Pokemon's role (Adamant on a special attacker)
- EV spread that doesn't serve the set (Speed investment on a Trick Room Pokemon, no HP investment on a tank)
- When suggesting changes, provide specific benchmarks: "84 Spe EVs lets Feraligatr outspeed base 130s after +1 Dragon Dance" or "196 HP / 60 Def survives Adamant Garchomp Earthquake"
```

With:

```
**EVs/Nature:** Check for:
- Nature that conflicts with the Pokemon's role (Adamant on a special attacker)
- EV spread that doesn't serve the set (Speed investment on a Trick Room Pokemon, no HP investment on a tank)
- When suggesting changes, calculate exact benchmarks using `reference/stat-calculations.md` (if evaluating-vgc-viability is available). Use Speed Thresholds (Section 2) for speed benchmarks, Bulk Thresholds (Section 4) for survival benchmarks, and Offensive Thresholds (Section 5) for KO benchmarks. Example: "84 Spe EVs gives Feraligatr 109 Speed, outspeeding max Speed Adamant Excadrill (base 88 = 106 Speed) after +1 Dragon Dance (109 * 1.5 = 163 vs 106)" or "196 HP / 60 Def lets Feraligatr survive 252+ Atk Garchomp Earthquake (calculate damage via Section 3)." If evaluating-vgc-viability is unavailable, provide benchmarks based on general stat comparisons.
```

- [ ] **Step 3: Commit**

```bash
git add skills/evaluating-vgc-teams/SKILL.md
git commit -m "feat: integrate stat-calculations into evaluating-vgc-teams skill"
```
