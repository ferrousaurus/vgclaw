# Win Condition Evaluation

> **Champions Rules Reminder**
> - All IVs are fixed to 31. Never reference 0 IVs or IV manipulation.
> - Stat Points (SPs) replace EVs: 1 SP = 8 EVs, max 32 per stat, 66 total.
> - Damage is deterministic — no random rolls.
> - Level 50 for all VGC calculations.
> - Item pool is limited: no Choice Band, Choice Specs, Life Orb, Assault Vest, Safety Goggles, etc.

> **When to read this file:** This reference is invoked primarily by the **Win Condition Robustness** and **Field Condition Management** dimensions in `SKILL.md`. Commonly read alongside `tempo.md` (Plan B resilience and preview independence) and `archetypes.md` (archetype expectations define win condition profiles).

How to assess whether a VGC team has sufficient, reliable, and diverse ways to win games. A win condition is a repeatable path to knocking out the opponent's bring-4 — a plan the team can execute, not just a strong individual Pokemon.

## Scoring Anchors for Win Condition Robustness

Use these anchors when assigning a score to the **Win Condition Robustness** dimension in `SKILL.md`:

- **5 (Optimal):** 2+ independent, low-dependency win conditions in different modes. No shared critical failure points.
- **4 (Strong):** 2 win conditions, one slightly dependent but protected.
- **3 (Acceptable):** 2 win conditions that share a failure point, or 1 strong + 1 weak backup.
- **2 (Weak):** Only 1 viable win condition, or 2 win conditions that both fail to the same common disruption.
- **1 (Critical flaw):** No coherent win condition. The team cannot describe how it plans to close out games.

## Win Condition Types

### Setup Sweeper

A Pokemon boosts its stats (Swords Dance, Dragon Dance, Calm Mind, Nasty Plot, Quiver Dance) and then overwhelms the opponent with boosted attacks.

**Depends on:** Enablers — Fake Out, redirection, Intimidate — to buy the setup turn.

**Fragility:** High dependency. The sweeper needs to survive a turn, successfully boost, and then not be revenge killed. If the opponent has Taunt, Encore, Haze, or just KOs the sweeper before it boosts, the plan collapses.

**Cross-ref:** `synergies.md` > Setup + Enabler for evaluating the quality of the setup pair. `synergies.md` > Fake Out + Setup and Redirector + Sweeper for specific enablement patterns. `tempo.md` > Lead Pair Evaluation for how setup leads perform under disruption.

### Spread Pressure

A pair deals damage to both opponents simultaneously — Earthquake, Heat Wave, Rock Slide, Dazzling Gleam — wearing down the field without needing setup turns.

**Depends on:** Two Pokemon on the field that can attack. Much lower dependency than setup.

**Fragility:** Low. Spread pressure works even when disrupted. Intimidate weakens physical spread moves but doesn't shut the plan down. Main vulnerabilities are Wide Guard and Pokemon with immunities/resistances to the spread type.

**Cross-ref:** `synergies.md` > Spread Move + Immunity for the pair pattern. `synergies.md` > Helping Hand + Power Move for boosting spread damage.

### Weather/Terrain Engine

A weather setter + an abuser forming a self-contained damage engine.

**Depends on:** The weather staying up. If the opponent overwrites your weather, the engine stalls.

**Fragility:** Medium. The engine is online Turn 1 if the setter leads, but it has a single point of failure: opposing weather/terrain. Teams that rely solely on weather without a non-weather backup are fragile.

**Cross-ref:** `archetypes.md` > Weather for archetype-specific weather cores. `tempo.md` > Plan B Resilience > Weather/Terrain Overwritten for fallback evaluation. `roles.md` > Field Condition Reset for overwrite capability.

### Trick Room Flip

Reversing speed for 5 turns with Trick Room, letting slow heavy hitters move first.

