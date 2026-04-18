# Pair Synergy Analysis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add pair-based synergy analysis to the VGC team builder skill so it reasons about how Pokemon work together on the field, not just individually.

**Architecture:** A new reference doc (`reference/synergies.md`) defines three synergy pattern categories with detection criteria. The SKILL.md workflow gets a new "Pair Synergy Scan" section in step 6 and light synergy references in steps 3-4.

**Tech Stack:** Markdown (skill instructions and reference docs)

---

## File Structure

- **Create:** `skills/building-vgc-teams/reference/synergies.md` — Synergy pattern categories, detection criteria, and Champions-specific examples. ~80-100 lines. Follows the style of existing reference docs (roles.md, archetypes.md): `# Title`, then `## Category` sections, each with a description, bullet-pointed sub-patterns, and concrete Pokemon examples.
- **Modify:** `skills/building-vgc-teams/SKILL.md` — Three changes: (1) add `reference/synergies.md` to the Data Sources reference list, (2) add synergy awareness to steps 3-4, (3) add Pair Synergy Scan section to step 6.

---

### Task 1: Create reference/synergies.md

**Files:**
- Create: `skills/building-vgc-teams/reference/synergies.md`

- [ ] **Step 1: Write the synergies reference doc**

Create `skills/building-vgc-teams/reference/synergies.md` with the following content:

```markdown
# VGC Pair Synergy Patterns

How to use this doc: when evaluating a pair of Pokemon, check each category below. A pair may match multiple patterns. Use the "What to check" bullets to verify a pattern applies to a specific pair using data from champions-roster.json, moves.json, and abilities.json.

## Offensive Combos

Pairs where one Pokemon's moves become stronger or safer because of the partner.

### Spread Move + Immunity

One Pokemon uses a spread move that hits both sides of the field. The partner is immune to it via type or ability.

- **What to check:** Does one Pokemon have Earthquake, Discharge, Surf, or Sludge Wave in its moves? Does the partner have a type immunity (Flying for Earthquake, Ground for Discharge) or ability immunity (Levitate for Earthquake, Lightning Rod/Volt Absorb for Discharge, Water Absorb/Storm Drain for Surf)?
- **Examples:** Garchomp (Earthquake) + Corviknight (Flying), Rotom (Discharge) + Garchomp (Ground-type), Politoed (Surf) + Gastrodon (Storm Drain)
- **Anti-pattern:** Two Ground-weak Pokemon where one runs Earthquake -- they can't be fielded together safely.

### Helping Hand + Power Move

One Pokemon has Helping Hand. The partner has a high-power attack (especially spread moves that benefit from the 50% boost).

- **What to check:** Does one Pokemon have Helping Hand in its moves? Does the partner have Heat Wave, Rock Slide, Muddy Water, Dazzling Gleam, Earthquake, Eruption, or another high-base-power move?
- **Examples:** Clefable (Helping Hand) + Volcarona (Heat Wave), Sableye (Helping Hand) + Feraligatr (Liquidation)

### Ability-Boosted Attacks

One Pokemon has an ability that activates when hit by a specific type. The partner can intentionally trigger it.

- **What to check:** Does one Pokemon have Flash Fire, Lightning Rod, Storm Drain, Sap Sipper, or Motor Drive? Does the partner have a move of that type (especially a weak or spread move to trigger it safely)?
- **Examples:** Armarouge (Flash Fire) + Torkoal (Heat Wave hits Armarouge to boost its Fire moves), Gastrodon (Storm Drain) + Politoed (Surf boosts Gastrodon's Sp.Atk)

### Setup + Enabler

One Pokemon has a setup move (Swords Dance, Dragon Dance, Calm Mind, Nasty Plot, Quiver Dance). The partner can protect it during setup.

- **What to check:** Does one Pokemon have a stat-boosting move? Does the partner have Fake Out, Follow Me, Rage Powder, or Intimidate to buy a free turn?
- **Examples:** Feraligatr (Dragon Dance) + Sableye (Fake Out + Helping Hand), Volcarona (Quiver Dance) + Clefable (Follow Me)

## Defensive Pivot Pairs

Pairs that cover each other's weaknesses when fielded together.

### Type Complement

Each partner resists or is immune to the other's weaknesses.

- **What to check:** List Partner A's weaknesses (types that hit it super-effectively). Does Partner B resist or take neutral damage from most of those types? Repeat in reverse. Flag pairs where both are weak to the same type.
- **Examples:** Garchomp (weak to Ice, Dragon, Fairy) + Incineroar (resists Ice, Fairy), Corviknight (weak to Fire, Electric) + Gastrodon (resists Fire, immune to Electric)
- **Anti-pattern:** Two Pokemon that share 2+ weaknesses and neither resists the other's weak types. They can't safely switch between each other.

### Intimidate + Frail Partner

An Intimidate user lowers the opponent's Attack, making a physically frail partner safer on the field.

- **What to check:** Does one Pokemon have the Intimidate ability? Does the partner have low physical Defense or HP and benefit from reduced incoming physical damage?
- **Examples:** Incineroar (Intimidate) + Gardevoir (low Def), Gyarados (Intimidate) + Volcarona (low Def)

### Ability-Based Protection

One Pokemon's ability draws or blocks attacks that would threaten the partner.

- **What to check:** Does one Pokemon have Lightning Rod, Storm Drain, or Flash Fire? Is the partner weak to that type?
- **Examples:** Gastrodon (Storm Drain) + Incineroar (Water-weak), Pachirisu (Lightning Rod) + Gyarados (Electric-weak)

## Mode Pairs

Pairs with a coherent Turn 1 game plan when led together.

### Fake Out + Setup

One Pokemon uses Fake Out to flinch an opponent. The partner uses the free turn to boost stats.

- **What to check:** Does one Pokemon have Fake Out? Does the partner have Dragon Dance, Swords Dance, Calm Mind, Nasty Plot, Quiver Dance, Tailwind, or Trick Room?
- **Examples:** Sableye (Fake Out) + Feraligatr (Dragon Dance), Incineroar (Fake Out) + Hatterene (Trick Room)

### Redirector + Sweeper

One Pokemon uses Follow Me or Rage Powder to absorb single-target attacks. The partner attacks freely.

- **What to check:** Does one Pokemon have Follow Me or Rage Powder? Does the partner have high offensive stats or a setup move that benefits from not being targeted?
- **Examples:** Clefable (Follow Me) + Volcarona (Quiver Dance or Heat Wave), Amoonguss (Rage Powder) + Kingambit (Swords Dance)

### Speed Control + Slow Attacker

One Pokemon sets Tailwind or Trick Room. The partner benefits from the speed change.

- **What to check:** Does one Pokemon have Tailwind or Trick Room? For Tailwind: does the partner have middling Speed (60-90 base) that becomes fast enough to outspeed threats with the double? For Trick Room: does the partner have very low Speed (under 50 base) and high offenses?
- **Examples:** Corviknight (Tailwind) + Feraligatr (base 78 Speed, doubles to outspeed most threats), Hatterene (Trick Room) + Torkoal (base 20 Speed, hits hard under TR)

### Dual Offensive Pressure

Two Pokemon that together threaten a wide range of types, forcing the opponent into difficult Protect/switch decisions on Turn 1.

- **What to check:** Do the two Pokemon's STAB types and main coverage moves together hit at least 12+ types super-effectively? Do they threaten different defensive profiles (one handles physical walls, the other special walls)?
- **Examples:** Garchomp (Ground/Dragon STAB) + Gardevoir (Psychic/Fairy STAB) -- together they hit Fighting, Poison, Dragon, Ground, Fire, Electric, Rock, Steel, Dark super-effectively
```

- [ ] **Step 2: Verify the file reads correctly and line count is in range**

Run: `wc -l skills/building-vgc-teams/reference/synergies.md`
Expected: between 70-110 lines

- [ ] **Step 3: Commit**

```bash
git add skills/building-vgc-teams/reference/synergies.md
git commit -m "feat: add synergy patterns reference doc for VGC team builder"
```

---

### Task 2: Add synergies.md to SKILL.md Data Sources

**Files:**
- Modify: `skills/building-vgc-teams/SKILL.md:28-30` (Reference section in Data Sources)

- [ ] **Step 1: Add synergies.md to the reference list**

In `SKILL.md`, find the "Reference (load when needed):" section (around line 28) and add the new entry. Change this:

```markdown
**Reference (load when needed):**
- `reference/roles.md` -- VGC role definitions
- `reference/archetypes.md` -- common team archetypes
- `reference/items.md` -- item selection heuristics
```

To this:

```markdown
**Reference (load when needed):**
- `reference/roles.md` -- VGC role definitions
- `reference/archetypes.md` -- common team archetypes
- `reference/items.md` -- item selection heuristics
- `reference/synergies.md` -- pair synergy patterns (offensive combos, defensive pivots, mode pairs)
```

