# Evaluating VGC Viability: Heuristics Improvements

## Summary

Improve the evaluating-vgc-viability skill by deepening the synergies reference file and adding three new strategic reference files. The current reference layer is too shallow (flat pattern-matching with no quality evaluation) and missing key strategic dimensions (speed reasoning, win condition assessment, game-plan resilience).

## Approach

Approach 2: Deepen existing files + add new files with cross-references. Each file is focused by topic and self-contained, with lightweight cross-references to related sections in other files. This keeps files easy to update independently while surfacing connections the entry-point skills need.

## Changes

### 1. Rewrite: reference/synergies.md

The current file has 3 categories (Offensive Combos, Defensive Pivot Pairs, Mode Pairs) with ~11 patterns. Each pattern is a flat checklist: "does this pair match Y/N?"

The rewrite keeps the same categories and patterns but adds two new dimensions.

#### Change 1: Layered Synergy Evaluation

Each existing pattern section gets a **"Quality signals"** subsection and a **"Stacking indicator"** note.

**Quality signals** teach the entry-point skills to evaluate how strong a specific instance of the pattern is. For example, for Setup + Enabler: "A Fake Out enabler that also has Helping Hand or Intimidate gives the setup sweeper value on turns beyond Turn 1. A Fake Out user with no secondary support is a one-turn enabler."

**Stacking indicators** point to other patterns this commonly layers with, both within synergies.md and cross-referencing other files. For example, Setup + Enabler cross-refs to "Helping Hand + Power Move" in Offensive Combos and "see tempo.md > Lead Pair Evaluation for how this pair performs as a Turn 1 lead."

After all patterns, a new **"Evaluating Layered Synergy"** section with heuristics:

- A pair matching 1 pattern is functional. A pair matching 2-3 patterns across categories is a strong core pair. A pair matching 4+ is exceptional and likely a meta-proven combination.
- Layers across categories (offensive + defensive + mode) are more valuable than layers within one category (three offensive combos but no defensive coverage).

#### Change 2: Anti-Synergy Framework

A new top-level section: **"Anti-Synergy Evaluation"** with systematic coverage of what makes pairs bad together.

**Categories:**

- **Shared weakness clustering** -- both Pokemon weak to the same type with neither resisting it. Severity heuristic: 1 shared weakness is normal; 2 is a yellow flag; 3+ is a red flag, especially if it's a common offensive type. Cross-ref to speed-tiers.md for whether the shared weakness is exploitable (both slow + shared weakness = very exploitable).
- **Role redundancy** -- two Pokemon filling the same role with nothing to differentiate their contributions. Severity heuristic: redundancy is only bad if it costs the team a role it needs. Two spread attackers is fine if the team has speed control and setup elsewhere.
- **Strategy conflict** -- Pokemon whose optimal game plans contradict each other when fielded together. E.g., a Tailwind setter + a Trick Room setter in the same bring-4 with no plan to use both. Severity heuristic: conflict is only an anti-synergy if the pair appears in the same bring-4 mode. If they're in different modes, it's fine.
- **Tempo mismatch** -- one Pokemon needs to act immediately (e.g., Eruption Torkoal wants Turn 1 damage) while the partner needs a setup turn. Cross-ref to tempo.md > Lead Pair Evaluation.
- **Friendly fire** -- spread moves or abilities that hurt the partner (Earthquake hitting a grounded partner, Discharge hitting a non-immune partner). Expanded from the current anti-pattern notes into a full section.

Each anti-synergy category includes severity guidance: when it's ignorable, when it's a concern, and when it's a dealbreaker.

---

### 2. New file: reference/speed-tiers.md

Qualitative speed reasoning heuristics. No mathematical calculations -- all guidance is tier-based and relative.

#### Section 1: Speed Tier Framework

Defines five qualitative tiers relative to the Champions roster:

- **Blazing** -- naturally outspeeds nearly everything without investment. These Pokemon rarely need speed control support; they are the fast pressure.
- **Fast** -- outspeeds most of the roster with modest investment. Benefits from speed control mainly to outrun other fast Pokemon or Scarf users.
- **Mid** -- the crowded tier where speed investment decisions matter most. A few EVs can flip dozens of matchups. Tailwind turns mid-tier Pokemon into effective fast threats.
- **Slow** -- too slow to compete without speed control. Needs Tailwind to function in a fast mode, or leans into Trick Room.
- **Trick Room** -- so slow that Trick Room is the primary or only way to move first. Speed investment is actively bad; minimum speed is often correct.

Each tier includes example Pokemon from the Champions roster without specifying exact base stats.

#### Section 2: Speed Investment Heuristics

Qualitative guidance:

- **"Invest to outspeed your tier, not the tier above."** A mid-tier Pokemon trying to outspeed fast-tier Pokemon without Tailwind is usually wasting EVs.
- **"Tailwind math is tier-shifting, not fine-tuning."** Under Tailwind, a mid-tier Pokemon jumps to effectively blazing. Don't over-invest in speed if the team has reliable Tailwind.
- **"Trick Room inverts the heuristic."** Under Trick Room, minimum speed is maximum priority. For dual-mode Pokemon, this creates genuine tension. Cross-ref to win-conditions.md for dual-mode Pokemon evaluation.
- **"Choice Scarf shifts one tier up."** A mid-tier Pokemon with Scarf behaves like a fast-tier Pokemon. Best on mid-tier Pokemon with one dominant attacking move.
- **"Speed ties are coin flips -- avoid building around them."** If the plan requires outspeeding a specific threat in the same tier, find a different answer.

#### Section 3: Speed Control Interaction

How speed tiers interact with team speed control options. Cross-references to roles.md (speed control section) and synergies.md (Speed Control + Slow Attacker pattern):

- **Tailwind teams** want mid-tier attackers (they become blazing under Tailwind with EVs to spare).
- **Trick Room teams** want trick-room-tier attackers paired with a bulky setter.
- **Dual-mode teams** need Pokemon that function in both speed contexts or clearly belong to one mode. Cross-ref to tempo.md for dual-mode lead selection.
- **No dedicated speed control** -- needs naturally fast Pokemon or reactive speed control (Icy Wind, Thunder Wave). Cross-ref to win-conditions.md for when raw speed is sufficient.

---

### 3. New file: reference/win-conditions.md

Win condition types, quality evaluation, and sufficiency heuristics.

#### Section 1: What Counts as a Win Condition

A win condition is a repeatable path to knocking out the opponent's bring-4 -- a plan the team can execute, not just a strong Pokemon.

**Categories:**

- **Setup sweeper** -- boosts stats then overwhelms. Depends on enablers (Fake Out, redirection, Intimidate). Fragile if enablers are removed. Cross-ref to synergies.md > Setup + Enabler.
- **Spread pressure** -- a pair deals damage to both opponents simultaneously, wearing down the field without setup. Less committal, works even when disrupted. Cross-ref to synergies.md > Spread Move + Immunity.
- **Weather/terrain engine** -- setter + abuser forming a self-contained damage engine. Degrades if weather is overwritten. Cross-ref to archetypes.md.
- **Trick Room flip** -- reversing speed for slow heavy hitters. Fragile to Taunt, Imprison, opposing Trick Room. Cross-ref to speed-tiers.md > Trick Room section.
- **Attrition/stall** -- outlasting through Intimidate cycling, recovery, status, Protect stalling. Rare in VGC but viable. Win condition is the opponent running out of resources first.
- **Single-target burst** -- concentrating both attacks on one target per turn for quick KOs and numbers advantage. No setup required, needs good speed control. Cross-ref to speed-tiers.md.

#### Section 2: Evaluating Win Condition Quality

Heuristics for reliability:

- **Dependency count** -- how many things need to go right? Setup sweeper needing Fake Out + redirect + boost + no crit = high dependency. Spread pressure needing two Pokemon on the field = low dependency. Lower is more reliable.
- **Disruption resilience** -- what commonly available counterplay shuts it down? If a single common move or ability stops the win condition, it needs a backup.
- **Turn count** -- how many turns until the win condition is online? Faster is more reliable because the opponent has fewer turns to disrupt.
- **Independence** -- does the win condition require specific Pokemon alive, or can multiple team members execute it? One sweeper = fragile. Multiple independent threats = resilient.

