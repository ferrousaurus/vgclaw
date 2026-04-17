# VGC Team Builder Skill -- Design Spec

## Overview

An agent skill that guides users through building a competitive VGC team for Pokemon Champions. The skill helps intermediate-level players construct teams conversationally, analyze strengths and weaknesses, check meta positioning, and export in Showdown paste format.

Pokemon Champions (released 2026-04-08) is the official VGC platform going forward. It includes a subset of Pokemon with some modified movesets. The skill must ensure every suggestion is legal in Champions.

## File Structure

```
building-vgc-teams/
├── SKILL.md                    # Team-building workflow and analysis logic
├── champions-roster.json       # Available Pokemon in Champions (name, types, base stats)
├── type-chart.json             # Type effectiveness matrix
└── reference/
    ├── roles.md                # VGC role definitions (speed control, redirect, etc.)
    └── archetypes.md           # Common team archetypes (Rain, Sun, Trick Room, etc.)
```

- **champions-roster.json** is the single source of truth for what's legal in Champions. Movesets and abilities come from PokeAPI at runtime. Schema:
  ```json
  [
    {
      "name": "Garchomp",
      "types": ["Dragon", "Ground"],
      "baseStats": { "hp": 108, "atk": 130, "def": 95, "spa": 80, "spd": 85, "spe": 102 }
    }
  ]
  ```
- **type-chart.json** is a static 18x18 effectiveness matrix. Schema: `{ "Fire": { "Grass": 2, "Water": 0.5, "Fire": 0.5, ... }, ... }` where values are damage multipliers (2, 1, 0.5, 0).
- **roles.md** and **archetypes.md** are loaded only when relevant (progressive disclosure).
- No moveset or item data stored locally.

## Target User

Intermediate VGC players who understand competitive basics (STAB, spread moves, speed tiers) but need help with team synergy and meta awareness. The skill does not explain fundamental concepts.

## Team-Building Workflow

### 1. Entry Point

Ask the user how they want to start:
- A specific Pokemon they want to build around
- A team archetype (Rain, Trick Room, Sun, Hyper Offense, etc.)
- What's strong in the current meta (triggers Pikalytics fetch)

### 2. Foundation (slots 1-2)

Based on the starting point, suggest a core pair. Pull competitive sets from PokeAPI, cross-reference against champions-roster.json. Present sets with reasoning about why they work together.

### 3. Build Out (slots 3-4)

Identify what the core is missing:
- Defensive type gaps (type-chart.json + roster)
- Missing roles (load roles.md -- speed control, redirect, Intimidate, etc.)
- Meta threats (fetch Pikalytics -- what common Pokemon beat the current picks?)

Suggest Pokemon that fill multiple gaps. Present 2-3 options with trade-offs.

### 4. Final Slots (5-6)

Focus on:
- Remaining coverage holes
- Flexible / anti-meta options
- "Glue" Pokemon that round out the team

### 5. Set Refinement

For each Pokemon, pull known competitive sets as starting points. User customizes from there.

### 6. Team Analysis

Run full analysis (see Team Analysis section below).

### 7. Export

Output the final team in Showdown paste format.

The user can jump around, skip ahead, go back, or swap Pokemon at any point. This is a conversation, not a rigid wizard.

## Team Analysis

Three layers, run after assembly or on demand:

### Type Coverage Matrix

- **Defensive:** For each team member, list weaknesses/resistances. Highlight types where 3+ Pokemon share a weakness.
- **Offensive:** For each team member's STAB + coverage moves, identify types the team can't hit super-effectively.
- Uses type-chart.json and roster data. No external fetch needed.

### Threat List

- Fetch current top-usage Pokemon from Pikalytics.
- For each high-usage threat, check: can the team handle it? Which team members match up well/poorly?
- Flag threats the team has no good answer for. Suggest counterplay (move changes, item choices, or member swaps).

### Role Checklist

Load roles.md and verify the team covers key VGC roles:
- Speed control (Tailwind, Trick Room, Icy Wind, etc.)
- Intimidate / Attack drops
- Redirection (Follow Me, Rage Powder)
- Fake Out pressure
- Setup options (Swords Dance, Calm Mind, etc.)
- Protect users
- Spread damage

Not every team needs every role. The skill flags gaps so the user makes informed trade-offs. The analysis is "here's what your team is good at, here's where it's exposed, here's what you can do about it" -- not pass/fail.

## Data Flow and External Calls

### PokeAPI (runtime)

- `https://pokeapi.co/api/v2/pokemon/{name}` -- abilities, moves, stats
- `https://pokeapi.co/api/v2/pokemon-species/{name}` -- form data if needed
- Called when suggesting a Pokemon or building a set
- Results filtered against champions-roster.json
- User is the final authority on moveset accuracy. If PokeAPI lists a move that Champions doesn't allow, the user corrects it.

### Pikalytics (runtime)

- Fetched via the Fetch MCP tool from `https://www.pikalytics.com/champions`
- Used for: usage stats, common sets, top threats, common teammates
- HTML scraping, not a structured API -- parse what's available from page content
- Graceful degradation: if the fetch fails or page structure changes, fall back to asking the user what they're seeing in the meta

### Local Data (always available)

- **champions-roster.json:** Hard filter for legality. The skill never suggests a Pokemon not in this file, regardless of what PokeAPI or Pikalytics returns.
- **type-chart.json:** Coverage math.
- **roles.md / archetypes.md:** Loaded when the conversation reaches those topics.

### Gatekeeper Rule

The skill never suggests a Pokemon not in champions-roster.json, regardless of what PokeAPI or Pikalytics returns. The roster is the gatekeeper.

## Showdown Export Format

Standard Showdown paste format:

```
Garchomp @ Life Orb
Ability: Rough Skin
Level: 50
EVs: 4 HP / 252 Atk / 252 Spe
Jolly Nature
- Earthquake
- Dragon Claw
- Protect
- Rock Slide
```

Rules:
- Level is always 50 (VGC standard)
- EVs must total 508 or less
- No duplicate items across the team
- No duplicate Pokemon
- All moves, abilities, and items must be ones the Pokemon can actually have (per PokeAPI, corrected by user for Champions differences)

## Out of Scope

- Team analysis of pre-built teams (separate future skill)
- Beginner-level concept explanations
- Damage calculation
- EV optimization / calc integration
- Non-Champions formats (Scarlet/Violet, older gens)
- Automated scraping scripts for roster maintenance