**Depends on:** Trick Room going up. If the setter is flinched by Fake Out, Taunted, KO'd before moving, or the opponent uses Imprison with Trick Room, the plan is denied.

**Fragility:** Medium-high. Trick Room is powerful when it works, but the setup turn is vulnerable. The setter needs protection (Mental Herb for Taunt, Fake Out support, Focus Sash) or inherent resilience (Hatterene's Magic Bounce, Farigiraf's Armor Tail). Once up, the 5-turn clock creates urgency.

**Cross-ref:** `speed-tiers.md` > Trick Room section and Speed Control Interaction. `synergies.md` > Speed Control + Slow Attacker for the pair pattern.

### Attrition / Stall

Outlasting the opponent through Intimidate cycling, recovery, status conditions, and Protect stalling.

**Depends on:** Bulk, recovery options, and the opponent not having a way to break through.

**Fragility:** Varies. Strong against teams with limited offense. Weak against setup sweepers that can boost past Intimidate, or Taunt users that shut down recovery.

**Context in VGC:** Rare as a primary win condition. More common as a backup plan. Evaluate whether the team has enough offensive threat to actually close games.

### Single-Target Burst

Concentrating both Pokemon's attacks on one opponent each turn to score quick KOs and create a numbers advantage.

**Depends on:** Good speed control to act before the opponent, or enough bulk to survive while targeting one threat.

**Fragility:** Low dependency, but requires consistent speed advantage. If the opponent outspeeds and KOs one attacker first, the burst plan collapses into a 1v2.

**Cross-ref:** `speed-tiers.md` > Fast Tier — single-target burst needs speed advantage. `synergies.md` > Dual Offensive Pressure for pairs that threaten wide type coverage.

## Evaluating Win Condition Quality

Four heuristics for assessing how reliable a win condition is.

### Dependency Count

How many things need to go right for the win condition to work?

- **Low dependency (1-2 things):** Spread pressure just needs two Pokemon on the field. Single-target burst just needs speed advantage and two attackers.
- **Medium dependency (3 things):** Weather engine needs setter alive + weather not overwritten + abuser on field. Trick Room needs setter alive + TR not blocked + slow attackers ready.
- **High dependency (4+ things):** Setup sweeper needs enabler alive + enabler's move to succeed + sweeper to survive + boost to go through.

**Heuristic:** Count the things that must go right. Each one is a potential failure point. If a win condition has 4+ dependencies, the team needs a backup plan.

### Disruption Resilience

What commonly available counterplay shuts the win condition down?

- **Red flag:** A win condition that loses to Intimidate, Fake Out, or a widely-used offensive type. Most opponents have these tools.
- **Green flag:** A win condition that requires specific, uncommon counterplay to stop.

**Heuristic:** If a single common move or ability stops the win condition, the team must either have protection or a backup win condition that doesn't share the same vulnerability.

### Turn Count

How many turns until the win condition is "online"?

- **Turn 0 (immediate):** Spread pressure and single-target burst.
- **Turn 1 (one setup action):** Weather engine (if setter leads). Tailwind. One-boost sweepers.
- **Turn 2+ (extended setup):** Trick Room + cleanup. Sweepers needing 2+ boosts.

**Heuristic:** Faster is more reliable. Win conditions that take 2+ turns need strong protection during setup.

### Independence

Does the win condition require specific Pokemon, or can multiple team members execute it?

- **Dependent (one Pokemon):** Only one sweeper. If it's KO'd, the win condition is gone.
- **Semi-independent:** The sweeper is unique, but multiple team members can enable it.
- **Independent (multiple Pokemon):** Two or three Pokemon can independently threaten the same style.

**Heuristic:** The more Pokemon that can independently contribute, the more resilient.

## Win Condition Sufficiency

### Minimum: 2 Independent Win Conditions

If one win condition is shut down, the team needs a second path. These should ideally be in different bring-4 modes.

