# Viability Heuristics Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deepen the evaluating-vgc-viability skill's synergies reference file and add three new strategic reference files (speed-tiers, win-conditions, tempo), then integrate them into the two consumer skills.

**Architecture:** The evaluating-vgc-viability skill is a data-provider whose `reference/` directory contains markdown heuristic guides. Two consumer skills (building-vgc-teams, evaluating-vgc-teams) load these files as optional dependencies. This plan rewrites one existing reference file, adds three new ones, updates the provider's manifest, and wires the new files into both consumers.

**Tech Stack:** Markdown skill files only. No code, no tests. Validation is manual review.

---

## File Map

| Action | File | Responsibility |
|--------|------|---------------|
| Rewrite | `skills/evaluating-vgc-viability/reference/synergies.md` | Pair synergy patterns with layered evaluation + anti-synergy framework |
| Create | `skills/evaluating-vgc-viability/reference/speed-tiers.md` | Speed tier framework, investment heuristics, speed control interaction |
| Create | `skills/evaluating-vgc-viability/reference/win-conditions.md` | Win condition types, quality evaluation, sufficiency heuristics |
| Create | `skills/evaluating-vgc-viability/reference/tempo.md` | Lead pair evaluation, Plan B resilience heuristics |
| Modify | `skills/evaluating-vgc-viability/SKILL.md` | Add three new files to reference listing |
| Modify | `skills/building-vgc-teams/SKILL.md` | Add data sources, Step 3 speed/wincon references, Step 6 new analysis sections |
| Modify | `skills/evaluating-vgc-teams/SKILL.md` | Add data sources, Step 3 drill-down list, Step 4 new layers 7-8 |

---

### Task 1: Rewrite synergies.md — existing patterns with quality signals and stacking indicators

**Files:**
- Rewrite: `skills/evaluating-vgc-viability/reference/synergies.md`

This task rewrites the existing content. Task 2 adds the new sections. Split this way so each commit is reviewable.

- [ ] **Step 1: Rewrite synergies.md with quality signals and stacking indicators on every pattern**

Replace the entire contents of `skills/evaluating-vgc-viability/reference/synergies.md` with:

