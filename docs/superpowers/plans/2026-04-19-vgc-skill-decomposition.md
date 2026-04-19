# VGC Skill Decomposition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract duplicated reference data from building-vgc-teams and evaluating-vgc-teams into three new data-provider skills (checking-vgc-legality, evaluating-vgc-viability, evaluating-vgc-meta), then update the consumer skills to reference them.

**Architecture:** Three new provider skills own the shared data files and instructions. Two existing consumer skills declare dependencies in frontmatter and reference provider skills in their Data Sources sections. Required dependencies hard-stop; optional dependencies degrade gracefully.

**Tech Stack:** Markdown (SKILL.md files), JSON (data files), git

---

### Task 1: Create checking-vgc-legality skill

**Files:**
- Create: `skills/checking-vgc-legality/SKILL.md`

- [ ] **Step 1: Create the skill directory and SKILL.md**

```bash
mkdir -p skills/checking-vgc-legality
```

Write `skills/checking-vgc-legality/SKILL.md` with this content:

```markdown
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
```

- [ ] **Step 2: Copy data files from building-vgc-teams to checking-vgc-legality**

```bash
cp skills/building-vgc-teams/champions-roster.json skills/checking-vgc-legality/champions-roster.json
cp skills/building-vgc-teams/type-chart.json skills/checking-vgc-legality/type-chart.json
cp skills/building-vgc-teams/moves.json skills/checking-vgc-legality/moves.json
cp skills/building-vgc-teams/abilities.json skills/checking-vgc-legality/abilities.json
cp skills/building-vgc-teams/items.json skills/checking-vgc-legality/items.json
```

- [ ] **Step 3: Verify files match originals**

```bash
for f in champions-roster.json type-chart.json moves.json abilities.json items.json; do
  diff -q skills/building-vgc-teams/$f skills/checking-vgc-legality/$f
done
```

Expected: all files identical, no output from diff.

- [ ] **Step 4: Commit**

```bash
git add skills/checking-vgc-legality/
git commit -m "feat: create checking-vgc-legality skill with game data files"
```

---

### Task 2: Create evaluating-vgc-viability skill

**Files:**
- Create: `skills/evaluating-vgc-viability/SKILL.md`
- Create: `skills/evaluating-vgc-viability/reference/roles.md`
- Create: `skills/evaluating-vgc-viability/reference/archetypes.md`
- Create: `skills/evaluating-vgc-viability/reference/items.md`
- Create: `skills/evaluating-vgc-viability/reference/synergies.md`

- [ ] **Step 1: Create the skill directory structure and SKILL.md**

```bash
mkdir -p skills/evaluating-vgc-viability/reference
```

Write `skills/evaluating-vgc-viability/SKILL.md` with this content:

```markdown
---
name: evaluating-vgc-viability
description: Provides strategic reference guides for Pokemon Champions VGC — role definitions, team archetypes, item heuristics, and pair synergy patterns. Optional dependency for team building and evaluation skills.
---

# Evaluating VGC Viability

Data provider for VGC strategic reference guides. This skill is not invoked directly. Other skills reference its files as an optional dependency.

## Reference Files

- `reference/roles.md` -- VGC role definitions (speed control, Intimidate, redirection, Fake Out, setup, spread damage, weather/terrain)
- `reference/archetypes.md` -- common team archetypes (Rain, Sun, Sand, Snow, Trick Room, Hyper Offense, Goodstuffs)
- `reference/items.md` -- item selection heuristics for Champions' item pool
- `reference/synergies.md` -- pair synergy patterns (offensive combos, defensive pivots, mode pairs)
```

- [ ] **Step 2: Copy reference files from building-vgc-teams**

```bash
cp skills/building-vgc-teams/reference/roles.md skills/evaluating-vgc-viability/reference/roles.md
cp skills/building-vgc-teams/reference/archetypes.md skills/evaluating-vgc-viability/reference/archetypes.md
cp skills/building-vgc-teams/reference/items.md skills/evaluating-vgc-viability/reference/items.md
cp skills/building-vgc-teams/reference/synergies.md skills/evaluating-vgc-viability/reference/synergies.md
```

- [ ] **Step 3: Verify files match originals**

```bash
for f in roles.md archetypes.md items.md synergies.md; do
  diff -q skills/building-vgc-teams/reference/$f skills/evaluating-vgc-viability/reference/$f
done
```

Expected: all files identical, no output from diff.

- [ ] **Step 4: Commit**

```bash
git add skills/evaluating-vgc-viability/
git commit -m "feat: create evaluating-vgc-viability skill with strategic reference guides"
```

---

### Task 3: Create evaluating-vgc-meta skill

**Files:**
- Create: `skills/evaluating-vgc-meta/SKILL.md`

- [ ] **Step 1: Create the skill directory and SKILL.md**

```bash
mkdir -p skills/evaluating-vgc-meta
```

Write `skills/evaluating-vgc-meta/SKILL.md` with this content:

```markdown
---
name: evaluating-vgc-meta
description: Provides current Pokemon Champions VGC meta data via Pikalytics — usage stats, top threats, common sets, and teammates. Optional dependency for team building and evaluation skills.
---

# Evaluating VGC Meta

Data provider for current Pokemon Champions VGC meta context. This skill is not invoked directly. Other skills reference it as an optional dependency.

## Pikalytics Fetch

Fetch `https://www.pikalytics.com/champions` for current usage stats, top threats, common sets, and teammates. Parse what you can from the HTML.

**What to extract:**
- Top Pokemon by usage rate (focus on top 10-15)
- Common held items, abilities, and moves for each top Pokemon
- Common teammates and cores
- Usage trends that indicate the current meta shape (e.g., high Trick Room representation, weather-heavy, etc.)

**If the fetch fails:** Ask the user what they're seeing in the meta. Do not guess or fabricate usage data.

## How Consumer Skills Should Use Meta Data

