---
name: evaluating-vgc-team-viability
description: Use when an agent needs to evaluate the competitive viability of a VGC team across multiple heuristic dimensions and produce a strategy-weighted overall verdict.
---

# Evaluating VGC Team Viability

Evaluate the competitive viability of a Pokemon Champions VGC team by scoring it across **13 heuristic dimensions** and synthesizing those scores into a strategy-weighted overall verdict.

This is a **resource skill** consumed by other agent skills. It does not parse teams, call deterministic tools, or interact with the user directly. The consuming skill provides the team data (Showdown paste, structured sets, or confirmed archetype intent).

## Champions Rules Reminder

This skill targets **Pokemon Champions**, which differs from mainline Pokemon:

- **Stat Points (SPs):** Replace EVs. 1 SP = 8 EVs. Max 32 SPs per stat, 66 total.
- **IVs:** Fixed to 31 for all Pokemon. Never reference 0 IVs or IV manipulation.
- **Deterministic damage:** Damage calculations produce one exact number — no random rolls.
- **Limited item pool:** No Choice Band, Choice Specs, Life Orb, Assault Vest, Safety Goggles, or many other mainline staples. Type-boosting items (1.2x) and Focus Sash carry more weight.
- **Level 50:** All calculations use Level 50.

All outputs must use **SP terminology exclusively**. Never use EVs, IVs, or legacy stat notation.

## Reference Index

All heuristics are grounded in the reference files under `references/` and the static JSON assets:

| Dimension | Reference | What It Evaluates |
|---|---|---|
| Stat Efficiency | `stat-calculations.md` | Whether SP spreads, natures, and benchmarks are mathematically sound |
| Role Coverage | `roles.md` | Whether the team covers the functional roles expected in VGC |
| Offensive Balance | `synergies.md` + `roles.md` | Whether the team threatens both physical and special defensive profiles |
| Archetype Coherence | `archetypes.md` | Whether the team executes a recognizable archetype and how well it fits that archetype's expected profile |
| Speed Profile | `speed-tiers.md` | Whether speed tiers, investments, and speed control align with the team's game plan |
| Field Condition Management | `tempo.md` + `roles.md` + `win-conditions.md` | Whether weather/terrain setters are reliable, have backup, and whether non-weather teams can answer opposing conditions |
| Item Optimization | `items.md` | Whether held items match roles, avoid conflicts, and capitalize on available options |
| Defensive Cohesion | `synergies.md` + `assets/pokemon.json` + `assets/type-chart.json` + `assets/abilities.json` | Whether the team-wide and bring-4 type charts are solid, with no exploitable weakness clusters |
| Pair Synergy | `synergies.md` | How well pairs of Pokemon work together on the field |
| Move Coverage & Optimization | `synergies.md` + `roles.md` + `assets/moves.json` | Whether movesets are optimal, coverage is diverse, and no slots are wasted |
| Win Condition Robustness | `win-conditions.md` | Whether the team has enough reliable, independent paths to winning |
| Lead & Resilience | `tempo.md` | Whether lead pairs are strong and the team has fallback plans when disrupted |
| Meta Matchup Robustness | `win-conditions.md` + external meta data | How well the team handles current top meta threats |

## The 13 Heuristic Dimensions

For each dimension, the agent must:
1. Read the relevant reference file.
2. Answer the key diagnostic questions using the team's actual data.
3. Assign a score from 1 to 5 based on the rubric.
4. Provide a 1-sentence justification for the score.

---

### 1. Stat Efficiency (`stat-calculations.md`)

**What it evaluates:** Whether SP spreads, natures, and benchmarks are mathematically sound and serve the team's game plan.

**Key diagnostic questions:**
- Does each Pokemon have a nature that matches its role? (e.g., Adamant physical attacker, Modest special attacker, Brave TR attacker)
- **Nature/SP consistency gate:** Does any Pokemon have a nature that directly contradicts its SP investment? Examples: a Speed-hindering nature (Brave, Quiet, Relaxed, Sassy) with >0 Speed SPs; a Speed-boosting nature (Jolly, Timid, Naive, Hasty) with 0 Speed SPs; an Atk-hindering nature (Modest, Timid, Calm, Bold) with heavy Atk SP investment. Any such conflict is an immediate objective flaw.
- **Trick Room Speed gate:** Does any Trick Room attacker (base Speed ≤45 with a Speed-hindering nature) have >0 Speed SPs? In Pokemon Champions, all IVs are fixed to 31. Adding Speed SPs to a TR attacker makes it slower under Trick Room with zero upside against other TR attackers at 0 Speed SPs + hindering nature. Speed ties against same-base-speed opponents are not resolved by adding SPs. Any Speed SPs on a TR attacker is an immediate objective flaw.
- Are SP investments achieving concrete benchmarks? (Speed targets, survival thresholds, KO thresholds)
- Are there wasted stats? (e.g., Speed investment on a TR attacker that wants minimum speed; offensive investment on a pure support). A **pure support** is a Pokemon with 0 offensive SPs, no setup moves, and a primary role of status/move support (e.g., Intimidate, Fake Out, Tailwind, redirection). Do **not** flag low offensive investment on a setup sweeper or a Pokemon holding a type-boosting item as wasted stats.
- Can the team survive key meta attacks? (Calculate using the Survive-a-Hit Procedure)
- Can the team achieve needed KOs? (Calculate using the OHKO/2HKO Threshold Procedures)
- Does any Pokemon intentionally sacrifice a benchmark for a higher-priority one? (e.g., a mixed attacker splitting Atk/SpA, sacrificing a survival benchmark to hit a decisive speed tier, or a bulky support investing 0 in offense to hit defensive thresholds). A trade-off is valid if it enables a higher-priority benchmark. Cross-ref `stat-calculations.md` > Acceptable Benchmark Trade-Offs.

**Scoring rubric:**
- **5 (Optimal):** Every spread is benchmark-driven. No wasted SPs. Key survival and KO thresholds met. Valid trade-offs are explicitly justified.
- **4 (Strong):** Good spreads with minor inefficiency (e.g., a few unneeded SPs in a non-critical stat).
- **3 (Acceptable):** Generic spreads (e.g., 32/32 bulk) that function but miss key benchmarks.
- **2 (Weak):** Nature conflicts with role, significant wasted investment, or failure to hit needed survival/KO thresholds.
- **1 (Critical flaw):** Multiple nature/SP conflicts that cripple key Pokemon (e.g., max Speed on a TR sweeper, no bulk on a lead that needs to survive).

**How to read the reference:**
- Quick: Read "Benchmark-First SP Spread Procedure" for the evaluation framework, then scan worked examples.
- Deep: Read full Sections 1–5 (Stat Calculation, Speed Thresholds, Damage Calculation, Bulk Thresholds, Offensive Thresholds) to calculate exact benchmarks for the team.

---

### 2. Role Coverage (`roles.md`)

**What it evaluates:** Whether the team covers the functional roles needed to execute VGC strategies effectively, **within viable bring-4 modes**.

**Key diagnostic questions:**
- Which roles from `roles.md` does the team cover? (Speed control, Intimidate, Redirection, Fake Out, Setup, Spread damage, Weather/Terrain, Status/Disruption, Setup Denial, Pivoting, Field Condition Reset, Screens, Sustain/Recovery)
- Are there critical role gaps that the archetype expects? (e.g., Hyper Offense missing Fake Out; Rain missing a weather setter)
- Is there harmful role redundancy within a single bring-4 group? (e.g., two Fake Out users with nothing to enable)
- Does redundancy across modes provide insurance rather than waste?
- **Setup Denial check:** Does the team have at least one tool to stop opposing setup sweepers (Haze, Taunt, Encore, phazing)? Bulky Offense and Goodstuffs teams are expected to have this; Hyper Offense can sometimes compensate by outspeeding before setup occurs.

**Redundancy is harmful ONLY when all three apply:**
1. Both redundant members appear in the **same validated bring-4 group**.
2. The team is **missing a must-have role** that one of the redundant slots could have provided (per `roles.md` > Archetype-Specific Role Priorities).
3. The redundant members offer **essentially the same contribution** — neither has secondary utility the other lacks.

**Redundancy across modes is insurance, not waste.** A Fake Out user in the fast mode and a different Fake Out user in the Trick Room mode provides resilience. Do not penalize this.

**Scoring rubric:**
- **5 (Optimal):** All roles relevant to the archetype are covered with no harmful redundancy.
- **4 (Strong):** All critical roles covered; one minor gap that doesn't cost games.
- **3 (Acceptable):** One notable gap, but the team compensates elsewhere.
- **2 (Weak):** Missing a critical role the archetype needs, or harmful redundancy within core modes.
- **1 (Critical flaw):** Multiple critical roles missing; the team cannot execute basic VGC functions.