```markdown
# VGC Pair Synergy Patterns

How to use this doc: when evaluating a pair of Pokemon, check each category below. A pair may match multiple patterns — and the best pairs do. Use the "What to check" bullets to verify a pattern applies using data from champions-roster.json, moves.json, and abilities.json. Use the "Quality signals" bullets to assess how strong the match is. Use "Stacking" notes to find related patterns this one commonly layers with.

## Offensive Combos

Pairs where one Pokemon's moves become stronger or safer because of the partner.

### Spread Move + Immunity

One Pokemon uses a spread move that hits both sides of the field. The partner is immune to it via type or ability.

- **What to check:** Does one Pokemon have Earthquake, Discharge, Surf, or Sludge Wave in its moves? Does the partner have a type immunity (Flying for Earthquake, Ground for Discharge) or ability immunity (Levitate for Earthquake, Lightning Rod/Volt Absorb for Discharge, Water Absorb/Storm Drain for Surf)?
- **Examples:** Garchomp (Earthquake) + Corviknight (Flying), Rotom (Discharge) + Garchomp (Ground-type), Politoed (Surf) + Gastrodon (Storm Drain)
- **Quality signals:**
  - Strong: the immune partner also benefits offensively from being on the field with the spread move (e.g., Gastrodon's Storm Drain boosts Sp.Atk when hit by Surf — the immunity is also a power-up).
  - Strong: the spread move is the attacker's primary STAB (e.g., Garchomp's Earthquake) rather than off-type coverage, so it gets used frequently.
  - Weak: the spread move is a backup option the attacker rarely clicks. The immunity exists on paper but rarely matters in practice.
- **Stacking:** Often layers with Defensive Pivot Pairs > Type Complement (the immune partner frequently resists other types the attacker is weak to). Also see win-conditions.md > Spread Pressure for how this pattern feeds a win condition.

### Helping Hand + Power Move

One Pokemon has Helping Hand. The partner has a high-power attack (especially spread moves that benefit from the 50% boost).

- **What to check:** Does one Pokemon have Helping Hand in its moves? Does the partner have Heat Wave, Rock Slide, Muddy Water, Dazzling Gleam, Earthquake, Eruption, or another high-base-power move?
- **Examples:** Clefable (Helping Hand) + Volcarona (Heat Wave), Sableye (Helping Hand) + Feraligatr (Liquidation)
- **Quality signals:**
  - Strong: the Helping Hand user has other useful support beyond Helping Hand (Follow Me, Fake Out, Intimidate). Helping Hand becomes a bonus on turns where other support isn't needed, not the only reason the pair exists.
  - Strong: the partner's boosted move threatens KOs it would otherwise miss. Helping Hand turns a 2HKO into an OHKO on a common threat.
  - Weak: the Helping Hand user contributes nothing else on the field. It clicks Helping Hand every turn because it has nothing better to do — sign of a dead slot.
- **Stacking:** Commonly layers with Mode Pairs > Fake Out + Setup (the Helping Hand user often has Fake Out too — Fake Out Turn 1, Helping Hand Turn 2+). Also layers with Redirector + Sweeper if the Helping Hand user also has Follow Me.

### Ability-Boosted Attacks

One Pokemon has an ability that activates when hit by a specific type. The partner can intentionally trigger it.

- **What to check:** Does one Pokemon have Flash Fire, Lightning Rod, Storm Drain, Sap Sipper, or Motor Drive? Does the partner have a move of that type (especially a weak or spread move to trigger it safely)?
- **Examples:** Armarouge (Flash Fire) + Torkoal (Heat Wave hits Armarouge to boost its Fire moves), Gastrodon (Storm Drain) + Politoed (Surf boosts Gastrodon's Sp.Atk)
- **Quality signals:**
  - Strong: the trigger happens naturally through the partner's normal game plan (e.g., Torkoal clicks Heat Wave to damage opponents, and Armarouge absorbs it as a side effect). No wasted turns.
  - Strong: the boosted Pokemon becomes a major threat after activation — the ability boost meaningfully changes its matchups.
  - Weak: triggering the ability requires the partner to use a suboptimal move (wasting a turn on a weak move just to activate the ability). If the setup turn is too costly, the combo isn't worth it.
- **Stacking:** Often layers with Defensive Pivot Pairs > Ability-Based Protection (the same ability that boosts also protects — Storm Drain both draws Water attacks away from a Water-weak partner AND boosts Sp.Atk).

### Setup + Enabler

One Pokemon has a setup move (Swords Dance, Dragon Dance, Calm Mind, Nasty Plot, Quiver Dance). The partner can protect it during setup.

- **What to check:** Does one Pokemon have a stat-boosting move? Does the partner have Fake Out, Follow Me, Rage Powder, or Intimidate to buy a free turn?
- **Examples:** Feraligatr (Dragon Dance) + Sableye (Fake Out + Helping Hand), Volcarona (Quiver Dance) + Clefable (Follow Me)
- **Quality signals:**
  - Strong: the enabler provides value beyond Turn 1 (Helping Hand after Fake Out, Intimidate that stays useful, Follow Me that can be repeated). A one-turn enabler with nothing to do afterward is weaker than one that remains relevant.
  - Strong: the setup sweeper threatens a sweep after a single boost — it only needs one free turn, not two. Lower setup dependency = more reliable.
  - Strong: the enabler and sweeper have good type complement (see Defensive Pivot Pairs > Type Complement) — they can stay on the field together after setup without sharing fatal weaknesses.
  - Weak: the sweeper needs 2+ boosts to threaten anything, making the setup unreliable even with support.
  - Weak: the enabler is dead weight after Turn 1 — no Helping Hand, no offensive pressure, no defensive utility.
- **Stacking:** Often layers with Mode Pairs > Fake Out + Setup (when the enabler specifically has Fake Out) and Helping Hand + Power Move (when the enabler also has Helping Hand). See tempo.md > Lead Pair Evaluation for how this pair performs as a Turn 1 lead. See win-conditions.md > Setup Sweeper for how to evaluate the resulting win condition's reliability.

## Defensive Pivot Pairs

Pairs that cover each other's weaknesses when fielded together.

### Type Complement

Each partner resists or is immune to the other's weaknesses.

- **What to check:** List Partner A's weaknesses (types that hit it super-effectively). Does Partner B resist or take neutral damage from most of those types? Repeat in reverse. Flag pairs where both are weak to the same type.
- **Examples:** Garchomp (weak to Ice, Dragon, Fairy) + Incineroar (resists Ice, Fairy), Corviknight (weak to Fire, Electric) + Gastrodon (resists Fire, immune to Electric)
- **Quality signals:**
  - Strong: mutual coverage — each partner covers most or all of the other's weaknesses, not just one-directional. The pair can stay on the field against a wide range of threats.
  - Strong: the covered weaknesses are common offensive types in VGC (Ground, Ice, Fairy, Rock). Covering niche weaknesses matters less.
  - Weak: coverage is one-directional — Partner B covers Partner A's weaknesses, but Partner A covers none of Partner B's. The pair works only when the right threats are on the opponent's side.
- **Stacking:** Layers with every other pattern. Strong type complement is a foundation — it makes offensive combos safer and mode pairs more durable. Cross-ref Anti-Synergy Evaluation > Shared Weakness Clustering for the inverse.

### Intimidate + Frail Partner

An Intimidate user lowers the opponent's Attack, making a physically frail partner safer on the field.

- **What to check:** Does one Pokemon have the Intimidate ability? Does the partner have low physical Defense or HP and benefit from reduced incoming physical damage?
- **Examples:** Incineroar (Intimidate) + Gardevoir (low Def), Gyarados (Intimidate) + Volcarona (low Def)
- **Quality signals:**
  - Strong: the frail partner is primarily threatened by physical attacks. Intimidate directly addresses the survival issue.
  - Strong: the Intimidate user brings additional utility (Fake Out, Snarl, U-turn) beyond just the Intimidate switch-in.
  - Weak: the frail partner is primarily threatened by special attacks. Intimidate doesn't help the actual survival problem.
- **Stacking:** Often layers with Mode Pairs > Fake Out + Setup (Incineroar has both Intimidate and Fake Out, making it a multi-layered enabler). Intimidate users that also have Snarl cover both physical and special attack reduction.

### Ability-Based Protection

One Pokemon's ability draws or blocks attacks that would threaten the partner.

- **What to check:** Does one Pokemon have Lightning Rod, Storm Drain, or Flash Fire? Is the partner weak to that type?
- **Examples:** Gastrodon (Storm Drain) + Incineroar (Water-weak), Pachirisu (Lightning Rod) + Gyarados (Electric-weak)
- **Quality signals:**
  - Strong: the protected partner has a critical 4x weakness to the type being redirected (e.g., Gyarados 4x weak to Electric). The ability turns an instant KO into a non-issue.
  - Strong: the ability user also benefits from absorbing the hit (Storm Drain boosts Sp.Atk, Lightning Rod boosts Sp.Atk). Protection + self-buff in one action.
  - Weak: the protected partner's weakness is only 2x and it has enough bulk to survive anyway. The protection is nice but not load-bearing.
- **Stacking:** Often layers with Offensive Combos > Ability-Boosted Attacks (same ability, dual purpose). Also see Offensive Combos > Spread Move + Immunity when the ability user is immune to the partner's spread moves.

## Mode Pairs

Pairs with a coherent Turn 1 game plan when led together.

### Fake Out + Setup

One Pokemon uses Fake Out to flinch an opponent. The partner uses the free turn to boost stats.

- **What to check:** Does one Pokemon have Fake Out? Does the partner have Dragon Dance, Swords Dance, Calm Mind, Nasty Plot, Quiver Dance, Tailwind, or Trick Room?
- **Examples:** Sableye (Fake Out) + Feraligatr (Dragon Dance), Incineroar (Fake Out) + Hatterene (Trick Room)
- **Quality signals:**
  - Strong: the Fake Out user has follow-up utility after Turn 1 — Helping Hand, Intimidate, Snarl, pivoting moves. It contributes to the game plan beyond the opening flinch.
  - Strong: the setup move only needs one turn to become threatening. One Dragon Dance = sweeping. One Trick Room = speed flipped.
  - Weak: the Fake Out user has nothing useful to do on Turn 2+. It sits on the field taking up a slot after its one trick is done.
  - Weak: the opponent has two threatening leads, and flinching one still leaves the other free to KO or disrupt the setup.
- **Stacking:** Layers with Offensive Combos > Setup + Enabler (Fake Out is one form of enablement) and Offensive Combos > Helping Hand + Power Move (if the Fake Out user also has Helping Hand — Fake Out Turn 1, Helping Hand Turn 2). See tempo.md > Lead Pair Evaluation > Fake Out + Attacker/Setter for lead assessment.

### Redirector + Sweeper

One Pokemon uses Follow Me or Rage Powder to absorb single-target attacks. The partner attacks freely.

- **What to check:** Does one Pokemon have Follow Me or Rage Powder? Does the partner have high offensive stats or a setup move that benefits from not being targeted?
- **Examples:** Clefable (Follow Me) + Volcarona (Quiver Dance or Heat Wave), Amoonguss (Rage Powder) + Kingambit (Swords Dance)
- **Quality signals:**
  - Strong: the redirector is bulky enough to take 2+ redirected hits, giving the sweeper multiple free turns rather than just one.
  - Strong: the redirector has recovery or defensive utility beyond redirection (Amoonguss with Spore, Clefable with Helping Hand) so it remains useful once the sweeper is set up.
  - Weak: the redirector goes down to one redirected hit. It's a one-turn shield, similar to Fake Out but less flexible since the redirector takes damage.
  - Weak: the sweeper's main threats use spread moves (Heat Wave, Earthquake, Rock Slide) that bypass redirection entirely. The Follow Me/Rage Powder doesn't actually protect against the real danger.
- **Stacking:** Layers with Offensive Combos > Setup + Enabler (redirection is a form of enablement, often stronger than Fake Out since it repeats). Cross-ref Anti-Synergy Evaluation > Friendly Fire if the sweeper runs spread moves that hit the redirector.

### Speed Control + Slow Attacker

One Pokemon sets Tailwind or Trick Room. The partner benefits from the speed change.

- **What to check:** Does one Pokemon have Tailwind or Trick Room? For Tailwind: does the partner sit in the mid speed tier (see speed-tiers.md) where Tailwind shifts it to effectively blazing? For Trick Room: does the partner sit in the Trick Room speed tier with high offenses?
- **Examples:** Corviknight (Tailwind) + Feraligatr (mid tier, doubles to outspeed most threats), Hatterene (Trick Room) + Torkoal (Trick Room tier, hits hard under TR)
- **Quality signals:**
  - Strong: the attacker is in the ideal tier for the speed control type. Mid-tier Pokemon benefit most from Tailwind. Trick Room-tier Pokemon benefit most from TR. See speed-tiers.md > Speed Control Interaction.
  - Strong: the speed control setter is bulky enough or has protection (Focus Sash, Mental Herb) to reliably get the move off.
  - Weak: the attacker is already in the blazing tier — Tailwind is redundant for it, providing diminishing returns.
  - Weak: the speed control setter is too frail to survive Turn 1, making the speed control unreliable.
- **Stacking:** See speed-tiers.md > Speed Control Interaction for how to evaluate the tier fit. Layers with Offensive Combos > Setup + Enabler when the "setup" is Tailwind/Trick Room itself. See tempo.md > Lead Pair Evaluation > Speed Control + Attacker for lead assessment. See win-conditions.md > Trick Room Flip for TR-specific win condition evaluation.

### Dual Offensive Pressure

Two Pokemon that together threaten a wide range of types, forcing the opponent into difficult Protect/switch decisions on Turn 1.

- **What to check:** Do the two Pokemon's STAB types and main coverage moves together hit at least 12+ types super-effectively? Do they threaten different defensive profiles (one handles physical walls, the other special walls)?
- **Examples:** Garchomp (Ground/Dragon STAB) + Gardevoir (Psychic/Fairy STAB) — together they hit Fighting, Poison, Dragon, Ground, Fire, Electric, Rock, Steel, Dark super-effectively
- **Quality signals:**
  - Strong: both Pokemon threaten KOs independently — the opponent can't just focus on stopping one. If either Pokemon gets a free turn, it deals major damage.
  - Strong: the pair's STAB types have minimal overlap in what they hit super-effectively. Wide combined coverage with little redundancy.
  - Strong: one is physical and the other special, making it hard for the opponent to wall both with Intimidate or a single defensive Pokemon.
  - Weak: both Pokemon are the same attack category (both physical or both special). A single Intimidate or Snarl weakens both.
  - Weak: significant type overlap — they both threaten the same types and leave the same types unchecked.
- **Stacking:** See tempo.md > Lead Pair Evaluation > Dual Offense for how this pair performs as a lead. Layers with Defensive Pivot Pairs > Type Complement when the wide offensive coverage corresponds to defensive complementarity.

## Evaluating Layered Synergy

When assessing a pair, don't stop at the first pattern match. Count how many patterns the pair satisfies across all three categories, and note which categories they span.

**Layer count heuristics:**

- **1 pattern:** Functional. The pair has a reason to be fielded together, but it's a single-dimensional relationship.
- **2-3 patterns across categories:** Strong core pair. These pairs justify building around — they work together offensively, defensively, or as a mode, and at least one other way too. Example: Sableye + Feraligatr matches Fake Out + Setup (mode pair), Helping Hand + Power Move (offensive combo), and Intimidate cycling if Sableye runs Will-O-Wisp for a pseudo-defensive layer.
- **4+ patterns:** Exceptional. Likely a meta-proven combination. These pairs are load-bearing — the team's identity is built around their interaction.

**Cross-category layers are more valuable than same-category layers.** A pair with one offensive combo, one defensive pivot pattern, and one mode pair (3 categories) is more robust than a pair with three offensive combos (1 category). The first pair works together in multiple game states; the second pair is powerful offensively but may share defensive vulnerabilities.

**How to use this in team evaluation:**

1. For each pair on the team, count pattern matches and note the categories.
2. The team's top 2-3 pairs by layer count are its "engine" — they should appear in the core-4.
3. If no pair exceeds 1 pattern, the team lacks a synergy engine and is relying on individual Pokemon strength rather than pair interactions. This is a flag, especially for archetypes that depend on specific combos (weather, setup-based, Trick Room).
4. If a pair has high synergy layers but also has an anti-synergy flag (see below), the anti-synergy may be worth accepting if the layers are strong enough. Evaluate the trade-off explicitly.

## Anti-Synergy Evaluation

Anti-synergies are reasons a pair is actively bad together on the field. Not every pair needs to be synergistic — some Pokemon just coexist — but pairs with anti-synergies cost something when fielded together.

### Shared Weakness Clustering

Both Pokemon are weak to the same type, and neither resists it.

- **What to check:** List each Pokemon's weaknesses. Identify types that appear as a weakness for both. Does either Pokemon resist that type? Does any teammate on the field with them resist it?
- **Severity heuristics:**
  - **Ignorable (1 shared weakness):** Normal. Most pairs share at least one weakness. Only a concern if the shared weakness is a very common offensive type (Ground, Ice, Rock, Fairy) AND neither Pokemon has notable bulk.
  - **Yellow flag (2 shared weaknesses):** Worth noting. The pair has a clear vulnerability corridor. Check whether the team's other bring-4 members cover both gaps. If yes, manageable. If no, the pair is exploitable.
  - **Red flag (3+ shared weaknesses):** Serious problem, especially if any shared weakness is common offensively. This pair creates a liability when fielded together — the opponent can threaten both with a single Pokemon. See speed-tiers.md — if both Pokemon are also slow, the vulnerability is compounded because they can't outrun the threats either.
- **Context:** Shared weakness matters more within a bring-4 than across the full team of 6. Two Pokemon that share weaknesses but never appear in the same bring-4 mode don't have this problem.

### Role Redundancy

Two Pokemon fill the same role with nothing to differentiate their contributions when fielded together.

- **What to check:** Do both Pokemon perform the same function — two Fake Out users, two redirectors, two Tailwind setters, two setup sweepers targeting the same defensive profile?
- **Severity heuristics:**
  - **Ignorable:** The redundancy serves different modes. Two Fake Out users that appear in different bring-4 groups provide role insurance across modes (see tempo.md > Plan B Resilience > Role Redundancy as Insurance). This is actively good at the team level.
  - **Yellow flag:** Both appear in the same bring-4, but one has secondary utility the other lacks. E.g., two Fake Out users, but one also has Helping Hand and the other has Intimidate — they differentiate after Turn 1.
  - **Red flag:** Both appear in the same bring-4 and offer essentially the same contribution. One is a wasted slot — a different role would make the mode stronger. The team loses a role it could have filled with that slot.
- **Context:** Redundancy is only a problem if it costs the team a role it needs. Check roles.md — is the team missing speed control, Intimidate, or another key role that the redundant slot could provide?

### Strategy Conflict

Two Pokemon's optimal game plans contradict each other when fielded together.

- **What to check:** Do the two Pokemon want different things from the game state? Tailwind setter + Trick Room attacker in the same mode (one wants fast turns, the other wants reversed speed). Weather setter + a different weather setter (they overwrite each other). A Pokemon that wants to stall + a Pokemon that wants to rush.
- **Severity heuristics:**
  - **Ignorable:** The conflicting Pokemon are in different bring-4 modes. A Tailwind setter and a Trick Room setter on the same team is dual-mode design, not a conflict — as long as they never need to be fielded together.
  - **Yellow flag:** They appear in the same mode, but one Pokemon can function suboptimally under the other's preferred game state. E.g., a mid-speed Pokemon on a Trick Room team — it's not ideal under TR, but it can still contribute.
  - **Red flag:** They appear in the same mode and actively sabotage each other. E.g., two different weather setters in the same bring-4 that overwrite each other's weather every time they switch in.
- **Context:** Strategy conflict within a mode is the issue. Across modes, "conflict" is flexibility. See tempo.md > Plan B Resilience for how different modes serve different matchups.

### Tempo Mismatch

One Pokemon needs to act immediately (Turn 1 pressure) while the partner needs a setup turn, and neither can support the other during the gap.

- **What to check:** Does one Pokemon's value decay sharply after Turn 1 (e.g., Eruption Torkoal whose power drops with HP, a lead whose only purpose is immediate offense)? Does the partner need a turn to set up before contributing (Dragon Dance, Trick Room)? Does the immediate-pressure Pokemon have no way to protect or enable the partner during setup?
- **Severity heuristics:**
  - **Ignorable:** The immediate-pressure Pokemon can Protect on Turn 1 while the partner sets up, then attack on Turn 2 without significant power loss. The tempo mismatch is one turn of slight inefficiency.
  - **Yellow flag:** The immediate-pressure Pokemon loses significant value by waiting (Eruption at reduced HP). The pair would be stronger if both either attacked Turn 1 or both set up Turn 1.
  - **Red flag:** Leading both together forces a lose-lose Turn 1 — either the setup Pokemon forgoes setup to attack alongside the pressure Pokemon (wasting its setup potential), or the pressure Pokemon waits (wasting its immediate value). Neither line is good.
- **Context:** This is specifically about lead dynamics. See tempo.md > Lead Pair Evaluation for broader lead assessment. A tempo mismatch pair might still be fine in the back of a bring-4 where they enter the field at different times.

### Friendly Fire

One Pokemon's spread moves or abilities damage or hinder the partner.

- **What to check:** Does one Pokemon run Earthquake, Discharge, Surf, or another spread move that hits allies? Is the partner NOT immune to that type via type or ability? Does one Pokemon have an ability that negatively affects the partner (e.g., Sand Stream chip damage on a non-Rock/Ground/Steel partner)?
- **Severity heuristics:**
  - **Ignorable:** The friendly fire is minor chip damage (Sand Stream on a partner with high HP) and doesn't threaten a KO or meaningfully reduce the partner's effectiveness.
  - **Yellow flag:** The friendly fire deals moderate damage (Surf hitting a neutral partner) but the spread move is important enough to the game plan that the team accepts the cost. Check whether an alternative single-target move exists (e.g., High Horsepower instead of Earthquake) that avoids the friendly fire.
  - **Red flag:** The friendly fire threatens to KO the partner or deals super-effective damage. The pair cannot safely be on the field when the spread move is used. If the spread move is a core part of the game plan, this pair has a fundamental fielding conflict.
- **Context:** Friendly fire is only relevant when both Pokemon are on the field simultaneously. If one is in the back, there's no issue. Also check whether a move swap fixes it — if the spread move user also learns a single-target equivalent (Earthquake -> High Horsepower, Surf -> Hydro Pump), the anti-synergy may be fixable with a Tier 1 move change. See Offensive Combos > Spread Move + Immunity for the positive version of this pattern.
```

