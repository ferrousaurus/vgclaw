# Items Data Reference -- Design Spec

## Overview

Add held item data to the building-vgc-teams skill by scraping Serebii's Champions items page. Creates an `items.json` data file and a `reference/items.md` competitive guide, then updates SKILL.md to incorporate item selection into the teambuilding workflow.

## What Changes

### New: items.json

Every held item available in Champions, keyed by name (~115 entries):

```json
{
  "Choice Scarf": {
    "category": "Hold Item",
    "effect": "Boosts Speed by 50% but locks the holder into one move."
  },
  "Sitrus Berry": {
    "category": "Berry",
    "effect": "Restores 25% HP when HP drops below 50%."
  },
  "Venusaurite": {
    "category": "Mega Stone",
    "effect": "Enables Venusaur to Mega Evolve into Mega Venusaur."
  }
}
```

Fields:
- `category`: one of "Hold Item", "Berry", or "Mega Stone"
- `effect`: description of the item's competitive effect, from Serebii

Three categories scraped from the items page:
- **Hold Items** (~30): Choice items, type-boosting items, Focus Sash, Leftovers, etc.
- **Berries** (~28): Sitrus, Lum, resistance berries (Shuca, Yache, etc.)
- **Mega Stones** (~60): one per Mega-eligible Pokemon

Miscellaneous items (tickets, coupons) are excluded -- they are not battle-relevant held items.

### New: reference/items.md

Competitive item selection guide, loaded during set refinement. Grouped by use case:

- **Offensive Items** -- Choice Band, Choice Specs, Life Orb, type-boosting items (Charcoal, Mystic Water, etc.). When to pick raw power vs locked choice vs recoil.
- **Speed Items** -- Choice Scarf, Quick Claw. When outspeeding matters more than move flexibility.
- **Defensive/Survival Items** -- Focus Sash, Leftovers, Sitrus Berry, resistance berries. When to prioritize living a hit over dealing damage.
- **Utility Items** -- Mental Herb (anti-Taunt/Encore), White Herb (Intimidate counter), Light Ball (Pikachu-specific). Niche picks that solve specific problems.
- **Mega Stones** -- Mandatory if running a Mega. Only one Mega per team. Stone choice is deterministic (Pokemon dictates stone).
- **General Heuristics** -- No duplicate items on a team. Item choice depends on role (sweeper wants damage, support wants survival). Check Pikalytics common sets as a starting point.

Follows the same style as `roles.md` and `archetypes.md` -- concise, competitive-focused, not exhaustive.

### Updated SKILL.md

**Data Sources section** -- add `items.json` to local data:

```markdown
- `items.json` -- held item details (category, effect)
```

**Reference section** -- add items guide:

```markdown
- `reference/items.md` -- item selection heuristics
```

**Set Refinement (step 5)** -- expand item selection guidance. Currently says "Held item (no duplicate items across the team)". Replace with:

Load `reference/items.md` for selection heuristics. For each Pokemon, suggest an item based on its role and the team's existing items. Verify the item exists in `items.json`. Enforce no duplicate items across the team. If a Pokemon is Mega-eligible and the team doesn't already have a Mega, consider whether the Mega Stone is worth the item slot.

## Scraping Strategy

A Python script that fetches the single items page and produces `items.json`:

1. Fetch `https://www.serebii.net/pokemonchampions/items.shtml`
2. Parse the three sections (Hold Items, Berries, Mega Stones) from the HTML tables
3. Extract item name and effect description from each row
4. Write `items.json` keyed by item name

This is a single-page scrape (1 fetch), much simpler than the Pokemon/moves/abilities scrape.

**Cleanup:** Delete the script after generating the JSON artifact.

## Out of Scope

- Item-Pokemon compatibility rules (any Pokemon can hold any non-Mega-Stone item)
- Item sprite/image data
- Shop prices or unlock conditions
- Automated item recommendation engine (the reference guide + agent judgment handles this)