**How to read the reference:**
- Quick: Check each role category and query `assets/moves.json` / `assets/abilities.json` for availability on the team's Pokemon.
- Deep: Read the full "Protect," "Weather Setters," "Screens," and "Sustain / Recovery" sections for nuanced flags.

---

### 3. Offensive Balance (`synergies.md` + `roles.md`)

**What it evaluates:** Whether the team has a healthy physical/special offensive split and can threaten both defensive profiles.

**Key diagnostic questions:**
- How many primary physical attackers vs. special attackers are in the team? A Pokemon counts as a **primary physical attacker** if it has ≥16 Atk SPs, an Atk-boosting nature, a physical type-boosting item, or a physical setup move (Swords Dance, Dragon Dance). A **primary special attacker** is defined analogously (≥16 SpA SPs, SpA-boosting nature, special type-boosting item, or special setup move). Support Pokemon with 0 offensive SPs and no setup moves do not count toward the physical/special split.
- What happens if the opponent leads Intimidate + a physical wall?
- What happens if the opponent leads Snarl + a special wall?
- Is there at least one strong physical threat and one strong special threat in viable bring-4 modes?
- Are there mixed attackers that can shift damage profile mid-game?

**Scoring rubric:**
- **5 (Optimal):** Balanced mix (e.g., 2 physical, 2 special, or flexible mixed attackers). Team threatens both defensive profiles reliably.
- **4 (Strong):** Slight imbalance (e.g., 3 physical, 1 special) but mixed coverage exists.
- **3 (Acceptable):** Noticeable lean (e.g., 4 physical, 1 special) but at least one viable special threat.
- **2 (Weak):** Severe imbalance (e.g., 5+ physical, 0 special). Opponent can hard-counter with Intimidate + physical bulk.
- **1 (Critical flaw):** Entirely one-sided offense. No physical or no special threat exists in any bring-4.

**How to read the reference:**
- Quick: Count physical vs. special attackers. Check `assets/moves.json` for each Pokemon's move categories.
- Deep: Evaluate whether the team's combined coverage hits both physical walls (high Def) and special walls (high SpD). Cross-ref `synergies.md` > Dual Offensive Pressure.

---

### 4. Archetype Coherence (`archetypes.md`)

**What it evaluates:** Whether the team maps cleanly to a known archetype (Rain, Sun, Sand, Snow, Trick Room, Hyper Offense, Tailwind Hyper Offense, Terrain-based, Bulky Offense, Goodstuffs/Balance) and whether its composition matches that archetype's expected strengths and weaknesses.

**Key diagnostic questions:**
- Does the team contain the defining elements of any archetype in `archetypes.md`? (e.g., Drizzle + Swift Swim for Rain; TR setter + slow attackers for Trick Room)
- Does the team have the expected number of abusers, setters, and support for that archetype?
- Are there conflicting archetype signals that dilute the game plan? (e.g., both Tailwind and Trick Room with no mode separation)
- Does the team have answers to the archetype's listed weaknesses?

**Scoring rubric:**
- **5 (Optimal):** Clean archetype execution with all expected elements and no dilution.
- **4 (Strong):** Clear archetype with minor gaps that don't undermine the core plan.
- **3 (Acceptable):** Archetype is present but under-supported, or the team is Goodstuffs/Balance with decent flexibility. Goodstuffs teams score here when they cover core roles, have multiple independent win conditions, and threaten diverse defensive profiles — even without a single gimmick.
- **2 (Weak):** Conflicting signals, missing critical archetype pieces, or an unsupported gimmick.
- **1 (Critical flaw):** No coherent archetype or strategy. The team lacks a unifying game plan AND cannot execute basic VGC functions or threaten common defensive profiles.

**How to read the reference:**
- Quick: Read the archetype definition and scoring anchors.
- Deep: Read the full "Strategy," "Strengths," and "Weaknesses" sections, then cross-check against the team. Pay special attention to Dual-Mode and Goodstuffs scoring notes.

---

### 5. Speed Profile (`speed-tiers.md`)

**What it evaluates:** Whether the team's speed tiers, investments, and speed control options align with its game plan.

