# Evaluating VGC Viability: Type Trio Heuristic

## Summary

Add a team-level type trio heuristic to the evaluating-vgc-viability skill. The current viability references cover pair synergies, roles, archetypes, tempo, win conditions, and speed reasoning, but they do not give downstream skills a clean way to recognize structural 3-Pokemon type cores across the full roster. This change adds a focused reference for team-level structural heuristics, starting with completed canonical type trios such as Fire-Water-Grass and Dragon-Fairy-Steel.

## Approach

Create a new focused reference file under `skills/evaluating-vgc-viability/reference/` for team-level structure heuristics rather than extending the existing pair-oriented `synergies.md`. The new file keeps trio reasoning separate from pair reasoning, making the distinction explicit for downstream skills: `synergies.md` remains about on-field pair interactions, while the new reference is about roster structure. The first heuristic in the new file is a bonus-only check for completed canonical type trios framed by their purpose.

## Changes

### 1. New file: `reference/team-structure.md`

Add a new reference file for team-level structural heuristics.

**Role of the file:**

- Evaluate whether a 6-Pokemon roster has meaningful 3+ Pokemon structural patterns that support bring-4 planning.
- Start narrowly with type trios only.
- Keep pair interaction logic out of this file.

**Top-of-file usage guidance:**

Entry-point skills should use this file only during team-level analysis, after establishing the team's archetype, pair interactions, and likely bring structures. The file is not for evaluating individual pairs, not for suggesting incomplete combos, and not for penalizing teams that do not contain a trio.

### 2. Section: `Type Trio Heuristics`

This section defines a trio as three Pokemon whose type combination creates broader offensive or defensive value than any single pair provides.

The section should be explicitly scoped to:

- full-team roster evaluation
- completed trios only
- bonus credit only
- canonical type patterns with broadly recognizable strategic meaning

It should explicitly exclude:

- pair-level trio forecasting
- near-miss evaluation
- penalties for not having a trio
- generalized 3-Pokemon combo scoring

### 3. Trio categories

The initial version should contain two trio categories.

#### Defensive Type Trios

These are trios whose primary value is defensive smoothing across the roster.

**Initial example pattern:**

- `Fire-Water-Grass`

**What to check:**

- Does the team contain all three types across distinct Pokemon?
- Do those Pokemon plausibly belong to the team's actual bring structures rather than existing as disconnected bench pieces?
- Does the trio materially broaden resistance coverage or reduce matchup brittleness across common attack types?

**Quality signals:**

- Strong: the three members appear naturally in the team's core or alternate bring-4 modes, and each leg covers pressure that another leg dislikes.
- Strong: the trio supports multiple game states rather than only one narrow matchup.
- Weak: the trio exists only on paper because one member is fringe and rarely part of realistic brings.
- Weak: the three members overlap too heavily in role or game plan, so the type loop exists without creating meaningful structural flexibility.

#### Offensive Type Trios

These are trios whose primary value is offensive pressure spread across defensive answers.

**Initial example pattern:**

- `Dragon-Fairy-Steel`

**What to check:**

- Does the team contain all three types across distinct Pokemon?
- Do the three types collectively pressure a wider range of defensive answers than the team's best pair already does?
- Does the trio reduce the chance that one class of resist or defensive profile stalls the team's main line of attack?

**Quality signals:**

- Strong: each leg contributes distinct offensive pressure and the trio appears in realistic mode planning.
- Strong: the trio forces different defensive concessions from opponents instead of repeating the same coverage profile.
- Weak: the trio is nominal only, with one or more members contributing the type but not meaningful pressure.
- Weak: the team already relies on a different offensive structure and the trio does not materially change evaluation.

### 4. Output behavior for entry-point skills

Entry-point skills that already consume `evaluating-vgc-viability` should use the trio heuristic only as a short team-analysis note.

**Expected behavior:**

- If a completed, meaningful trio is present, mention it as bonus structural credit.
- Example output shape: "The team gains bonus structural credit from a defensive Fire-Water-Grass trio that smooths defensive pivots across its likely brings."
- If no meaningful trio is present, say nothing. Absence of a trio is not an issue by itself.
- If the optional dependency is missing, skip the heuristic entirely.

This keeps the heuristic interpretive rather than turning it into a required scored layer.

### 5. Updates to `evaluating-vgc-viability/SKILL.md`

Add the new file to the reference file listing:

```md
- `reference/team-structure.md` -- team-level structural heuristics, including canonical type trio patterns
```

### 6. Updates to user-facing reference listings

Update any user-facing or entry-point skill documentation that enumerates the evaluating-vgc-viability reference files directly.

At minimum, `README.md` should add the new file to the optional viability data block so the documented reference surface matches the repository layout.

If `building-vgc-teams/SKILL.md` or `evaluating-vgc-teams/SKILL.md` explicitly list viability reference files, update those lists as well. No new required workflow step is needed in those skills yet; this change only exposes the new reference for downstream use during team analysis.

## What Doesn't Change

- `reference/synergies.md` remains pair-focused.
- No new anti-synergy or near-miss trio logic is added.
- No generalized framework for non-type trios is added.
- No numeric scoring model is introduced.
- No legality, meta, or damage-calculation files change.

## Why This Boundary Works

This design adds the smallest new surface that cleanly supports team-level trio reasoning. It avoids bloating `synergies.md` with non-pair logic, gives downstream skills an obvious place to look for roster-structure heuristics, and keeps the heuristic intentionally narrow: completed canonical trios that deserve bonus credit when they materially support the team's real game plans.