- [ ] **Step 2: Review the rewritten file**

Read `skills/evaluating-vgc-viability/reference/synergies.md` end-to-end. Verify:
- All 11 original patterns are present (4 offensive, 3 defensive, 4 mode)
- Each pattern has: What to check, Examples, Quality signals, Stacking
- The Evaluating Layered Synergy section follows all patterns
- All 5 anti-synergy categories are present with severity heuristics
- Cross-references point to files that will exist after this plan is complete: `speed-tiers.md`, `win-conditions.md`, `tempo.md`, `roles.md`, `archetypes.md`

- [ ] **Step 3: Commit**

```bash
git add skills/evaluating-vgc-viability/reference/synergies.md
git commit -m "feat: rewrite synergies.md with layered evaluation and anti-synergy framework"
```

---

### Task 2: Create speed-tiers.md

**Files:**
- Create: `skills/evaluating-vgc-viability/reference/speed-tiers.md`

- [ ] **Step 1: Create speed-tiers.md**

Create `skills/evaluating-vgc-viability/reference/speed-tiers.md` with:

```markdown
# Speed Tier Framework

Qualitative speed reasoning for Pokemon Champions VGC. All guidance is tier-based and relative — no exact stat calculations. Use this to evaluate speed investments, assess team composition, and reason about speed control interactions.

## Speed Tiers

Five tiers relative to the Champions roster. When evaluating a Pokemon's speed tier, look up its base Speed in champions-roster.json and place it in the appropriate tier.

### Blazing

The fastest Pokemon in the format. These naturally outspeed nearly everything without dedicated speed investment. They don't need Tailwind or speed control support — they ARE the fast pressure.

**Examples from Champions roster:** Dragapult, Jolteon, Aerodactyl, Talonflame, Weavile, Noivern, Meowscarada, Greninja, Alakazam, Whimsicott

**Role in teams:** Primary fast threats or fast support (Prankster Tailwind from Whimsicott). Speed investment for these Pokemon is about outspeeding each other, not the rest of the roster. If your team runs a blazing-tier Pokemon, you often don't need Tailwind to go fast — you already are fast.

### Fast

Outspeeds most of the roster with modest speed investment. These Pokemon are naturally quick but can be outsped by the blazing tier. They benefit from speed control mainly to outrun other fast or blazing-tier Pokemon, or Choice Scarf users.

**Examples from Champions roster:** Garchomp, Charizard, Ninetales, Volcarona, Hydreigon, Infernape, Zoroark, Gengar, Arcanine

**Role in teams:** Core attackers that function well without speed control but become dominant with it. Fast-tier Pokemon under Tailwind outspeed even the blazing tier, which can be relevant but offers diminishing returns — they were already outspeeding most threats.

### Mid

The crowded tier where speed investment decisions matter most. Many competitively viable Pokemon cluster here, and a few EVs can flip dozens of matchups. Tailwind transforms mid-tier Pokemon into effective fast threats.

**Examples from Champions roster:** Excadrill, Lucario, Heracross, Kommo-o, Gyarados, Milotic, Feraligatr, Venusaur, Dragonite, Gardevoir, Mamoswine, Chandelure, Passimian, Corviknight, Scizor

**Role in teams:** The primary beneficiaries of Tailwind. Under Tailwind, mid-tier Pokemon jump to effectively blazing. Without speed control, they need to accept being outsped by fast and blazing tiers and rely on bulk, priority, or redirection to function. Speed EV decisions for mid-tier Pokemon are the most impactful on the team — small investment changes determine which matchups they win.

### Slow

Too slow to compete without speed control. These Pokemon need Tailwind to function in a fast mode, or they lean into their bulk and accept moving second. Some operate well in a Trick Room team that also has a non-TR mode, sitting in an awkward middle ground.

**Examples from Champions roster:** Incineroar, Tyranitar, Clefable, Sylveon, Aegislash, Primarina, Kingambit, Sableye, Azumarill, Aggron

**Role in teams:** Often support Pokemon (Incineroar's value is Intimidate + Fake Out, not speed) or bulky attackers that accept moving second. Speed investment is usually minimal — just enough to outspeed other slow-tier Pokemon or reach a specific threshold under Tailwind. Some slow-tier Pokemon (Kingambit, Azumarill) have high enough Attack that moving second doesn't matter if they survive to hit back.

### Trick Room

So slow that Trick Room is the primary or only way to let them move first. Under Trick Room, these become the fastest Pokemon on the field. Speed investment is actively bad — minimum speed (0 speed EVs, speed-lowering nature) is correct.

**Examples from Champions roster:** Torkoal, Rhyperior, Hatterene, Slowbro, Slowking, Conkeldurr, Snorlax, Reuniclus, Aromatisse, Crabominable, Avalugg

**Role in teams:** Trick Room attackers or setters. These Pokemon define the Trick Room mode — if your team has them, it should have Trick Room too. Outside of Trick Room, they move last against nearly everything, which is a liability in non-TR modes. For dual-mode teams, Trick Room-tier Pokemon typically only appear in the TR bring-4, not the fast bring-4.

## Speed Investment Heuristics

Qualitative guidelines for when and how to invest in Speed EVs.

### Invest to outspeed your tier, not the tier above

A mid-tier Pokemon trying to outspeed fast-tier Pokemon without Tailwind is usually wasting EVs that could go into bulk or offense. Speed investment should target the relevant matchups within your tier — other mid-tier Pokemon you want to outspeed, or specific slow-tier threats you need to move before.

**Exception:** A mid-tier Pokemon that's right at the boundary of the fast tier might justify a few extra EVs to cross over. But if it takes max Speed + a boosting Nature to barely reach fast-tier range, those EVs are better spent elsewhere.

### Tailwind is tier-shifting, not fine-tuning

Under Tailwind, a mid-tier Pokemon jumps to effectively blazing. This means: if your team has reliable Tailwind, your mid-tier attackers don't need heavy speed investment. They can invest in bulk or offense instead, and let Tailwind handle the speed. Over-investing in speed on a Tailwind team means you're fast when you don't need to be (under Tailwind) and still not fast enough when it matters (without Tailwind against blazing-tier threats).

**Implication for team building:** Tailwind teams should prioritize mid-tier attackers that benefit most from the tier shift, not fast-tier Pokemon that get diminishing returns from the double.

### Trick Room inverts the heuristic

Under Trick Room, minimum speed is maximum priority. For Trick Room attackers, use a speed-lowering nature (Brave for physical, Quiet for special) and 0 Speed EVs. Every point of Speed you add makes them slower under Trick Room.

**Dual-mode tension:** A Pokemon that operates in both a Trick Room mode and a non-TR mode faces a genuine conflict. Minimum speed is optimal under TR but terrible outside it. Maximum speed is useless under TR. There is no good middle ground — the Pokemon will be suboptimal in one mode. Acknowledge this trade-off explicitly when it comes up. See win-conditions.md > Dual-Mode Pokemon Tension for how this affects win condition evaluation.

### Choice Scarf shifts one tier up

A mid-tier Pokemon with Choice Scarf behaves like a fast-tier Pokemon. A slow-tier Pokemon with Scarf behaves like a mid-tier Pokemon. This makes Scarf strongest on mid-tier Pokemon with one dominant attacking move — they get fast-tier speed while retaining their bulk and offensive stat investment.

**Trade-off:** Scarf locks you into one move and prevents Protect. The Pokemon becomes a one-dimensional fast attacker. Best when the team needs a revenge killer that can clean up without setup, worst when the team needs the flexibility of move choice.

### Speed ties are coin flips — avoid building around them

If your game plan requires outspeeding a specific threat and your Pokemon is in the same speed tier with similar investment, you're relying on a coin flip. Either invest to clearly outspeed (a few extra EVs) or find a different answer — speed control, priority moves, or a Pokemon from a faster tier that naturally outspeeds the threat.

**When ties are acceptable:** If both your Pokemon and the threat are in the mid tier and you have Tailwind as a backup plan, the tie only matters on turns without Tailwind. That's a manageable risk, not a fatal one.

## Speed Control Interaction

How speed tiers interact with team speed control options. Cross-references roles.md (Speed Control section) for which Pokemon provide each type of speed control, and synergies.md (Speed Control + Slow Attacker pattern) for pair evaluation.

### Tailwind Teams

Tailwind doubles Speed for 4 turns. The ideal Tailwind beneficiaries are mid-tier attackers — they jump from "outsped by most threats" to "outspeeding nearly everything." Fast-tier Pokemon get diminishing returns from Tailwind (they were already fast). Slow-tier Pokemon under Tailwind reach mid-tier speed at best, which may not be enough.

**Team composition heuristic:** A Tailwind team wants 2-3 mid-tier attackers as its core damage dealers, a blazing or fast-tier Tailwind setter (so it can set Tailwind before being KO'd), and possibly one slow-tier support Pokemon (Incineroar, Clefable) whose speed doesn't matter because their role is utility, not offense.

### Trick Room Teams

Trick Room reverses speed for 5 turns. The ideal Trick Room attackers are Trick Room-tier Pokemon — they move first under TR and hit extremely hard. Mid-tier and fast-tier Pokemon become liabilities under Trick Room (they move last).

**Team composition heuristic:** A Trick Room team wants 2-3 Trick Room-tier attackers, a bulky TR setter (preferably Trick Room-tier itself so it moves first under its own TR on subsequent turns), and support Pokemon whose value doesn't depend on speed (Intimidate users, redirectors).

### Dual-Mode Teams (Tailwind + Trick Room)

Dual-mode teams have both Tailwind and Trick Room options. This creates flexibility but demands careful mode separation.

**Composition heuristic:** Each mode should have its own speed-appropriate attackers. The Tailwind mode uses mid-tier attackers, the Trick Room mode uses TR-tier attackers. Pokemon that appear in both modes should be speed-agnostic — support Pokemon (Incineroar, Clefable) or redirectors whose value is independent of turn order.

Mid-tier Pokemon in a Trick Room mode are awkward (too fast for TR, too slow without it). Similarly, Trick Room-tier Pokemon in a Tailwind mode are dead weight (even doubled, their speed is still low). Avoid fielding these mismatches.

See tempo.md > Lead Pair Evaluation for how to assess lead choices in dual-mode teams, and tempo.md > Plan B Resilience for how modes serve as fallbacks for each other.

### No Dedicated Speed Control

If the team lacks Tailwind, Trick Room, and Choice Scarf, it relies on naturally fast Pokemon (blazing and fast tiers) and reactive speed control (Icy Wind, Thunder Wave, Electroweb) to manage turn order.

**When this works:** Hyper offense teams that bring blazing-tier threats and simply outspeed most opponents. The "speed control" is having faster Pokemon. Cross-ref win-conditions.md > Single-Target Burst for how this feeds a win condition.

**When this is a problem:** If the team's main attackers are mid-tier or slow without speed control support, they'll consistently move second against common threats. Flag this as a structural speed issue. Cross-ref roles.md > Speed Control for potential additions.
```

