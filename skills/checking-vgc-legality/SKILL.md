---
name: checking-vgc-legality
description: Provides authoritative game data for Pokemon Champions VGC — legal roster, moves, abilities, items, and type chart. Required dependency for team building and evaluation skills.
---

# Checking VGC Legality

Data provider for Pokemon Champions VGC game data. This skill is not invoked directly. Other skills reference its files as a required dependency.

## Gatekeeper Rule

**NEVER suggest a Pokemon that is not in champions-roster.json.** Before suggesting any Pokemon, verify it exists in the roster. This applies regardless of what any other data source says. The roster is the single source of truth for Champions legality.

Any skill that depends on checking-vgc-legality inherits this rule.

## Data Files

- `champions-roster.json` -- legal Pokemon with types, base stats, abilities, moves, and mega data
- `type-chart.json` -- type effectiveness multipliers (2, 1, 0.5, 0). Missing entries = 1x.
- `moves.json` -- move details (type, category, power, accuracy, priority, target, effect)
- `abilities.json` -- ability effects
- `items.json` -- held item details (category, effect)
