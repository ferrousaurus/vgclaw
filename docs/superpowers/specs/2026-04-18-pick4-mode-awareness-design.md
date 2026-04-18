# Pick-4 Mode Awareness for VGC Team Builder

## Problem

The building-vgc-teams skill treats the 6-Pokemon team as a monolithic unit. In VGC, you bring 6 but pick 4 for each game. A team that only works as a 6 is a bad team -- the real measure of viability is whether you can assemble good groups of 4 from your 6 against various threats. The current workflow (steps 2-6) fills slots sequentially to cover gaps across all 6, with no consideration for which 4 you'd actually bring together.

## Solution: Slot-Aware Pick-4 Layering

Layer pick-4 awareness into the existing slot-by-slot workflow. Steps 2-4 build toward a default "core-4" bring group. Steps 5-6 shift to enabling alternate modes for different matchups. Analysis validates each mode as a viable group of 4 and maps modes to meta threats.

### Changes to Step 2 (Foundation)

Mostly unchanged. After explaining why the core pair works together, add a note about what role each plays in a bring-4 context. Example: "Garchomp is your primary attacker, Whimsicott is your speed control -- these two will likely appear in most of your bring-4 groups."

### Changes to Step 3 (Build Out, slots 3-4)

Reframe from "fill gaps" to "complete your default core-4." The skill still identifies type/role/meta gaps, but evaluates candidates as "which Pokemon makes the strongest group of 4 with your existing core pair?" Suggestions note what the resulting core-4 can and can't handle.

After slot 4 is chosen, present a **core-4 summary**: "Your default bring is [A, B, C, D]. This group has [roles covered]. It struggles against [threats/archetypes]." This frames slots 5-6 as solving those problems.

### Changes to Step 4 (Final Slots, 5-6)

Reframe from "fill remaining holes" to "enable alternate modes." The framing becomes: "Your core-4 struggles against [X, Y]. Slots 5-6 should give you an alternate mode or targeted swaps for those matchups."

Suggestions are presented as swap-ins: "Swap this in for [core-4 member] against [threat/archetype] to get [different game plan]." Each suggestion should name which core-4 member it replaces and what matchup it's for.

### Changes to Step 5 (Set Refinement)

No new step -- just an additional lens. When refining sets, consider which modes each Pokemon participates in:

- Pokemon appearing in multiple bring-4 groups should have versatile sets (e.g., balanced EV spreads).
- Pokemon appearing in only one mode can be more specialized (e.g., min-speed Torkoal for Trick Room only).

Mention this trade-off when relevant, not for every Pokemon.

### New Analysis Layer: Bring-4 Mode Analysis (Step 6)

Added to Team Analysis after the Pair Synergy Scan and before the Threat List.

**1. Identify modes.** Based on team composition, identify the core-4 (default bring) and any alternate modes. A "mode" is a group of 4 with a coherent game plan (fast offense, Trick Room, anti-weather, etc.). Alternate modes swap 1-2 members from the core-4.

**2. Validate each mode.** For each mode, check:
- Does this group of 4 have speed control?
- Does it have a win condition (setup sweeper, spread damage, etc.)?
- Are there critical type gaps (a type hitting 3+ of the 4 super-effectively with no resist among them)?
- Does it have pair synergy (Fake Out + setup, redirect + sweeper, etc.)?

Flag modes missing something critical. If a mode fails validation (e.g., no speed control and no way to deal damage before the opponent moves), say so directly.

**3. Map modes to matchups.** Using Pikalytics meta threats, suggest which mode to bring against common archetypes. Examples:
- "Against rain: bring [fast mode], swap in Gastrodon for Volcarona"
- "Against Trick Room: bring [core-4], Whimsicott's Taunt handles it"
- "Against sun: bring [alternate mode] with Tyranitar to reset weather"

**4. Mode coverage gaps.** If a common meta archetype has no good mode answer, flag it and suggest a fix: a move/item change on an existing member, or a slot 5-6 replacement that would create a viable mode for that matchup.

## What Doesn't Change

- **Step 1 (Entry points):** Unchanged.
- **Step 7 (Export):** Unchanged. Showdown paste format doesn't encode modes.
- **Existing analysis layers:** Type Coverage Matrix, Pair Synergy Scan, Threat List, and Role Checklist stay as-is. They still evaluate the full 6.
- **Conversation style:** User can jump around, swap Pokemon, re-run analysis at any time.
- **No damage calcs or speed tier math.** Mode validation checks for the presence of speed control, not whether specific Pokemon outspeed specific threats.

## Files Changed

- `skills/building-vgc-teams/SKILL.md` -- modify steps 2-5, add Bring-4 Mode Analysis to step 6
