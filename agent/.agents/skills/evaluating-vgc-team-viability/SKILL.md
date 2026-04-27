---
name: evaluating-vgc-team-viability
description: Use when an agent needs to evaluate the competitive viability of a VGC team across multiple heuristic dimensions and produce a strategy-weighted overall verdict.
---

# Evaluating VGC Team Viability

Evaluate the competitive viability of a Pokemon Champions VGC team by scoring it across 8 heuristic dimensions and synthesizing those scores into a strategy-weighted overall verdict.

This is a **resource skill** consumed by other agent skills. It does not parse teams, call deterministic tools, or interact with the user directly. The consuming skill provides the team data (Showdown paste, structured sets, or confirmed archetype intent).

## Reference Index

All heuristics are grounded in the 8 reference files under `references/`:

| Dimension | Reference | What It Evaluates |
|---|---|---|
| Archetype Coherence | `archetypes.md` | Whether the team executes a recognizable archetype and how well it fits that archetype's expected profile |
| Role Coverage | `roles.md` | Whether the team covers the functional roles expected in VGC |
| Pair Synergy | `synergies.md` | How well pairs of Pokemon work together on the field |
| Speed Profile | `speed-tiers.md` | Whether speed tiers, investments, and speed control align with the team's game plan |
| Item Optimization | `items.md` | Whether held items match roles, avoid conflicts, and capitalize on available options |
| Stat Efficiency | `stat-calculations.md` | Whether SP spreads, natures, and benchmarks are mathematically sound |
| Win Condition Robustness | `win-conditions.md` | Whether the team has enough reliable, independent paths to winning |
| Lead & Resilience | `tempo.md` | Whether lead pairs are strong and the team has fallback plans when disrupted |

## The 8 Heuristic Dimensions

For each dimension, the agent must:
1. Read the relevant reference file.
2. Answer the key diagnostic questions using the team's actual data.
3. Assign a score from 1 to 5 based on the rubric.
4. Provide a 1-sentence justification for the score.

### 1. Archetype Coherence (`archetypes.md`)

**What it evaluates:** Whether the team maps cleanly to a known archetype (Rain, Sun, Sand, Snow, Trick Room, Hyper Offense, Goodstuffs/Balance) and whether its composition matches that archetype's expected strengths and weaknesses.

**Key diagnostic questions:**
- Does the team contain the defining elements of any archetype in `archetypes.md`? (e.g., Drizzle + Swift Swim for Rain; TR setter + slow attackers for Trick Room)
- Does the team have the expected number of abusers, setters, and support for that archetype?
- Are there conflicting archetype signals that dilute the game plan? (e.g., both Tailwind and Trick Room with no mode separation)
- Does the team have answers to the archetype's listed weaknesses?

**Scoring rubric:**
- **5 (Optimal):** Clean archetype execution with all expected elements and no dilution.
- **4 (Strong):** Clear archetype with minor gaps that don't undermine the core plan.
- **3 (Acceptable):** Archetype is present but under-supported, or the team is Goodstuffs with decent flexibility.
- **2 (Weak):** Conflicting signals, missing critical archetype pieces, or an unsupported gimmick.
- **1 (Critical flaw):** No coherent archetype or strategy. The team lacks a unifying game plan.

**How to read the reference:**
- Quick: Read the archetype definition and "Champions Core Example" for the detected archetype.
- Deep: Read the full "Strategy," "Strengths," and "Weaknesses" sections, then cross-check against the team.

---

### 2. Role Coverage (`roles.md`)

**What it evaluates:** Whether the team covers the functional roles needed to execute VGC strategies effectively.

**Key diagnostic questions:**
- Which roles from `roles.md` does the team cover? (Speed control, Intimidate, Redirection, Fake Out, Setup, Spread damage, Weather/Terrain)
- Are there critical role gaps that the archetype expects? (e.g., Hyper Offense missing Fake Out; Rain missing a weather setter)
- Is there harmful role redundancy within a single bring-4 group? (e.g., two Fake Out users with nothing to enable)
- Does redundancy across modes provide insurance rather than waste?

**Scoring rubric:**
- **5 (Optimal):** All roles relevant to the archetype are covered with no harmful redundancy.
- **4 (Strong):** All critical roles covered; one minor gap that doesn't cost games.
- **3 (Acceptable):** One notable gap, but the team compensates elsewhere.
- **2 (Weak):** Missing a critical role the archetype needs, or harmful redundancy within core modes.
- **1 (Critical flaw):** Multiple critical roles missing; the team cannot execute basic VGC functions.

