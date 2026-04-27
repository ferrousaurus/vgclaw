# Item Selection Guide

> **Champions Rules Reminder**
> - All IVs are fixed to 31. Never reference 0 IVs or IV manipulation.
> - Stat Points (SPs) replace EVs: 1 SP = 8 EVs, max 32 per stat, 66 total.
> - Damage is deterministic — no random rolls.
> - Level 50 for all VGC calculations.
> - Item pool is limited: no Choice Band, Choice Specs, Life Orb, Assault Vest, Safety Goggles, etc. Type-boosting items and Focus Sash carry more weight.

> **When to read this file:** This reference is invoked primarily by the **Item Optimization** dimension in `SKILL.md`. Commonly read alongside `stat-calculations.md` (for SP benchmarks that affect item choices), `roles.md` (for role-matched items), and `speed-tiers.md` (for Choice Scarf and speed-modifying items).

## Offensive Items

Items that boost damage output. Champions has type-boosting items but no Choice Band, Choice Specs, or Life Orb.

- **Type-boosting items** (Charcoal, Mystic Water, Miracle Seed, Magnet, Never-Melt Ice, Dragon Fang, Fairy Feather, Black Belt, Black Glasses, Hard Stone, Poison Barb, Sharp Beak, Silk Scarf, Silver Powder, Soft Sand, Spell Tag, Twisted Spoon, Metal Coat) — 20% boost to one type's moves, no drawback. The primary offensive item in Champions. Give to Pokemon that deal most of their damage with one type.
- **Scope Lens** — Increases critical hit rate. Useful on Pokemon with high-crit moves (Slash, Stone Edge, etc.) or abilities like Super Luck.
- **King's Rock** — 10% flinch chance on hits. Best on multi-hit moves or spread moves (Rock Slide already flinches — this stacks). Unreliable but can steal turns.

**When to use what:**
- Pokemon relies on one STAB type for damage? Type-boosting item
- Pokemon has high-crit synergy? Scope Lens
- No better option and using spread/multi-hit moves? King's Rock

## Speed Items

- **Choice Scarf** — 50% Speed boost, locked to one move. The only speed-boosting item in Champions. Turns a mid-speed Pokemon into a fast revenge killer. Best on Pokemon with one dominant attacking move. Remember: holder can't use Protect and is locked into the first move chosen each switch-in.
- **Quick Claw** — 20% chance to move first. Unreliable. Only consider as a last resort on very slow Pokemon that don't fit Trick Room.

## Defensive / Survival Items

- **Focus Sash** — Survive any single hit at 1 HP from full HP. Best on fragile leads that need one turn to set up (Tailwind, Trick Room). Useless after the first hit or if the holder takes chip damage (weather, entry hazards).
- **Sitrus Berry** — Restores 25% HP when below 50%. Best on bulky Pokemon that expect to take a hit and keep fighting. Great on Intimidate users and Trick Room setters.
- **Leftovers** — Restores 1/16 HP each turn. Better in longer games on tanky Pokemon. Less impactful in VGC's fast pace than Sitrus Berry in most cases.
- **Shell Bell** — Restores HP equal to 1/8 of damage dealt. Best on high-damage spread attackers that hit multiple targets per turn. Unreliable on low-damage supports.
- **Oran Berry** — Restores 10 HP when below 50%. Weaker than Sitrus Berry at level 50. Rarely optimal, but available if Sitrus is taken.
- **Focus Band** — 10% chance to survive a fatal hit. Unreliable. Focus Sash is almost always better.
- **Resistance berries** (Shuca, Yache, Babiri, Occa, Passho, Wacan, Rindo, Chople, Coba, Charti, Kasib, Haban, Colbur, Roseli, Tanga, Kebia, Payapa, Chilan) — Halve damage from one super-effective hit. Best when a Pokemon has one key weakness that would KO it. Common examples: Shuca Berry on a Ground-weak Pokemon to survive Earthquake, Yache Berry on Garchomp to survive Ice Beam.

**When to use what:**
- Fragile lead that must do one thing on turn 1? Focus Sash
- Bulky and expects to take several hits? Sitrus Berry
- Has one specific weakness that would OHKO it? Resistance berry
- Tank in a slower game? Leftovers

## Utility Items

