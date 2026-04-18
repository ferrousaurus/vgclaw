# Pick-4 Mode Awareness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Layer pick-4 mode awareness into the VGC team builder so the skill builds toward a default core-4, enables alternate modes in slots 5-6, and validates bring-4 groups in analysis.

**Architecture:** All changes are to `skills/building-vgc-teams/SKILL.md`. Steps 2-5 get reframed to think in terms of core-4 and modes. Step 6 gets a new Bring-4 Mode Analysis section inserted between Pair Synergy Scan and Threat List.

**Tech Stack:** Markdown (skill prompt file)

**Spec:** `docs/superpowers/specs/2026-04-18-pick4-mode-awareness-design.md`

---

### Task 1: Add pick-4 context to Step 2 (Foundation)

**Files:**
- Modify: `skills/building-vgc-teams/SKILL.md:41-48`

- [ ] **Step 1: Add bring-4 role note to Step 2**

After item 4 ("Explain why these two work together"), add a fifth item. Replace lines 41-48 with:

```markdown
### 2. Foundation (slots 1-2)

Establish the team's core pair. For each Pokemon:
1. Verify it's in champions-roster.json
2. Read its abilities and moves from the roster. Look up move details in moves.json and ability effects in abilities.json as needed.
3. Suggest a competitive set (moves, ability, item) as a starting point
4. Explain why these two work together (type synergy, role coverage, archetype fit)
5. Note what role each plays in a bring-4 context -- these two will likely appear in most bring-4 groups. Example: "Garchomp is your primary attacker, Whimsicott is your speed control -- expect to bring both in most games."
```

- [ ] **Step 2: Commit**

```bash
git add skills/building-vgc-teams/SKILL.md
git commit -m "feat: add pick-4 role context to team builder step 2"
```

---

### Task 2: Reframe Step 3 as "complete your core-4"

**Files:**
- Modify: `skills/building-vgc-teams/SKILL.md:49-56`

- [ ] **Step 1: Replace Step 3 content**

Replace lines 49-56 (the entire Step 3 section) with:

```markdown
### 3. Build Out (slots 3-4) -- Complete the Core-4

The goal is to complete your default bring-4 group. Identify gaps in the current pair:
1. **Type gaps** -- Read type-chart.json + roster types. Which types can the team not resist? Which types can't the team hit super-effectively?
2. **Role gaps** -- Load roles.md. Does the team have speed control? Intimidate? Redirection? Fake Out?
3. **Meta threats** -- Fetch Pikalytics. Which top-usage Pokemon threaten the current core?

For each gap, suggest 2-3 Pokemon from the roster that address it. Evaluate candidates as "which Pokemon makes the strongest group of 4 with your existing core pair?" Prefer Pokemon that fill multiple gaps. Present trade-offs. When suggesting, note any pair synergies with existing team members -- load `reference/synergies.md` and call out offensive combos (e.g., "Garchomp gives you Earthquake + your Corviknight is immune to it"), defensive pivot pairs, or mode pairs that the new Pokemon enables.

**After slot 4 is chosen, present a core-4 summary:** "Your default bring is [A, B, C, D]. This group has [roles covered: speed control, Fake Out, spread damage, etc.]. It struggles against [specific threats or archetypes the core-4 can't handle]." This summary frames slots 5-6 as solving those problems.
```

- [ ] **Step 2: Commit**

```bash
git add skills/building-vgc-teams/SKILL.md
git commit -m "feat: reframe step 3 as core-4 completion with summary"
```

---

### Task 3: Reframe Step 4 as "enable alternate modes"

**Files:**
- Modify: `skills/building-vgc-teams/SKILL.md` (Step 4 section, formerly lines 58-64)

- [ ] **Step 1: Replace Step 4 content**

Replace the entire Step 4 section with:

```markdown
### 4. Alternate Mode Slots (5-6)

Slots 5-6 enable alternate modes for matchups the core-4 struggles against. Reference the core-4 summary from step 3.

For each slot, suggest 2-3 Pokemon framed as swap-ins:
- **Name which core-4 member it replaces** and in what matchup. Example: "Swap Torkoal in for Whimsicott against Trick Room teams -- Torkoal gives you a Trick Room mode with Hatterene instead of a Tailwind mode."
- **Describe the alternate mode it creates.** What is the game plan for the resulting group of 4? How does it differ from the core-4's plan?
- **Pair synergy** -- does the new Pokemon form strong mode pairs or offensive combos with the remaining core members? A Pokemon that enables a coherent alternate mode is better than one that just fills a type gap.

If the team only has one viable mode after both slots are filled, flag it: "Your team currently brings the same 4 every game. Consider [alternative Pokemon] for slot [N] to give you a [description] mode against [matchup]."
```