**How to read the reference:**
- Quick: Check the bulleted role lists under each section (Speed Control, Intimidate, Redirection, etc.).
- Deep: Read the full "Protect" and "Weather Setters" sections for nuanced flags.

---

### 3. Pair Synergy (`synergies.md`)

**What it evaluates:** How well pairs of Pokemon on the team work together offensively, defensively, and as mode pairs.

**Key diagnostic questions:**
- For each of the 15 possible pairs, how many synergy patterns do they match? (Offensive Combos, Defensive Pivot Pairs, Mode Pairs)
- Which pairs are the top 2-3 by layer count? Are they in the core-4?
- Are there anti-synergy flags? (Shared Weakness Clustering, Role Redundancy, Strategy Conflict, Tempo Mismatch, Friendly Fire)
- Does any anti-synergy appear within a core bring-4 group?

**Scoring rubric:**
- **5 (Optimal):** Multiple pairs with 3+ cross-category synergy layers. No red-flag anti-synergies in core modes.
- **4 (Strong):** Clear synergy engine (2-3 layers) in core pairs. Minor anti-synergy that's manageable.
- **3 (Acceptable):** Some synergy exists but no strong engine. One yellow-flag anti-synergy.
- **2 (Weak):** Most pairs are 1-pattern or non-synergistic. A red-flag anti-synergy in a core mode.
- **1 (Critical flaw):** Core pairs have severe anti-synergy (friendly fire, strategy conflict, 3+ shared weaknesses) that makes them unfieldable together.

**How to read the reference:**
- Quick: Scan the "Evaluating Layered Synergy" section for layer count heuristics, then jump to "Anti-Synergy Evaluation" for red flags.
- Deep: Read each pattern category in full and map the team's pairs against them systematically.

---

### 4. Speed Profile (`speed-tiers.md`)

**What it evaluates:** Whether the team's speed tiers, investments, and speed control options align with its game plan.

**Key diagnostic questions:**
- Which speed tier does each attacker occupy? (Blazing, Fast, Mid, Slow, Trick Room)
- Does the team's speed control mode match its attackers? (Tailwind with mid-tier attackers; Trick Room with TR-tier attackers)
- Are there speed tier conflicts within a bring-4? (e.g., blazing-tier Pokemon on a Trick Room team with no fast mode)
- Is Speed investment efficient? (Mid-tier Pokemon over-investing to chase fast-tier; TR attackers not at minimum speed)
- Does the team have a backup speed control option or naturally fast attackers if primary speed control is denied?

**Scoring rubric:**
- **5 (Optimal):** Speed tiers perfectly match the game plan. Efficient investment. Backup speed options exist.
- **4 (Strong):** Good alignment with minor inefficiencies (e.g., one Pokemon with slightly wasted Speed SPs).
- **3 (Acceptable):** Functional but with one notable conflict or missing backup.
- **2 (Weak):** Significant speed tier conflicts within core modes. Over-investment or under-investment on key Pokemon.
- **1 (Critical flaw):** Core attackers cannot function under the team's speed control, or the team has no speed control and no naturally fast threats.

**How to read the reference:**
- Quick: Read the tier definitions and "Speed Investment Heuristics" section.
- Deep: Read "Speed Control Interaction" for team composition heuristics specific to Tailwind, Trick Room, and dual-mode teams.

---

### 5. Item Optimization (`items.md`)

**What it evaluates:** Whether held items match roles, avoid conflicts, and capitalize on available options.

**Key diagnostic questions:**
- Are there duplicate items? (VGC rules prohibit this)
- Does each item fit the Pokemon's role? (e.g., Focus Sash on fragile leads, Sitrus Berry on bulky pivots, Mental Herb on TR setters)
- Are Mega Stones used correctly? (Only one per team, no duplicate Mega Stones, alternate Mega addresses a real matchup)
- Are resistance berries used against relevant threats? (e.g., Shuca Berry surviving Earthquake from common attackers)
- Is there a missed opportunity? (e.g., a Pokemon with a `mega` field not holding its Mega Stone when the team has no other Mega)

**Scoring rubric:**
- **5 (Optimal):** Every item is purposeful, role-matched, and maximizes the team's options. No duplicates, no missed opportunities.
- **4 (Strong):** One minor item choice that's slightly suboptimal but not impactful.
- **3 (Acceptable):** Functional items, one notable mismatch or missed opportunity.
- **2 (Weak):** Duplicate items, critical role mismatches (e.g., no Mental Herb on a Taunt-vulnerable TR setter), or a wasted Mega slot.
- **1 (Critical flaw):** Multiple item conflicts, illegal duplicates, or items that actively harm the game plan.