- [ ] **Step 2: Review the file**

Read `skills/evaluating-vgc-viability/reference/speed-tiers.md` end-to-end. Verify:
- 3 sections present: Speed Tier Framework, Speed Investment Heuristics, Speed Control Interaction
- 5 tiers defined with Champions roster examples
- 5 investment heuristics present
- 4 speed control interaction subsections present
- Cross-references to: roles.md, synergies.md, win-conditions.md, tempo.md
- No mathematical calculations — all qualitative

- [ ] **Step 3: Commit**

```bash
git add skills/evaluating-vgc-viability/reference/speed-tiers.md
git commit -m "feat: add speed-tiers.md reference file"
```

---

### Task 3: Create win-conditions.md

**Files:**
- Create: `skills/evaluating-vgc-viability/reference/win-conditions.md`

- [ ] **Step 1: Create win-conditions.md**

Create `skills/evaluating-vgc-viability/reference/win-conditions.md` with:

```markdown
# Win Condition Evaluation

How to assess whether a VGC team has sufficient, reliable, and diverse ways to win games. A win condition is a repeatable path to knocking out the opponent's bring-4 — a plan the team can execute, not just a strong individual Pokemon.

## Win Condition Types

### Setup Sweeper

A Pokemon boosts its stats (Swords Dance, Dragon Dance, Calm Mind, Nasty Plot, Quiver Dance) and then overwhelms the opponent with boosted attacks.

**Depends on:** Enablers — Fake Out, redirection, Intimidate — to buy the setup turn. If enablers are removed or blocked, the sweeper may never get to boost.

**Fragility:** High dependency. The sweeper needs to survive a turn, successfully boost, and then not be revenge killed. If the opponent has Taunt, Encore, Haze, or just KOs the sweeper before it boosts, the plan collapses.

**Cross-ref:** synergies.md > Setup + Enabler for evaluating the quality of the setup pair. synergies.md > Fake Out + Setup and Redirector + Sweeper for specific enablement patterns. tempo.md > Lead Pair Evaluation for how setup leads perform under disruption.

### Spread Pressure

A pair deals damage to both opponents simultaneously — Earthquake, Heat Wave, Rock Slide, Dazzling Gleam — wearing down the field without needing setup turns.

**Depends on:** Two Pokemon on the field that can attack. Much lower dependency than setup.

**Fragility:** Low. Spread pressure works even when disrupted because it doesn't need a setup turn. Intimidate weakens physical spread moves but doesn't shut the plan down. The main vulnerability is Wide Guard (blocks some spread moves) and Pokemon with immunities/resistances to the spread type.

**Cross-ref:** synergies.md > Spread Move + Immunity for the pair pattern. synergies.md > Helping Hand + Power Move for boosting spread damage.

### Weather/Terrain Engine

A weather setter (Drought, Drizzle, Sand Stream, Snow Warning) + an abuser (Chlorophyll, Swift Swim, Sand Rush, Slush Rush, or weather-boosted moves) forming a self-contained damage engine.

**Depends on:** The weather staying up. If the opponent brings a different weather setter and overwrites your weather, the engine stalls. The setter needs to be on the field or re-enter to reset weather.

**Fragility:** Medium. The engine is online Turn 1 if the setter leads (low turn count), but it has a single point of failure: opposing weather. Teams that rely solely on weather without a non-weather backup win condition are fragile.

**Cross-ref:** archetypes.md for archetype-specific weather cores. tempo.md > Plan B Resilience > Weather/Terrain Overwritten for fallback evaluation.

### Trick Room Flip

Reversing speed for 5 turns with Trick Room, letting slow heavy hitters move first and overwhelm faster opponents.

**Depends on:** Trick Room going up. If the setter is flinched by Fake Out, Taunted, KO'd before moving, or the opponent uses Imprison with Trick Room, the entire plan is denied.

**Fragility:** Medium-high. Trick Room is powerful when it works, but the setup turn is vulnerable. The setter needs protection (Mental Herb for Taunt, Fake Out support, Focus Sash) or inherent resilience (Hatterene's Magic Bounce blocks Taunt, Farigiraf's Armor Tail blocks priority). Once Trick Room is up, the 5-turn clock creates urgency — the team needs to close the game before turns expire.

**Cross-ref:** speed-tiers.md > Trick Room section and Speed Control Interaction > Trick Room Teams for team composition. synergies.md > Speed Control + Slow Attacker for the pair pattern.

### Attrition / Stall

Outlasting the opponent through Intimidate cycling, recovery, status conditions, and Protect stalling. The opponent runs out of resources (PP, healthy Pokemon, patience) before you do.

**Depends on:** Bulk, recovery options, and the opponent not having a way to break through the defensive core.

**Fragility:** Varies. Strong against teams with limited offensive options or no way to boost past Intimidate. Weak against setup sweepers that can boost to the point where Intimidate doesn't matter, or Taunt users that shut down recovery and status.

**Context in VGC:** Rare. VGC's fast pace and 4v4 format make pure stall difficult. However, elements of attrition (Intimidate cycling, Protect stalling to waste Trick Room turns, recovery on bulky pivots) appear in many successful teams as a secondary plan. It's more common as a backup win condition than a primary one.

### Single-Target Burst

Concentrating both Pokemon's attacks on one opponent each turn to score quick KOs and create a numbers advantage (2v1 → win). No setup required.

**Depends on:** Good speed control to act before the opponent, or enough bulk to survive while targeting one threat at a time.

**Fragility:** Low dependency (just needs two attackers on the field), but requires consistent speed advantage. If the opponent outspeeds and KOs one of your attackers first, the burst plan collapses into a 1v2.

**Cross-ref:** speed-tiers.md — single-target burst needs the team to be faster or to use speed control. Without speed advantage, the opponent can do the same thing to you. synergies.md > Dual Offensive Pressure for pairs that threaten wide type coverage in burst mode.

## Evaluating Win Condition Quality

Four heuristics for assessing how reliable a win condition is.

### Dependency Count

How many things need to go right for the win condition to work?

- **Low dependency (1-2 things):** Spread pressure just needs two Pokemon on the field. Single-target burst just needs speed advantage and two attackers. These are reliable because they have few failure points.
- **Medium dependency (3 things):** Weather engine needs the setter alive + weather not overwritten + abuser on the field. Trick Room needs the setter alive + TR not blocked + slow attackers ready.
- **High dependency (4+ things):** Setup sweeper needs the enabler alive + enabler's move to succeed (Fake Out not blocked, Follow Me not bypassed) + sweeper to survive the turn + boost to go through (no Taunt/Encore). Each additional dependency is another way the plan can fail.

**Heuristic:** Count the things that must go right. Each one is a potential failure point. Fewer dependencies = more reliable. If a win condition has 4+ dependencies, the team needs a backup plan for when it fails.

### Disruption Resilience

What commonly available counterplay shuts the win condition down?

- **Ask:** Is there a single move, ability, or common lead that invalidates this win condition? How often will the opponent have access to that counterplay?
- **Red flag:** A win condition that loses to Intimidate (the most common ability in VGC), Fake Out (on many common leads), or a widely-used offensive type. If most opponents have the tools to stop your plan, it's fragile.
- **Green flag:** A win condition that requires specific, uncommon counterplay to stop. If only niche picks counter it, most opponents won't have the answer.

**Heuristic:** If a single common move or ability stops the win condition, the team must either have protection against that disruption or a backup win condition that doesn't share the same vulnerability.

### Turn Count

How many turns until the win condition is "online" and threatening?

- **Turn 0 (immediate):** Spread pressure and single-target burst are online the moment both Pokemon are on the field. No setup required.
- **Turn 1 (one setup action):** Weather engine is online if the setter leads (weather sets automatically). Tailwind is one move. One-boost sweepers (Swords Dance, Dragon Dance) need one turn.
- **Turn 2+ (extended setup):** Trick Room needs a turn to set up, then attackers need TR turns to clean. Sweepers that need 2+ boosts need multiple turns.

**Heuristic:** Faster is more reliable because the opponent has fewer turns to disrupt the plan. Every turn of setup is a turn the opponent can use to Taunt, KO, or pivot. Win conditions that take 2+ turns to come online need strong protection during setup.

### Independence

Does the win condition require specific Pokemon to be alive, or can multiple team members execute it?

- **Dependent (one Pokemon):** Only one Pokemon on the team can sweep after setup. If it's KO'd before boosting, the win condition is gone.
- **Semi-independent (one Pokemon, replaceable enabler):** The sweeper is unique, but multiple team members can enable it (Fake Out from Incineroar OR Follow Me from Clefable). Losing one enabler doesn't kill the plan.
- **Independent (multiple Pokemon):** Two or three Pokemon can independently threaten the same style of win condition. If one goes down, another can execute a similar plan.

**Heuristic:** The more Pokemon that can independently contribute to a win condition, the more resilient it is. A team where all damage comes through one sweeper is fragile. A team where 2-3 members can each threaten KOs (even without boosts) is resilient.

## Win Condition Sufficiency

Heuristics for whether a team has enough win conditions.

### Minimum: 2 Independent Win Conditions

If one win condition is shut down (weather overwritten, setup sweeper KO'd before boosting, Trick Room blocked), the team needs a second path to winning. These should ideally be in different bring-4 modes so the team can adapt at team preview.

**What "independent" means:** The two win conditions should not share the same critical failure point. If both depend on the same Pokemon surviving, or both lose to the same common counterplay (Intimidate, Taunt), they're not truly independent — they fail together.

**Cross-ref:** tempo.md > Plan B Resilience for evaluating whether the team's fallback modes actually provide independent win conditions.

### Quality Over Quantity

Three fragile win conditions (all high-dependency, all vulnerable to common counterplay) are worse than two resilient ones. Evaluate the best two win conditions, not the total count.

**Heuristic:** Rate each win condition by dependency count and disruption resilience. If the team's top two win conditions both rate poorly, adding a third poor one doesn't fix the problem — the team needs to strengthen its existing win conditions (e.g., adding protection for a setup sweeper) or replace one with a more resilient option.

### Archetype Expectations

Different archetypes have different expected win condition profiles:

- **Weather teams:** Primary win condition is the weather engine. Backup should be a non-weather-dependent attacker or mode. A weather team where every attacker relies on weather has one win condition, not several.
- **Hyper offense:** Expects multiple independent threats — several Pokemon that can each score KOs without needing each other. The win condition is overwhelming pressure from multiple angles.
- **Trick Room:** Primary win condition is TR flip. Backup is usually a fast mode (Tailwind or naturally fast Pokemon) for when TR is denied or when facing opposing TR teams.
- **Goodstuffs / Balance:** No single engine. The "win condition" is adaptability — multiple flexible Pokemon that can combine into different game plans depending on the matchup. Evaluate based on whether the team has enough offensive threat to actually close games, not based on a specific engine.

**Cross-ref:** archetypes.md for detailed archetype descriptions.

### Dual-Mode Pokemon Tension

A Pokemon that participates in two win conditions across different modes (e.g., a mid-speed Pokemon that works in both the Tailwind plan and a non-Tailwind plan) adds flexibility but may be suboptimal in both modes.

**When it's fine:** The Pokemon's role is support (Intimidate, Fake Out, redirection) and its speed tier doesn't matter much. Incineroar works in almost any mode because its value is utility, not speed-dependent.

**When it's a problem:** The Pokemon is an attacker whose speed investment creates a genuine trade-off between modes. Too fast for Trick Room, too slow without Tailwind. This means the Pokemon is a liability in at least one mode.

**Cross-ref:** speed-tiers.md > Trick Room Inverts the Heuristic for the speed investment tension on dual-mode attackers.
```

