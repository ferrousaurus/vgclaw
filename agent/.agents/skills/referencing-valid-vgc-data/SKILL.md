---
name: referencing-valid-vgc-data
description: Use to verify legality or availability of a Pokemon, move, ability, or item against the static assets.
---

# Valid Data

Source every Pokemon, move, ability, and held item from static assets in `agent/`; never use pre-trained knowledge.

## How to Query the Data

Query assets with `jq` via Bash. Never load whole JSON into context or scan it with `grep`/`rg`.

- Paths are relative to the `agent/` working directory (e.g. `assets/pokemon.json`).
- All five files are **top-level JSON objects** keyed by a name string. Keys are **case-sensitive** and must match exactly as they appear in the file (e.g. `"Mega Venusaur"`, `"Choice Scarf"`, `"Close Combat"`).
- Unknown keys return `null` in jq, not an error — verify with `// empty` or `has(...)` when presence matters.
- Numbers (power, accuracy, pp, stat values) are JSON numbers. Missing numeric fields on moves (e.g. status moves) are `null`, not absent.
- A failed query (e.g. `jq: error: ...`) means malformed jq — fix the query, do not guess at the answer.

## Data Shapes

### `assets/pokemon.json`

Top-level object: `{ <PokemonName>: <PokemonEntry>, ... }`. 215 entries.

```json
{
  "types": ["Grass", "Poison"],
  "pokedexNumber": 3,
  "baseStats": { "hp": 80, "atk": 82, "def": 83, "spa": 100, "spd": 100, "spe": 80 },
  "abilities": ["Overgrow", "Chlorophyll"],
  "moves": ["Acid Spray", "Amnesia", "..."],
  "mega": [
    {
      "name": "Mega Venusaur",
      "item": "Venusaurite",
      "types": ["Grass", "Poison"],
      "ability": "Thick Fat",
      "baseStats": { "hp": 80, "atk": 100, "def": 123, "spa": 122, "spd": 120, "spe": 80 },
      "regulations": ["Regulation M-A", "Regulation M-B"]
    }
  ],
  "regulations": ["Regulation M-A", "Regulation M-B"]
}
```

Notes:
- `mega` is an **array** (some Pokemon have multiple Mega forms, e.g. Charizard); absent on non-Mega-eligible Pokemon.
- `regulations` is absent on some entries and on some Mega forms.
- `baseStats` keys are always: `hp`, `atk`, `def`, `spa`, `spd`, `spe` (lowercase).
- `moves` and `abilities` are exact-name string arrays.

### `assets/moves.json`

Top-level object: `{ <MoveName>: <MoveEntry>, ... }`. 490 entries.

```json
{
  "type": "Rock",
  "category": "Physical",
  "power": 40,
  "accuracy": 100,
  "pp": 20,
  "priority": 1,
  "target": "Selected Target",
  "effect": ""
}
```

Field notes:
- `category` is one of `Physical`, `Special`, `Status`.
- `power` and `accuracy` are `null` for status moves (not absent).
- `accuracy` of `101` is a known sentinel for "always hits" (e.g. Aerial Ace, Swift). Do not treat 101 as a percent.
- `priority` is an integer; 0 is normal, positive is a priority move.
- `target` is a free-form string describing targeting (e.g. `Selected Target`, `Self`, `All Adjacent Pokemon`, `Self or Ally`).

### `assets/abilities.json`

Top-level object: `{ <AbilityName>: <AbilityEntry>, ... }`. 201 entries.

```json
{
  "effect": "Powers up moves of the same type as the Pokémon.",
  "stabModifier": 2.0
}
```

Field notes:
- `stabModifier` and `damageModifier` are **optional** numbers; only present on abilities that change damage output.
- `damageCondition` is optional and only present alongside `damageModifier` (describes the condition, e.g. `"Fighting-type moves only"`).
- Some abilities (e.g. Intimidate) have only `effect` and no numeric modifiers.