**When available:** Use meta-relative language that references specific threats and usage data. Examples:
- "With Tailwind, Pokemon A is faster than Garchomp, a top threat in the meta."
- "Garchomp appears on 45% of teams -- your team needs an answer to it."
- "Against the current meta's Rain prevalence, consider a Grass-type."

**When this skill is unavailable:** Consumer skills should fall back to generic, stat-based assessments. Examples:
- "Pokemon A has an above-average speed stat."
- "Your team may struggle against fast Ground-types."
- "Consider type coverage for common offensive types."
```

- [ ] **Step 2: Commit**

```bash
git add skills/evaluating-vgc-meta/
git commit -m "feat: create evaluating-vgc-meta skill with Pikalytics fetch instructions"
```

---

### Task 4: Update building-vgc-teams SKILL.md

**Files:**
- Modify: `skills/building-vgc-teams/SKILL.md`

This is the largest task. The full updated file content is provided below. Key changes from the original:

1. Add `dependencies` to frontmatter
2. Remove Gatekeeper Rule section (inherited from checking-vgc-legality)
3. Replace Data Sources with skill-referenced groups + Dependency Check section
4. Conditionalize all workflow steps that reference optional skills
5. Replace all Pikalytics fetch instructions with evaluating-vgc-meta references

- [ ] **Step 1: Replace SKILL.md with updated version**

Write `skills/building-vgc-teams/SKILL.md` with this content:

```markdown
---
name: building-vgc-teams
description: Use when the user wants to build a competitive VGC team for Pokemon Champions, needs help choosing Pokemon, checking type coverage, or evaluating meta matchups
dependencies:
  required:
    - checking-vgc-legality
  optional:
    - evaluating-vgc-viability
    - evaluating-vgc-meta
---

# Building VGC Teams

Conversational team builder for Pokemon Champions VGC. Guides intermediate players through constructing a 6-Pokemon team, analyzing its strengths and weaknesses, and exporting in Showdown paste format.

## Dependency Check

Before starting, verify that required skill directories exist.

- **checking-vgc-legality (required):** If this skill's directory is missing, stop and tell the user: "This skill requires the checking-vgc-legality skill. Please install it before continuing." Do not proceed.
- **evaluating-vgc-viability (optional):** If missing, continue without strategic reference data. Skip synergy scans, archetype references, and role checklists. Do not mention these features to the user.
- **evaluating-vgc-meta (optional):** If missing, continue without meta context. Use generic, stat-based assessments (e.g., "above-average speed") instead of meta-relative ones (e.g., "faster than Garchomp, a top threat"). Skip threat lists and meta matchup mapping.

## Data Sources

### From checking-vgc-legality (REQUIRED -- stop if skill is missing)
- `champions-roster.json` -- legal Pokemon with types, base stats, abilities, moves, and mega data
- `type-chart.json` -- type effectiveness multipliers (2, 1, 0.5, 0). Missing entries = 1x.
- `moves.json` -- move details (type, category, power, accuracy, priority, target, effect)
- `abilities.json` -- ability effects
- `items.json` -- held item details (category, effect)

### From evaluating-vgc-viability (optional -- degrade gracefully if missing)
- `reference/roles.md` -- VGC role definitions
- `reference/archetypes.md` -- common team archetypes
- `reference/items.md` -- item selection heuristics
- `reference/synergies.md` -- pair synergy patterns (offensive combos, defensive pivots, mode pairs)

### From evaluating-vgc-meta (optional -- degrade gracefully if missing)
- Pikalytics fetch for current usage stats, top threats, common sets, and teammates

## Workflow

### 1. Ask the user how to start

Three entry points:
- **"I want to build around X"** -- User names 1-2 Pokemon. Verify they're in the roster (from checking-vgc-legality). Proceed to Foundation.
- **"I want to play [archetype]"** -- If evaluating-vgc-viability is available, load archetypes.md and present the relevant core. Otherwise, work with the user's description of the archetype. Proceed to Foundation.
- **"What's good right now?"** -- If evaluating-vgc-meta is available, fetch Pikalytics and present top-usage Pokemon and common cores. Otherwise, ask the user what Pokemon or strategies they've been seeing. Let the user pick a direction.

### 2. Foundation (slots 1-2)

Establish the team's core pair. For each Pokemon:
1. Verify it's in champions-roster.json (from checking-vgc-legality)
2. Read its abilities and moves from the roster. Look up move details in moves.json and ability effects in abilities.json as needed.
3. Suggest a competitive set (moves, ability, item) as a starting point
4. Explain why these two work together (type synergy, role coverage, archetype fit)
5. Note what role each plays in a bring-4 context -- these two will likely appear in most bring-4 groups. Example: "Garchomp is your primary attacker, Whimsicott is your speed control -- expect to bring both in most games."

### 3. Build Out (slots 3-4) -- Complete the Core-4

The goal is to complete your default bring-4 group. Identify gaps in the current pair:
1. **Type gaps** -- Read type-chart.json + roster types (from checking-vgc-legality). Which types can the team not resist? Which types can't the team hit super-effectively?
2. **Role gaps** -- If evaluating-vgc-viability is available, load roles.md. Does the team have speed control? Intimidate? Redirection? Fake Out? If unavailable, assess role coverage based on the team's moves and abilities directly.
3. **Meta threats** -- If evaluating-vgc-meta is available, fetch Pikalytics to identify which top-usage Pokemon threaten the current core. If unavailable, identify threats based on type matchups and common offensive types.

For each gap, suggest 2-3 Pokemon from the roster that address it. Evaluate candidates as "which Pokemon makes the strongest group of 4 with your existing core pair?" Prefer Pokemon that fill multiple gaps. Present trade-offs. When suggesting, if evaluating-vgc-viability is available, load `reference/synergies.md` and call out offensive combos (e.g., "Garchomp gives you Earthquake + your Corviknight is immune to it"), defensive pivot pairs, or mode pairs that the new Pokemon enables.

