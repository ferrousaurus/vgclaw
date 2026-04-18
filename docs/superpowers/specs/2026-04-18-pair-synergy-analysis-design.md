# Pair Synergy Analysis for VGC Team Builder

## Problem

The building-vgc-teams skill checks roles and types individually but doesn't reason about how Pokemon work together as pairs on the field. VGC is a doubles format where pair synergy is critical -- Earthquake + Levitate partner, Fake Out + setup sweeper, Follow Me + sweeper, defensive coverage between fielded partners. The current analysis (step 6) treats each Pokemon in isolation.

## Solution: Hybrid Reference Patterns + Pair Scan

Two additions:

1. A new `reference/synergies.md` file that defines synergy pattern categories with examples
2. A new "Pair Synergy Scan" analysis step in SKILL.md that evaluates all 15 pairs on a team against those patterns

### reference/synergies.md

Defines three synergy categories the skill checks when scanning pairs:

**Offensive Combos** -- Pairs where one Pokemon's moves become stronger or safer because of the partner.
- Spread move + immunity (Earthquake + Levitate/Flying, Discharge + Lightning Rod/Volt Absorb, Surf + Water Absorb/Storm Drain)
- Helping Hand + high-power spread move (Heat Wave, Rock Slide, Muddy Water)
- Ability-boosted attacks (partner with Flash Fire receives a Fire move to power up)
- Setup + enabler (Dragon Dance/Swords Dance user + Fake Out or Follow Me partner)

**Defensive Pivot Pairs** -- Pairs that cover each other's weaknesses when fielded together.
- For each pair, check whether Partner B's resistances/immunities cover Partner A's weaknesses and vice versa. Flag pairs where both share a common weakness.
- Intimidate + physically frail partner
- Ability-based protection (Lightning Rod drawing Electric moves from a Water-type partner)

**Mode Pairs** -- Pairs with a coherent Turn 1 game plan.
- Fake Out + setup (flinch one threat while partner boosts)
- Redirector + sweeper (Follow Me/Rage Powder absorbs hits while partner attacks)
- Tailwind setter + slow nuke (Tailwind turn 1, partner outspeeds next turn)
- Dual offensive pressure (two fast attackers threatening different types)

The doc is ~80-100 lines, structured like the existing reference docs (roles.md, archetypes.md).

### Pair Synergy Scan (SKILL.md step 6)

Runs as part of Team Analysis, after the Type Coverage Matrix and before the Threat List.

**Process:** For each of the 15 possible pairs on the 6-Pokemon team:
1. Load `reference/synergies.md` for pattern categories
2. Check the pair against each category using the team's actual moves, abilities, and types from the data files
3. Classify as strong synergy, neutral, or anti-synergy

**Output (filtered, not all 15 pairs):**
- **Top synergy pairs** (2-3 best) -- what they do together and why, labeled by category
- **Anti-synergy flags** -- pairs that are actively bad together (shared weaknesses with no coverage, redundant roles, conflicting strategies)
- **Missing synergy gaps** -- patterns the archetype typically wants that no pair on the team provides (e.g., hyper offense team with no Fake Out + setup pair)

### Light Synergy in Steps 3-4

During Build Out and Final Slots, the skill lightly references synergy when suggesting new Pokemon: "this Pokemon forms a strong offensive combo with your existing [X] because [reason]." No full pair scan -- just informed suggestions.

## Scope Boundaries

This change does NOT include:
- **Damage calcs** -- no KO/survival calculations
- **Speed tier comparisons** -- no verification that a Pokemon outspeeds threats after speed control
- **Bring-4 / team preview analysis** -- no recommendations for which 4 to bring against specific opponents
- **Changes to existing analysis sections** -- Type Coverage Matrix, Threat List, and Role Checklist are unchanged

## Files Changed

- `reference/synergies.md` -- new file (~80-100 lines)
- `SKILL.md` -- add Pair Synergy Scan to step 6, add light synergy references to steps 3-4