- [ ] **Step 2: Commit**

```bash
git add skills/building-vgc-teams/SKILL.md
git commit -m "feat: add synergies.md to SKILL.md data sources list"
```

---

### Task 3: Add light synergy awareness to Steps 3-4

**Files:**
- Modify: `skills/building-vgc-teams/SKILL.md:48-63` (Steps 3 and 4)

- [ ] **Step 1: Update Step 3 (Build Out) to reference synergy**

In `SKILL.md`, find Step 3 "Build Out (slots 3-4)" (around line 48). Change the last paragraph from:

```markdown
For each gap, suggest 2-3 Pokemon from the roster that address it. Prefer Pokemon that fill multiple gaps. Present trade-offs.
```

To:

```markdown
For each gap, suggest 2-3 Pokemon from the roster that address it. Prefer Pokemon that fill multiple gaps. Present trade-offs. When suggesting, note any pair synergies with existing team members -- load `reference/synergies.md` and call out offensive combos (e.g., "Garchomp gives you Earthquake + your Corviknight is immune to it"), defensive pivot pairs, or mode pairs that the new Pokemon enables.
```

- [ ] **Step 2: Update Step 4 (Final Slots) to reference synergy**

In `SKILL.md`, find Step 4 "Final Slots (5-6)" (around line 58). Change this:

```markdown
Fill remaining holes:
- Coverage gaps from the type analysis
- Anti-meta picks that handle common threats
- "Glue" Pokemon that support the team's game plan
```

To:

```markdown
Fill remaining holes:
- Coverage gaps from the type analysis
- Anti-meta picks that handle common threats
- "Glue" Pokemon that support the team's game plan
- Pair synergy -- does the new Pokemon form strong mode pairs or offensive combos with existing members? A Pokemon that fills a type gap AND creates a Fake Out + setup pair is better than one that only fills the type gap.
```

- [ ] **Step 3: Commit**

```bash
git add skills/building-vgc-teams/SKILL.md
git commit -m "feat: add light synergy awareness to build-out steps 3-4"
```

---

### Task 4: Add Pair Synergy Scan to Step 6

**Files:**
- Modify: `skills/building-vgc-teams/SKILL.md:79-107` (Step 6: Team Analysis)

- [ ] **Step 1: Update the step 6 intro line**

In `SKILL.md`, find the Step 6 intro (around line 81). Change:

```markdown
Run all three analysis layers. Present results clearly.
```

To:

```markdown
Run all four analysis layers. Present results clearly.
```

- [ ] **Step 2: Add Pair Synergy Scan section after Type Coverage Matrix**

In `SKILL.md`, find the end of the "Type Coverage Matrix" section (the paragraph ending with "Flag types the team has no super-effective coverage against." around line 88). Insert the following new section between the Type Coverage Matrix and the Threat List:

```markdown
**Pair Synergy Scan:**

Load `reference/synergies.md`. For each of the 15 possible pairs on the team, check the pair against each synergy category (offensive combos, defensive pivot pairs, mode pairs) using the team's actual moves, abilities, and types from the data files.

Do not list all 15 pairs. Present only the notable findings:

*Top synergy pairs (2-3 best):* Identify the pairs with the strongest synergies. For each, name the pair, state the synergy category, and explain what they do together. Example: "Sableye + Feraligatr (Mode Pair: Fake Out + Dragon Dance setup. Sableye also has Helping Hand to boost Feraligatr's attacks after it's set up.)"

*Anti-synergy flags:* Identify pairs that are actively bad together on the field. Shared weaknesses with no cross-coverage, redundant roles (two redirectors, two Fake Out users with nothing to enable), or conflicting strategies (Tailwind setter paired with a Trick Room setter and no plan to use both modes). Only flag pairs where the anti-synergy is meaningful -- two Pokemon sharing one weakness is normal, two Pokemon sharing three weaknesses with no cross-coverage is a flag.

*Missing synergy gaps:* Check whether the team is missing synergy patterns that its archetype typically wants. Reference the team's archetype from `reference/archetypes.md` if one was chosen in step 1. Examples: a hyper offense team with no Fake Out + setup pair, a rain team with no spread move + immunity combo, a team with setup sweepers but no redirector or Fake Out user to enable them. Not every team needs every pattern -- flag gaps as observations, not failures.
```

- [ ] **Step 3: Commit**

```bash
git add skills/building-vgc-teams/SKILL.md
git commit -m "feat: add pair synergy scan to team analysis step 6"
```
