# Alternate Mega Awareness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add alternate Mega awareness to the VGC team builder skill so it recommends a second Mega-eligible Pokemon during team building and validates alternate-Mega modes during analysis.

**Architecture:** Two edits to `skills/building-vgc-teams/SKILL.md`. Step 4 gets a new paragraph about Mega-eligible candidates for slots 5-6. Step 6's Bring-4 Mode Analysis gets Mega-awareness additions to all four substeps plus the hard constraint that two Mega Stone carriers never appear in the same bring-4 group.

**Tech Stack:** Markdown (skill definition file)

---

### Task 1: Add alternate Mega awareness to Step 4 (Alternate Mode Slots 5-6)

**Files:**
- Modify: `skills/building-vgc-teams/SKILL.md:61-70`

- [ ] **Step 1: Add Mega-eligible candidate guidance after the existing slot 5-6 suggestions**

In `skills/building-vgc-teams/SKILL.md`, find the step 4 section "### 4. Alternate Mode Slots (5-6)". After the existing paragraph about flagging single-mode teams (line 70: `If the team only has one viable mode...`), add a new section about alternate Mega candidates.

Replace this text in `SKILL.md`:

```
If the team only has one viable mode after both slots are filled, flag it: "Your team currently brings the same 4 every game. Consider [alternative Pokemon] for slot [N] to give you a [description] mode against [matchup]."
```

With:

```
If the team only has one viable mode after both slots are filled, flag it: "Your team currently brings the same 4 every game. Consider [alternative Pokemon] for slot [N] to give you a [description] mode against [matchup]."

**Alternate Mega candidates:** If the core-4 includes a Mega Stone carrier (the primary Mega), at least one slot 5-6 candidate across both rounds should be Mega-eligible (has a `mega` field in champions-roster.json) with a Mega form that addresses the primary Mega's bad matchups. If none of the organic candidates are Mega-eligible, add one as an additional option (the list grows from 2-3 to 3-4 candidates for that slot). Prioritize candidates whose Mega form counter-types what counters the primary Mega. Note if the candidate also enables a different game plan as a secondary benefit.

When presenting a Mega-eligible candidate:
- Note it carries a Mega Stone and **replaces the primary Mega in the bring-4** — two Mega Stone carriers must never appear in the same bring-4 group.
- Explain what the Mega form addresses and which specific counters to the primary Mega it handles. Example: "Mega Scizor threatens the Fairy types that wall Mega Feraligatr's Dragonize."
- If the user declines the alternate Mega for both slots, accept the decision and move on. The alternate Mega is always a recommendation, never forced.
```

- [ ] **Step 2: Verify the edit reads correctly in context**

Read `skills/building-vgc-teams/SKILL.md` from line 61 to line 85 and confirm:
1. The new "Alternate Mega candidates" paragraph follows the single-mode flag paragraph.
2. The three bullet points are present and correctly formatted.
3. The hard constraint ("two Mega Stone carriers must never appear in the same bring-4 group") is stated.

- [ ] **Step 3: Commit**

```bash
git add skills/building-vgc-teams/SKILL.md
git commit -m "feat: add alternate mega candidate guidance to team builder step 4"
```

### Task 2: Add Mega awareness to Step 6 Bring-4 Mode Analysis

**Files:**
- Modify: `skills/building-vgc-teams/SKILL.md:111-127`

- [ ] **Step 1: Add Mega awareness to substep 1 (Identify modes)**

In `skills/building-vgc-teams/SKILL.md`, find the substep "*1. Identify modes.*" in the Bring-4 Mode Analysis section. 

Replace this text:

```
*1. Identify modes.* Name the core-4 (the default bring group established in step 3) and any alternate modes enabled by slots 5-6. A "mode" is a group of 4 with a coherent game plan (fast offense, Trick Room, anti-weather, etc.). Alternate modes swap 1-2 members from the core-4. List each mode with its 4 members and one-line game plan.
```

With:

```
*1. Identify modes.* Name the core-4 (the default bring group established in step 3) and any alternate modes enabled by slots 5-6. A "mode" is a group of 4 with a coherent game plan (fast offense, Trick Room, anti-weather, etc.). Alternate modes swap 1-2 members from the core-4. List each mode with its 4 members and one-line game plan. If the team has two Mega Stone carriers, identify any mode that swaps the primary Mega out for the alternate Mega. Name it explicitly as a Mega-swap mode. Example: "Alternate Mega mode: swap Feraligatr for Scizor. Mega evolve Scizor. Game plan: Steel-type offensive pressure against Fairy-heavy teams." Two Mega Stone carriers must never appear in the same bring-4 group.
```

- [ ] **Step 2: Add Mega awareness to substep 2 (Validate each mode)**

Find the substep "*2. Validate each mode.*".

Replace this text:

```
*2. Validate each mode.* For each mode, check:
- Does this group of 4 have speed control?
- Does it have a win condition (setup sweeper, spread damage, etc.)?
- Are there critical type gaps (a type hitting 3+ of the 4 super-effectively with no resist among them)?
- Does it have pair synergy (Fake Out + setup, redirect + sweeper, etc.)?

Flag modes missing something critical. If a mode fails validation (e.g., no speed control and no way to deal damage before the opponent moves), say so directly and suggest a fix.
```

With:

```
*2. Validate each mode.* For each mode, check:
- Does this group of 4 have speed control?
- Does it have a win condition (setup sweeper, spread damage, etc.)?
- Are there critical type gaps (a type hitting 3+ of the 4 super-effectively with no resist among them)?
- Does it have pair synergy (Fake Out + setup, redirect + sweeper, etc.)?

Flag modes missing something critical. If a mode fails validation (e.g., no speed control and no way to deal damage before the opponent moves), say so directly and suggest a fix. When validating an alternate-Mega mode, evaluate using the alternate Mega's Mega stats and ability from champions-roster.json (not its base form). The primary Mega is benched in this mode and irrelevant to validation.
```

- [ ] **Step 3: Add Mega awareness to substep 3 (Map modes to matchups)**

Find the substep "*3. Map modes to matchups.*".

Replace this text:

```
*3. Map modes to matchups.* Using the Pikalytics meta threats, suggest which mode to bring against common archetypes. Format as: "Against [archetype/threat]: bring [mode name] -- swap [Pokemon] in for [Pokemon]. [One sentence explaining why.]"
```

With:

```
*3. Map modes to matchups.* Using the Pikalytics meta threats, suggest which mode to bring against common archetypes. Format as: "Against [archetype/threat]: bring [mode name] -- swap [Pokemon] in for [Pokemon]. [One sentence explaining why.]" Explicitly map alternate-Mega modes to the matchups that counter the primary Mega. Example: "Against Fairy-heavy teams: bring Alternate Mega mode -- swap Feraligatr for Mega Scizor. Scizor's Steel STAB threatens Fairies that wall Dragonize."
```

- [ ] **Step 4: Add Mega awareness to substep 4 (Mode coverage gaps)**

Find the substep "*4. Mode coverage gaps.*".

Replace this text:

```
*4. Mode coverage gaps.* If a common meta archetype (from Pikalytics top-usage trends) has no good mode answer, flag it and suggest a fix: a move/item change on an existing member, or a slot 5-6 replacement that would create a viable mode for that matchup.
```

With:

```
*4. Mode coverage gaps.* If a common meta archetype (from Pikalytics top-usage trends) has no good mode answer, flag it and suggest a fix: a move/item change on an existing member, or a slot 5-6 replacement that would create a viable mode for that matchup. If the team has no alternate Mega and the primary Mega is countered by a common meta archetype, flag it specifically: "Your primary Mega [X] is countered by [archetype] and you have no alternate Mega mode. Consider adding [Mega-eligible Pokemon] in slot [N]."
```

- [ ] **Step 5: Verify all four substep edits read correctly in context**

Read `skills/building-vgc-teams/SKILL.md` from line 111 to line 135 and confirm:
1. Substep 1 mentions Mega-swap modes and the mutual exclusion constraint.
2. Substep 2 mentions evaluating with Mega stats/ability.
3. Substep 3 mentions mapping alternate-Mega modes to primary Mega's counters.
4. Substep 4 mentions flagging missing alternate Mega when the primary is countered.

- [ ] **Step 6: Commit**

```bash
git add skills/building-vgc-teams/SKILL.md
git commit -m "feat: add alternate mega awareness to bring-4 mode analysis step 6"
```
