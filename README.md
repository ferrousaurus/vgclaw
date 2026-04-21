# VGC Team Building & Evaluation Skills

A suite of skills for building, evaluating, and refining Pokemon Champions VGC teams. Choose your entry point based on what you need to do.

## Installation

Add the skills to your Agent environment:

```bash
npx skills add https://github.com/ferrousaurus/vgclaw --skill checking-vgc-legality
npx skills add https://github.com/ferrousaurus/vgclaw --skill evaluating-vgc-viability
npx skills add https://github.com/ferrousaurus/vgclaw --skill evaluating-vgc-meta
npx skills add https://github.com/ferrousaurus/vgclaw --skill building-vgc-teams
npx skills add https://github.com/ferrousaurus/vgclaw --skill evaluating-vgc-teams
```

## Quick Start

### I want to build a new VGC team
Use the **building-vgc-teams** skill.
- Guides you through constructing a 6-Pokemon team from scratch
- Helps you choose Pokemon, refine their sets, and validate your core-4 modes
- Outputs your team in Showdown paste format

### I want to evaluate an existing VGC team
Use the **evaluating-vgc-teams** skill.
- Paste in your team and get a detailed analysis
- Auto-detects your team's archetype and strategy
- Drills down into type coverage, synergies, bring-4 modes, and meta matchups
- Suggests tiered fixes (move swaps first, Pokemon swaps last)
- Exports a revised team with a change diff when you're done

## The Five Skills

### Entry Points

#### **building-vgc-teams**
Conversational team builder for constructing competitive 6-Pokemon teams.