- [ ] **Step 2: Review the file**

Read `skills/evaluating-vgc-viability/reference/win-conditions.md` end-to-end. Verify:
- 3 sections present: Win Condition Types, Evaluating Win Condition Quality, Win Condition Sufficiency
- 6 win condition types defined with dependencies, fragility, and cross-refs
- 4 quality heuristics present: Dependency Count, Disruption Resilience, Turn Count, Independence
- 4 sufficiency heuristics present: Minimum 2, Quality Over Quantity, Archetype Expectations, Dual-Mode Tension
- Cross-references to: synergies.md, speed-tiers.md, tempo.md, archetypes.md

- [ ] **Step 3: Commit**

```bash
git add skills/evaluating-vgc-viability/reference/win-conditions.md
git commit -m "feat: add win-conditions.md reference file"
```

---

### Task 4: Create tempo.md

**Files:**
- Create: `skills/evaluating-vgc-viability/reference/tempo.md`

- [ ] **Step 1: Create tempo.md**

Create `skills/evaluating-vgc-viability/reference/tempo.md` with:

```markdown
# Tempo and Game-Plan Resilience

Heuristics for evaluating lead pairs and whether a team was built with fallback options. Scoped to team construction decisions — this is about whether the team has the tools to execute strong opening turns and recover from disruption, not about in-game piloting.

## Lead Pair Evaluation

Each bring-4 mode implies a lead pair — the two Pokemon you put on the field Turn 1. Strong leads set the tone for the game. Weak leads let the opponent dictate the pace.

### What Makes a Strong Lead Pair

#### Complementary Turn 1 Actions

The two Pokemon want to do different things on Turn 1, and those actions don't conflict with each other.

- **Strong complementary leads:** Fake Out + Setup (one flinches, one boosts), Tailwind + Protect (one sets speed, one stays safe), spread attack + redirect (one deals damage, one absorbs incoming fire). In each case, both Pokemon have a clear, useful action that supports the shared game plan.
- **Weak leads:** Both want to set up (neither pressures the opponent), both use support moves with no offensive pressure (the opponent gets a free Turn 1), one Pokemon has no useful Turn 1 action (dead weight in the lead position).

**Heuristic:** If removing either Pokemon from the lead makes Turn 1 significantly worse, the pair has strong Turn 1 synergy. If one Pokemon could be replaced with any other and Turn 1 wouldn't change, it's not contributing to the lead dynamic.

#### Threat Projection

The lead pair should force the opponent into a difficult choice on Turn 1. If the opponent can freely ignore one of your leads — because it's not threatening and not enabling anything threatening — your lead is passive.

- **Strong threat projection:** Both Pokemon threaten damage or meaningful disruption. The opponent has to choose which threat to address and accepts that the other will execute its plan. Example: Garchomp threatens Earthquake while Gardevoir threatens Dazzling Gleam — the opponent can't Protect against both types.
- **Weak threat projection:** One Pokemon is obviously non-threatening (a pure support Pokemon with no offensive presence), allowing the opponent to double-target the sole threat and ignore the support. This is especially bad if the support Pokemon's contribution can be played around (e.g., Protecting against a predicted Fake Out).

**Cross-ref:** synergies.md > Dual Offensive Pressure for the offensive pairing pattern.

#### Flexibility Under Disruption

What happens when the opponent disrupts your planned Turn 1? The opponent leads Fake Out into your setter, double-targets your sweeper, or brings an unexpected counter.

- **Strong flexibility:** The lead pair has alternative lines. The Fake Out user can attack if the opponent Protects. The setter has Focus Sash to survive a hit. The sweeper can attack instead of setting up if the opponent's lead matchup is favorable. Multiple reasonable Turn 1 choices exist.
- **Weak flexibility:** The lead has one line and folds if it's disrupted. If the setter goes down, there's no backup. If Fake Out is blocked (Inner Focus, Psychic Terrain, Armor Tail), the enabler has nothing to do. The pair was built for one scenario and doesn't adapt.

**Heuristic:** For each lead pair, ask: "What happens if the opponent's Turn 1 stops our primary plan?" If the answer is "we have no backup," the lead is brittle.

#### Information Hiding

Some leads telegraph the game plan immediately (Torkoal + Venusaur = sun, Hatterene + Torkoal = Trick Room). The opponent knows what's coming and can plan accordingly. Other leads are ambiguous — they could be executing multiple different plans, and the opponent has to guess.

- **When information hiding matters:** Goodstuffs and balance teams benefit most from ambiguous leads. The opponent's uncertainty is your advantage. Leads that could be Tailwind mode OR offensive mode depending on what you click force the opponent to respect both options.
- **When it doesn't matter:** Dedicated archetype teams (weather, Trick Room) don't hide their plan — their strength comes from executing the engine, not from surprise. A Trick Room team's lead telegraphs TR, and that's fine because the opponent's answer to TR might not be on their team.

### Common Lead-Pair Patterns

These are lead-pair patterns (how two Pokemon perform on Turn 1 together), not team archetypes.

#### Fake Out + Attacker/Setter

The safe default. One Pokemon uses Fake Out to flinch an opponent, giving the partner a free action — setup move, Tailwind, Trick Room, or a powerful attack without fear of disruption from the flinched target.

- **Strong when:** The partner's Turn 1 action is high-impact (Trick Room, Dragon Dance, or a STAB attack that threatens a KO). The Fake Out user has follow-up utility after Turn 1 (Helping Hand, Intimidate, pivoting moves).
- **Weak when:** The partner's Turn 1 action is low-impact (a support move that doesn't change the game state meaningfully). The Fake Out user has nothing to do on Turn 2+.
- **Vulnerable to:** Inner Focus, Psychic Terrain, Armor Tail, Queenly Majesty (block Fake Out). Opposing double-target into the partner (Fake Out only stops one opponent).

#### Dual Offense

Two attackers threatening immediate KOs from Turn 1. No setup phase — just damage.

- **Strong when:** Both Pokemon are in the fast or blazing speed tier (see speed-tiers.md) and threaten KOs with their STAB moves. The opponent can't Protect against both because they hit different types. Physical + special split makes it hard to wall both.
- **Weak when:** The pair is slower than common threats (they take hits before dealing damage). Both are the same attack category (Intimidate weakens both physical attackers, or both special attackers share vulnerabilities).
- **Vulnerable to:** Intimidate (weakens physical attackers), opposing Fake Out (steals initiative), and opposing speed control that outspeeds both.

#### Redirect + Setup

One Pokemon uses Follow Me or Rage Powder to absorb single-target attacks while the partner boosts or attacks freely.

- **Strong when:** The redirector is bulky enough to take multiple hits, giving the partner several free turns. The partner threatens a sweep after one boost.
- **Weak when:** The opponent has spread moves (Heat Wave, Rock Slide, Earthquake) that bypass redirection entirely. The redirector goes down in one hit, providing barely more value than Fake Out.
- **Telegraphed:** This lead announces "we're setting up." The opponent knows to use spread moves or double-target the sweeper before the redirector can act (if faster).

#### Speed Control + Attacker

One Pokemon sets Tailwind or Trick Room. The partner either Protects (safe line) or attacks (aggressive line, risking the setter being KO'd before moving).

- **Strong when:** The setter is fast enough or bulky enough to reliably get the speed control up. The attacker is in the right speed tier to benefit (mid tier for Tailwind, TR tier for Trick Room — see speed-tiers.md > Speed Control Interaction).
- **Weak when:** The setter is fragile and likely to be KO'd before moving. The attacker doesn't benefit enough from the speed change (already fast for Tailwind, not slow enough for TR).
- **Backup plan matters:** If the setter goes down Turn 1, does the team have a secondary speed control option? See Plan B Resilience below.

## Plan B Resilience

Does the team have fallback options when the primary game plan is disrupted? This is about team construction — whether the team was built with backup plans, not about in-game adaptation.

### Disruption Scenarios

Evaluate the team against these common disruption scenarios. For each, ask: "Does the team have a path to winning if this happens?"

#### Lead Pokemon KO'd Turn 1

The opponent concentrates fire on your key lead and KOs it before it acts. Does the team have a bring-4 mode that doesn't depend on any single Pokemon surviving Turn 1?

**What to check:** Identify which Pokemon is most critical to each mode's Turn 1 plan. If that Pokemon is KO'd, does the remaining trio have a coherent plan? Does the team have an alternate mode that doesn't include the vulnerable Pokemon?

**Cross-ref:** win-conditions.md > Independence — a team where the only win condition depends on one specific Pokemon surviving is structurally fragile.

#### Speed Control Denied

Tailwind is Taunted. Trick Room is Imprisoned. The setter is flinched by Fake Out or KO'd before moving. The opponent has blocked your speed plan.

**What to check:** Does the team have a secondary speed control option (a second Tailwind user, Icy Wind, Thunder Wave, Choice Scarf)? Does the team have naturally fast Pokemon (blazing or fast tier) that can function without speed control?

**Cross-ref:** speed-tiers.md — teams with blazing-tier attackers are inherently more resilient to speed control denial because they don't depend on Tailwind/TR to move first. Teams where every attacker is mid-tier or slower and the only speed control is one Tailwind setter are extremely fragile to this scenario.

#### Weather/Terrain Overwritten

The opponent brings their own weather setter and overwrites your weather. Your weather-dependent attackers lose their speed doubling and damage boost.

**What to check:** Does the weather team have at least one attacker that deals meaningful damage without the weather active? Does the team have a second weather setter to re-establish weather? Can the team's non-weather mode compete independently?

**Cross-ref:** win-conditions.md > Disruption Resilience — a weather team where every attacker depends on weather has a single point of failure.

#### Setup Denied

Taunt, Encore, or a Turn 1 KO prevents the sweeper from boosting. The setup win condition is offline.

**What to check:** Does the team have a non-setup win condition? Can the team apply spread pressure or single-target burst without needing boosts? Is there an alternate mode that doesn't depend on setup?

**Cross-ref:** win-conditions.md > Win Condition Sufficiency — if the team's only win condition is a setup sweeper, this scenario is an auto-loss.

### Resilience Heuristics

#### Mode Independence

A resilient team's alternate modes don't share the same points of failure. If both your Tailwind mode and your offensive mode rely on the same Pokemon surviving Turn 1, losing that Pokemon collapses both plans.

**What to check:** For each bring-4 mode, identify the single most important Pokemon. Is it the same Pokemon across multiple modes? If yes, the team has a concentration risk — one well-placed KO eliminates multiple game plans.

**Ideal:** Each mode's critical Pokemon is different. Losing a key player in one mode still leaves another mode fully functional.

**Cross-ref:** synergies.md — evaluate whether modes share key Pokemon by looking at which synergy pairs appear in multiple bring-4 groups.

#### Role Redundancy as Insurance

Role redundancy is flagged as an anti-synergy in synergies.md > Role Redundancy when both Pokemon appear in the same bring-4. But having the same role available across different modes is insurance, not waste.

**Example:** Fake Out on your primary lead (Incineroar in the core-4) AND on a slot 5-6 alternate (Scrafty in a backup mode). If Incineroar is KO'd or the opponent leads a matchup where Incineroar is bad, the team still has Fake Out access through a different mode.

**Heuristic:** Evaluate redundancy at two levels:
- **Within a single bring-4:** Usually wasteful. Two Fake Out users in the same mode means one slot is doing a job the other could do. The redundant slot would be better filled by a different role.
- **Across the full team of 6:** Often valuable. The same role in different modes means the role survives even if one mode is countered. This is resilience by design.

#### Graceful Degradation

The best teams don't need everything to go right. They win cleanly when the plan works and still compete when it doesn't.

**Heuristic:** Describe a common disruption scenario (speed control denied, weather overwritten, key Pokemon KO'd Turn 1). If the team has zero path to winning in that scenario, it's a team construction flaw, not a piloting problem. The team needs to be built with at least a suboptimal path to victory in each common scenario.

**What "suboptimal path" means:** The backup plan doesn't have to be as strong as Plan A. A weather team that can still apply some pressure without weather (even if it's weaker) is more resilient than one that literally cannot threaten the opponent when weather is down. The question isn't "is Plan B as good as Plan A?" — it's "does Plan B exist at all?"
```

