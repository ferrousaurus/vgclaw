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