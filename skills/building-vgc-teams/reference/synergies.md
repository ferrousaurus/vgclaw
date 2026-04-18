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
