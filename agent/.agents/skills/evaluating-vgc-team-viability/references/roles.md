# VGC Team Roles

> **Champions Rules Reminder**
> - All IVs are fixed to 31. Never reference 0 IVs or IV manipulation.
> - Stat Points (SPs) replace EVs: 1 SP = 8 EVs, max 32 per stat, 66 total.
> - Damage is deterministic — no random rolls.
> - Level 50 for all VGC calculations.
> - Item pool is limited: no Choice Band, Choice Specs, Life Orb, Assault Vest, Safety Goggles, etc.

> **When to read this file:** This reference is invoked primarily by the **Role Coverage** and **Field Condition Management** dimensions in `SKILL.md`. Commonly read alongside `win-conditions.md` (roles enable win conditions) and `tempo.md` (lead patterns depend on role coverage).

How to use this file: for each role below, query the static JSON assets to determine which Pokémon on the team (or available in Champions) can fill it. Do **not** rely on pre-trained knowledge or static lists. The assets are the source of truth.

**Query workflow:**
1. To find which Pokémon know a specific move: scan `assets/moves.json` for the move name, then cross-reference the learnset against `assets/pokemon.json`.
2. To find which Pokémon have a specific ability: scan `assets/abilities.json` for the ability name, then cross-reference against `assets/pokemon.json`.
3. To verify a Pokémon can legally have a move/ability combination: confirm both appear on that Pokémon's entry in `assets/pokemon.json`.

**Bring-4 vs. Team of 6:** A role is only "covered" if it appears in a viable bring-4 mode. Having Intimidate on slot 5 with no way to bring it in relevant matchups does not close a bring-4 gap.

---

## Speed Control

Manipulate turn order to let your team move first or guarantee slow Pokémon move in the right order.

- **Tailwind** (doubles Speed for 4 turns): Query `assets/moves.json` for "Tailwind."
- **Trick Room** (reverses Speed for 5 turns): Query `assets/moves.json` for "Trick Room."
- **Icy Wind / Electroweb** (lower opponent Speed): Query `assets/moves.json` for "Icy Wind" and "Electroweb."
- **Thunder Wave / Glare** (paralysis): Query `assets/moves.json` for "Thunder Wave" and "Glare."

## Intimidate / Attack Drops

Reduce the opponent's Attack stat to weaken physical threats.

- **Intimidate ability**: Query `assets/abilities.json` for "Intimidate."
- **Snarl** (lowers Sp.Atk): Query `assets/moves.json` for "Snarl."

## Redirection

Force opponent's attacks toward a designated team member.

- **Follow Me**: Query `assets/moves.json` for "Follow Me."
- **Rage Powder**: Query `assets/moves.json` for "Rage Powder."
- **Ally Switch**: Query `assets/moves.json` for "Ally Switch."

## Fake Out Pressure

Flinch an opponent on Turn 1 to enable safe setup or positioning.

- **Fake Out**: Query `assets/moves.json` for "Fake Out."

## Setup

Boost stats for a sweeper or support role.

- **Swords Dance**: Query `assets/moves.json` for "Swords Dance."
- **Calm Mind**: Query `assets/moves.json` for "Calm Mind."
- **Dragon Dance**: Query `assets/moves.json` for "Dragon Dance."
- **Nasty Plot**: Query `assets/moves.json` for "Nasty Plot."
- **Quiver Dance**: Query `assets/moves.json` for "Quiver Dance."
- **Growth**: Query `assets/moves.json` for "Growth."

## Spread Damage

Hit both opponents simultaneously.

- **Earthquake**: Query `assets/moves.json` for "Earthquake."
- **Rock Slide**: Query `assets/moves.json` for "Rock Slide."
- **Heat Wave**: Query `assets/moves.json` for "Heat Wave."
- **Dazzling Gleam**: Query `assets/moves.json` for "Dazzling Gleam."
- **Muddy Water**: Query `assets/moves.json` for "Muddy Water."
- **Discharge**: Query `assets/moves.json` for "Discharge."
- **Sludge Wave**: Query `assets/moves.json` for "Sludge Wave."
- **Blizzard**: Query `assets/moves.json` for "Blizzard."

## Protect

Almost every VGC Pokémon runs Protect. It's not a role to "fill" but a red flag if a Pokémon doesn't learn it or has no reason to skip it. Pokémon that commonly skip Protect:
- Fake Out users (need 4 offensive/support moves)
- Choice item holders (locked into one move)

Query `assets/moves.json` for "Protect" to confirm availability.

## Weather Setters

Enable weather-dependent strategies.

- **Sun** (Drought): Query `assets/abilities.json` for "Drought." Also query `assets/moves.json` for "Sunny Day."
- **Rain** (Drizzle): Query `assets/abilities.json` for "Drizzle." Also query `assets/moves.json` for "Rain Dance."
- **Sand** (Sand Stream): Query `assets/abilities.json` for "Sand Stream." Also query `assets/moves.json` for "Sandstorm."
- **Snow** (Snow Warning): Query `assets/abilities.json` for "Snow Warning."

## Terrain Setters

Enable terrain-dependent strategies.

- **Electric Terrain**: Query `assets/moves.json` for "Electric Terrain."
- **Grassy Terrain**: Query `assets/moves.json` for "Grassy Terrain."
- **Psychic Terrain**: Query `assets/moves.json` for "Psychic Terrain."
- **Misty Terrain**: Query `assets/moves.json` for "Misty Terrain."

## Status & Disruption

Inflict status or force unfavorable positions on the opponent.