**After slot 4 is chosen, present a core-4 summary:** "Your default bring is [A, B, C, D]. This group has [roles covered: speed control, Fake Out, spread damage, etc.]. It struggles against [specific threats or archetypes the core-4 can't handle]." This summary frames slots 5-6 as solving those problems.

### 4. Alternate Mode Slots (5-6)

Slots 5-6 enable alternate modes for matchups the core-4 struggles against. Reference the core-4 summary from step 3.

For each slot, suggest 2-3 Pokemon framed as swap-ins:
- **Name which core-4 member it replaces** and in what matchup. Example: "Swap Torkoal in for Whimsicott against Trick Room teams -- Torkoal gives you a Trick Room mode with Hatterene instead of a Tailwind mode."
- **Describe the alternate mode it creates.** What is the game plan for the resulting group of 4? How does it differ from the core-4's plan?
- **Pair synergy** -- does the new Pokemon form strong mode pairs or offensive combos with the remaining core members? If evaluating-vgc-viability is available, reference synergy patterns from synergies.md. A Pokemon that enables a coherent alternate mode is better than one that just fills a type gap.

If the team only has one viable mode after both slots are filled, flag it: "Your team currently brings the same 4 every game. Consider [alternative Pokemon] for slot [N] to give you a [description] mode against [matchup]."

**Alternate Mega candidates:** If the core-4 includes a Mega Stone carrier (the primary Mega), at least one slot 5-6 candidate across both rounds should be Mega-eligible (has a `mega` field in champions-roster.json) with a Mega form that addresses the primary Mega's bad matchups. If none of the organic candidates are Mega-eligible, add one as an additional option (the list grows from 2-3 to 3-4 candidates for that slot). Prioritize candidates whose Mega form counter-types what counters the primary Mega. Note if the candidate also enables a different game plan as a secondary benefit.

When presenting a Mega-eligible candidate:
- Note it carries a Mega Stone and **replaces the primary Mega in the bring-4** -- two Mega Stone carriers must never appear in the same bring-4 group.
- Explain what the Mega form addresses and which specific counters to the primary Mega it handles. Example: "Mega Scizor threatens the Fairy types that wall Mega Feraligatr's Dragonize."
- If the user declines the alternate Mega for both slots, accept the decision and move on. The alternate Mega is always a recommendation, never forced.

### 5. Set Refinement

For each of the 6 Pokemon, suggest a starting set:
- Ability
- Held item
- 4 moves
- Nature
- EVs (suggest a simple spread like 252/252/4 as a baseline)

Build sets from the Pokemon's available moves and abilities in champions-roster.json (from checking-vgc-legality). Look up move details (type, power, category) in moves.json.

**Item selection:** If evaluating-vgc-viability is available, load `reference/items.md` for selection heuristics. For each Pokemon, suggest an item based on its role and the team's existing items. Verify the item exists in `items.json` (from checking-vgc-legality). Enforce no duplicate items across the team. If a Pokemon is Mega-eligible and the team doesn't already have a Mega, consider whether the Mega Stone is worth the item slot.

If evaluating-vgc-meta is available, cross-reference with Pikalytics common sets. The user customizes from here.

**Mode-aware sets:** Consider which bring-4 groups each Pokemon participates in. Pokemon appearing in multiple modes should have versatile sets (e.g., balanced EV spreads, moves useful in both game plans). Pokemon appearing in only one mode can be more specialized (e.g., min-speed Torkoal for Trick Room mode only). Mention this trade-off when it's relevant to the set choice, not for every Pokemon.

### 6. Team Analysis

Run all applicable analysis layers. Present results clearly.

**Type Coverage Matrix:**

Defensive -- for each team member, list weaknesses and resistances using type-chart.json (from checking-vgc-legality). Flag any type that hits 3+ team members super-effectively.

Offensive -- for each team member's STAB types + main coverage moves, list what types the team hits super-effectively. Flag types the team has no super-effective coverage against.

**Pair Synergy Scan (requires evaluating-vgc-viability):**

If evaluating-vgc-viability is available, load `reference/synergies.md`. For each of the 15 possible pairs on the team, check the pair against each synergy category (offensive combos, defensive pivot pairs, mode pairs) using the team's actual moves, abilities, and types from the data files (from checking-vgc-legality).

Do not list all 15 pairs. Present only the notable findings:

*Top synergy pairs (2-3 best):* Identify the pairs with the strongest synergies. For each, name the pair, state the synergy category, and explain what they do together. Example: "Sableye + Feraligatr (Mode Pair: Fake Out + Dragon Dance setup. Sableye also has Helping Hand to boost Feraligatr's attacks after it's set up.)"

*Anti-synergy flags:* Identify pairs that are actively bad together on the field. Shared weaknesses with no cross-coverage, redundant roles (two redirectors, two Fake Out users with nothing to enable), or conflicting strategies (Tailwind setter paired with a Trick Room setter and no plan to use both modes). Only flag pairs where the anti-synergy is meaningful -- two Pokemon sharing one weakness is normal, two Pokemon sharing three weaknesses with no cross-coverage is a flag.

*Missing synergy gaps:* Check whether the team is missing synergy patterns that its archetype typically wants. Reference the team's archetype from `reference/archetypes.md` (from evaluating-vgc-viability) if one was chosen in step 1. Examples: a hyper offense team with no Fake Out + setup pair, a rain team with no spread move + immunity combo, a team with setup sweepers but no redirector or Fake Out user to enable them. Not every team needs every pattern -- flag gaps as observations, not failures.

If evaluating-vgc-viability is unavailable, skip the Pair Synergy Scan entirely.

**Bring-4 Mode Analysis:**

Identify and validate the team's bring-4 groups.