**What it does:**
1. Asks how you want to start (build around specific Pokemon, choose an archetype, or see what's meta)
2. Guides you through filling all 6 slots with strategic focus on your core-4
3. Refines movesets, items, abilities, and EVs for each Pokemon
4. Runs comprehensive team analysis (type coverage, synergies, bring-4 modes)
5. Exports the final team in Showdown paste format

**Best for:** Starting a team from scratch or pivoting to a new archetype

#### **evaluating-vgc-teams**
Team analyzer and optimizer for existing teams.

**What it does:**
1. Parses your Showdown paste and validates legality
2. Auto-detects your team's archetype (Rain, Trick Room, Hyper Offense, etc.)
3. Provides a summary verdict with top strengths and issues
4. Offers six drill-down analysis layers:
   - Type Coverage (offensive/defensive gaps)
   - Pair Synergies (how well your Pokemon work together)
   - Bring-4 Modes (your different game plans and their matchups)
   - Meta Threat Matchups (how you handle current top threats)
   - Role Checklist (do you have speed control, Intimidate, Fake Out, etc.)
   - Set Optimization (individual Pokemon tuning)
5. Suggests tiered fixes: move changes first, then item/ability changes, then EV adjustments, then Pokemon swaps
6. Exports a revised team with all accepted changes applied

**Best for:** Iterating on an existing team or preparing for competition

### Reference Data (Auto-Loaded as Needed)

#### **checking-vgc-legality**
**Required dependency** for both entry-point skills. Provides authoritative game data.

**Data files:**
- `champions-roster.json` — Legal Pokemon with types, base stats, abilities, moves, and Mega forms
- `moves.json` — Move details (type, category, power, accuracy, priority, target, effect)
- `abilities.json` — Ability effects
- `items.json` — Held item details
- `type-chart.json` — Type effectiveness matchups (used to check coverage)

**How it's used:** Both entry-point skills read from these files to validate Pokemon, suggest sets, and check type coverage. You'll never directly invoke this skill—it's used behind the scenes.

#### **evaluating-vgc-viability**
Optional dependency. Provides strategic reference guides.

**Data files:**
- `reference/roles.md` — VGC role definitions (speed control, Intimidate, redirection, Fake Out, setup, spread damage, weather/terrain)
- `reference/archetypes.md` — Common team archetypes (Rain, Sun, Sand, Snow, Trick Room, Hyper Offense, Goodstuffs)
- `reference/items.md` — Item selection heuristics
- `reference/synergies.md` — Pair synergy patterns (offensive combos, defensive pivots, mode pairs)
- `reference/team-structure.md` — Team-level structural heuristics, including canonical type trio patterns

**What happens if it's missing:** Both entry-point skills degrade gracefully. You'll lose:
- Archetype-specific role checklists and synergy patterns
- Strategic reference data for suggesting Pokemon
- Pair synergy analysis (building-vgc-teams and evaluating-vgc-teams will skip this)

The skills will still work, but with less strategic depth.

#### **evaluating-vgc-meta**
Optional dependency. Provides current Pokemon Champions meta data.

**Data source:**
- Fetches Pikalytics (`https://www.pikalytics.com/champions`) for usage stats, top threats, common sets, and teammates

**What it enables:**
- Meta-relative assessments (e.g., "faster than Garchomp, a top threat" instead of "above-average speed")
- Threat lists showing which team members handle top-usage Pokemon
- Mode-to-matchup mapping (which bring-4 to use against which meta archetypes)
- "What's good right now?" suggestions based on current usage trends

**What happens if it's missing:** Both entry-point skills fall back to generic, stat-based analysis:
- "Pokemon A has above-average speed" instead of "faster than Garchomp"
- Type-based threat assessment instead of usage-rate-based threats
- No specific meta matchup suggestions

The skills will still work, but without real-time meta context.

## Workflow Examples

### Example 1: Building a New Team

1. Invoke **building-vgc-teams**
2. Choose your starting point:
   - "I want to build around Garchomp and Corviknight"
   - "I want to play a Trick Room team"
   - "What's good right now?"
3. The skill guides you through 6 slots, asking for feedback after each Pokemon
4. Once all 6 are chosen, it refines movesets and analyzes the team
5. You can swap Pokemon, adjust moves/items, or request deeper analysis on any layer
6. When done, export your team in Showdown paste format

### Example 2: Evaluating & Refining an Existing Team

1. Invoke **evaluating-vgc-teams**
2. Paste your Showdown team
3. The skill detects your archetype and presents a summary verdict
4. Choose which analysis layer to drill into:
   - "Show me type coverage issues"
   - "What's my biggest problem?"
   - "Can you go through all of them?"
5. For each layer, the skill flags issues and suggests tiered fixes
6. You accept or reject each fix
7. Export the revised team with a change diff

## Tips & Conventions

### Showdown Paste Format
Both skills use Showdown paste format for input and output:

```
Pokemon @ Held Item
Ability: Ability Name
Level: 50
EVs: ### HP / ### Atk / ### Def / ### SpA / ### SpD / ### Spe
Nature Nature
- Move 1
- Move 2
- Move 3
- Move 4
```

### VGC Rules
- **Level 50** (not adjustable)
- **EV limit:** 508 maximum (not 510 like Smogon formats)
- **No duplicate Pokemon** across the team
- **No duplicate held items** across the team
- **Two Mega Stone carriers never appear in the same bring-4 group** (alternate Mega modes swap one out)

### Bring-4 Modes
Both skills reason about your "bring-4"—the 4 Pokemon you use in each game. Competitive teams usually have:
- **Core-4:** Your default bring-4 (the main game plan)
- **Alternate modes:** Swap 1-2 Pokemon from the core-4 for specific matchups (e.g., Trick Room mode instead of Tailwind mode)

When evaluating or building, the skills validate that each mode has speed control, a win condition, and reasonable type coverage.

## Dependency Requirements

| Skill | Requires | Optional |
|-------|----------|----------|
| **building-vgc-teams** | checking-vgc-legality | evaluating-vgc-viability, evaluating-vgc-meta |
| **evaluating-vgc-teams** | checking-vgc-legality | evaluating-vgc-viability, evaluating-vgc-meta |
| **evaluating-vgc-viability** | None | Used as a reference by the entry-point skills |
| **evaluating-vgc-meta** | None | Used as a reference by the entry-point skills |
| **checking-vgc-legality** | None | Backbone data provider for all other skills |

If `checking-vgc-legality` is missing, both entry-point skills will stop and ask you to install it. Optional dependencies degrade gracefully if missing.

## When to Use Each Skill

| Situation | Use |
|-----------|-----|
| "I want to build a team from scratch" | **building-vgc-teams** |
| "I want to see what archetypes exist" | **building-vgc-teams** (archetype selection) |
| "I want meta suggestions" | **building-vgc-teams** ("What's good right now?") |
| "I want to evaluate my team" | **evaluating-vgc-teams** |
| "My team loses to [threat]—how do I fix it?" | **evaluating-vgc-teams** (drill into Threat Matchups or Type Coverage) |
| "I want to swap one Pokemon in my team" | **evaluating-vgc-teams** (Pokemon swap suggestions) |
| "I want role definitions" | **evaluating-vgc-viability** (reference directly) |
| "I want to know current meta usage rates" | **evaluating-vgc-meta** (reference directly) |
| "I want to check if a Pokemon is legal" | **checking-vgc-legality** (reference directly) |

## FAQs

**Q: Can I use these skills without the optional dependencies?**  
A: Yes. Both entry-point skills work without `evaluating-vgc-viability` or `evaluating-vgc-meta`, but with reduced strategic depth. You'll get stat-based assessments instead of meta-relative ones, and some analysis layers will be skipped.

**Q: Do I need to invoke the reference skills directly?**  
A: No. They auto-load when needed. Just invoke **building-vgc-teams** or **evaluating-vgc-teams**, and they'll fetch reference data as required.

**Q: What happens if the Pikalytics fetch fails?**  
A: If **evaluating-vgc-meta** can't fetch meta data, the skill will ask you what you're seeing in the current meta. It won't guess or fabricate usage stats.

**Q: Can I jump between analysis layers?**  
A: Yes. Both entry-point skills support exploring layers in any order. You can ask to "skip to mode analysis" or "go back to type coverage" without issue.

**Q: Can I make partial changes to my team?**  
A: Yes. When using **evaluating-vgc-teams**, you can accept some fix suggestions and reject others. Only the accepted changes are included in the final export.

**Q: What's the difference between a "core-4" and a "bring-4"?**  
A: Your **core-4** is your default 4 Pokemon (your main game plan). Your **bring-4** is whichever 4 you actually use in any given game. For many matchups, your bring-4 = your core-4. For others, you swap in alternate slots to form a different bring-4 with a different mode.

## Next Steps

- **Ready to build?** Invoke **building-vgc-teams** and choose your starting point.
- **Ready to refine?** Invoke **evaluating-vgc-teams** and paste your team.
- **Want to learn more?** Reference **evaluating-vgc-viability** for role, archetype, and synergy definitions.
