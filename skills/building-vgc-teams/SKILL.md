---
name: building-vgc-teams
description: Use when the user wants to build a competitive VGC team for Pokemon Champions, needs help choosing Pokemon, checking type coverage, or evaluating meta matchups
---

# Building VGC Teams

Conversational team builder for Pokemon Champions VGC. Guides intermediate players through constructing a 6-Pokemon team, analyzing its strengths and weaknesses, and exporting in Showdown paste format.

## Gatekeeper Rule

**NEVER suggest a Pokemon that is not in champions-roster.json.** Before suggesting any Pokemon, verify it exists in the roster. This applies regardless of what Pikalytics data says. The roster is the single source of truth for Champions legality.

## Data Sources

**Local (always read first):**
- `champions-roster.json` -- legal Pokemon with types, base stats, abilities, moves, and mega data
- `type-chart.json` -- type effectiveness multipliers (2, 1, 0.5, 0). Missing entries = 1x.
- `moves.json` -- move details (type, category, power, accuracy, priority, target, effect)
- `abilities.json` -- ability effects
- `items.json` -- held item details (category, effect)

**Runtime fetches:**
- **Pikalytics** -- Fetch `https://www.pikalytics.com/champions` for current usage stats, top threats, common sets, and teammates. Parse what you can from the HTML. If the fetch fails, ask the user what they're seeing in the meta.

**Reference (load when needed):**
- `reference/roles.md` -- VGC role definitions
- `reference/archetypes.md` -- common team archetypes
- `reference/items.md` -- item selection heuristics
- `reference/synergies.md` -- pair synergy patterns (offensive combos, defensive pivots, mode pairs)

## Workflow

### 1. Ask the user how to start

Three entry points:
- **"I want to build around X"** -- User names 1-2 Pokemon. Verify they're in the roster. Proceed to Foundation.
- **"I want to play [archetype]"** -- Load archetypes.md, present the relevant core. Proceed to Foundation.
- **"What's good right now?"** -- Fetch Pikalytics. Present top-usage Pokemon and common cores. Let the user pick a direction.

### 2. Foundation (slots 1-2)

Establish the team's core pair. For each Pokemon:
1. Verify it's in champions-roster.json
2. Read its abilities and moves from the roster. Look up move details in moves.json and ability effects in abilities.json as needed.
3. Suggest a competitive set (moves, ability, item) as a starting point
4. Explain why these two work together (type synergy, role coverage, archetype fit)
5. Note what role each plays in a bring-4 context -- these two will likely appear in most bring-4 groups. Example: "Garchomp is your primary attacker, Whimsicott is your speed control -- expect to bring both in most games."

### 3. Build Out (slots 3-4) -- Complete the Core-4

The goal is to complete your default bring-4 group. Identify gaps in the current pair:
1. **Type gaps** -- Read type-chart.json + roster types. Which types can the team not resist? Which types can't the team hit super-effectively?
2. **Role gaps** -- Load roles.md. Does the team have speed control? Intimidate? Redirection? Fake Out?
3. **Meta threats** -- Fetch Pikalytics. Which top-usage Pokemon threaten the current core?

For each gap, suggest 2-3 Pokemon from the roster that address it. Evaluate candidates as "which Pokemon makes the strongest group of 4 with your existing core pair?" Prefer Pokemon that fill multiple gaps. Present trade-offs. When suggesting, note any pair synergies with existing team members -- load `reference/synergies.md` and call out offensive combos (e.g., "Garchomp gives you Earthquake + your Corviknight is immune to it"), defensive pivot pairs, or mode pairs that the new Pokemon enables.

**After slot 4 is chosen, present a core-4 summary:** "Your default bring is [A, B, C, D]. This group has [roles covered: speed control, Fake Out, spread damage, etc.]. It struggles against [specific threats or archetypes the core-4 can't handle]." This summary frames slots 5-6 as solving those problems.

### 4. Alternate Mode Slots (5-6)

Slots 5-6 enable alternate modes for matchups the core-4 struggles against. Reference the core-4 summary from step 3.

For each slot, suggest 2-3 Pokemon framed as swap-ins:
- **Name which core-4 member it replaces** and in what matchup. Example: "Swap Torkoal in for Whimsicott against Trick Room teams -- Torkoal gives you a Trick Room mode with Hatterene instead of a Tailwind mode."
- **Describe the alternate mode it creates.** What is the game plan for the resulting group of 4? How does it differ from the core-4's plan?
- **Pair synergy** -- does the new Pokemon form strong mode pairs or offensive combos with the remaining core members? A Pokemon that enables a coherent alternate mode is better than one that just fills a type gap.

If the team only has one viable mode after both slots are filled, flag it: "Your team currently brings the same 4 every game. Consider [alternative Pokemon] for slot [N] to give you a [description] mode against [matchup]."

### 5. Set Refinement

For each of the 6 Pokemon, suggest a starting set:
- Ability
- Held item
- 4 moves
- Nature
- EVs (suggest a simple spread like 252/252/4 as a baseline)

Build sets from the Pokemon's available moves and abilities in champions-roster.json. Look up move details (type, power, category) in moves.json.

**Item selection:** Load `reference/items.md` for selection heuristics. For each Pokemon, suggest an item based on its role and the team's existing items. Verify the item exists in `items.json`. Enforce no duplicate items across the team. If a Pokemon is Mega-eligible and the team doesn't already have a Mega, consider whether the Mega Stone is worth the item slot.

Cross-reference with Pikalytics common sets when available. The user customizes from here.

### 6. Team Analysis

Run all four analysis layers. Present results clearly.

**Type Coverage Matrix:**

Defensive -- for each team member, list weaknesses and resistances using type-chart.json. Flag any type that hits 3+ team members super-effectively.

Offensive -- for each team member's STAB types + main coverage moves, list what types the team hits super-effectively. Flag types the team has no super-effective coverage against.

**Pair Synergy Scan:**

Load `reference/synergies.md`. For each of the 15 possible pairs on the team, check the pair against each synergy category (offensive combos, defensive pivot pairs, mode pairs) using the team's actual moves, abilities, and types from the data files.

Do not list all 15 pairs. Present only the notable findings:

*Top synergy pairs (2-3 best):* Identify the pairs with the strongest synergies. For each, name the pair, state the synergy category, and explain what they do together. Example: "Sableye + Feraligatr (Mode Pair: Fake Out + Dragon Dance setup. Sableye also has Helping Hand to boost Feraligatr's attacks after it's set up.)"

*Anti-synergy flags:* Identify pairs that are actively bad together on the field. Shared weaknesses with no cross-coverage, redundant roles (two redirectors, two Fake Out users with nothing to enable), or conflicting strategies (Tailwind setter paired with a Trick Room setter and no plan to use both modes). Only flag pairs where the anti-synergy is meaningful -- two Pokemon sharing one weakness is normal, two Pokemon sharing three weaknesses with no cross-coverage is a flag.

*Missing synergy gaps:* Check whether the team is missing synergy patterns that its archetype typically wants. Reference the team's archetype from `reference/archetypes.md` if one was chosen in step 1. Examples: a hyper offense team with no Fake Out + setup pair, a rain team with no spread move + immunity combo, a team with setup sweepers but no redirector or Fake Out user to enable them. Not every team needs every pattern -- flag gaps as observations, not failures.

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
- All move and ability data is Champions-accurate from Serebii. If the user reports a discrepancy, trust the user and note it for roster updates.
