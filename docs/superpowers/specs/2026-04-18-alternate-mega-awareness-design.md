# Alternate Mega Awareness for VGC Team Builder

## Problem

The building-vgc-teams skill assumes the team's Mega evolution is locked to one Pokemon across all bring-4 modes. In practice, a team can carry multiple Mega Stones — only one Pokemon can Mega evolve per game. This means the choice of which Pokemon to Mega evolve is a per-game decision, not a team-wide one.

This gap matters most when the primary Mega has hard counters in the meta. For example, Mega Feraligatr's Dragonize ability converts Normal moves to Dragon-type. Fairy types resist Dragon and wall Feraligatr's main STAB option (Double-Edge). A team built around Mega Feraligatr with no alternate Mega has no way to change its offensive profile against Fairy-heavy teams — it brings the same countered Mega every game.

The skill should treat alternate Megas as a natural part of team building and mode analysis.

## Hard Constraint

**Two Mega Stone carriers must never appear in the same bring-4 group.** Only one can Mega evolve per game, so bringing both wastes a slot on a Pokemon stuck in base form with an unusable item. This constraint is enforced during team building (step 4) and mode analysis (step 6).

## Solution

### Changes to Step 4 (Alternate Mode Slots 5-6)

**Current behavior:** Suggests 2-3 candidates per slot, framed as swap-ins for core-4 members. No Mega awareness.

**New behavior:** After generating the normal candidate list for each slot, check whether at least one candidate is Mega-eligible (has a `mega` field in champions-roster.json) and whose Mega form addresses a weakness of the primary Mega. If none of the organic candidates are Mega-eligible, add one Mega-eligible suggestion as an additional option (the list grows from 2-3 to 3-4 candidates for that slot).

When presenting a Mega-eligible candidate, the skill should:

1. Note it carries a Mega Stone and **replaces the primary Mega in the bring-4** (never bring both Mega carriers together).
2. Explain what the Mega form addresses — prioritize counter-typing the primary Mega's bad matchups. Note if it also enables a different game plan (e.g., a Trick Room mode, bulky offense mode) as a secondary benefit.
3. Identify which specific counters to the primary Mega this alternate Mega handles. Example: "Mega Scizor threatens the Fairy types that wall Mega Feraligatr's Dragonize."

If the user declines the alternate Mega for both slots 5 and 6, accept the decision and move on. The alternate Mega is always a recommendation, never forced.

### Changes to Step 6 (Bring-4 Mode Analysis)

Add Mega-awareness to the four existing substeps of the Bring-4 Mode Analysis:

**Substep 1 — Identify modes:** If the team has two Mega Stone carriers, identify any mode that swaps the primary Mega out for the alternate Mega. Name it explicitly as a Mega-swap mode with its game plan. Example: "Alternate Mega mode: swap Feraligatr for Scizor. Mega evolve Scizor. Game plan: Steel-type offensive pressure against Fairy-heavy teams."

**Substep 2 — Validate each mode:** When validating an alternate-Mega mode, evaluate using the alternate Mega's Mega stats and ability (not its base form). Check the same criteria as other modes: speed control, win condition, critical type gaps, and pair synergy. The primary Mega is benched in this mode and irrelevant to validation.

**Substep 3 — Map modes to matchups:** Explicitly map alternate-Mega modes to the matchups that counter the primary Mega. Example: "Against Fairy-heavy teams: bring Alternate Mega mode — swap Feraligatr for Mega Scizor. Scizor's Steel STAB threatens Fairies that wall Dragonize."

**Substep 4 — Mode coverage gaps:** If the team has no alternate Mega and the primary Mega is countered by a common meta archetype (from Pikalytics), flag it: "Your primary Mega [X] is countered by [archetype] and you have no alternate Mega mode. Consider adding [Mega-eligible Pokemon] in slot [N]."

## What Doesn't Change

- **Steps 1-3 (Entry, Foundation, Build Out):** The primary Mega is chosen and locked into the core-4 as before.
- **Step 5 (Set Refinement):** No changes. The existing mode-aware set guidance already handles Pokemon in multiple modes.
- **Step 7 (Export):** Unchanged. Showdown paste format doesn't encode modes or Mega choices.
- **Existing analysis layers:** Type Coverage Matrix, Pair Synergy Scan, Threat List, and Role Checklist evaluate the full 6 as before.

## Files Changed

- `skills/building-vgc-teams/SKILL.md` — modify step 4 to include Mega-eligible candidates; modify step 6 Bring-4 Mode Analysis substeps 1-4 for Mega awareness.