**Key diagnostic questions:**
- Which speed tier does each attacker occupy? (Blazing, Fast, Mid, Slow, Trick Room)
- Does the team's speed control mode match its attackers? (Tailwind with mid-tier attackers; Trick Room with TR-tier attackers)
- Are there speed tier conflicts within a bring-4? (e.g., blazing-tier Pokemon on a Trick Room team with no fast mode)
- Is Speed investment efficient? (Mid-tier Pokemon over-investing to chase fast-tier; TR attackers not at minimum speed)
- Does the team have a backup speed control option or naturally fast attackers (see `speed-tiers.md` > Definition of "Naturally Fast") if primary speed control is denied?
- Does the team have priority move coverage as a reactive backup?
- **Speed Control Redundancy:** If the primary speed control is denied (setter KO'd, move Taunted/Imprisoned), can the team still manage turn order? Count secondary setters, priority users, naturally fast threats (including Choice Scarf users with ≥16 offensive SPs), and reactive speed drops (Icy Wind, Electroweb, Thunder Wave) as redundancy layers.
- **Speed tie audit:** Do any two core Pokemon have the identical effective Speed stat? In VGC doubles, identical Speed creates random move order. If the planned sequence requires a specific order (e.g., Fake Out before Dragon Dance, Tailwind before the attacker moves), an unintentional speed tie is a structural flaw. Speed ties are acceptable only when move order does not matter.
  - *Worked example:* A Jolly 16 Spe SPs Feraligatr (base 78) and a Jolly 16 Spe SPs Incineroar (base 60) do **not** tie — their base stats differ. However, two Jolly 32 Spe SPs Greninja (base 122) in the same team would tie at identical Speed. If one must Taunt before the other sets up, the tie introduces a 50% chance of failure.

**Scoring rubric:**
- **5 (Optimal):** Speed tiers perfectly match the game plan. Efficient investment. Backup speed options exist (secondary speed control or priority).
- **4 (Strong):** Good alignment with minor inefficiencies (e.g., one Pokemon with slightly wasted Speed SPs).
- **3 (Acceptable):** Functional but with one notable conflict or missing backup.
- **2 (Weak):** Significant speed tier conflicts within core modes. Over-investment or under-investment on key Pokemon.
- **1 (Critical flaw):** Core attackers cannot function under the team's speed control, or the team has no speed control and no naturally fast threats (see `speed-tiers.md` > Definition of "Naturally Fast").

**Trick Room Speed Profile Anchors:**
For Trick Room teams, low absolute speed is desirable, not a flaw. Score Speed Profile using these adjusted anchors:
- **5 (Optimal for TR):** All TR attackers have 0 Speed SPs + a Speed-hindering nature (Brave, Quiet, Relaxed, or Sassy). The TR setter's survivability is benchmarked. Speed-agnostic supports may appear in both fast and TR modes without penalty. No fast attackers are shoehorned into the TR bring-4.
- **1 (Critical flaw for TR):** TR attackers have Speed SPs or non-hindering natures; fast-tier attackers are forced into the TR mode without a speed-agnostic role; or the team lacks a TR setter entirely.

**How to read the reference:**
- Quick: Read the tier definitions and "Speed Investment Heuristics" section.
- Deep: Read "Speed Control Interaction" and "Priority Moves as Speed Control Backup" for team composition heuristics specific to Tailwind, Trick Room, dual-mode teams, and no-speed-control teams.

---

### 6. Field Condition Management (`tempo.md` + `roles.md` + `win-conditions.md`)

**What it evaluates:** Whether the team can reliably establish, maintain, and recover weather or terrain when running a weather/terrain archetype; and whether non-weather teams have adequate answers to opposing field conditions.

**Key diagnostic questions:**
- Does the team have a weather/terrain setter? Is it ability-based (passive) or move-based (active)?
- Can the setter survive Turn 1 to establish the field condition? (Focus Sash, bulk, Mental Herb, redirection)
- Does the team have a backup plan if the field condition is overwritten by the opponent? (Second setter, non-condition attackers, Field Condition Reset)
- Can the team function for 5+ turns if the field condition expires naturally?
- For non-weather teams: does the team have a way to overwrite or punish common opposing weather/terrain?
- Does the team have attackers that function outside the field condition, or are all attackers dependent on it?

**Scoring Rubric — Weather/Terrain Teams:**
- **5 (Optimal):** Reliable setter with protection, backup re-establishment, and non-condition attackers.
- **4 (Strong):** One minor gap (e.g., setter slightly fragile but has Focus Sash).
- **3 (Acceptable):** Functional but setter is a single point of failure, or all attackers depend on the condition with no backup.
- **2 (Weak):** Setter cannot reliably go up, or the team collapses when the condition is overwritten.
- **1 (Critical flaw):** Weather/terrain team with no setter.

**Scoring Rubric — Non-Weather Teams:**
- **5 (Optimal):** Answers to all common opposing conditions (overwrite capability or strong individual Pokemon that function regardless).
- **4 (Strong):** One minor gap (lacks overwrite but has strong individual Pokemon).
- **3 (Acceptable):** Functional but no specific answers to opposing conditions; no members are hard-countered.
- **2 (Weak):** 1–2 members are hard-countered by common opposing conditions with no answer.
- **1 (Critical flaw):** 3+ members are hard-countered by common opposing conditions with no answer.

Score **N/A** for Field Condition Management only if the archetype has no weather/terrain interaction AND no members are hard-countered by common conditions. When scored N/A, exclude this dimension from the overall synthesis in Step 4.

**How to read the reference:**
- Quick: Check `tempo.md` > Plan B Resilience > Weather/Terrain Overwritten and `roles.md` > Field Condition Reset.
- Deep: Evaluate each viable bring-4 against the 5-turn duration, overwrite scenarios, and fallback attackers. Cross-ref `win-conditions.md` > Weather/Terrain Engine for dependency analysis.

---

### 7. Item Optimization (`items.md`)

**What it evaluates:** Whether held items match roles, avoid conflicts, and capitalize on available options.

**Key diagnostic questions:**
- Are there duplicate items? (VGC rules prohibit this)
- Does each item fit the Pokemon's role? (e.g., Focus Sash on fragile leads, Sitrus Berry on bulky pivots, Mental Herb on TR setters)
- Are Mega Stones used correctly? (No duplicate Mega Stones; multiple Mega Stones on the team of 6 are neutral if no validated bring-4 contains both holders; alternate Mega addresses a real matchup)
- Are resistance berries used against relevant threats? (e.g., Shuca Berry surviving Earthquake from common attackers)
- Is each resistance berry actually needed? If the Pokemon survives the relevant super-effective attack at its current bulk without the berry, the berry is a missed opportunity — score it as a suboptimal item choice rather than a strength.
  - *Worked example:* A Garchomp with 32 HP SPs / 0 Def SPs takes ~45% from an unboosted Jolly Garchomp Earthquake. A **Shuca Berry** reduces this to ~22.5%, but Garchomp already survives comfortably. The Shuca Berry is a missed opportunity — a **Yache Berry** (for Ice Beam) or **Sitrus Berry** (for general survivability) would be more impactful.
- Is there a missed opportunity? (e.g., a Pokemon with a `mega` field not holding its Mega Stone when the team has no other Mega)
- If the team has two Mega-eligible Pokemon, do they split into distinct, viable bring-4 modes? Multiple Mega Stones on the roster are neutral. Penalize only if a validated bring-4 needs both Mega Stone holders at once, or if the secondary Mega's base form fails to justify its slot when the other Mega is brought.
- Does any Pokemon use a self-stat-lowering move (Close Combat, Overheat, Draco Meteor) without White Herb?
- Are there item/ability conflicts? (e.g., White Herb on Contrary; resistance berry on an immunity ability)
- Does any Pokemon hold Choice Scarf while also having Protect in its moveset? (Choice Scarf prevents Protect usage.)
- Does any Pokemon have an item that synergizes with its moveset beyond raw type-boosting? (e.g., **Scope Lens** with high-crit moves like Slash or Stone Edge; **King's Rock** with multi-hit moves; **White Herb** with Close Combat / Overheat / Draco Meteor). Score these combinations favorably when they match the Pokemon's role.
- Does the team's item distribution cover offensive, defensive, and utility needs? Six type-boosting items lacks survival tools; six survival items lacks offensive punch.

**Scoring rubric:**
- **5 (Optimal):** Every item is purposeful, role-matched, and maximizes the team's options. No duplicates, no missed opportunities, no ability conflicts. Item distribution covers offensive, defensive, and utility needs.
- **4 (Strong):** One minor item choice that's slightly suboptimal but not impactful.
- **3 (Acceptable):** Functional items, one notable mismatch or missed opportunity.
- **2 (Weak):** Duplicate items, critical role mismatches (e.g., no Mental Herb on a Taunt-vulnerable TR setter), a wasted Mega slot, or a Choice Scarf + Protect conflict.
- **1 (Critical flaw):** Multiple item conflicts, illegal duplicates, or items that actively harm the game plan.

**How to read the reference:**
- Quick: Read "General Heuristics" and scan the category summaries (Offensive, Speed, Defensive, Utility, Mega Stones).
- Deep: Read the full "When to use what" bullets under each category for role-specific guidance, and cross-check `assets/abilities.json` for item/ability conflicts.

---

### 8. Defensive Cohesion (`synergies.md` + `assets/pokemon.json` + `assets/type-chart.json` + `assets/abilities.json`)

**What it evaluates:** The team-wide and bring-4 type charts — whether weaknesses are clustered, resistances/immunities cover common threats, and the team can safely field 4 Pokemon against standard coverage.

**Key diagnostic questions:**
- How many Pokemon share a weakness to each common offensive type? (Check: Ground, Ice, Fairy, Rock, Fire, Electric, Fighting, Water)
- Does the team have critical immunities? (Ground via Flying-type/Levitate, Electric via Ground-type/Lightning Rod/Volt Absorb, Water via Storm Drain/Water Absorb)
- Does any viable bring-4 have 3+ members weak to one type?
- Are there resistance holes that common attacks exploit? (e.g., no Fairy resist on a team facing common Fairy attackers)
- Can the team switch into common spread moves (Earthquake, Heat Wave, Blizzard, Rock Slide) without losing multiple members?
- Have **both type-based and ability-based** immunities been factored into weakness counts? (e.g., Flying-type is immune to Ground regardless of ability; Levitate negates Ground weakness; Thick Fat negates Fire and Ice weaknesses)
- For each viable bring-4, does the team have parity between physical and special bulk? A bring-4 with 3+ members that have low SpD and no dedicated special wall or resistance core is a yellow flag. Similarly, a bring-4 with 3+ members that have low Def and no physical wall is flagged.
- **Team-wide audits:** Before scoring, run the **Team-Wide Ability Anti-Synergy Audit** and the **Team-Wide Friendly Fire Audit** from `synergies.md`. If either audit returns a red flag, downgrade this dimension by one tier (minimum 1).

**Scoring rubric:**
- **5 (Optimal):** Excellent mutual coverage. Key immunities present. No bring-4 has >1 shared weakness to a common offensive type. Physical/special bulk is balanced across all viable bring-4s.
- **4 (Strong):** Solid coverage with one minor hole (e.g., no Ground immunity but good physical bulk to compensate, or slight lopsidedness in one defensive profile).
- **3 (Acceptable):** Manageable gaps. One notable vulnerability corridor in a common bring-4, or one bring-4 is noticeably lopsided toward physical or special bulk.
- **2 (Weak):** Exploitable weaknesses. 3+ team members weak to one common type, or a bring-4 with 2+ shared weaknesses and no immunity, or a bring-4 that cannot safely take hits from either physical or special attackers.
- **1 (Critical flaw):** Catastrophic type chart. 4+ members share a weakness with no immunity, or the team cannot safely field 4 Pokemon against common coverage, or all viable bring-4s are lopsided in the same defensive direction.

**Ability-based immunity adjustment:** Before counting shared weaknesses, apply ability-based immunities and resistances. A Pokemon with Levitate does **not** count as Ground-weak. A Pokemon with Thick Fat does **not** count as Fire-weak or Ice-weak. A Pokemon with Storm Drain does **not** count as Water-weak. Only count weaknesses that the Pokemon actually takes super-effective damage from. This adjustment can upgrade a score by one tier if it removes a clustered weakness.

**How to read the reference:**
- Quick: List each Pokemon's weaknesses via `assets/pokemon.json` and `assets/type-chart.json`. Count shared weaknesses and note immunities. Cross-reference `assets/abilities.json` to adjust for Levitate, Flash Fire, Thick Fat, etc.
- Deep: Evaluate the bring-4 type chart for each viable mode. Cross-ref `synergies.md` > Anti-Synergy Evaluation > Shared Weakness Clustering and Ability-Based Synergy.

---

### 9. Pair Synergy (`synergies.md`)

**What it evaluates:** How well pairs of Pokemon on the team work together offensively, defensively, and as mode pairs.

**Key diagnostic questions:**
- For each pair (sample using the heuristic in `synergies.md`), how many synergy patterns do they match? (Offensive Combos, Defensive Pivot Pairs, Mode Pairs, Ability-Based Synergy)
- Which pairs are the top 2-3 by layer count? Are they in the core-4?
- Are there anti-synergy flags? (Shared Weakness Clustering, Role Redundancy, Strategy Conflict, Tempo Mismatch, Friendly Fire)
- Does any anti-synergy appear within a core bring-4 group?
- Have abilities been evaluated as synergy layers? (e.g., Levitate enabling Earthquake spam)
- **Team-wide audits:** Before scoring, run the **Team-Wide Ability Anti-Synergy Audit** and the **Team-Wide Friendly Fire Audit** from `synergies.md`. If either audit returns a red flag that affects core pairs, downgrade this dimension by one tier (minimum 1).

**Scoring rubric:**
- **5 (Optimal):** Multiple pairs with 3+ cross-category synergy layers. No red-flag anti-synergies in core modes.
- **4 (Strong):** Clear synergy engine (2-3 layers) in core pairs. Minor anti-synergy that's manageable.
- **3 (Acceptable):** Some synergy exists but no strong engine. One yellow-flag anti-synergy.
- **2 (Weak):** Most pairs are 1-pattern or non-synergistic. A red-flag anti-synergy in a core mode.
- **1 (Critical flaw):** Core pairs have severe anti-synergy (friendly fire, strategy conflict, 3+ shared weaknesses) that makes them unfieldable together.

**Trade-off scoring:** If a core pair has high synergy layers but also carries an anti-synergy flag, apply a cap: a **yellow-flag** anti-synergy caps the pair at score 4; a **red-flag** anti-synergy caps the pair at score 2. If a red-flag pair appears in a validated bring-4, downgrade the overall Pair Synergy dimension by one tier (minimum 1).

**How to read the reference:**
- Quick: Scan the scoring anchors and "Evaluating Layered Synergy" section for layer counts, then jump to "Anti-Synergy Evaluation" for red flags.
- Deep: Read each pattern category in full and map the team's pairs against them systematically, including the new Ability-Based Synergy section.

---

### 10. Move Coverage & Optimization (`synergies.md`, `roles.md`, `assets/moves.json`)

**What it evaluates:** Whether each Pokemon's moveset is optimal for its role, whether the team has redundant or missing coverage, and whether Protect is present where expected.

**Key diagnostic questions:**
- **Legality gate:** Before evaluating moveset quality, verify that each move appears in the Pokemon's `moves` array in `assets/pokemon.json`. If a move is missing, apply a tiered penalty: **2 (Weak)** for a single illegal move on a non-critical slot (e.g., slot 5–6 with no primary win-condition role). **1 (Critical flaw)** only if multiple Pokemon have illegal moves, or the illegal move is on a Pokemon that carries a primary win condition. After noting the illegality, proceed to evaluate the remaining legal movesets.
  - **Cross-dimensional cap:** If the illegal move is on a **primary win-condition Pokemon** (a Pokemon whose moves, ability, or presence is required to initiate a win condition — e.g., the setup sweeper, the weather setter + abuser pair, the TR setter), this caps **Win Condition Robustness** at score **2** if a legal substitute move exists, or score **1** if the win condition is unexecutable without the illegal move.
- Does each Pokemon have its primary STAB(s) and any required support/status moves for its role?
- Is there redundant coverage across the team? (e.g., three Pokemon with the same coverage move)
- Are there "dead" moves? A dead move has **no plausible relevant target** in the current meta (e.g., a physical attacker with a weak special move for "coverage" that it never clicks because no relevant target is weak to it). A **tech move** is rare but has a **high-impact, documented target** (e.g., Haze to stop common setup sweepers, Skill Swap to neutralize a prevalent ability). Tech moves should not be penalized as dead.
- Does every Pokemon that should have Protect actually have it? **Protect is expected on:** non-Choice supports, non-Choice bulky attackers, and setup sweepers that need to stall a turn. **Protect is NOT expected on:** Choice item holders (including Choice Scarf), dedicated Fake Out leads that need 4 other moves, and some pure support Pokemon with 4 mandatory status moves.
- Does the team have enough spread-move options? Does coverage hit common defensive profiles?
- Can the team damage common immunities? (Ghost immune to Normal/Fighting, Ground immune via Flying/Levitate, etc.) Cross-ref `synergies.md` > Coverage for Common Immunities.
- **Offensive coverage audit:** For each viable bring-4, list the types the team can hit super-effectively via STAB or coverage moves (query `assets/moves.json` for move types, cross-reference `assets/type-chart.json`). Flag if the bring-4 cannot hit any of the following common defensive types super-effectively: Ghost, Fairy, Steel, Water, Ground (via Flying/Levitate targets).
  - *Yellow flag:* One common defensive type has no super-effective answer in a core bring-4.
  - *Red flag:* Two or more common defensive types have no super-effective answer, or a core win-condition Pokemon is completely walled by a single prevalent type.
- **Move reliability audit (weighted accuracy budget):** In Champions, damage is deterministic, but **accuracy is not**. A missed move is a guaranteed lost turn. Evaluate the team's reliance on low-accuracy moves using a weighted point system:
  - **<75% accuracy (e.g., Focus Blast 70%):** 2 points if it is a primary STAB or required coverage for a win condition; 1 point otherwise.
  - **75–89% accuracy (e.g., Hydro Pump 80%, Stone Edge 80%, Blizzard outside Snow 70%):** 1 point if frequently clicked for damage or KO thresholds; 0.5 points otherwise.
  - **90–95% accuracy (e.g., Play Rough 90%):** 0.5 points; only downgrade if multiple such moves cluster on the same primary win-condition Pokemon.
  - **Downgrade trigger:** If the team totals **≥2.5 weighted points**, downgrade Move Coverage & Optimization by one tier (minimum 1). If **≥1.5 weighted points** sit on a single primary win-condition Pokemon, downgrade by one tier regardless of team total.
  - *Worked example:* A Modest 32 SpA SPs Gardevoir using **Moonblast** (100% accuracy, 95 power) vs. **Dazzling Gleam** (100% accuracy, 80 power, spread) is reliable. The same Gardevoir relying on **Focus Blast** (70% accuracy) to OHKO Incineroar contributes 2 weighted points and triggers a downgrade if Gardevoir is the primary special win condition.

**Scoring rubric:**
- **5 (Optimal):** Every moveset is optimal. No dead moves. Good spread options. Diverse coverage hits common defensive profiles. Protect is present where needed.
- **4 (Strong):** One minor suboptimal move or slight redundancy.
- **3 (Acceptable):** Functional movesets with one notable gap (missing STAB, no Protect where expected, or significant redundancy).
- **2 (Weak):** Multiple Pokemon with poor movesets, missing critical coverage, or dead moves.
- **1 (Critical flaw):** Illegal moves, multiple Pokemon missing STAB/Protect on Pokemon that need it, or movesets that directly contradict roles.

**How to read the reference:**
- Quick: Cross-check each Pokemon's moves against `assets/moves.json`. Verify STAB, coverage, support moves, and Protect.
- Deep: Compare the team's combined offensive coverage against common defensive profiles in the format. Check `synergies.md` > Dual Offensive Pressure for pair-level coverage evaluation.

---

### 11. Win Condition Robustness (`win-conditions.md`)

**What it evaluates:** Whether the team has enough reliable, independent paths to winning.

**Key diagnostic questions:**
- What win condition types does the team have? (Setup Sweeper, Spread Pressure, Weather/Terrain Engine, Trick Room Flip, Attrition, Single-Target Burst)
- How many independent win conditions exist? (Minimum expectation: 2)
- What is the dependency count for each win condition? (Lower = more reliable)
- How resilient is each win condition to common disruption? (Intimidate, Fake Out, Taunt, opposing weather)
- Are win conditions distributed across different bring-4 modes, or do they all rely on the same critical Pokemon?
- **Independence test:** Pick the most critical Pokemon for the primary win condition. If it is KO'd Turn 1, does the remaining bring-4 still have a coherent path to winning? Repeat for the second win condition. If both collapse when the same Pokemon is removed, they are not independent.
- **Win condition collision check:** Do any two win conditions in the same validated bring-4 require mutually exclusive game states (e.g., Tailwind active + Trick Room active; Sun active + Rain active)? If yes, they do not count as separate win conditions for that bring-4. Flag the mode as having fewer win conditions than the full team suggests.
- Does the team have an endgame "closer" — a Pokemon that can clean up in 2v2 or 1v2 situations? Cross-ref `win-conditions.md` > Endgame / Closer Viability.
- Does the team have Team Preview independence? (Can the opponent shut down all paths by targeting one Pokemon?)
- **Illegal move vulnerability:** Are any win conditions compromised by illegal or unusable moves on their critical Pokemon? If yes, apply the cross-dimensional cap per `Move Coverage & Optimization` > Legality gate.

**Scoring rubric:**
- **5 (Optimal):** 2+ independent, low-dependency win conditions in different modes. No shared critical failure points. At least one strong closer (a Pokemon that can clean up 2v2 or 1v2 without needing a setup turn). Preview-independent.
- **4 (Strong):** 2 win conditions, one slightly dependent but protected.
- **3 (Acceptable):** 2 win conditions that share a failure point, or 1 strong + 1 weak backup. No viable closer caps the score here.
- **2 (Weak):** Only 1 viable win condition, or 2 win conditions that both fail to the same common disruption.
- **1 (Critical flaw):** No coherent win condition. The team cannot describe how it plans to close out games.

**How to read the reference:**
- Quick: Read "Win Condition Types" and "Win Condition Sufficiency."
- Deep: Read "Evaluating Win Condition Quality" for dependency count, disruption resilience, turn count, and independence, then score each identified win condition. Cross-ref `tempo.md` > Preview & Counter-Lead Resilience.

---

### 12. Lead & Resilience (`tempo.md`)

**What it evaluates:** Whether lead pairs are strong and the team has fallback plans when disrupted.

**Key diagnostic questions:**
- For each bring-4 mode, what is the natural lead pair? Does it match a strong pattern from `tempo.md`? (Fake Out + Attacker/Setter, Dual Offense, Redirect + Setup, Speed Control + Attacker)
- Do the leads have complementary Turn 1 actions? Is either Pokemon dead weight on Turn 1?
- Do the leads project threats, or can the opponent safely ignore one?
- **Turn 1 double-target survival:** Can the team's most critical lead Pokemon (e.g., Tailwind setter, Trick Room setter, Fake Out + Setup enabler) survive a simultaneous double-target from two common meta offensive threats? Account for spread-move chip (e.g., Earthquake, Heat Wave, Dazzling Gleam) followed by a single-target STAB. If the lead collapses to a realistic double-target, the lead is brittle regardless of individual bulk benchmarks.
  - *Worked example:* A Focus Sash Whimsicott (HP ~160) facing a lead Gardevoir (Dazzling Gleam ~76 damage after spread penalty) + Garchomp (Earthquake ~X damage). Even with Focus Sash, if Whimsicott took chip from a prior turn or faces a spread move that bypasses Sash (e.g., multi-hit Rock Blast), it may die before executing its Turn 1 action.
- What happens if the primary plan is disrupted? (Lead KO'd, speed control denied, weather overwritten, setup denied)
- Does the team have alternate modes that don't share the same critical Pokemon?
- How many distinct, viable bring-4 groups exist? Can the team adapt at preview?
- Does the team telegraph a single game plan at preview, or does it have counter-lead resilience?

**Scoring rubric:**
- **5 (Optimal):** Strong leads with complementary actions and multiple fallback lines. Alternate modes are independent. 2+ viable bring-4 groups. Counter-lead resilient.
- **4 (Strong):** Good leads with one minor brittleness (e.g., one lead pattern that's slightly telegraphed but hard to punish).
- **3 (Acceptable):** Functional leads, but disruption exposes a real weakness with limited backup.
- **2 (Weak):** Brittle leads with one clear line and no fallback. Disruption collapses the game plan.
- **1 (Critical flaw):** No viable lead pair. The team cannot execute a productive Turn 1 in any mode.

**How to read the reference:**
- Quick: Read "Lead Pair Evaluation" for the strong/weak lead heuristics and common patterns.
- Deep: Read "Plan B Resilience" and "Preview & Counter-Lead Resilience" and evaluate the team against each disruption scenario.

---

### 13. Meta Matchup Robustness (`win-conditions.md` + external meta data)

**What it evaluates:** How well the team handles the current format's most common threats and leads.

**Key diagnostic questions:**
- Against the format's top 10–15 most-used Pokemon, can the team field a bring-4 with a plausible answer to at least 7?
- **What counts as a "plausible answer"?** Use this decision tree for each top threat:
  1. **Resist STAB + threaten KO back:** The team has a Pokemon that resists the threat's primary STAB and can OHKO or 2HKO it.
  2. **Outspeed and OHKO:** The team has a faster Pokemon that can remove the threat before it moves.
  3. **Cripple with status or move-disruption:** The team can Taunt, Thunder Wave, Will-O-Wisp, Encore, or Fake Out the threat into irrelevance.
  4. **Immunity + punish switch-in:** The team has an immunity to the threat's main attacking type and can exploit the forced switch.
  5. **Outlast with recovery/bulk:** The team has a Pokemon that can survive the threat's main attacks, recover HP (Sitrus Berry, Strength Sap, Roost, etc.), and reliably threaten a 2HKO in return.
  If none of the five apply, the team lacks a plausible answer to that threat.
- Does the team have an auto-loss matchup against any top-5 usage Pokemon?
- Are there common leads the team cannot disrupt or out-trade?
- Does the team have specific coverage or defensive answers to prevalent setup sweepers, weather setters, or speed control users?

**Scoring Rubric — With Pikalytics Data:**
- **5 (Optimal):** Strong answers to all top threats; no auto-losses.
- **4 (Strong):** Strong answers to most; one manageable bad matchup.
- **3 (Acceptable):** Functional but has 1–2 difficult meta matchups.
- **2 (Weak):** Multiple bad matchups against common threats.
- **1 (Critical flaw):** Auto-losses against prevalent meta Pokemon.

**Scoring Rubric — Without Pikalytics Data (Static Asset Proxy):**
- **5 (Optimal):** Passes all proxy audits (see below).
- **4 (Strong):** Fails one proxy audit item.
- **3 (Acceptable):** Fails two proxy audit items.
- **2 (Weak):** Fails three or more proxy audit items.
- **1 (Critical flaw):** Auto-loss to a common archetype per proxy threat list.

**Proxy Procedure (use when Pikalytics unavailable):**
1. **Proxy offensive threats:** Query `assets/pokemon.json` for Pokemon with base Atk or base SpA ≥100. Exclude Pokemon with **Truant**, **Slow Start**, or **Defeatist**. Select top 10 by base stat total.
2. **Proxy support threats:** Query `assets/pokemon.json` for Pokemon with base HP ≥75 or base Def/SpD ≥90 that also have **Intimidate**, **Prankster**, or redirection moves (Follow Me, Rage Powder). Select top 3–5 by base stat total.
3. **Type coverage audit:** For each of Ground, Ice, Fairy, Fire, Electric, verify the team has a viable bring-4 with ≤1 member weak to that type and at least one resist/immunity.
4. **Ability audit:** Check answers to Intimidate, Prankster, and weather/terrain setters via the decision tree above.
5. **Setup denial audit:** Check whether the team has answers to common setup sweepers (Haze, Taunt, Encore, phazing). If the team has no setup denial and the proxy threat list includes prominent setup sweepers, flag this as a meta vulnerability.
6. **Justification must state:** "Scored using static-asset proxy (no Pikalytics data)."

**How to read the reference:**
- Quick: If meta data is unavailable, use the Static Asset Proxy rubric above. Never score based on vague intuition.
- Deep: Fetch `https://www.pikalytics.com/champions` usage data. Use the With Pikalytics Data rubric.

---

## Strategy-Weighted Overall Viability

After scoring all 13 dimensions, synthesize an overall verdict through the following steps:

### Step 1: Detect or Confirm Archetype

Before identifying the archetype, identify and validate the team's **bring-4 modes**:

1. **Identify core-4:** The 3-4 Pokemon with the highest synergy layer counts (per `synergies.md` > Evaluating Layered Synergy) that share a coherent game plan.
2. **List alternates:** Swap 1-2 members to create alternate modes. A "mode" is a group of 4 with a coherent game plan.
3. **Validate each mode** against four gates:
   - (a) **Speed:** Has speed control, naturally fast attackers, or a reactive speed-drop user.
   - (b) **Win condition:** Has a coherent path to winning (setup sweeper, spread pressure, burst, etc.).
   - (c) **Anti-synergy:** Has no red-flag anti-synergies within the group.
   - (d) **Lead:** Has a lead pair with complementary Turn 1 actions.
4. **Filter:** Only **validated** modes count toward scoring in **Lead & Resilience** and **Win Condition Robustness**. Invalid modes are noted but do not contribute positively.

Then use `archetypes.md` to identify the team's archetype from the validated modes. If the user has stated an intent, use that. If ambiguous, label it as dual-mode or Goodstuffs and note the primary signals.

### Step 2: Score All 13 Dimensions

Produce a table with each dimension, its 1-5 score, and a 1-sentence justification.

### Step 3: Dynamically Weight Relevance

Use the table below to determine which dimensions are **critical**, **discounted**, and **N/A/neutral** for the detected archetype. The agent must apply contextual judgment, not fixed multipliers.

**Definitions:**
- **Critical:** High weight. A score of 1 in a critical dimension is unlikely to score above 2.0 overall.
- **Discounted:** Still scored 1–5, but a low score does not automatically cap the overall verdict unless it creates a functional auto-loss.
- **N/A / Neutral:** Dimension is irrelevant to the archetype. Score it as neutral and exclude it from the synthesis entirely.

| Archetype | Critical Dimensions | Discounted Dimensions | N/A / Neutral |
|---|---|---|---|
| **Trick Room** | Win Condition Robustness, Lead & Resilience, Pair Synergy, Stat Efficiency | Speed Profile (reinterprets low speed as desirable; min speed is optimal) | Field Condition Management (non-weather team with no weather-weak members) |
| **Hyper Offense** | Pair Synergy, Win Condition Robustness, Move Coverage & Optimization, Speed Profile | Role Coverage (defensive roles less critical unless enabling sweepers), Defensive Cohesion (less critical than for Balance) | Field Condition Management (non-weather team with no weather-weak members) |
| **Tailwind Hyper Offense** | Pair Synergy, Win Condition Robustness, Speed Profile, Move Coverage & Optimization, Lead & Resilience | Role Coverage (defensive roles less critical unless enabling sweepers) | Field Condition Management (non-weather team with no weather-weak members) |
| **Weather (Rain/Sun/Sand/Snow)** | Role Coverage, Win Condition Robustness, Archetype Coherence, Lead & Resilience, Field Condition Management | — | — |
| **Terrain-based** | Role Coverage, Win Condition Robustness, Archetype Coherence, Pair Synergy, Field Condition Management | — | — |
| **Bulky Offense** | Defensive Cohesion, Win Condition Robustness, Stat Efficiency, Move Coverage & Optimization | Speed Profile (less critical than for HO; bulk trades for speed) | Field Condition Management (non-weather team with no weather-weak members) |
| **Goodstuffs / Balance** | No dimension is discounted. Well-roundedness is the goal. The lowest-scoring dimension is often the limiting factor. | — | — |
| **Dual-Mode (Tailwind + Trick Room)** | Speed Profile, Lead & Resilience, Role Coverage, Pair Synergy | — | Field Condition Management (non-weather team with no weather-weak members) |

**Guidelines:**
- **Trick Room:** `Speed Profile` is reinterpreted — low absolute speed on TR attackers is optimal, not a weakness. A TR team scores well on Speed Profile when all TR attackers have 0 Speed SPs + Speed-hindering natures and the setter is benchmarked for survivability. `Win Condition Robustness`, `Lead & Resilience`, and `Pair Synergy` are weighted higher. Do not conflate low Speed stats with a low Speed Profile score.
- **Hyper Offense:** `Pair Synergy` and `Win Condition Robustness` dominate. `Role Coverage` for defensive roles (Intimidate, Redirection) is less critical unless the team lacks enablers for its sweepers.
- **Tailwind Hyper Offense:** `Speed Profile`, `Lead & Resilience`, and `Pair Synergy` dominate. The Tailwind setter is a single point of failure — its resilience is critical. `Role Coverage` for defensive roles is secondary.
- **Weather (Rain/Sun/Sand/Snow):** `Role Coverage` (weather setter presence), `Win Condition Robustness`, and `Archetype Coherence` dominate. `Lead & Resilience` matters for weather-overwrite scenarios.
- **Terrain-based:** Similar to Weather — `Role Coverage` (terrain setter), `Win Condition Robustness`, and `Archetype Coherence` dominate. `Pair Synergy` matters because terrain abusers often pair with the setter.
- **Bulky Offense:** `Defensive Cohesion` and `Stat Efficiency` dominate because the team wins by trading efficiently. `Speed Profile` is less critical — the team accepts moving second. `Lead & Resilience` and `Role Coverage` should be downgraded if the team has zero pivoting options (U-turn, Volt Switch, Parting Shot, Flip Turn, Regenerator) and no safe switch-ins into common coverage (Ground, Ice, Fairy). Bulky Offense wins through trading and repositioning; lacking pivot tools is a structural flaw.
- **Goodstuffs/Balance:** No dimension is discounted, and **all dimensions are effectively critical** because well-roundedness is the goal. The lowest-scoring dimension is the limiting factor for the overall score — a Goodstuffs team with one 1 in any dimension is unlikely to score above 2.0 overall, even if that dimension is not formally labeled "critical." A Goodstuffs team with no pivot users and no safe switch-ins into common coverage is unlikely to score above 3.5 in `Lead & Resilience`, even if its raw stats are strong.
- **Dual-Mode (e.g., Tailwind + Trick Room):** `Speed Profile` and `Lead & Resilience` are critical because mode separation is the core challenge. `Role Coverage` matters for ensuring both modes are functional.
- **Field Condition Management:** For Weather and Terrain-based teams, this dimension is critical — the setter's survivability and backup plans are core to the strategy. For non-weather teams, it is discounted: the team should have some answer to common opposing weather/terrain, but lacking one is not a critical flaw unless 3+ members are hard-countered by it.

If a dimension is irrelevant to the archetype (e.g., Weather/Terrain role coverage on a non-weather team), it should not penalize the overall score. Score it as "N/A" or neutral and exclude it from the synthesis.

**N/A / Neutral Dimension Handling:** A dimension scored as N/A (e.g., Field Condition Management for a non-weather team with no weather-weak members) is **excluded entirely from the overall synthesis**. It neither raises nor lowers the overall score. Do not treat an N/A dimension as a missing score or a hidden penalty. Only dimensions scored 1–5 are factored into the Step 4 synthesis.

### Step 4: Synthesize Overall Score

Produce an overall score from 1.0 to 5.0. This is a qualitative synthesis, not a weighted average. The agent should reason as follows:

- A team with one **Critical flaw (1)** in any **critical dimension** (per the table in Step 3) is unlikely to score above 2.0 overall, regardless of other scores.
- A score of 1 in a **discounted** dimension does **not** automatically cap the overall score at 2.0. However, if that 1 creates a functional auto-loss (e.g., a Tailwind HO team with a Speed Profile of 1 because it has no speed control and no naturally fast threats), the synthesis may still cap it narratively.
- A team with multiple **Weak (2)** scores in critical dimensions for its archetype is unlikely to score above 2.5.
- A team with all **Acceptable (3)** scores and one **Strong (4)** in a key dimension is a 3.0–3.5 team.
- A team with mostly **Strong (4)** and one **Optimal (5)** is a 4.0–4.5 team.
- A team scoring **Optimal (5)** across all critical dimensions is a 4.5–5.0 team.

**Partial-team penalty:** If evaluating a team with fewer than 6 Pokemon, missing slots are structural liabilities.
- A 4-Pokemon draft cannot score above **3.0** overall, no matter how strong the drafted members are.
- A 5-Pokemon draft cannot score above **3.5** overall.
- **Exception:** If the user explicitly labels the evaluation as a **core/draft** and the 4 drafted Pokemon form a complete, legally viable bring-4 with a coherent win condition, cap at **3.5** instead of 3.0. Apply the stricter cap only if the draft is incomplete (missing a 4th slot or lacking a win condition).
- Score the existing dimensions based on the drafted Pokemon, then apply the cap.

**Filler-slot penalty:** A 6-Pokemon team with obvious filler slots is functionally a smaller team.
- If 2+ slots have **zero synergy layers**, **no viable bring-4 inclusion**, and **roles fully duplicated** by another slot, apply a hard cap of **3.5** overall.
- If 3+ slots are filler, apply a hard cap of **3.0** overall.
- A slot is **filler** ONLY if **ALL three** gates apply:
  1. **Low bring-4 presence:** It appears in ≤1 validated bring-4 group (per Step 1 validation).
  2. **Low synergy:** Its highest synergy layer count with any teammate is ≤1.
  3. **Redundant role:** Every role it provides is also provided by another team member with a strictly higher synergy layer count.

**Important override:** A Pokemon with low synergy but a **unique role** (e.g., the team's only Intimidate user, the only Ground immunity, the only Fairy resist) is **NOT filler**, even if it scores poorly on gates 1 and 2. Uniqueness overrides the filler label.

**Two-Mega exception:** If a team has two Mega-eligible Pokemon and one Mega's mode is non-viable (per Cross-Dimensional Mega Audit), that slot is functionally filler regardless of its non-Mega performance.

Score the existing dimensions based on the non-filler Pokemon, then apply the cap.

Apply the more restrictive cap. If partial-team and filler-slot penalties produce different caps, use the lower one.

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
| Stat Efficiency | `speed-tiers.md` + `items.md` | Speed benchmarks and item modifiers (Choice Scarf, Mega Stones) affect stat targets |
| Role Coverage | `win-conditions.md` | Roles enable win conditions; missing Fake Out or redirection can collapse a setup sweeper plan |
| Offensive Balance | `synergies.md` | Dual Offensive Pressure evaluates pair-level physical/special split |
| Archetype Coherence | `tempo.md` + `items.md` | Archetypes imply lead patterns; weather teams may need specific items (check `items.md` for availability) |
| Speed Profile | `synergies.md` + `items.md` + `assets/pokemon.json` | Speed Control + Slow Attacker is a synergy pattern; Choice Scarf shifts tiers; Mega Stones may change base Speed |
| Speed Profile | Dynamic Weighting | Trick Room teams reinterpret low speed as optimal |
| Field Condition Management | `tempo.md` + `roles.md` + `win-conditions.md` | Weather/Terrain overwrite resilience and fallback plans are tempo and win-condition concerns |
| Item Optimization | `roles.md` + `stat-calculations.md` + `assets/abilities.json` | Items must match roles; White Herb negates self-lowering moves like Close Combat/Overheat; abilities may conflict with items |
| Defensive Cohesion | `synergies.md` + `assets/abilities.json` | Shared weaknesses compound if both Pokemon are also slow; type complement is a synergy layer; abilities modify type-chart weaknesses |
| Pair Synergy | `roles.md` + `assets/abilities.json` | Role redundancy is a synergy anti-pattern; abilities create defensive and offensive synergy layers |
| Move Coverage & Optimization | `synergies.md` + `win-conditions.md` | Coverage enables win conditions; spread moves enable Spread Pressure |
| Move Coverage & Optimization | `synergies.md` + `assets/type-chart.json` | Offensive coverage audit checks SE hits on common defensive types |
| Move Coverage & Optimization | `win-conditions.md` | Illegal moves on win-condition Pokemon cap Win Condition Robustness |
| Win Condition Robustness | `archetypes.md` + `tempo.md` | Archetype expectations define how many win conditions and what types are needed; preview independence is a resilience check |
| Lead & Resilience | `speed-tiers.md` + `win-conditions.md` | Speed control interaction determines whether leads can execute their plan; preview independence checks concentration risk |
| Item Optimization | `speed-tiers.md` + `synergies.md` + `assets/pokemon.json` | Mega form may change speed tier, typing, and ability |
| Meta Matchup Robustness | `synergies.md` + `win-conditions.md` | Type-chart holes and coverage gaps manifest as meta matchup problems; win condition diversity affects meta resilience |

## Example Evaluation Output

Below is a fictional example showing the expected format. The agent should produce output at this level of detail when reporting a full evaluation.

---

**Detected Archetype:** Tailwind Hyper Offense

**Dimension Scores:**

| Dimension | Score | Justification |
|---|---|---|
| Stat Efficiency | 3 | Generic 32/32 bulk spreads. Feraligatr misses a key survival benchmark vs. 32 SpA SPs Gardevoir. |
| Role Coverage | 3 | Has Tailwind, Fake Out, and Setup. Missing Intimidate, Redirection, and Screens. |
| Offensive Balance | 4 | Three physical attackers, but Gardevoir provides special coverage. Balanced enough to threaten both walls. |
| Archetype Coherence | 4 | Clear Tailwind HO with Whimsicott + 3 mid-tier attackers. No conflicting modes. |
| Speed Profile | 4 | Mid-tier attackers benefit well from Tailwind. One Pokemon has 8 wasted Speed SPs that could go to bulk. |
| Field Condition Management | 3 | No weather/terrain setter or specific answers to opposing conditions, but no hard-counter from common weather either. Discounted for Tailwind HO. |
| Item Optimization | 2 | Duplicate Sitrus Berry on two Pokemon. No resistance berries despite Ice weakness. Good item-role matching otherwise. |
| Defensive Cohesion | 3 | Two Pokemon weak to Ice, no immunity. Otherwise solid. |
| Pair Synergy | 4 | Whimsicott + Feraligatr is a strong Fake Out + Setup pair with 3 synergy layers. One minor anti-synergy: two mid-tier attackers share an Ice weakness. |
| Move Coverage & Optimization | 4 | All Pokemon have primary STAB and Protect. One minor redundancy: both attackers carry Ice-type coverage. |
| Win Condition Robustness | 3 | Two win conditions: Feraligatr setup sweep and spread pressure from Garchomp. Both depend on Whimsicott surviving Turn 1. |
| Lead & Resilience | 2 | Strong Fake Out + Setup lead, but no backup if Whimsicott is KO'd. No alternate mode. |
| Meta Matchup Robustness | 3 | No auto-losses against top threats, but struggles against common Ice attackers and lacks answers to setup sweepers. |

**Dynamic Weighting:**
- For Tailwind Hyper Offense, `Pair Synergy`, `Win Condition Robustness`, `Speed Profile`, `Move Coverage & Optimization`, and `Lead & Resilience` are critical. `Role Coverage` for defensive roles is less important, but the missing Intimidate is still a gap.
- The `Lead & Resilience` weakness is severe for this archetype because HO needs to execute Turn 1 reliably. A single KO on Whimsicott collapses both win conditions.
- The `Item Optimization` duplicate is fixable but matters because the team needs diverse survival tools.
- `Meta Matchup Robustness` is acceptable but not strong — the team doesn't hard-lose to anything common, but it doesn't dominate the meta either.

**Overall Score:** 3.2

**Verdict:** Structural Issues

The team has a clear game plan and strong synergy in its core pair, but it is brittle. Whimsicott is a single point of failure for both win conditions, and the lack of an alternate mode or backup speed control means a well-prepared opponent can shut it down. Fixing the duplicate item, reallocating wasted Speed SPs, and adding a secondary mode (e.g., a Choice Scarf revenge killer or a second Tailwind user) would raise this to a Viable with Minor Tuning team.

**Top Strengths:**
- Whimsicott + Feraligatr is a high-synergy lead pair with Fake Out + Dragon Dance enablement.
- Speed tiers align well with Tailwind — all three attackers jump to effectively blazing under Tailwind.

**Top Issues:**
- Whimsicott is a concentration risk. If it's KO'd Turn 1, both win conditions are offline.
- Duplicate Sitrus Berry wastes an item slot that could provide a resistance berry or utility item.
- No answer to common setup sweepers in the current meta.

---

## Usage Instructions for Agents

### When to Run Full Evaluation vs. Targeted Subset

- **Full 13-dimension evaluation:** Use when the user asks for a general viability check, when a team is newly built, or when multiple layers are suspected to have issues.
- **Targeted subset:** Use when the user asks about a specific concern (e.g., "Is my speed profile okay?" or "Do I have enough win conditions?"). In that case, read only the relevant reference file and its cross-references.

### How to Report Results

1. **Scores first.** Present the 13-dimension score table upfront.
2. **Synthesis second.** Explain the dynamic weighting reasoning and the overall score.
3. **Verdict third.** State the tiered verdict in one sentence.
4. **Actionable fixes last.** If the score is below 4.0, provide 2-4 concrete suggestions ranked by impact. Tie each suggestion to a specific dimension and reference file.

### Constraints

- Do not invent anti-patterns or viability flags. All assessments must be grounded in the reference files and the static JSON assets.
- This skill does not validate legality. The consuming skill must run `check-vgc-team-legality` before invoking this evaluation.
- This skill does not fetch meta data. The consuming skill may fetch Pikalytics separately if meta context is needed.
- All damage, speed, and survival calculations should use `stat-calculations.md`. Default to heuristic reasoning; use math only when precision is needed to distinguish between close options.
- Use **SP terminology exclusively** in all outputs. Never use EVs, IVs, or legacy stat notation.

### Showdown Paste Preprocessing

When parsing Showdown pastes for evaluation:

1. **Convert EVs to SPs:** Divide each EV value by 8 and round down. Verify the total does not exceed 66 SPs. Example: `252 HP EVs` = `31 HP SPs` (since 252 / 8 = 31.5, round down to 31).
2. **Ignore IV lines:** All IVs are fixed to 31 in Champions. Never reference IV manipulation.
3. **Interpret `IVs: 0 Spe`:** In Champions, this means 0 Speed SPs + a Speed-hindering nature (Brave, Quiet, Relaxed, or Sassy). **Verify the nature is one of these four.** If the nature is neutral or Speed-boosting, flag a **Stat Efficiency** conflict — do not assume the nature should be changed.
4. **Assume Level 50:** If the paste lacks a level line, assume Level 50.
5. **Validate totals:** After conversion, ensure no stat exceeds 32 SPs and the sum of all SPs does not exceed 66.

---

### Mega Evolution Cross-Dimensional Impact

When a team includes a Mega Evolution, the evaluator must re-evaluate three dimensions using the **Mega form's** data from `assets/pokemon.json`:

1. **Speed Profile:** Does the Mega form's base Speed change its speed tier? (e.g., Mega Garchomp drops from Fast to Mid.)
2. **Defensive Cohesion:** Does the Mega form's typing patch a type-chart hole? Does it gain or lose key immunities/resistances? Score the team's type chart using Mega typing when the Mega is expected to be brought.
3. **Pair Synergy:** Does the Mega form's ability create new synergy layers or remove existing ones?

A Mega Stone is serving a defensive role if the Mega typing patches a weakness (e.g., Charizardite X granting Ground immunity). In such cases, the item choice should be scored favorably in **Item Optimization** even if the base form loses a flexible item slot.

**Two-Mega teams:** If two Pokemon hold Mega Stones, treat that as neutral at the roster level. They must never appear in the same bring-4 group. Validate that each Mega forms a distinct, viable mode when the other is benched. If one Mega's mode is non-viable, or if a validated bring-4 would need both Mega Stone holders together, that slot is functionally filler.

---

## Quick-Reference Cheat Sheet

### All 13 Dimensions (1–5 Anchors)

| Dimension | 5 (Optimal) | 1 (Critical flaw) |
|---|---|---|
| **Stat Efficiency** | Every spread benchmark-driven, no wasted SPs | Multiple nature/SP conflicts cripple key Pokemon |
| **Role Coverage** | All archetype-relevant roles covered, no harmful redundancy | Multiple critical roles missing; cannot execute basic VGC functions |
| **Offensive Balance** | Balanced physical/special mix threatens both walls | Entirely one-sided offense, no physical or special threat |
| **Archetype Coherence** | Clean archetype execution, no dilution | No coherent archetype or strategy |
| **Speed Profile** | Speed tiers match game plan, efficient investment, backup exists | Core attackers cannot function under speed control; no speed control and no fast threats |
| **Field Condition Management** | Reliable setter + backup + non-condition attackers | No setter on weather team, or 3+ members hard-countered by common conditions |
| **Item Optimization** | Every item purposeful, no duplicates, no conflicts, diverse coverage | Multiple item conflicts, illegal duplicates, items harming the plan |
| **Defensive Cohesion** | Excellent mutual coverage, key immunities, no clustered weaknesses, balanced physical/special bulk | Catastrophic type chart, 4+ members share weakness with no immunity, or all bring-4s lopsided in same defensive direction |
| **Pair Synergy** | Multiple pairs with 3+ cross-category layers, no red-flag anti-synergies | Core pairs have severe anti-synergy, unfieldable together |
| **Move Coverage** | Every moveset optimal, no dead moves, Protect where needed | Illegal moves, multiple missing STAB/Protect, movesets contradicting roles |
| **Win Condition Robustness** | 2+ independent, low-dependency win conditions, strong closer | No coherent win condition; cannot describe how it closes games |
| **Lead & Resilience** | Strong leads, complementary actions, multiple fallbacks, counter-lead resilient | No viable lead pair; cannot execute a productive Turn 1 |
| **Meta Matchup Robustness** | Strong answers to all top threats; no auto-losses | Auto-losses against prevalent meta Pokemon |

**Mega Evolution note:** When evaluating a team with a Mega, use the Mega form's typing and ability for Defensive Cohesion and Speed Profile checks.

### Critical Dimensions by Archetype

| Archetype | Critical Dimensions | Discounted |
|---|---|---|
| **Trick Room** | Win Conditions, Lead & Resilience, Pair Synergy, Stat Efficiency | Speed Profile, Field Condition Management |
| **Hyper Offense** | Pair Synergy, Win Conditions, Move Coverage, Speed Profile | Role Coverage, Defensive Cohesion, Field Condition Management |
| **Tailwind HO** | Pair Synergy, Win Conditions, Speed Profile, Move Coverage, Lead & Resilience | Role Coverage, Field Condition Management |
| **Weather** | Role Coverage, Win Conditions, Archetype Coherence, Lead & Resilience, **Field Condition Management** | — |
| **Terrain-based** | Role Coverage, Win Conditions, Archetype Coherence, Pair Synergy, **Field Condition Management** | — |
| **Bulky Offense** | Defensive Cohesion, Win Conditions, Stat Efficiency, Move Coverage | Speed Profile, Field Condition Management |
| **Goodstuffs** | All dimensions equally; lowest score is the limit | — |
| **Dual-Mode** | Speed Profile, Lead & Resilience, Role Coverage, Pair Synergy | Field Condition Management |

### Common Red Flags Checklist

- [ ] **Concentration risk:** One Pokemon is critical for 2+ win conditions.
- [ ] **Speed tier conflict:** TR-tier attacker in a Tailwind mode, or mid-tier attacker in a TR mode.
- [ ] **Shared weakness cluster:** 3+ team members weak to one common type with no immunity.
- [ ] **Duplicate items:** Two Pokemon hold the same item.
- [ ] **No Protect on a support:** Non-Choice, non-dedicated-Fake-Out support lacks Protect.
- [ ] **Choice Scarf + Protect:** Item and move are mutually incompatible.
- [ ] **Dead move:** A move with no plausible relevant target in the current meta.
- [ ] **Filler slots:** 2+ slots with zero synergy layers and no viable bring-4 inclusion.
- [ ] **Brittle lead:** Primary lead has one line and no fallback if disrupted.
- [ ] **No speed control backup:** Primary speed control denied → no way to manage turn order.
- [ ] **TR attacker with Speed SPs:** Any Speed SPs on a Trick Room attacker (base Speed ≤45, Speed-hindering nature) is a wasted stat that actively harms the game plan.
- [ ] **Offensive coverage gap:** Core bring-4 cannot hit 2+ common defensive types (Ghost, Fairy, Steel, Water, Ground via Flying) super-effectively.
- [ ] **High accuracy-dependency:** Primary win-condition Pokemon relies on low-accuracy moves (weighted budget ≥1.5 points) or team totals ≥2.5 weighted points.

---

## Common Evaluation Mistakes

Agents should avoid these frequent errors when scoring teams:

1. **Flagging 0 Speed SPs on Trick Room attackers as "wasted stats."** In Pokemon Champions, minimum speed is achieved with **0 Speed SPs + a Speed-hindering nature**. This is optimal for TR attackers. Do not penalize it.

2. **Penalizing Goodstuffs/Balance for lacking a weather setter.** Goodstuffs teams are evaluated on well-roundedness, not on executing a specific engine. Missing a weather setter is only a flaw for Weather archetypes.

3. **Scoring a dual-mode team low because support Pokemon appear in both modes.** Support Pokemon (Intimidate users, redirectors, Fake Out users) are *intended* to appear in multiple bring-4 modes. This is flexibility, not "mode bleeding." Only penalize attackers with mismatched speed tiers.

4. **Applying mainline VGC assumptions.** Champions differs from mainline Pokemon:
   - No 0 IVs (all IVs are fixed to 31).
   - No Choice Band, Choice Specs, Life Orb, Assault Vest, Safety Goggles.
   - Damage is deterministic (no random rolls).
   - Use SPs, not EVs.
   Do not assume mainline items or mechanics exist.

5. **Treating a discounted dimension score of 1 as an automatic 2.0 overall cap.** A 1 in a discounted dimension (e.g., Field Condition Management on a Tailwind HO team) does not automatically cap the overall score at 2.0. Only cap it if the 1 creates a functional auto-loss.

6. **Confusing "dead moves" with "tech moves."** A dead move has no relevant target. A tech move is rarely clicked but has a documented, high-impact target (e.g., Haze vs. common setup sweepers). Tech moves should not be penalized.

7. **Failing to preprocess Showdown pastes.** EVs must be converted to SPs. `IVs: 0 Spe` must be interpreted as 0 Speed SPs + Speed-hindering nature. Never use raw EV or IV values in evaluation output.