- **Sleep**: Query `assets/moves.json` for "Spore," "Sleep Powder," "Hypnosis," "Yawn," etc.
- **Burn**: Query `assets/moves.json` for "Will-O-Wisp."
- **Paralysis**: Query `assets/moves.json` for "Thunder Wave," "Glare," "Stun Spore," etc.
- **Taunt**: Query `assets/moves.json` for "Taunt."
- **Encore**: Query `assets/moves.json` for "Encore."
- **Haze**: Query `assets/moves.json` for "Haze."
- **Perish Song**: Query `assets/moves.json` for "Perish Song."

## Setup Denial

Prevent the opponent from accumulating stat boosts that render conventional defensive tools (Intimidate, bulk) irrelevant.

- **Haze**: Query `assets/moves.json` for "Haze."
- **Taunt**: Query `assets/moves.json` for "Taunt."
- **Encore**: Query `assets/moves.json` for "Encore."
- **Whirlwind / Roar / Clear Smog**: Query `assets/moves.json` for "Whirlwind," "Roar," and "Clear Smog."

**Context:** Teams without any setup denial tools auto-lose to well-supported Dragon Dance, Quiver Dance, or Swords Dance sweepers. This is a defensive role on par with Intimidate and Redirection. Bulky Offense and Goodstuffs teams in particular need at least one answer; Hyper Offense can sometimes compensate by outsweeping before the opponent sets up.

## Pivoting / Momentum

Switch safely while maintaining pressure or recovering HP.

- **Pivot moves**: Query `assets/moves.json` for "U-turn," "Volt Switch," "Parting Shot," "Flip Turn."
- **Regenerator ability**: Query `assets/abilities.json` for "Regenerator."
- **Drawing moves**: Query `assets/abilities.json` for "Lightning Rod," "Storm Drain."

## Field Condition Reset

Overwrite or re-establish weather/terrain when the opponent controls the field.

- Own weather setter (ability or move) that can overwrite opposing weather.
- Own terrain setter (ability or move) that can overwrite opposing terrain.
- Evaluate whether the team can function when its preferred field condition is denied.

## Screens

Reduce incoming damage for the team through Reflect and Light Screen.

- **Reflect**: Query `assets/moves.json` for "Reflect."
- **Light Screen**: Query `assets/moves.json` for "Light Screen."
- **Prankster + Screen**: Query `assets/abilities.json` for "Prankster," then cross-reference which screen users have it.

**Context:** Screens effectively double the team's bulk for 5 turns. A team with a dedicated screen setter (especially with Prankster) can afford to run lighter defensive investment on its attackers. Absence of screens is not always a flaw, but for Bulky Offense and Goodstuffs teams, a screen setter is a notable role.

## Sustain / Recovery

Restore HP for self or allies to outlast opponents in extended games.

- **Healing moves for allies**: Query `assets/moves.json` for "Heal Pulse," "Life Dew."
- **Self-recovery**: Query `assets/moves.json` for "Recover," "Roost," "Slack Off," "Morning Sun," "Moonlight," "Synthesis," "Soft-Boiled," "Milk Drink."
- **Regenerator ability**: Query `assets/abilities.json` for "Regenerator."

**Context:** Sustain is particularly valuable on Bulky Offense and attrition-oriented teams. In VGC's fast pace, recovery is less critical than on 6v6 Singles, but a single recovery user can turn a 2HKO into a 3HKO and shift game outcomes. Teams without any recovery should have strong burst options to close games quickly.

---

## Archetype-Specific Role Priorities

Not every role is equally important for every archetype. Use this checklist to determine **must-have** vs. **nice-to-have** roles when evaluating `Role Coverage` in `SKILL.md`.

| Archetype | Must-Have Roles | Nice-to-Have Roles | Irrelevant Roles |
|---|---|---|---|
| **Trick Room** | Trick Room setter, 2-3 slow attackers (base Speed ≤ 45), Fake Out or redirection for setter protection | Intimidate, Screens, Sustain | Tailwind setter, Weather setter |
| **Tailwind Hyper Offense** | Tailwind setter, 2-3 mid-tier attackers, Fake Out or Setup | Intimidate, Redirection, Screens | Trick Room setter, Weather setter |
| **Hyper Offense (no Tailwind)** | 2-3 fast/blazing-tier attackers, Fake Out or Setup | Intimidate, Redirection | Screens, Sustain, Weather setter |
| **Weather (Rain/Sun/Sand/Snow)** | Weather setter, 1-2 abusers (Swift Swim/Chlorophyll/Sand Rush/Slush Rush or type-boosted moves), non-weather backup attacker | Intimidate, Redirection, Fake Out | Trick Room setter, opposing-weather setter |
| **Terrain-based** | Terrain setter, 1-2 terrain abusers, non-terrain backup attacker | Intimidate, Redirection, Fake Out | Weather setter, Trick Room setter |
| **Bulky Offense** | 2+ bulky attackers, Intimidate or Screens, recovery or pivoting, **Setup Denial** | Redirection, Fake Out, Setup | Tailwind setter, Weather setter |
| **Goodstuffs / Balance** | Intimidate, Fake Out or Redirection, speed control (any type), 2+ independent win conditions, **Setup Denial** | Screens, Sustain, Setup, Weather/Terrain | None are strictly irrelevant; well-roundedness is the goal |
| **Dual-Mode (Tailwind + Trick Room)** | Tailwind setter, Trick Room setter, speed-appropriate attackers for each mode, speed-agnostic supports | Intimidate, Redirection, Screens | Weather setter |

**How to use this table:** Missing a "must-have" role is a critical gap that should penalize `Role Coverage`. Missing a "nice-to-have" role is a minor gap. Missing an "irrelevant" role should not penalize the score.