### `assets/items.json`

Top-level object: `{ <ItemName>: <ItemEntry>, ... }`. 148 entries.

```json
{
  "category": "Hold Item",
  "effect": "An item to be held by a Pokémon. This belt helps with focus and boosts the power of the holder's Fighting-type moves.",
  "damageModifier": 1.2,
  "damageCondition": "Fighting-type moves only",
  "regulations": ["Regulation M-A", "Regulation M-B"]
}
```

Field notes:
- `category` is `Hold Item` for standard held items (Mega Stones are also held items but tagged by their effect).
- `damageModifier` and `damageCondition` are optional; pair up when present.
- `regulations` is an array of strings, e.g. `["Regulation M-A", "Regulation M-B"]`. Absent on some items.

### `assets/type-chart.json`

Top-level object: `{ <AttackingType>: { <DefendingType>: <multiplier> } }`. 18 attacking types.

The schema, multiplier values, the "missing defender entry means 1×" convention, and the full vuln/resist query workflow live in `referencing-vgc-vulnerabilities` — the single source for type-chart usage.

## Common Queries

Use these common patterns. Substitute `$NAME` literally, or construct filter from shell variable; never invent fields.

```bash
# Does a Pokemon exist?
jq -e 'has("Feraligatr")' assets/pokemon.json

# Get a Pokemon's full entry
jq '.Feraligatr' assets/pokemon.json

# Get a single field
jq -r '.Feraligatr.types | join(", ")' assets/pokemon.json
jq -r '.Feraligatr.baseStats.spe' assets/pokemon.json

# Is a move in a Pokemon's learnset? (returns true/false)
jq --arg m "Ice Fang" -e '.Feraligatr.moves | index($m) != null' assets/pokemon.json

# Is an ability legal on a Pokemon?
jq --arg a "Sheer Force" -e '.Ninetales.abilities | index($a) != null' assets/pokemon.json

# What are a Pokemon's Mega forms?
jq -c '.Venusaur.mega[]' assets/pokemon.json

# Mega form's ability / stats / regulations
jq -r '.Charizard.mega[] | select(.name == "Mega Charizard X") | .ability' assets/pokemon.json
jq '.Garchomp.mega[] | select(.name == "Mega Garchomp") | .baseStats' assets/pokemon.json

# Is a Mega form legal in a given regulation?
jq --arg n "Mega Venusaur" -e '.Venusaur.mega[] | select(.name == $n) | .regulations | index("Regulation M-B") != null' assets/pokemon.json

# Is an item legal in a given regulation?
jq --arg i "Choice Scarf" -e '.[$i].regulations // [] | index("Regulation M-A") != null' assets/items.json

# Is a move in the data (i.e. usable at all)?
jq -e 'has("Boomburst")' assets/moves.json

# A move's type / category / power
jq -r '.Boomburst | "\(.type) \(.category) \(.power // "—")"' assets/moves.json

# Does an ability have a damage modifier? (and what is it)
jq -r '.Adaptability | "\(.stabModifier // "none")"' assets/abilities.json

# List all Mega-eligible Pokemon
jq -r 'to_entries[] | select(.value.mega != null) | .key' assets/pokemon.json

# Filter moves by type
jq -r 'to_entries[] | select(.value.type == "Fairy" and .value.category == "Special") | .key' assets/moves.json
```

## Legality Rules

A member is legal only if all hold:

1. The Pokemon name is a key in `assets/pokemon.json`.
2. The held item name is a key in `assets/items.json`.
3. The ability name is a key in `assets/abilities.json` **and** appears in the Pokemon's `abilities` array.
4. Each of its moves is a key in `assets/moves.json` **and** appears in the Pokemon's `moves` array.
5. If the Pokemon is holding its Mega Stone, the Mega form name appears in `pokemon.json[<name>].mega[]`.

Never infer legality from descriptions or memory. Verify each rule with `jq`; use `check-vgc-team-legality` for whole team.