**What "independent" means:** The two win conditions should not share the same critical failure point. If both depend on the same Pokemon surviving, or both lose to the same common counterplay, they're not truly independent.

**Cross-ref:** `tempo.md` > Plan B Resilience for evaluating whether fallback modes provide independent win conditions.

### Quality Over Quantity

Three fragile win conditions are worse than two resilient ones. Evaluate the best two.

**Heuristic:** Rate each win condition by dependency count and disruption resilience. If the top two both rate poorly, adding a third poor one doesn't fix the problem.

### Archetype Expectations

Different archetypes have different expected win condition profiles:

- **Weather teams:** Primary is the weather engine. Backup should be non-weather-dependent. A weather team where every attacker relies on weather has one win condition.
- **Hyper offense:** Expects multiple independent threats. The win condition is overwhelming pressure from multiple angles.
- **Trick Room:** Primary is TR flip. Backup is usually a fast mode (Tailwind or naturally fast Pokemon) for when TR is denied.
- **Goodstuffs / Balance:** No single engine. The "win condition" is adaptability. Evaluate based on whether the team has enough offensive threat to close games — multiple flexible Pokemon that can combine into different game plans.

**Cross-ref:** `archetypes.md` > Scoring Anchors for detailed archetype descriptions.

### Dual-Mode Pokemon Tension

A Pokemon that participates in two win conditions across different modes adds flexibility but may be suboptimal in both.

**When it's fine:** The Pokemon's role is support (Intimidate, Fake Out, redirection) and its speed tier doesn't matter.

**When it's a problem:** The Pokemon is an attacker with a speed investment trade-off. Too fast for Trick Room, too slow without Tailwind.

**Cross-ref:** `speed-tiers.md` > Trick Room Inverts the Heuristic.

### Endgame / Closer Viability

A win condition describes how the team reaches an advantage, but a **closer** describes how it finishes the game from that advantage. In 2v2 or 1v2 endgames, some Pokemon clean up effortlessly while others need setup that they no longer have time for.

**What to check:**
- In a 2v2 endgame (both teams down to 2 Pokemon), which team members can threaten KOs without needing a setup turn?
- In a 1v2 endgame, does any Pokemon have the speed, coverage, and bulk to win against two weakened opponents?
- After trading 2-for-2 in the first 3 turns, does the remaining bring-4 still have a coherent path to winning, or did the traded Pokemon carry all the win conditions?
- Does the team have at least one Pokemon with strong immediate damage (no setup required) and good speed control or natural speed in the endgame?

**Heuristic:**
- **Strong closer:** A Pokemon that threatens KOs with unboosted attacks, has reliable speed (natural or under Tailwind/TR), and resists common endgame coverage.
- **Weak closer:** A setup sweeper that needs a boost to threaten anything, or a slow Pokemon with no speed control left.
- **No closer:** The team wins through attrition or spread pressure but cannot convert a numbers advantage into a KO race.

**Cross-ref:** `tempo.md` > Plan B Resilience for how fallback modes perform when primary win-condition Pokemon are traded early.

### Team Preview Independence

At Team Preview, the opponent sees which Pokemon are shared across your win conditions. If every viable win condition depends on the same Pokemon surviving, the opponent knows exactly what to target.

**What to check:**
- List the critical Pokemon for each win condition. Is it the same Pokemon across 2+ win conditions?
- Can the team field a bring-4 where the critical Pokemon is NOT the same as in the primary mode?
- Does the team have a "decoy" — a Pokemon that looks critical in preview but is actually secondary?

**Heuristic:**
- **Independent:** Each win condition's critical Pokemon is different. The opponent cannot shut down all paths by targeting one slot.
- **Semi-dependent:** One Pokemon is critical for two win conditions, but the team has a third independent path.
- **Fully dependent:** All win conditions collapse if one Pokemon is KO'd. This is a concentration risk.

**Cross-ref:** `tempo.md` > Preview & Counter-Lead Resilience.