- **Mental Herb** — Cures Taunt, Encore, Disable, Torment (one-time). Critical on support Pokemon that must use status moves (Trick Room setters, Tailwind users). Best answer to Prankster Taunt.
- **White Herb** — Restores any lowered stats (one-time). Counters Intimidate on physical attackers. Also useful on Pokemon that lower their own stats with powerful moves like Close Combat, Overheat, Draco Meteor, Leaf Storm, Superpower, Hammer Arm, or Ice Hammer. If a Pokemon runs one of these moves, White Herb removes the self-inflicted stat drop, effectively giving a free power move with no drawback.
- **Light Ball** — Doubles Pikachu's Attack and Sp.Atk. Only works on Pikachu. Mandatory if running Pikachu.
- **Bright Powder** — Lowers opponent's accuracy by 10%. Unreliable but can steal games. Niche pick when no other item fits.
- **Status-curing berries** (Cheri, Chesto, Pecha, Rawst, Aspear, Persim, Lum) — Cure specific status conditions or confusion. Lum Berry cures any status (one-time) and is the most versatile. Chesto Berry is common on Rest users.
- **Leppa Berry** — Restores 10 PP to a move. Very niche. Only relevant in extremely long games.

## Mega Stones

- A Pokemon holding its Mega Stone can Mega Evolve once per battle.
- The Mega Stone is mandatory for that Pokemon (no alternative item).
- A Mega Pokemon's stone is deterministic: Venusaur always uses Venusaurite, Charizard uses Charizardite X or Y, etc.

### Mega Evolution Opportunity Cost

Evaluate whether the Mega form is worth giving up a flexible item slot:
- **Strong fit:** The Mega addresses a real team weakness (e.g., speed tier, defensive typing, or bulk) that the base form cannot cover with a standard item.
- **Weak fit:** The base form is already viable and loses more from giving up its item (e.g., Choice Scarf revenge killer, Focus Sash lead) than the Mega gains.
- **Wasted opportunity:** The team has a Pokemon with a Mega field but no Mega Stone, and no other Mega is present. The team is leaving a powerful option on the table.

## Mega Evolution & Typing

Mega Evolution can change a Pokemon's type (e.g., Charizardite X makes Charizard Fire/Dragon). When evaluating items:

- Check `assets/pokemon.json` for the `mega` field on the Pokemon.
- If the team uses a Mega, evaluate the Mega typing alongside the base typing when assessing `Defensive Cohesion` and `Pair Synergy`.
- A Mega may be chosen specifically to patch a type-chart hole (e.g., gaining a Ground immunity or a Fairy resistance). In such cases, the Mega Stone is serving a defensive role and should be scored favorably even if the base form loses a flexible item slot.
- Multiple Mega Stones on the team of 6 are acceptable and neutral in bring-4 play, provided no viable bring-4 includes both Mega Stone holders. If a team has a Pokemon with a `mega` field but no Mega Stone, and no other Mega is present, flag this as a missed opportunity in `Item Optimization`.

## General Heuristics

1. **No duplicate items** — VGC rules prohibit two Pokemon holding the same item.
2. **Match item to role** — Attackers want type-boosting items or Choice Scarf, supports want survival or utility items, leads want Focus Sash.
3. **Champions has a limited item pool** — No Choice Band, Choice Specs, Life Orb, Assault Vest, Safety Goggles, or many other mainline VGC staples. Type-boosting items and Focus Sash carry more weight here. Weather-extending rocks (Damp Rock, Heat Rock, etc.) are not available in Champions; weather lasts 5 turns by default.
4. **Protect compatibility** — Choice Scarf locks you into one move, preventing Protect. Make sure your Protect users don't hold Choice Scarf.
5. **Self-lowering move synergy** — Pokemon using Close Combat, Overheat, Draco Meteor, Leaf Storm, or similar moves should strongly consider White Herb to negate the drawback.
6. **Item / Ability conflict check** — Cross-reference `assets/abilities.json` to ensure the item is not negated or redundant with the Pokemon's ability.
   - **White Herb** is wasted on a Pokemon with **Contrary** (lowering stats is beneficial, so negating the drop is harmful). White Herb is **not** wasted on **Clear Body** — Clear Body only blocks opponent-inflicted drops, not self-inflicted drops from moves like Close Combat or Overheat.
   - **Resistance berries** (e.g., Shuca, Yache) are redundant on a Pokemon with an immunity ability to that type (e.g., Levitate + Shuca Berry; Storm Drain + Passho Berry).
   - **Mental Herb** is less critical on a Pokemon with **Oblivious** or **Aroma Veil** (already immune to Taunt/Encore or ally-protected from them).
   - **Focus Sash** is less valuable on a Pokemon with **Sturdy** (already has an OHKO prevention effect at full HP).
