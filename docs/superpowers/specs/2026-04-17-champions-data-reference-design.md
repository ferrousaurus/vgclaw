# Champions Data Reference -- Design Spec

## Overview

Enrich the building-vgc-teams skill with comprehensive, Champions-accurate data scraped from Serebii. This replaces the PokeAPI runtime dependency with complete local data: abilities, movesets, Mega Evolution data, full move details, and full ability details -- all sourced from Serebii's Champions-specific pages.

## What Changes

### Enriched champions-roster.json

Expand each Pokemon entry from `{name, types, baseStats}` to include abilities, moves, and mega data:

```json
{
  "name": "Venusaur",
  "types": ["Grass", "Poison"],
  "abilities": ["Overgrow", "Chlorophyll"],
  "baseStats": { "hp": 80, "atk": 82, "def": 83, "spa": 100, "spd": 100, "spe": 80 },
  "moves": ["Acid Spray", "Bullet Seed", "Energy Ball", "Giga Drain"],
  "mega": {
    "ability": "Thick Fat",
    "types": ["Grass", "Poison"],
    "baseStats": { "hp": 80, "atk": 100, "def": 123, "spa": 122, "spd": 120, "spe": 80 }
  }
}
```

- `abilities`: array of all available abilities (regular + hidden, no distinction)
- `moves`: flat array of move names (Champions-accurate from Serebii)
- `mega`: only present on Pokemon with Mega Evolutions. Contains Mega ability, types (if changed), and base stats.

### New: moves.json

Every move available in Champions, keyed by name:

```json
{
  "Earthquake": {
    "type": "Ground",
    "category": "Physical",
    "power": 100,
    "accuracy": 100,
    "pp": 12,
    "priority": 0,
    "target": "All Adjacent",
    "effect": "Power doubled against Underground targets. Halved by Grassy Terrain."
  }
}
```

Fields: type, category (Physical/Special/Status), power (null for status), accuracy (null if always hits), pp, priority, target (Self/Single/All Adjacent/etc.), effect (brief description).

### New: abilities.json

Every ability available in Champions, keyed by name:

```json
{
  "Chlorophyll": {
    "effect": "Doubles Speed in Sun."
  },
  "Intimidate": {
    "effect": "Lowers adjacent opponents' Attack by one stage on switch-in."
  }
}
```

Fields: effect (concise competitive description).

### Updated SKILL.md

Remove all PokeAPI references. Update Data Sources section:

```markdown
**Local (always read first):**
- `champions-roster.json` -- legal Pokemon with types, base stats, abilities, moves, and mega data
- `type-chart.json` -- type effectiveness multipliers
- `moves.json` -- move details (type, category, power, accuracy, priority, target, effect)
- `abilities.json` -- ability effects

**Runtime fetches:**
- **Pikalytics** -- Fetch `https://www.pikalytics.com/champions` for usage stats, top threats, common sets. If fetch fails, ask the user.

**Reference (load when needed):**
- `reference/roles.md` -- VGC role definitions
- `reference/archetypes.md` -- common team archetypes
```

Update workflow steps to read from local files instead of fetching PokeAPI.

## Scraping Strategy

A bash script that runs once to produce all three data files:

1. **For each of the 186 Pokemon**, fetch `https://www.serebii.net/pokedex-champions/{name}/` and extract:
   - Abilities (from the abilities section)
   - Full move list (move names from the moves table)
   - Mega data if present (ability, types, stats)
2. **Collect all unique move names** across all Pokemon
3. **For each unique move**, fetch `https://www.serebii.net/attackdex-champions/{name}.shtml` and extract: type, category, power, accuracy, PP, priority, target, effect
4. **Collect all unique ability names** across all Pokemon
5. **For each unique ability**, fetch `https://www.serebii.net/abilitydex/{name}.shtml` and extract: effect description
6. **Write**: enriched `champions-roster.json`, `moves.json`, `abilities.json`

**Resumability:** Save raw HTML to a temp directory. Re-running skips already-fetched pages.

**Polite scraping:** 1-second delay between requests.

**Estimated scope:** ~186 Pokemon pages + ~400 move pages + ~100 ability pages = ~700 fetches = ~12 minutes.

**Cleanup:** Delete the script and temp files after generating the JSON artifacts.

## Serebii Page Structure

**Pokemon pages** (`/pokedex-champions/{name}/`):
- Abilities in `<a href="/abilitydex/{ability}.shtml"><strong>{Ability Name}</strong></a>` tags
- Moves in a table with columns: Attack Name, Type, Cat., Att., Acc., PP, Effect %
- Move names link to `/attackdex-champions/{move}.shtml`
- Type and category are image-based (`/pokedex-bw/type/{type}.gif`, `/pokedex-bw/type/{category}.png`)
- Mega data in a separate section below standard form data

**Move pages** (`/attackdex-champions/{move}.shtml`):
- Type, category, power, accuracy, PP in structured fields
- Priority and target info available
- Effect description in text

**Ability pages** (`/abilitydex/{ability}.shtml`):
- Effect description in text

## Out of Scope

- Items reference (future enhancement)
- Automated re-scraping on game updates
- Move/ability interactions or combo detection
- EV spread optimization