- [ ] **Step 2: Commit**

```bash
git add skills/building-vgc-teams/SKILL.md
git commit -m "feat: reframe step 4 as alternate mode slot selection"
```

---

### Task 4: Add mode-awareness lens to Step 5 (Set Refinement)

**Files:**
- Modify: `skills/building-vgc-teams/SKILL.md` (Step 5 section, formerly lines 66-79)

- [ ] **Step 1: Add mode-awareness paragraph to Step 5**

After the existing "Cross-reference with Pikalytics common sets when available. The user customizes from here." line, add:

```markdown

**Mode-aware sets:** Consider which bring-4 groups each Pokemon participates in. Pokemon appearing in multiple modes should have versatile sets (e.g., balanced EV spreads, moves useful in both game plans). Pokemon appearing in only one mode can be more specialized (e.g., min-speed Torkoal for Trick Room mode only). Mention this trade-off when it's relevant to the set choice, not for every Pokemon.
```

- [ ] **Step 2: Commit**

```bash
git add skills/building-vgc-teams/SKILL.md
git commit -m "feat: add mode-aware set refinement guidance to step 5"
```

---

### Task 5: Add Bring-4 Mode Analysis to Step 6

**Files:**
- Modify: `skills/building-vgc-teams/SKILL.md` (Step 6 section)

- [ ] **Step 1: Update the analysis layer count**

Change the opening line of Step 6 from:

```markdown
Run all four analysis layers. Present results clearly.
```

to:

```markdown
Run all five analysis layers. Present results clearly.
```

- [ ] **Step 2: Insert Bring-4 Mode Analysis section**

After the Pair Synergy Scan section (after the "Missing synergy gaps" paragraph ending with "flag gaps as observations, not failures.") and before the "**Threat List:**" heading, insert:

```markdown

**Bring-4 Mode Analysis:**

Identify and validate the team's bring-4 groups.

*1. Identify modes.* Name the core-4 (the default bring group established in step 3) and any alternate modes enabled by slots 5-6. A "mode" is a group of 4 with a coherent game plan (fast offense, Trick Room, anti-weather, etc.). Alternate modes swap 1-2 members from the core-4. List each mode with its 4 members and one-line game plan.

*2. Validate each mode.* For each mode, check:
- Does this group of 4 have speed control?
- Does it have a win condition (setup sweeper, spread damage, etc.)?
- Are there critical type gaps (a type hitting 3+ of the 4 super-effectively with no resist among them)?
- Does it have pair synergy (Fake Out + setup, redirect + sweeper, etc.)?

Flag modes missing something critical. If a mode fails validation (e.g., no speed control and no way to deal damage before the opponent moves), say so directly and suggest a fix.

*3. Map modes to matchups.* Using the Pikalytics meta threats, suggest which mode to bring against common archetypes. Format as: "Against [archetype/threat]: bring [mode name] -- swap [Pokemon] in for [Pokemon]. [One sentence explaining why.]"

*4. Mode coverage gaps.* If a common meta archetype (from Pikalytics top-usage trends) has no good mode answer, flag it and suggest a fix: a move/item change on an existing member, or a slot 5-6 replacement that would create a viable mode for that matchup.
```

- [ ] **Step 3: Commit**

```bash
git add skills/building-vgc-teams/SKILL.md
git commit -m "feat: add bring-4 mode analysis to team analysis step 6"
```

---

### Task 6: Sync .agents copy and verify

**Files:**
- Modify: `.agents/skills/building-vgc-teams/SKILL.md`

- [ ] **Step 1: Check if .agents copy needs syncing**

```bash
diff skills/building-vgc-teams/SKILL.md .agents/skills/building-vgc-teams/SKILL.md
```

If the files differ, copy the updated file:

```bash
cp skills/building-vgc-teams/SKILL.md .agents/skills/building-vgc-teams/SKILL.md
```

- [ ] **Step 2: Read the final SKILL.md end-to-end**

Read `skills/building-vgc-teams/SKILL.md` from top to bottom. Verify:
- Step 2 mentions bring-4 role context
- Step 3 is titled "Build Out (slots 3-4) -- Complete the Core-4" and ends with a core-4 summary instruction
- Step 4 is titled "Alternate Mode Slots (5-6)" and frames suggestions as swap-ins with mode descriptions
- Step 5 includes the "Mode-aware sets" paragraph
- Step 6 says "five analysis layers" and includes Bring-4 Mode Analysis between Pair Synergy Scan and Threat List
- No orphaned references to old step names or "fill remaining holes" language

- [ ] **Step 3: Commit if .agents copy was updated**

```bash
git add .agents/skills/building-vgc-teams/SKILL.md
git commit -m "chore: sync .agents copy of building-vgc-teams skill"
```