*1. Identify modes.* Name the core-4 (the default bring group established in step 3) and any alternate modes enabled by slots 5-6. A "mode" is a group of 4 with a coherent game plan (fast offense, Trick Room, anti-weather, etc.). Alternate modes swap 1-2 members from the core-4. List each mode with its 4 members and one-line game plan. If the team has two Mega Stone carriers, identify any mode that swaps the primary Mega out for the alternate Mega. Name it explicitly as a Mega-swap mode. Example: "Alternate Mega mode: swap Feraligatr for Scizor. Mega evolve Scizor. Game plan: Steel-type offensive pressure against Fairy-heavy teams." Two Mega Stone carriers must never appear in the same bring-4 group.

*2. Validate each mode.* For each mode, check:
- Does this group of 4 have speed control?
- Does it have a win condition (setup sweeper, spread damage, etc.)?
- Are there critical type gaps (a type hitting 3+ of the 4 super-effectively with no resist among them)?
- Does it have pair synergy (Fake Out + setup, redirect + sweeper, etc.)?

Flag modes missing something critical. If a mode fails validation (e.g., no speed control and no way to deal damage before the opponent moves), say so directly and suggest a fix. When validating an alternate-Mega mode, evaluate using the alternate Mega's Mega stats and ability from champions-roster.json (not its base form). The primary Mega is benched in this mode and irrelevant to validation.

*3. Map modes to matchups.* If evaluating-vgc-meta is available, use Pikalytics meta threats to suggest which mode to bring against common archetypes. Format as: "Against [archetype/threat]: bring [mode name] -- swap [Pokemon] in for [Pokemon]. [One sentence explaining why.]" Explicitly map alternate-Mega modes to the matchups that counter the primary Mega. Example: "Against Fairy-heavy teams: bring Alternate Mega mode -- swap Feraligatr for Mega Scizor. Scizor's Steel STAB threatens Fairies that wall Dragonize."

If evaluating-vgc-meta is unavailable, map modes to general type-based matchups instead of specific meta archetypes.

*4. Mode coverage gaps.* If evaluating-vgc-meta is available and a common meta archetype (from Pikalytics top-usage trends) has no good mode answer, flag it and suggest a fix: a move/item change on an existing member, or a slot 5-6 replacement that would create a viable mode for that matchup. If the team has no alternate Mega and the primary Mega is countered by a common meta archetype, flag it specifically: "Your primary Mega [X] is countered by [archetype] and you have no alternate Mega mode. Consider adding [Mega-eligible Pokemon] in slot [N]."

If evaluating-vgc-meta is unavailable, assess mode coverage gaps based on type matchups only.

**Threat List (requires evaluating-vgc-meta):**

If evaluating-vgc-meta is available, fetch Pikalytics top-usage Pokemon. For each high-usage threat:
- Which team members handle it well?
- Which team members lose to it?
- If the team has no good answer, suggest counterplay (move change, item swap, or team member replacement)

If evaluating-vgc-meta is unavailable, skip the Threat List entirely.

**Role Checklist (requires evaluating-vgc-viability):**

If evaluating-vgc-viability is available, load roles.md. Check which roles the team covers:
- [ ] Speed control
- [ ] Intimidate / Attack drops
- [ ] Redirection
- [ ] Fake Out
- [ ] Setup
- [ ] Spread damage
- [ ] Weather/Terrain (if relevant to the archetype)

Not every team needs every role. Flag gaps as information, not failures.

If evaluating-vgc-viability is unavailable, skip the Role Checklist entirely.

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
```

- [ ] **Step 2: Verify the file was written correctly**

Read back `skills/building-vgc-teams/SKILL.md` and confirm:
- Frontmatter has `dependencies` with `required: [checking-vgc-legality]` and `optional: [evaluating-vgc-viability, evaluating-vgc-meta]`
- No Gatekeeper Rule section exists
- Data Sources section has three subsections referencing the three provider skills
- Dependency Check section exists after the intro paragraph
- No bare references to `champions-roster.json` without "(from checking-vgc-legality)"
- No bare references to Pikalytics fetch without "(from evaluating-vgc-meta)" or conditional language
- No bare references to reference files without "(from evaluating-vgc-viability)" or conditional language

- [ ] **Step 3: Commit**

```bash
git add skills/building-vgc-teams/SKILL.md
git commit -m "refactor: update building-vgc-teams to reference provider skills"
```

---

### Task 5: Update evaluating-vgc-teams SKILL.md

**Files:**
- Modify: `skills/evaluating-vgc-teams/SKILL.md`

Same structural changes as Task 4, applied to the evaluating skill. The full updated file content is provided below.

- [ ] **Step 1: Replace SKILL.md with updated version**

Write `skills/evaluating-vgc-teams/SKILL.md` with this content:

```markdown
---
name: evaluating-vgc-teams
description: Use when the user wants to evaluate, rate, or get feedback on an existing VGC team for Pokemon Champions, including team analysis, fix suggestions, and meta matchup review
dependencies:
  required:
    - checking-vgc-legality
  optional:
    - evaluating-vgc-viability
    - evaluating-vgc-meta
---

# Evaluating VGC Teams

Evaluates existing Pokemon Champions VGC teams from Showdown paste format. Auto-detects the team's archetype, presents a summary verdict, and lets the user drill into analysis layers with tiered fix suggestions. Outputs a revised Showdown paste with a change diff when done.

## Dependency Check

Before starting, verify that required skill directories exist.

- **checking-vgc-legality (required):** If this skill's directory is missing, stop and tell the user: "This skill requires the checking-vgc-legality skill. Please install it before continuing." Do not proceed.
- **evaluating-vgc-viability (optional):** If missing, continue without strategic reference data. Skip synergy scans, archetype references, and role checklists. Do not mention these features to the user.
- **evaluating-vgc-meta (optional):** If missing, continue without meta context. Use generic, stat-based assessments (e.g., "above-average speed") instead of meta-relative ones (e.g., "faster than Garchomp, a top threat"). Skip threat lists and meta matchup mapping.