**How to read the reference:**
- Quick: Read "General Heuristics" and scan the category summaries (Offensive, Speed, Defensive, Utility, Mega Stones).
- Deep: Read the full "When to use what" bullets under each category for role-specific guidance.

---

### 6. Stat Efficiency (`stat-calculations.md`)

**What it evaluates:** Whether SP spreads, natures, and benchmarks are mathematically sound and serve the team's game plan.

**Key diagnostic questions:**
- Does each Pokemon have a nature that matches its role? (e.g., Adamant physical attacker, Modest special attacker, Brave TR attacker)
- Are SP investments achieving concrete benchmarks? (Speed targets, survival thresholds, KO thresholds)
- Are there wasted stats? (e.g., Speed investment on a TR attacker that wants minimum speed; offensive investment on a pure support)
- Can the team survive key meta attacks? (Calculate using the Survive-a-Hit Procedure)
- Can the team achieve needed KOs? (Calculate using the OHKO/2HKO Threshold Procedures)

**Scoring rubric:**
- **5 (Optimal):** Every spread is benchmark-driven. No wasted SPs. Key survival and KO thresholds met.
- **4 (Strong):** Good spreads with minor inefficiency (e.g., a few unneeded SPs in a non-critical stat).
- **3 (Acceptable):** Generic spreads (e.g., 32/32/0/0/0/2) that function but miss key benchmarks.
- **2 (Weak):** Nature conflicts with role, significant wasted investment, or failure to hit needed survival/KO thresholds.
- **1 (Critical flaw):** Multiple nature/SP conflicts that cripple key Pokemon (e.g., max Speed on a TR sweeper, no bulk on a lead that needs to survive).

**How to read the reference:**
- Quick: Read "Benchmark-First SP Spread Procedure" for the evaluation framework, then scan worked examples.
- Deep: Read full Sections 1–5 (Stat Calculation, Speed Thresholds, Damage Calculation, Bulk Thresholds, Offensive Thresholds) to calculate exact benchmarks for the team.

---

### 7. Win Condition Robustness (`win-conditions.md`)

**What it evaluates:** Whether the team has enough reliable, independent paths to winning.

**Key diagnostic questions:**
- What win condition types does the team have? (Setup Sweeper, Spread Pressure, Weather/Terrain Engine, Trick Room Flip, Attrition, Single-Target Burst)
- How many independent win conditions exist? (Minimum expectation: 2)
- What is the dependency count for each win condition? (Lower = more reliable)
- How resilient is each win condition to common disruption? (Intimidate, Fake Out, Taunt, opposing weather)
- Are win conditions distributed across different bring-4 modes, or do they all rely on the same critical Pokemon?

**Scoring rubric:**
- **5 (Optimal):** 2+ independent, low-dependency win conditions in different modes. No shared critical failure points.
- **4 (Strong):** 2 win conditions, one slightly dependent but protected.
- **3 (Acceptable):** 2 win conditions that share a failure point, or 1 strong + 1 weak backup.
- **2 (Weak):** Only 1 viable win condition, or 2 win conditions that both fail to the same common disruption.
- **1 (Critical flaw):** No coherent win condition. The team cannot describe how it plans to close out games.

**How to read the reference:**
- Quick: Read "Win Condition Types" and "Win Condition Sufficiency."
- Deep: Read "Evaluating Win Condition Quality" for dependency count, disruption resilience, turn count, and independence, then score each identified win condition.

---

### 8. Lead & Resilience (`tempo.md`)

**What it evaluates:** Whether lead pairs are strong and the team has fallback plans when disrupted.