- [ ] **Step 2: Review the file**

Read `skills/evaluating-vgc-viability/reference/tempo.md` end-to-end. Verify:
- 2 sections present: Lead Pair Evaluation, Plan B Resilience
- Lead Pair Evaluation has: 4 quality criteria, 4 common lead-pair patterns
- Plan B Resilience has: 4 disruption scenarios, 3 resilience heuristics
- Cross-references to: synergies.md, speed-tiers.md, win-conditions.md
- No piloting advice — all heuristics are about team construction

- [ ] **Step 3: Commit**

```bash
git add skills/evaluating-vgc-viability/reference/tempo.md
git commit -m "feat: add tempo.md reference file"
```

---

### Task 5: Update evaluating-vgc-viability SKILL.md

**Files:**
- Modify: `skills/evaluating-vgc-viability/SKILL.md:12-15`

- [ ] **Step 1: Add new files to the reference listing**

In `skills/evaluating-vgc-viability/SKILL.md`, replace lines 12-15:

```markdown
- `reference/roles.md` -- VGC role definitions (speed control, Intimidate, redirection, Fake Out, setup, spread damage, weather/terrain)
- `reference/archetypes.md` -- common team archetypes (Rain, Sun, Sand, Snow, Trick Room, Hyper Offense, Goodstuffs)
- `reference/items.md` -- item selection heuristics for Champions' item pool
- `reference/synergies.md` -- pair synergy patterns (offensive combos, defensive pivots, mode pairs)
```