## Data Sources

### From checking-vgc-legality (REQUIRED -- stop if skill is missing)
- `champions-roster.json` -- legal Pokemon with types, base stats, abilities, moves, and mega data
- `type-chart.json` -- type effectiveness multipliers (2, 1, 0.5, 0). Missing entries = 1x.
- `moves.json` -- move details (type, category, power, accuracy, priority, target, effect)
- `abilities.json` -- ability effects
- `items.json` -- held item details (category, effect)

### From evaluating-vgc-viability (optional -- degrade gracefully if missing)
- `reference/roles.md` -- VGC role definitions
- `reference/archetypes.md` -- common team archetypes
- `reference/items.md` -- item selection heuristics
- `reference/synergies.md` -- pair synergy patterns (offensive combos, defensive pivots, mode pairs)

### From evaluating-vgc-meta (optional -- degrade gracefully if missing)
- Pikalytics fetch for current usage stats, top threats, common sets, and teammates

## Workflow

### 1. Parse & Validate

The user provides a team in Showdown paste format. Parse it into structured data (Pokemon name, item, ability, EVs, nature, moves).

**Partial teams:** If the paste contains fewer than 6 Pokemon, accept it and evaluate what's there. Flag the incomplete roster in the summary verdict ("This team has N/6 slots filled") and skip bring-4 mode analysis if there are fewer than 4 Pokemon. Do not prompt the user to add more -- they may be evaluating a core before filling remaining slots.