#### Section 3: Win Condition Sufficiency

Heuristics for whether a team has enough:

- **Minimum: 2 independent win conditions.** If one is shut down, the team needs a second path. Ideally in different bring-4 modes. Cross-ref to tempo.md > Plan B Resilience.
- **Quality over quantity.** Three fragile win conditions are worse than two resilient ones.
- **Archetype expectations.** Weather teams: engine primary, non-weather attacker backup. Hyper offense: multiple independent threats. Trick Room: TR primary, fast mode backup. Goodstuffs: flexible pressure, adaptability is the win condition. Cross-ref to archetypes.md.
- **Dual-mode Pokemon tension.** A Pokemon in two win conditions across different modes adds flexibility but may be suboptimal in both. Cross-ref to speed-tiers.md > Section 2.

---

### 4. New file: reference/tempo.md

Lead pair evaluation and game-plan resilience heuristics. Scoped to team construction decisions, not piloting.

#### Section 1: Lead Pair Evaluation

Heuristics for assessing whether a team's lead options are strong. Each bring-4 mode implies a lead pair.

**What makes a strong lead pair:**

- **Complementary Turn 1 actions** -- the two Pokemon want to do different things that don't conflict. Good: Fake Out + Setup, Tailwind + Protect, spread attack + redirect. Bad: both want to set up, both use support moves with no offensive pressure. Heuristic: if removing either Pokemon from the lead makes Turn 1 significantly worse, the pair has strong Turn 1 synergy.
- **Threat projection** -- the lead pair should force a difficult choice. If the opponent can freely ignore one lead, the lead is passive. Cross-ref to synergies.md > Dual Offensive Pressure.
- **Flexibility under disruption** -- what happens if the opponent leads Fake Out into your setter or double-targets your sweeper? Strong leads have fallback options; brittle leads have one line.
- **Information hiding** -- ambiguous leads give Turn 1 mind game advantages. Matters more for goodstuffs/balance than dedicated archetype teams.

**Common lead archetypes** (lead-pair patterns, not team archetypes):

- **Fake Out + Attacker/Setter** -- safe default. Strong when the partner has an impactful Turn 1 move; weak otherwise.
- **Dual Offense** -- two attackers threatening immediate KOs. High pressure, weak to Intimidate and opposing Fake Out. Cross-ref to speed-tiers.md.
- **Redirect + Setup** -- strong setup guarantee, telegraphed. Weak to spread moves.
- **Speed Control + Attacker** -- setter uses Tailwind/TR, attacker Protects or attacks. Needs the setter to survive Turn 1.

#### Section 2: Plan B Resilience

Heuristics for whether the team was built with fallback options.

**Disruption scenarios to evaluate:**

- **Lead Pokemon KO'd Turn 1** -- does the team have a mode that doesn't depend on any single Pokemon surviving Turn 1? Cross-ref to win-conditions.md > Independence.
- **Speed control denied** -- Tailwind Taunted, TR Imprisoned, setter flinched. Does the team have secondary speed control or naturally fast Pokemon? Cross-ref to speed-tiers.md.
- **Weather/terrain overwritten** -- does the weather team have non-weather-dependent attackers? Cross-ref to win-conditions.md > Disruption Resilience.
- **Setup denied** -- Taunt, Encore, or KO prevents boosting. Does the team have a non-setup win condition? Cross-ref to win-conditions.md > Win Condition Sufficiency.

**Resilience heuristics:**

- **Mode independence** -- a resilient team's alternate modes don't share the same points of failure. If both Tailwind mode and offensive mode rely on the same Pokemon, losing it collapses both plans. Cross-ref to synergies.md.
- **Role redundancy as insurance** -- redundancy within a single bring-4 is usually wasteful (synergies.md anti-synergy). But the same role available across different modes is resilience. E.g., Fake Out on the primary lead AND on a slot 5-6 alternate.
- **Graceful degradation** -- the best teams don't need everything to go right. If a common disruption scenario leaves the team with zero path to winning, that's a construction flaw.

---

### 5. Updates to evaluating-vgc-viability/SKILL.md

Add the three new files to the reference file listing:

```
- reference/speed-tiers.md -- speed tier framework and investment heuristics
- reference/win-conditions.md -- win condition types, quality evaluation, sufficiency
- reference/tempo.md -- lead pair evaluation and game-plan resilience
```

---

### 6. Updates to building-vgc-teams/SKILL.md

#### Data Sources section

Add the three new files under the evaluating-vgc-viability optional block:

```
- reference/speed-tiers.md -- speed tier framework and investment heuristics
- reference/win-conditions.md -- win condition types, quality evaluation, sufficiency
- reference/tempo.md -- lead pair evaluation and game-plan resilience
```

#### Step 3 (Build Out, slots 3-4)

When evaluating candidates for the core-4, reference:
- speed-tiers.md to assess whether the candidate's speed tier fits the team's speed control plan
- win-conditions.md to check whether the candidate contributes to or enables a win condition

#### Step 6 (Team Analysis)

Add two new analysis sub-sections, gated behind evaluating-vgc-viability availability (same pattern as Pair Synergy Scan and Role Checklist):

- **Win Condition Assessment** -- uses win-conditions.md to identify the team's win conditions, evaluate their quality, and check sufficiency.
- **Lead & Resilience Check** -- uses tempo.md to evaluate lead pairs for each bring-4 mode and assess Plan B resilience. Follows the Bring-4 Mode Analysis since it evaluates leads and fallbacks for modes already identified.

---

### 7. Updates to evaluating-vgc-teams/SKILL.md

#### Data Sources section

Add the three new files under the evaluating-vgc-viability optional block (same as building-vgc-teams).

#### Step 4 (Analysis Layers)

Add two new layers, gated behind evaluating-vgc-viability:

- **Layer 7: Win Condition Assessment** -- identify win conditions, evaluate quality and sufficiency per win-conditions.md. Fixes: fragile win condition -> suggest moves/items that reduce dependency (Tier 1-2). Only one win condition -> suggest Pokemon swap adding a second path (Tier 5).
- **Layer 8: Lead & Resilience Check** -- evaluate lead pairs per tempo.md, assess Plan B resilience. Fixes: brittle lead pair -> suggest move with fallback options (Tier 1). No mode survives common disruption -> suggest slot swap adding resilience (Tier 5).

#### Step 3 (Summary Verdict)

Update the drill-down list to include the new layers (gated behind dependency check):

```
7. Win Condition Assessment (requires evaluating-vgc-viability)
8. Lead & Resilience Check (requires evaluating-vgc-viability)
```

---

## What Doesn't Change

- **reference/roles.md** -- stays as-is. speed-tiers.md cross-references the speed control section but roles.md itself doesn't need updates.
- **reference/archetypes.md** -- stays as-is. win-conditions.md and tempo.md cross-reference archetype expectations but archetypes.md doesn't need updates.
- **reference/items.md** -- stays as-is. No new item heuristics in this design.
- **checking-vgc-legality** -- no changes.
- **evaluating-vgc-meta** -- no changes.

## Cross-Reference Map

| Source file | References | Section referenced |
|---|---|---|
| synergies.md | speed-tiers.md | Shared weakness clustering severity |
| synergies.md | tempo.md | Lead Pair Evaluation (from Setup + Enabler, Tempo mismatch) |
| speed-tiers.md | roles.md | Speed control role definitions |
| speed-tiers.md | synergies.md | Speed Control + Slow Attacker pattern |
| speed-tiers.md | win-conditions.md | Dual-mode Pokemon evaluation |
| speed-tiers.md | tempo.md | Dual-mode lead selection |
| win-conditions.md | synergies.md | Setup + Enabler, Spread Move + Immunity |
| win-conditions.md | archetypes.md | Archetype-specific expectations |
| win-conditions.md | speed-tiers.md | Trick Room section, dual-mode tension |
| win-conditions.md | tempo.md | Plan B Resilience |
| tempo.md | synergies.md | Dual Offensive Pressure, mode independence |
| tempo.md | speed-tiers.md | Speed requirements for dual offense leads, speed control denial |
| tempo.md | win-conditions.md | Independence, Disruption Resilience, Sufficiency |