**Key diagnostic questions:**
- For each bring-4 mode, what is the natural lead pair? Does it match a strong pattern from `tempo.md`? (Fake Out + Attacker/Setter, Dual Offense, Redirect + Setup, Speed Control + Attacker)
- Do the leads have complementary Turn 1 actions? Is either Pokemon dead weight on Turn 1?
- Do the leads project threats, or can the opponent safely ignore one?
- What happens if the primary plan is disrupted? (Lead KO'd, speed control denied, weather overwritten, setup denied)
- Does the team have alternate modes that don't share the same critical Pokemon?

**Scoring rubric:**
- **5 (Optimal):** Strong leads with complementary actions and multiple fallback lines. Alternate modes are independent.
- **4 (Strong):** Good leads with one minor brittleness (e.g., one lead pattern that's slightly telegraphed but hard to punish).
- **3 (Acceptable):** Functional leads, but disruption exposes a real weakness with limited backup.
- **2 (Weak):** Brittle leads with one clear line and no fallback. Disruption collapses the game plan.
- **1 (Critical flaw):** No viable lead pair. The team cannot execute a productive Turn 1 in any mode.

**How to read the reference:**
- Quick: Read "Lead Pair Evaluation" for the strong/weak lead heuristics and common patterns.
- Deep: Read "Plan B Resilience" and evaluate the team against each disruption scenario.

## Strategy-Weighted Overall Viability

After scoring all 8 dimensions, synthesize an overall verdict through the following steps:

### Step 1: Detect or Confirm Archetype
Use `archetypes.md` to identify the team's archetype. If the user has stated an intent, use that. If ambiguous, label it as dual-mode or Goodstuffs and note the primary signals.

### Step 2: Score All 8 Dimensions
Produce a table with each dimension, its 1-5 score, and a 1-sentence justification.

### Step 3: Dynamically Weight Relevance
Reason about which dimensions matter most for the detected archetype. The agent must apply contextual judgment, not fixed multipliers. Guidelines:

- **Trick Room:** `Speed Profile` is reinterpreted — low speed on attackers is desirable, but the setter's survivability matters more. `Win Condition Robustness`, `Lead & Resilience`, and `Pair Synergy` are weighted higher. A TR team with a strong speed profile (minimum speeds, no wasted SPs) scores well on Speed Profile even though its absolute speeds are low.
- **Hyper Offense:** `Pair Synergy` and `Win Condition Robustness` dominate. `Role Coverage` for defensive roles (Intimidate, Redirection) is less critical unless the team lacks enablers for its sweepers.
- **Weather (Rain/Sun/Sand/Snow):** `Role Coverage` (weather setter presence), `Win Condition Robustness`, and `Archetype Coherence` dominate. `Lead & Resilience` matters for weather-overwrite scenarios.
- **Goodstuffs/Balance:** No dimension is discounted. Well-roundedness is the goal. The lowest-scoring dimension is often the limiting factor.
- **Dual-Mode (e.g., Tailwind + Trick Room):** `Speed Profile` and `Lead & Resilience` are critical because mode separation is the core challenge. `Role Coverage` matters for ensuring both modes are functional.

If a dimension is irrelevant to the archetype (e.g., Weather/Terrain role coverage on a non-weather team), it should not penalize the overall score. Score it as "N/A" or neutral and exclude it from the synthesis.

### Step 4: Synthesize Overall Score
Produce an overall score from 1.0 to 5.0. This is a qualitative synthesis, not a weighted average. The agent should reason as follows:

- A team with one **Critical flaw (1)** in any critical dimension is unlikely to score above 2.0 overall, regardless of other scores.
- A team with multiple **Weak (2)** scores in critical dimensions for its archetype is unlikely to score above 2.5.
- A team with all **Acceptable (3)** scores and one **Strong (4)** in a key dimension is a 3.0–3.5 team.
- A team with mostly **Strong (4)** and one **Optimal (5)** is a 4.0–4.5 team.
- A team scoring **Optimal (5)** across all critical dimensions is a 4.5–5.0 team.

### Step 5: Tiered Verdict
Map the overall score to a viability tier:

| Overall Score | Tier | Verdict |
|---|---|---|
| 4.5 – 5.0 | Tournament-Ready | The team is structurally sound and competitively viable with minimal tuning. |
| 3.5 – 4.4 | Viable with Minor Tuning | The team works but has 1-2 areas that could be sharpened. |
| 2.5 – 3.4 | Structural Issues | The team has identifiable flaws that will cost games against competent opponents. |
| 1.5 – 2.4 | Major Flaws | The team requires significant restructuring to be competitive. |
| 1.0 – 1.4 | Critical Flaws | The team is likely unviable as-is and needs fundamental redesign. |

## Cross-Reference Map

When evaluating a dimension, read these references together for deeper insight:

| Primary Dimension | Read Together With | Why |
|---|---|---|
| Pair Synergy | `roles.md` | Role redundancy is a synergy anti-pattern; check roles first to identify it |
| Lead & Resilience | `speed-tiers.md` | Speed control interaction determines whether leads can execute their plan |
| Win Condition Robustness | `archetypes.md` | Archetype expectations define how many win conditions and what types are needed |
| Stat Efficiency | `speed-tiers.md` + `items.md` | Speed benchmarks and item modifiers (Choice Scarf, Mega Stones) affect stat targets |
| Item Optimization | `roles.md` | Items must match roles (e.g., Mental Herb on Taunt-vulnerable supports) |
| Speed Profile | `synergies.md` | Speed Control + Slow Attacker is a synergy pattern; tempo mismatches are anti-synergies |
| Role Coverage | `win-conditions.md` | Roles enable win conditions; missing Fake Out or redirection can collapse a setup sweeper plan |
| Archetype Coherence | `tempo.md` | Archetypes imply lead patterns (e.g., TR teams lead setter + slow attacker) |

## Example Evaluation Output

Below is a fictional example showing the expected format. The agent should produce output at this level of detail when reporting a full evaluation.

---

**Detected Archetype:** Tailwind Hyper Offense

**Dimension Scores:**

| Dimension | Score | Justification |
|---|---|---|
| Archetype Coherence | 4 | Clear Tailwind HO with Whimsicott + 3 mid-tier attackers. No conflicting modes. |
| Role Coverage | 3 | Has Tailwind, Fake Out, and Setup. Missing Intimidate and Redirection. |
| Pair Synergy | 4 | Whimsicott + Feraligatr is a strong Fake Out + Setup pair with 3 synergy layers. One minor anti-synergy: two mid-tier attackers share an Ice weakness. |
| Speed Profile | 4 | Mid-tier attackers benefit well from Tailwind. One Pokemon has 8 wasted Speed SPs that could go to bulk. |
| Item Optimization | 3 | Good item-role matching, but duplicate Sitrus Berry on two Pokemon. No resistance berries despite Ice weakness. |
| Stat Efficiency | 3 | Generic 32/32 spreads. Feraligatr misses a key survival benchmark vs. max SpA Gardevoir. |
| Win Condition Robustness | 3 | Two win conditions: Feraligatr setup sweep and spread pressure from Garchomp. Both depend on Whimsicott surviving Turn 1. |
| Lead & Resilience | 2 | Strong Fake Out + Setup lead, but no backup if Whimsicott is KO'd. No alternate mode. |

**Dynamic Weighting:**
- For Tailwind Hyper Offense, `Pair Synergy`, `Win Condition Robustness`, and `Speed Profile` are critical. `Role Coverage` for defensive roles is less important, but the missing Intimidate is still a gap.
- The `Lead & Resilience` weakness is severe for this archetype because HO needs to execute Turn 1 reliably. A single KO on Whimsicott collapses both win conditions.
- The `Item Optimization` duplicate is fixable but matters because the team needs diverse survival tools.

**Overall Score:** 3.2

**Verdict:** Structural Issues

The team has a clear game plan and strong synergy in its core pair, but it is brittle. Whimsicott is a single point of failure for both win conditions, and the lack of an alternate mode or backup speed control means a well-prepared opponent can shut it down. Fixing the duplicate item, reallocating Speed SPs, and adding a secondary mode (e.g., a Choice Scarf revenge killer or a second Tailwind user) would raise this to a Viable with Minor Tuning team.

**Top Strengths:**
- Whimsicott + Feraligatr is a high-synergy lead pair with Fake Out + Dragon Dance enablement.
- Speed tiers align well with Tailwind — all three attackers jump to effectively blazing under Tailwind.

**Top Issues:**
- Whimsicott is a concentration risk. If it's KO'd Turn 1, both win conditions are offline.
- Duplicate Sitrus Berry wastes an item slot that could provide a resistance berry or utility item.

---

## Usage Instructions for Agents

### When to Run Full Evaluation vs. Targeted Subset

- **Full 8-dimension evaluation:** Use when the user asks for a general viability check, when a team is newly built, or when multiple layers are suspected to have issues.
- **Targeted subset:** Use when the user asks about a specific concern (e.g., "Is my speed profile okay?" or "Do I have enough win conditions?"). In that case, read only the relevant reference file and its cross-references.

### How to Report Results

1. **Scores first.** Present the 8-dimension score table upfront.
2. **Synthesis second.** Explain the dynamic weighting reasoning and the overall score.
3. **Verdict third.** State the tiered verdict in one sentence.
4. **Actionable fixes last.** If the score is below 4.0, provide 2-4 concrete suggestions ranked by impact. Tie each suggestion to a specific dimension and reference file.

### Constraints

- Do not invent anti-patterns or viability flags. All assessments must be grounded in the 8 reference files.
- This skill does not validate legality. The consuming skill must run `check-vgc-team-legality` before invoking this evaluation.
- This skill does not fetch meta data. The consuming skill may fetch Pikalytics separately if meta context is needed.
- All damage, speed, and survival calculations should use `stat-calculations.md`. Default to heuristic reasoning; use math only when precision is needed to distinguish between close options.