For each Pokemon, validate:
1. Verify it exists in `champions-roster.json` (from checking-vgc-legality)
2. Verify its listed ability is legal for it (exists in the roster entry's abilities)
3. Verify its listed moves are legal for it (exist in the roster entry's moves)
4. Verify its item exists in `items.json` (from checking-vgc-legality)
5. Check for duplicate items across the team
6. Verify EV totals don't exceed 508

Flag any validation errors before proceeding. If a Pokemon isn't in the roster, ask the user whether to proceed with partial evaluation (skip that Pokemon) or correct the paste.

### 2. Archetype Detection & Confirmation

Auto-detect the team's archetype by checking for signals. If evaluating-vgc-viability is available, load `reference/archetypes.md` for archetype definitions. If unavailable, detect archetypes based on team composition signals directly.

- **Rain:** Drizzle user (Politoed, Pelipper) present? Swift Swim or rain abusers on the team?
- **Sun:** Drought user (Torkoal, Ninetales) present? Chlorophyll users or sun abusers?
- **Sand:** Sand Stream user (Tyranitar, Hippowdon) present? Sand Rush users (Excadrill)?
- **Snow:** Snow Warning user (Abomasnow) present? Slush Rush or Aurora Veil users?
- **Trick Room:** TR setter present (check roster for Trick Room in moves)? Multiple Pokemon with base Speed under 50?
- **Hyper Offense:** Multiple setup moves (Swords Dance, Dragon Dance, Nasty Plot, Calm Mind, Quiver Dance), Fake Out support, Tailwind, high offensive base stats across the board?
- **Goodstuffs/Balance:** No strong archetype signals -- versatile Pokemon, mixed speed tiers, Intimidate support.

Present the assessment: *"This looks like a [archetype] team built around [core Pokemon]. Is that what you're going for?"*

If the user corrects the archetype, reframe all subsequent analysis against the stated intent. If the archetype is ambiguous (e.g., both Tailwind and Trick Room elements), name it as a dual-mode team and confirm which mode is primary.

The detected (or corrected) archetype informs all subsequent analysis -- what roles are expected, which synergy gaps matter, and how to evaluate bring-4 modes.

### 3. Summary Verdict

Run a quick pass across all applicable analysis layers to identify the headline strengths and issues. Present a high-level summary before any deep analysis.

**Format:**

> **Team: [Archetype] built around [core Pokemon]**
>
> **Strengths (2-3 bullets):** What the team does well -- e.g., "Strong Fake Out + Dragon Dance setup mode with Sableye/Feraligatr," "Good type diversity across the 6," "Multiple speed control options."
>
> **Top Issues (2-3 bullets, ranked by severity):** The most impactful problems -- e.g., "No answer to top-usage [threat]," "Only one viable bring-4 mode," "Duplicate roles with no Intimidate."
>
> **Drill-down areas:**
> 1. Type Coverage
> 2. Pair Synergies *(requires evaluating-vgc-viability)*
> 3. Bring-4 Modes
> 4. Meta Threat Matchups *(requires evaluating-vgc-meta)*
> 5. Role Checklist *(requires evaluating-vgc-viability)*
> 6. Set Optimization
>
> *"Which area do you want to dig into, or should I go through them in order?"*

Only list drill-down areas whose dependencies are available. If evaluating-vgc-viability is unavailable, omit Pair Synergies and Role Checklist from the list. If evaluating-vgc-meta is unavailable, omit Meta Threat Matchups from the list.

The summary requires reading data files (from checking-vgc-legality) and, if evaluating-vgc-meta is available, fetching Pikalytics to identify the top issues. If evaluating-vgc-meta is unavailable, base the summary on type matchups and stat analysis only. If the team has fewer than 6 Pokemon, note it here: "This team has N/6 slots filled."

### 4. Analysis Layers (Drill-Down)

Each layer follows the same pattern: **findings -> problems flagged -> tiered fix suggestions.** The user can drill into any layer in any order.

Fix tiers (used across all layers, in priority order -- always start with the least disruptive):
1. Move change
2. Item change
3. Ability change
4. EV/Nature adjustment
5. Pokemon swap (present 2-3 candidates from the roster with trade-offs)

#### Layer 1: Type Coverage

**Defensive:** For each team member, list weaknesses and resistances using type-chart.json (from checking-vgc-legality). Flag any type that hits 3+ team members super-effectively.

**Offensive:** For each team member's STAB types (determined by the Pokemon's types in the roster) + coverage moves (non-STAB attacking moves in the set), list what types the team hits super-effectively. Look up move types in moves.json (from checking-vgc-legality). Flag types the team has no super-effective coverage against.

**Fixes:**
- Offensive type hole -> suggest a coverage move swap on the team member best positioned to learn a move of the missing type (check their available moves in champions-roster.json). Tier 1 fix.
- A type hitting 3 members SE -> flag as a concern, suggest resistance berry or item change if applicable. Tier 2 fix.
- A type hitting 4+ members SE with no resist on the team -> escalate to a Pokemon swap suggestion. Identify 2-3 roster Pokemon that resist the problematic type and fill a similar role to the weakest link. Tier 5 fix.

#### Layer 2: Pair Synergies (requires evaluating-vgc-viability)

If evaluating-vgc-viability is unavailable, skip this layer entirely.

Load `reference/synergies.md` (from evaluating-vgc-viability). For each of the 15 possible pairs on the team (or fewer for partial teams), check the pair against each synergy category using the team's actual moves, abilities, and types from the data files (from checking-vgc-legality).

Do not list all pairs. Present only the notable findings:

**Top synergy pairs (2-3 best):** Identify the pairs with the strongest synergies. For each, name the pair, state the synergy category, and explain what they do together. Example: "Sableye + Feraligatr (Mode Pair: Fake Out + Dragon Dance setup. Sableye also has Helping Hand to boost Feraligatr's attacks after it's set up.)"

**Anti-synergy flags:** Identify pairs that are actively bad together on the field. Shared weaknesses with no cross-coverage, redundant roles (two redirectors, two Fake Out users with nothing to enable), or conflicting strategies (Tailwind setter paired with a Trick Room setter and no plan to use both modes). Only flag pairs where the anti-synergy is meaningful -- two Pokemon sharing one weakness is normal, two Pokemon sharing three weaknesses with no cross-coverage is a flag.

**Missing synergy gaps:** Check whether the team is missing synergy patterns that its archetype typically wants. Reference the detected archetype from `reference/archetypes.md` (from evaluating-vgc-viability). Examples: a hyper offense team with no Fake Out + setup pair, a rain team with no spread move + immunity combo, a team with setup sweepers but no redirector or Fake Out user to enable them. Not every team needs every pattern -- flag gaps as observations, not failures.

**Fixes:**
- Anti-synergy from a specific move (e.g., Earthquake hitting partner) -> suggest an alternative move the Pokemon learns (e.g., High Horsepower). Tier 1 fix.
- Anti-synergy from item conflict -> suggest an item swap. Tier 2 fix.
- Missing synergy the archetype fundamentally needs -> escalate to a slot swap with 2-3 candidates that provide the missing pattern. Tier 5 fix.

#### Layer 3: Bring-4 Modes

Skip this layer if the team has fewer than 4 Pokemon.

**1. Identify modes.** Determine the core-4 (the group of 4 that represents the team's default game plan) and any alternate modes enabled by the remaining slots. A "mode" is a group of 4 with a coherent game plan (fast offense, Trick Room, anti-weather, etc.). Alternate modes swap 1-2 members from the core-4.

List each mode with its 4 members and one-line game plan. If the team has two Mega Stone carriers, identify any mode that swaps the primary Mega out for the alternate Mega. Name it explicitly as a Mega-swap mode. Example: "Alternate Mega mode: swap Feraligatr for Scizor. Mega evolve Scizor. Game plan: Steel-type offensive pressure against Fairy-heavy teams."

Two Mega Stone carriers must never appear in the same bring-4 group.

**2. Validate each mode.** For each mode, check:
- Does this group of 4 have speed control (Tailwind, Trick Room, Icy Wind, Thunder Wave, or Choice Scarf)?
- Does it have a win condition (setup sweeper, spread damage dealer, etc.)?
- Are there critical type gaps (a type hitting 3+ of the 4 super-effectively with no resist among them)?
- Does it have pair synergy (Fake Out + setup, redirect + sweeper, etc.)?

Flag modes missing something critical. If a mode fails validation (e.g., no speed control and no way to deal damage before the opponent moves), say so directly and suggest a fix.

When validating an alternate-Mega mode, evaluate using the alternate Mega's Mega stats and ability from champions-roster.json (not its base form). The primary Mega is benched in this mode and irrelevant to validation.

**3. Map modes to matchups.** If evaluating-vgc-meta is available, use Pikalytics meta data to suggest which mode to bring against common archetypes. Format as: "Against [archetype/threat]: bring [mode name] -- swap [Pokemon] in for [Pokemon]. [One sentence explaining why.]"

Explicitly map alternate-Mega modes to the matchups that counter the primary Mega. Example: "Against Fairy-heavy teams: bring Alternate Mega mode -- swap Feraligatr for Mega Scizor. Scizor's Steel STAB threatens Fairies that wall Dragonize."

If evaluating-vgc-meta is unavailable, map modes to general type-based matchups instead of specific meta archetypes.

**4. Mode coverage gaps.** If evaluating-vgc-meta is available and a common meta archetype (from Pikalytics top-usage trends) has no good mode answer, flag it.

If evaluating-vgc-meta is unavailable, assess mode coverage gaps based on type matchups only.

**Fixes:**
- Weak mode missing speed control -> suggest adding Tailwind/Icy Wind to a Pokemon in that mode that learns it (check roster). Tier 1 fix.
- Weak mode missing a win condition -> suggest a move change (setup move) or item change on existing members. Tier 1-2 fix.
- No mode covers a common meta archetype -> suggest a slot 5-6 swap that would create a viable mode for that matchup. Tier 5 fix.
- Team has a primary Mega countered by a common archetype and no alternate Mega -> flag it specifically: "Your primary Mega [X] is countered by [archetype] and you have no alternate Mega mode. Consider adding [Mega-eligible Pokemon] in slot [N]." Identify 2-3 Mega-eligible candidates from the roster whose Mega form counter-types what counters the primary Mega. Tier 5 fix.

#### Layer 4: Meta Threat Matchups (requires evaluating-vgc-meta)

If evaluating-vgc-meta is unavailable, skip this layer entirely.

Fetch Pikalytics (via evaluating-vgc-meta) for top-usage Pokemon. For each high-usage threat (focus on the top 10-15 by usage rate):
- Which team members handle it well? (resist its STAB, outspeed and KO it, have Intimidate against physical threats, etc.)
- Which team members lose to it? (weak to its STAB, slower, can't deal meaningful damage)
- If the team has no good answer, suggest counterplay

**Fixes:**
- Team has a shaky answer (handles it but not cleanly) -> suggest a move or item change to shore up the matchup. Tier 1-2 fix.
- A top-3 usage threat has zero answers on the team -> escalate to a swap suggestion with 2-3 specific roster candidates that handle the threat and explain which team member they'd replace and why. Tier 5 fix.

#### Layer 5: Role Checklist (requires evaluating-vgc-viability)

If evaluating-vgc-viability is unavailable, skip this layer entirely.

Load `reference/roles.md` (from evaluating-vgc-viability). Check which roles the team covers:

- [ ] Speed control (Tailwind, Trick Room, Icy Wind, Thunder Wave, Choice Scarf)
- [ ] Intimidate / Attack drops (Intimidate ability, Snarl)
- [ ] Redirection (Follow Me, Rage Powder)
- [ ] Fake Out
- [ ] Setup (Swords Dance, Dragon Dance, Calm Mind, Nasty Plot, Quiver Dance, etc.)
- [ ] Spread damage (Earthquake, Rock Slide, Heat Wave, Dazzling Gleam, etc.)
- [ ] Weather/Terrain (only flag if relevant to the detected archetype)

Not every team needs every role. Evaluate gaps against the detected archetype:
- A hyper offense team missing Fake Out is a problem. A goodstuffs team missing it is a note.
- A rain team missing a weather setter is critical. A balance team without weather is fine.

Flag gaps as observations with context, not failures.

**Fixes:**
- Missing role that an existing team member could fill -> check if any team member learns the relevant move in champions-roster.json and suggest a move swap. Tier 1 fix.
- Missing role with no current member able to fill it -> suggest a Pokemon swap with 2-3 candidates that provide the role. Tier 5 fix.

#### Layer 6: Set Optimization

Review each Pokemon's individual set for internal consistency and efficiency. Read the Pokemon's full data from champions-roster.json (from checking-vgc-legality) and cross-reference with the team's archetype and game plan.

**Ability:** Does the Pokemon have a better ability available for this team context? Check all abilities listed in the roster entry. Example: a Corviknight running Pressure when Mirror Armor is available and the team faces Intimidate users.

**Item:** Check for:
- Duplicate items across the team (VGC rules prohibit this)
- Missed Mega Stone opportunity (Pokemon has a `mega` field in the roster but isn't holding its Mega Stone -- worth it?)
- Better item for the role. If evaluating-vgc-viability is available, load `reference/items.md` for heuristics. Example: a lead Trick Room setter without Mental Herb or Focus Sash.

**Moves:** Check for:
- Moves that don't serve the team's game plan. If evaluating-vgc-meta is available, check whether coverage moves hit relevant meta threats. If unavailable, evaluate coverage based on type chart utility.
- Missing Protect on a Pokemon that should have it (not a Fake Out user, Choice holder, or Assault Vest holder)
- Better move options available in the roster entry for the Pokemon's role

**EVs/Nature:** Check for:
- Nature that conflicts with the Pokemon's role (Adamant on a special attacker)
- EV spread that doesn't serve the set (Speed investment on a Trick Room Pokemon, no HP investment on a tank)
- When suggesting changes, provide specific benchmarks: "84 Spe EVs lets Feraligatr outspeed base 130s after +1 Dragon Dance" or "196 HP / 60 Def survives Adamant Garchomp Earthquake"

**Fixes:** Always specific and justified with benchmarks or matchup reasoning. Tier 1-4 fixes (move, item, ability, EV changes). Set optimization never escalates to a Pokemon swap -- that's handled by other layers.

### 5. Fix Tracking & Export

As the user works through drill-down layers and accepts or rejects fix suggestions, track all accepted changes as a running changelist.

When the user is done exploring (or asks for the updated team), output:

**1. Revised Showdown paste** -- the full team in paste format with all accepted changes applied:

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

**2. Change diff** -- a summary of what changed from the original paste:

Example:
> - Feraligatr: Double-Edge -> Ice Punch (coverage for Garchomp/Salamence)
> - Clefable: Sitrus Berry -> Lum Berry (status immunity for Follow Me longevity)
> - Corviknight: 252 HP / 252 Def / 4 SpD -> 252 HP / 148 Def / 108 SpD (survives Modest Gardevoir Thunderbolt)
> - Slot 5: Volcarona -> Incineroar (adds Intimidate + Fake Out)

If no changes were accepted, re-output the original paste with a note that no modifications were made.

The user can request a partial export at any time (e.g., "show me the team with just the move changes, not the swap").

## Conversation Style

- The user can jump between layers, revisit analysis, accept or reject fixes freely
- Present 2-3 options when suggesting Pokemon swaps, not a single "correct" answer
- Explain trade-offs concisely -- the user understands VGC basics
- Tiered fixes: always start with the least disruptive option before escalating
- All move and ability data is Champions-accurate from the roster. If the user reports a discrepancy, trust the user and note it for roster updates.
```

- [ ] **Step 2: Verify the file was written correctly**

Read back `skills/evaluating-vgc-teams/SKILL.md` and confirm the same checklist as Task 4 Step 2:
- Frontmatter has `dependencies` with `required: [checking-vgc-legality]` and `optional: [evaluating-vgc-viability, evaluating-vgc-meta]`
- No Gatekeeper Rule section exists
- Data Sources section has three subsections referencing the three provider skills
- Dependency Check section exists after the intro paragraph
- Drill-down area list conditionally omits unavailable layers
- No bare references to data files without provider skill attribution
- No bare references to Pikalytics fetch without conditional language

- [ ] **Step 3: Commit**

```bash
git add skills/evaluating-vgc-teams/SKILL.md
git commit -m "refactor: update evaluating-vgc-teams to reference provider skills"
```

---

### Task 6: Delete duplicate data files from consumer skills

**Files:**
- Delete: `skills/building-vgc-teams/champions-roster.json`
- Delete: `skills/building-vgc-teams/type-chart.json`
- Delete: `skills/building-vgc-teams/moves.json`
- Delete: `skills/building-vgc-teams/abilities.json`
- Delete: `skills/building-vgc-teams/items.json`
- Delete: `skills/building-vgc-teams/reference/roles.md`
- Delete: `skills/building-vgc-teams/reference/archetypes.md`
- Delete: `skills/building-vgc-teams/reference/items.md`
- Delete: `skills/building-vgc-teams/reference/synergies.md`
- Delete: `skills/evaluating-vgc-teams/champions-roster.json`
- Delete: `skills/evaluating-vgc-teams/type-chart.json`
- Delete: `skills/evaluating-vgc-teams/moves.json`
- Delete: `skills/evaluating-vgc-teams/abilities.json`
- Delete: `skills/evaluating-vgc-teams/items.json`
- Delete: `skills/evaluating-vgc-teams/reference/roles.md`
- Delete: `skills/evaluating-vgc-teams/reference/archetypes.md`
- Delete: `skills/evaluating-vgc-teams/reference/items.md`
- Delete: `skills/evaluating-vgc-teams/reference/synergies.md`

- [ ] **Step 1: Verify provider skills have the files before deleting**

```bash
for f in champions-roster.json type-chart.json moves.json abilities.json items.json; do
  diff -q skills/building-vgc-teams/$f skills/checking-vgc-legality/$f
done
for f in roles.md archetypes.md items.md synergies.md; do
  diff -q skills/building-vgc-teams/reference/$f skills/evaluating-vgc-viability/reference/$f
done
```

Expected: all files identical, no diff output. Only proceed if verification passes.

- [ ] **Step 2: Delete data files from building-vgc-teams**

```bash
rm skills/building-vgc-teams/champions-roster.json
rm skills/building-vgc-teams/type-chart.json
rm skills/building-vgc-teams/moves.json
rm skills/building-vgc-teams/abilities.json
rm skills/building-vgc-teams/items.json
rm -r skills/building-vgc-teams/reference/
```

- [ ] **Step 3: Delete data files from evaluating-vgc-teams**

```bash
rm skills/evaluating-vgc-teams/champions-roster.json
rm skills/evaluating-vgc-teams/type-chart.json
rm skills/evaluating-vgc-teams/moves.json
rm skills/evaluating-vgc-teams/abilities.json
rm skills/evaluating-vgc-teams/items.json
rm -r skills/evaluating-vgc-teams/reference/
```

- [ ] **Step 4: Verify consumer skills only contain SKILL.md**

```bash
ls -la skills/building-vgc-teams/
ls -la skills/evaluating-vgc-teams/
```

Expected: each directory contains only `SKILL.md`.

- [ ] **Step 5: Commit**

```bash
git add -A skills/building-vgc-teams/ skills/evaluating-vgc-teams/
git commit -m "chore: remove duplicate data files from consumer skills"
```

---

### Task 7: Final verification

- [ ] **Step 1: Verify complete file structure**

```bash
find skills/ -type f | sort
```

Expected output:
```
skills/building-vgc-teams/SKILL.md
skills/checking-vgc-legality/SKILL.md
skills/checking-vgc-legality/abilities.json
skills/checking-vgc-legality/champions-roster.json
skills/checking-vgc-legality/items.json
skills/checking-vgc-legality/moves.json
skills/checking-vgc-legality/type-chart.json
skills/evaluating-vgc-meta/SKILL.md
skills/evaluating-vgc-teams/SKILL.md
skills/evaluating-vgc-viability/SKILL.md
skills/evaluating-vgc-viability/reference/archetypes.md
skills/evaluating-vgc-viability/reference/items.md
skills/evaluating-vgc-viability/reference/roles.md
skills/evaluating-vgc-viability/reference/synergies.md
```

- [ ] **Step 2: Verify no stale references in consumer SKILL.md files**

Search both consumer SKILL.md files for patterns that should no longer appear:

```bash
grep -n "Gatekeeper Rule" skills/building-vgc-teams/SKILL.md skills/evaluating-vgc-teams/SKILL.md
grep -n "^- \`champions-roster" skills/building-vgc-teams/SKILL.md skills/evaluating-vgc-teams/SKILL.md
grep -n "Fetch.*pikalytics" skills/building-vgc-teams/SKILL.md skills/evaluating-vgc-teams/SKILL.md
```

Expected: 
- "Gatekeeper Rule" should not appear as a section heading in either file
- No bare `champions-roster.json` references without "(from checking-vgc-legality)" context
- No bare Pikalytics fetch URLs -- all should be conditioned on evaluating-vgc-meta

- [ ] **Step 3: Verify dependency declarations in frontmatter**

```bash
head -10 skills/building-vgc-teams/SKILL.md
head -10 skills/evaluating-vgc-teams/SKILL.md
```

Expected: both files have `dependencies:` block with `required: [checking-vgc-legality]` and `optional: [evaluating-vgc-viability, evaluating-vgc-meta]`.
