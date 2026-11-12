---
name: referencing-vgc-vulnerabilities
description: Use to compute a Pokemon's or move's type matchups — resistances and vulnerabilities.
---

# Vulnerabilities

Type chart is `assets/type-chart.json`. Query with `jq`; never load full file or use type-chart memory.

## How to Query

- Path is relative to the `agent/` working directory: `assets/type-chart.json`.
- The file is a top-level object: `{ <AttackingType>: { <DefendingType>: <multiplier> } }`.
- 18 attacking types (Normal, Fire, Water, Electric, Grass, Ice, Fighting, Poison, Ground, Flying, Psychic, Bug, Rock, Ghost, Dragon, Dark, Steel, Fairy).
- Multipliers are `0`, `0.5`, `1`, or `2`.
- **A missing defender entry means 1× (neutral).** Use `// 1` when reading a value to apply the default.
- For dual-typed defenders, **multiply** the two single-type multipliers to get the combined modifier (then convert 0.25 → "1/4×", 0.5 → "1/2×", 1 → "1×", 2 → "2×", 4 → "4×").
- Defensive type lookup is the inverse of the chart: the multiplier of an attacking type against a defending type is the multiplier of `(attacker → defender)`. To find a defender's weakness to a type, look up that type as the key in the chart and find the defender in its value (or use `// 1` for the missing case).

## Schema

```json
{
  "Fire": { "Fire": 0.5, "Water": 0.5, "Grass": 2, "Ice": 2, "Bug": 2, "Rock": 0.5, "Dragon": 0.5, "Steel": 2 }
}
```

Fire row means Fire deals 0.5× to Fire and 2× to Grass; unlisted types (for example Electric) take 1×.

## Common Queries

Substitute type names as literals or with `--arg` / `--argjson`. Type names are **capitalized strings** and must match exactly.

```bash
# Single attack matchup: how effective is TYPE against DEFENDER?
# (returns the multiplier, or 1 if missing)
jq --arg t "Fire" --arg d "Grass" '.[$t][$d] // 1' assets/type-chart.json   # -> 2

# Defensive lookup: what is a Pokemon's modifier against an attacking type?
# Get the Pokemon's types first, then multiply.
TYPES=$(jq -r '.Feraligatr.types | join(" ")' assets/pokemon.json)
for d in $TYPES; do
  jq --arg t "Ice" --arg d "$d" '.[$t][$d] // 1' assets/type-chart.json
done
# Multiply the per-type results to get the combined modifier.

# List everything a type hits super-effectively (2×)
jq --arg t "Fighting" '.[$t] | to_entries | map(select(.value == 2)) | map(.key)' assets/type-chart.json

# List everything that resists a type (0.5×)
jq --arg t "Dragon" '.[$t] | to_entries | map(select(.value == 0.5)) | map(.key)' assets/type-chart.json

# List everything a type hits for 0× (immune)
jq --arg t "Normal" '.[$t] | to_entries | map(select(.value == 0)) | map(.key)' assets/type-chart.json

# Combined modifier for a dual-typed defender vs. an attacking type
jq --arg t "Ice" --arg d1 "Dragon" --arg d2 "Flying" '
  (.[$t][$d1] // 1) * (.[$t][$d2] // 1)
' assets/type-chart.json
# -> 4 (Ice 2× Dragon, Ice 2× Flying)

# Full defensive profile of a Pokemon vs. every attacking type
# (works for 1- or 2-type Pokemon; slurps pokemon.json for types)
jq -r --slurpfile pkmn assets/pokemon.json '
  . as $chart |
  $pkmn[0]["Feraligatr"].types as $types |
  ["Normal","Fire","Water","Electric","Grass","Ice","Fighting","Poison","Ground","Flying","Psychic","Bug","Rock","Ghost","Dragon","Dark","Steel","Fairy"] |
  map(. as $atk |
    if ($types | length) == 1 then
      ($chart[$atk][$types[0]] // 1)
    else
      ($chart[$atk][$types[0]] // 1) * ($chart[$atk][$types[1]] // 1)
    end |
    "\($atk): \(.)"
  ) | .[]
' assets/type-chart.json
# Feraligatr (Water): Electric 2, Grass 2, Fire 0.5, Water 0.5, Ice 0.5, Steel 0.5, ...
```

For repeated roster calculations, write a jq program (for example `/tmp/vuln.jq`) and run `jq -f /tmp/vuln.jq`; this retains reproducibility.

## Quick Sanity Checks

- `jq 'keys | sort' assets/type-chart.json` should return all 18 attacking types.
- `jq -r '[.. | numbers] | unique | .[]' assets/type-chart.json` returns only the multipliers that are **explicitly encoded** in the file — typically `0`, `0.5`, and `2`. Neutral `1` is **not** stored; missing defender keys mean 1× by convention.
- For a STAB move, the move's `type` field on `assets/moves.json` is the attacking type for the chart lookup.
- Ability-based immunities (Levitate, Flash Fire, Lightning Rod, etc.) and **type-based** immunities (e.g. Ghost is immune to Normal and Fighting) are both relevant. Type-based immunities are already encoded in the chart (multiplier 0). Ability-based immunities must be checked separately against `assets/abilities.json` and `assets/pokemon.json`.