with:

```markdown
- `reference/roles.md` -- VGC role definitions (speed control, Intimidate, redirection, Fake Out, setup, spread damage, weather/terrain)
- `reference/archetypes.md` -- common team archetypes (Rain, Sun, Sand, Snow, Trick Room, Hyper Offense, Goodstuffs)
- `reference/items.md` -- item selection heuristics for Champions' item pool
- `reference/synergies.md` -- pair synergy patterns with layered evaluation and anti-synergy framework
- `reference/speed-tiers.md` -- speed tier framework, investment heuristics, and speed control interaction
- `reference/win-conditions.md` -- win condition types, quality evaluation, and sufficiency heuristics
- `reference/tempo.md` -- lead pair evaluation and game-plan resilience heuristics
```

- [ ] **Step 2: Commit**

```bash
git add skills/evaluating-vgc-viability/SKILL.md
git commit -m "feat: update viability SKILL.md to list new reference files"
```

---

### Task 6: Update building-vgc-teams SKILL.md

**Files:**
- Modify: `skills/building-vgc-teams/SKILL.md:33-37` (Data Sources)
- Modify: `skills/building-vgc-teams/SKILL.md:60-69` (Step 3)
- Modify: `skills/building-vgc-teams/SKILL.md:106-174` (Step 6)

- [ ] **Step 1: Add new files to Data Sources**

In `skills/building-vgc-teams/SKILL.md`, replace lines 33-37:

```markdown
### From evaluating-vgc-viability (optional -- degrade gracefully if missing)
- `reference/roles.md` -- VGC role definitions
- `reference/archetypes.md` -- common team archetypes
- `reference/items.md` -- item selection heuristics
- `reference/synergies.md` -- pair synergy patterns (offensive combos, defensive pivots, mode pairs)
```

with:

```markdown
### From evaluating-vgc-viability (optional -- degrade gracefully if missing)
- `reference/roles.md` -- VGC role definitions
- `reference/archetypes.md` -- common team archetypes
- `reference/items.md` -- item selection heuristics
- `reference/synergies.md` -- pair synergy patterns with layered evaluation and anti-synergy framework
- `reference/speed-tiers.md` -- speed tier framework, investment heuristics, and speed control interaction
- `reference/win-conditions.md` -- win condition types, quality evaluation, and sufficiency heuristics
- `reference/tempo.md` -- lead pair evaluation and game-plan resilience heuristics
```

- [ ] **Step 2: Add speed tier and win condition references to Step 3**

In `skills/building-vgc-teams/SKILL.md`, replace lines 60-69:

```markdown
### 3. Build Out (slots 3-4) -- Complete the Core-4

The goal is to complete your default bring-4 group. Identify gaps in the current pair:
1. **Type gaps** -- Read type-chart.json + roster types (from checking-vgc-legality). Which types can the team not resist? Which types can't the team hit super-effectively?
2. **Role gaps** -- If evaluating-vgc-viability is available, load roles.md. Does the team have speed control? Intimidate? Redirection? Fake Out? If unavailable, assess role coverage based on the team's moves and abilities directly.
3. **Meta threats** -- If evaluating-vgc-meta is available, fetch Pikalytics to identify which top-usage Pokemon threaten the current core. If unavailable, identify threats based on type matchups and common offensive types.

For each gap, suggest 2-3 Pokemon from the roster that address it. Evaluate candidates as "which Pokemon makes the strongest group of 4 with your existing core pair?" Prefer Pokemon that fill multiple gaps. Present trade-offs. When suggesting, if evaluating-vgc-viability is available, load `reference/synergies.md` and call out offensive combos (e.g., "Garchomp gives you Earthquake + your Corviknight is immune to it"), defensive pivot pairs, or mode pairs that the new Pokemon enables.

**After slot 4 is chosen, present a core-4 summary:** "Your default bring is [A, B, C, D]. This group has [roles covered: speed control, Fake Out, spread damage, etc.]. It struggles against [specific threats or archetypes the core-4 can't handle]." This summary frames slots 5-6 as solving those problems.
```

with:

```markdown
### 3. Build Out (slots 3-4) -- Complete the Core-4

The goal is to complete your default bring-4 group. Identify gaps in the current pair:
1. **Type gaps** -- Read type-chart.json + roster types (from checking-vgc-legality). Which types can the team not resist? Which types can't the team hit super-effectively?
2. **Role gaps** -- If evaluating-vgc-viability is available, load roles.md. Does the team have speed control? Intimidate? Redirection? Fake Out? If unavailable, assess role coverage based on the team's moves and abilities directly.
3. **Speed tier fit** -- If evaluating-vgc-viability is available, load `reference/speed-tiers.md`. Does the candidate's speed tier fit the team's speed control plan? A mid-tier attacker is ideal for a Tailwind team; a Trick Room-tier attacker suits a TR team. Avoid adding Pokemon whose speed tier conflicts with the team's speed control mode (e.g., a blazing-tier Pokemon on a Trick Room team with no fast mode). If evaluating-vgc-viability is unavailable, assess speed fit by comparing the candidate's base Speed in the roster against the team's speed control options.
4. **Win condition contribution** -- If evaluating-vgc-viability is available, load `reference/win-conditions.md`. Does the candidate contribute to an existing win condition (e.g., a spread attacker that adds to spread pressure) or enable a new one (e.g., a setup sweeper that gives the team a second path to winning)? Prefer candidates that strengthen existing win conditions or add independent ones over candidates that just fill a type gap. If evaluating-vgc-viability is unavailable, assess win condition contribution based on the candidate's offensive stats, setup moves, and how it interacts with existing team members.
5. **Meta threats** -- If evaluating-vgc-meta is available, fetch Pikalytics to identify which top-usage Pokemon threaten the current core. If unavailable, identify threats based on type matchups and common offensive types.

For each gap, suggest 2-3 Pokemon from the roster that address it. Evaluate candidates as "which Pokemon makes the strongest group of 4 with your existing core pair?" Prefer Pokemon that fill multiple gaps. Present trade-offs. When suggesting, if evaluating-vgc-viability is available, load `reference/synergies.md` and call out offensive combos (e.g., "Garchomp gives you Earthquake + your Corviknight is immune to it"), defensive pivot pairs, or mode pairs that the new Pokemon enables.

**After slot 4 is chosen, present a core-4 summary:** "Your default bring is [A, B, C, D]. This group has [roles covered: speed control, Fake Out, spread damage, etc.]. It struggles against [specific threats or archetypes the core-4 can't handle]." This summary frames slots 5-6 as solving those problems.
```

- [ ] **Step 3: Add Win Condition Assessment and Lead & Resilience Check to Step 6**

In `skills/building-vgc-teams/SKILL.md`, find the end of the Role Checklist section (after "If evaluating-vgc-viability is unavailable, skip the Role Checklist entirely." around line 174) and add the following two new analysis sections BEFORE "### 7. Export":

```markdown

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
```

- [ ] **Step 4: Commit**

```bash
git add skills/building-vgc-teams/SKILL.md
git commit -m "feat: integrate speed-tiers, win-conditions, and tempo into building-vgc-teams"
```

---

### Task 7: Update evaluating-vgc-teams SKILL.md

**Files:**
- Modify: `skills/evaluating-vgc-teams/SKILL.md:33-37` (Data Sources)
- Modify: `skills/evaluating-vgc-teams/SKILL.md:90-101` (Summary Verdict drill-down list)
- Modify: `skills/evaluating-vgc-teams/SKILL.md` (after Layer 6, before Fix Tracking)

- [ ] **Step 1: Add new files to Data Sources**

In `skills/evaluating-vgc-teams/SKILL.md`, replace lines 33-37:

```markdown
### From evaluating-vgc-viability (optional -- degrade gracefully if missing)
- `reference/roles.md` -- VGC role definitions
- `reference/archetypes.md` -- common team archetypes
- `reference/items.md` -- item selection heuristics
- `reference/synergies.md` -- pair synergy patterns (offensive combos, defensive pivots, mode pairs)
```

with:

```markdown
### From evaluating-vgc-viability (optional -- degrade gracefully if missing)
- `reference/roles.md` -- VGC role definitions
- `reference/archetypes.md` -- common team archetypes
- `reference/items.md` -- item selection heuristics
- `reference/synergies.md` -- pair synergy patterns with layered evaluation and anti-synergy framework
- `reference/speed-tiers.md` -- speed tier framework, investment heuristics, and speed control interaction
- `reference/win-conditions.md` -- win condition types, quality evaluation, and sufficiency heuristics
- `reference/tempo.md` -- lead pair evaluation and game-plan resilience heuristics
```

- [ ] **Step 2: Update Summary Verdict drill-down list**

In `skills/evaluating-vgc-teams/SKILL.md`, replace the drill-down list in the Summary Verdict section (lines 91-98):

```markdown
> **Drill-down areas:**
> 1. Type Coverage
> 2. Pair Synergies *(requires evaluating-vgc-viability)*
> 3. Bring-4 Modes
> 4. Meta Threat Matchups *(requires evaluating-vgc-meta)*
> 5. Role Checklist *(requires evaluating-vgc-viability)*
> 6. Set Optimization
>
> *"Which area do you want to dig into, or should I go through them in order?"*
```

with:

```markdown
> **Drill-down areas:**
> 1. Type Coverage
> 2. Pair Synergies *(requires evaluating-vgc-viability)*
> 3. Bring-4 Modes
> 4. Meta Threat Matchups *(requires evaluating-vgc-meta)*
> 5. Role Checklist *(requires evaluating-vgc-viability)*
> 6. Set Optimization
> 7. Win Condition Assessment *(requires evaluating-vgc-viability)*
> 8. Lead & Resilience Check *(requires evaluating-vgc-viability)*
>
> *"Which area do you want to dig into, or should I go through them in order?"*
```

- [ ] **Step 3: Add Layer 7 and Layer 8 after Layer 6**

In `skills/evaluating-vgc-teams/SKILL.md`, find the end of Layer 6: Set Optimization (after "Set optimization never escalates to a Pokemon swap -- that's handled by other layers." around line 239) and add the following BEFORE "### 5. Fix Tracking & Export":

```markdown

#### Layer 7: Win Condition Assessment (requires evaluating-vgc-viability)

If evaluating-vgc-viability is unavailable, skip this layer entirely.

Load `reference/win-conditions.md` (from evaluating-vgc-viability). Identify and evaluate the team's win conditions.

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

#### Layer 8: Lead & Resilience Check (requires evaluating-vgc-viability)

If evaluating-vgc-viability is unavailable, skip this layer entirely.

Load `reference/tempo.md` (from evaluating-vgc-viability). Evaluate lead pairs for each bring-4 mode identified in Layer 3 (Bring-4 Modes) and assess Plan B resilience.

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
```

- [ ] **Step 4: Commit**

```bash
git add skills/evaluating-vgc-teams/SKILL.md
git commit -m "feat: integrate win-conditions and tempo into evaluating-vgc-teams"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] synergies.md rewrite with layered evaluation + anti-synergy framework → Task 1
- [x] speed-tiers.md creation → Task 2
- [x] win-conditions.md creation → Task 3
- [x] tempo.md creation → Task 4
- [x] evaluating-vgc-viability SKILL.md update → Task 5
- [x] building-vgc-teams data sources update → Task 6 Step 1
- [x] building-vgc-teams Step 3 speed/wincon references → Task 6 Step 2
- [x] building-vgc-teams Step 6 new analysis sections → Task 6 Step 3
- [x] evaluating-vgc-teams data sources update → Task 7 Step 1
- [x] evaluating-vgc-teams Summary Verdict drill-down update → Task 7 Step 2
- [x] evaluating-vgc-teams Layer 7 + Layer 8 → Task 7 Step 3
- [x] Cross-reference map entries all present in file content

**Placeholder scan:** No TBD, TODO, "fill in later", or "similar to Task N" found.

**Consistency check:** All cross-references between files point to sections that exist in the plan. File names, section names, and heuristic names are consistent across all tasks.
