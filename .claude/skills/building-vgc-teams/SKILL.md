---
name: building-vgc-teams
description: Use when the user wants to build a competitive VGC team for Pokemon Champions, needs help choosing Pokemon, checking type coverage, or evaluating meta matchups
---

# Building VGC Teams

Conversational team builder for Pokemon Champions VGC. Guides intermediate players through constructing a 6-Pokemon team, analyzing its strengths and weaknesses, and exporting in Showdown paste format.

## Gatekeeper Rule

**NEVER suggest a Pokemon that is not in champions-roster.json.** Before suggesting any Pokemon, verify it exists in the roster. This applies regardless of what PokeAPI or Pikalytics data says. The roster is the single source of truth for Champions legality.

## Data Sources

**Local (always read first):**
- `champions-roster.json` -- legal Pokemon with types and base stats
- `type-chart.json` -- type effectiveness multipliers (2, 1, 0.5, 0). Missing entries = 1x.

**Runtime fetches:**
- **PokeAPI** -- `https://pokeapi.co/api/v2/pokemon/{name}` for abilities, moves. Use lowercase hyphenated names (e.g., `mr-rime`, `kommo-o`). User is final authority on moveset accuracy -- PokeAPI reflects mainline games, not Champions-specific changes.
- **Pikalytics** -- Fetch `https://www.pikalytics.com/champions` for current usage stats, top threats, common sets, and teammates. Parse what you can from the HTML. If the fetch fails, ask the user what they're seeing in the meta.

**Reference (load when needed):**
- `reference/roles.md` -- VGC role definitions
- `reference/archetypes.md` -- common team archetypes

## Workflow

### 1. Ask the user how to start

Three entry points:
- **"I want to build around X"** -- User names 1-2 Pokemon. Verify they're in the roster. Proceed to Foundation.
- **"I want to play [archetype]"** -- Load archetypes.md, present the relevant core. Proceed to Foundation.
- **"What's good right now?"** -- Fetch Pikalytics. Present top-usage Pokemon and common cores. Let the user pick a direction.

### 2. Foundation (slots 1-2)

Establish the team's core pair. For each Pokemon:
1. Verify it's in champions-roster.json
2. Fetch its data from PokeAPI (abilities, moves)
3. Suggest a competitive set (moves, ability, item) as a starting point
4. Explain why these two work together (type synergy, role coverage, archetype fit)

### 3. Build Out (slots 3-4)

Identify gaps in the current team:
1. **Type gaps** -- Read type-chart.json + roster types. Which types can the team not resist? Which types can't the team hit super-effectively?
2. **Role gaps** -- Load roles.md. Does the team have speed control? Intimidate? Redirection? Fake Out?
3. **Meta threats** -- Fetch Pikalytics. Which top-usage Pokemon threaten the current core?

For each gap, suggest 2-3 Pokemon from the roster that address it. Prefer Pokemon that fill multiple gaps. Present trade-offs.

### 4. Final Slots (5-6)

Fill remaining holes:
- Coverage gaps from the type analysis
- Anti-meta picks that handle common threats
- "Glue" Pokemon that support the team's game plan

### 5. Set Refinement

For each of the 6 Pokemon, suggest a starting set:
- Ability
- Held item (no duplicate items across the team)
- 4 moves
- Nature
- EVs (suggest a simple spread like 252/252/4 as a baseline)

Pull known competitive sets from PokeAPI move data + Pikalytics common sets. The user customizes from here.

### 6. Team Analysis

Run all three analysis layers. Present results clearly.

**Type Coverage Matrix:**

Defensive -- for each team member, list weaknesses and resistances using type-chart.json. Flag any type that hits 3+ team members super-effectively.

Offensive -- for each team member's STAB types + main coverage moves, list what types the team hits super-effectively. Flag types the team has no super-effective coverage against.

**Threat List:**

Fetch Pikalytics top-usage Pokemon. For each high-usage threat:
- Which team members handle it well?
- Which team members lose to it?
- If the team has no good answer, suggest counterplay (move change, item swap, or team member replacement)

**Role Checklist:**

Load roles.md. Check which roles the team covers:
- [ ] Speed control
- [ ] Intimidate / Attack drops
- [ ] Redirection
- [ ] Fake Out
- [ ] Setup
- [ ] Spread damage
- [ ] Weather/Terrain (if relevant to the archetype)

Not every team needs every role. Flag gaps as information, not failures.

### 7. Export

Output the team in Showdown paste format:

```
[Pokemon] @ [Item]
Ability: [Ability]
Level: 50
EVs: [HP] HP / [Atk] Atk / [Def] Def / [SpA] SpA / [SpD] SpD / [Spe] Spe
[Nature] Nature
- [Move 1]
- [Move 2]
- [Move 3]
- [Move 4]
```

Rules: Level 50, EVs total 508 max, no duplicate items, no duplicate Pokemon.

## Conversation Style

- The user can jump around: swap a Pokemon, revisit an earlier slot, re-run analysis, or change direction at any time
- Present 2-3 options when suggesting Pokemon, not a single "correct" answer
- Explain trade-offs concisely -- the user understands VGC basics
- When in doubt about Champions-specific data (modified movesets, availability of specific forms), ask the user rather than guessing
