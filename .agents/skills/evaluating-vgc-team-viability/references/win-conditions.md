# Win Condition Evaluation

How to assess whether a VGC team has sufficient, reliable, and diverse ways to win games. A win condition is a repeatable path to knocking out the opponent's bring-4 — a plan the team can execute, not just a strong individual Pokemon.

## Win Condition Types

### Setup Sweeper

A Pokemon boosts its stats (Swords Dance, Dragon Dance, Calm Mind, Nasty Plot, Quiver Dance) and then overwhelms the opponent with boosted attacks.

**Depends on:** Enablers — Fake Out, redirection, Intimidate — to buy the setup turn. If enablers are removed or blocked, the sweeper may never get to boost.

**Fragility:** High dependency. The sweeper needs to survive a turn, successfully boost, and then not be revenge killed. If the opponent has Taunt, Encore, Haze, or just KOs the sweeper before it boosts, the plan collapses.

**Cross-ref:** synergies.md > Setup + Enabler for evaluating the quality of the setup pair. synergies.md > Fake Out + Setup and Redirector + Sweeper for specific enablement patterns. tempo.md > Lead Pair Evaluation for how setup leads perform under disruption.

### Spread Pressure

A pair deals damage to both opponents simultaneously — Earthquake, Heat Wave, Rock Slide, Dazzling Gleam — wearing down the field without needing setup turns.

**Depends on:** Two Pokemon on the field that can attack. Much lower dependency than setup.

**Fragility:** Low. Spread pressure works even when disrupted because it doesn't need a setup turn. Intimidate weakens physical spread moves but doesn't shut the plan down. The main vulnerability is Wide Guard (blocks some spread moves) and Pokemon with immunities/resistances to the spread type.

**Cross-ref:** synergies.md > Spread Move + Immunity for the pair pattern. synergies.md > Helping Hand + Power Move for boosting spread damage.

### Weather/Terrain Engine

A weather setter (Drought, Drizzle, Sand Stream, Snow Warning) + an abuser (Chlorophyll, Swift Swim, Sand Rush, Slush Rush, or weather-boosted moves) forming a self-contained damage engine.

**Depends on:** The weather staying up. If the opponent brings a different weather setter and overwrites your weather, the engine stalls. The setter needs to be on the field or re-enter to reset weather.

**Fragility:** Medium. The engine is online Turn 1 if the setter leads (low turn count), but it has a single point of failure: opposing weather. Teams that rely solely on weather without a non-weather backup win condition are fragile.

**Cross-ref:** archetypes.md for archetype-specific weather cores. tempo.md > Plan B Resilience > Weather/Terrain Overwritten for fallback evaluation.

### Trick Room Flip

Reversing speed for 5 turns with Trick Room, letting slow heavy hitters move first and overwhelm faster opponents.

**Depends on:** Trick Room going up. If the setter is flinched by Fake Out, Taunted, KO'd before moving, or the opponent uses Imprison with Trick Room, the entire plan is denied.

**Fragility:** Medium-high. Trick Room is powerful when it works, but the setup turn is vulnerable. The setter needs protection (Mental Herb for Taunt, Fake Out support, Focus Sash) or inherent resilience (Hatterene's Magic Bounce blocks Taunt, Farigiraf's Armor Tail blocks priority). Once Trick Room is up, the 5-turn clock creates urgency — the team needs to close the game before turns expire.

**Cross-ref:** speed-tiers.md > Trick Room section and Speed Control Interaction > Trick Room Teams for team composition. synergies.md > Speed Control + Slow Attacker for the pair pattern.

### Attrition / Stall

Outlasting the opponent through Intimidate cycling, recovery, status conditions, and Protect stalling. The opponent runs out of resources (PP, healthy Pokemon, patience) before you do.

**Depends on:** Bulk, recovery options, and the opponent not having a way to break through the defensive core.

**Fragility:** Varies. Strong against teams with limited offensive options or no way to boost past Intimidate. Weak against setup sweepers that can boost to the point where Intimidate doesn't matter, or Taunt users that shut down recovery and status.

**Context in VGC:** Rare. VGC's fast pace and 4v4 format make pure stall difficult. However, elements of attrition (Intimidate cycling, Protect stalling to waste Trick Room turns, recovery on bulky pivots) appear in many successful teams as a secondary plan. It's more common as a backup win condition than a primary one.

### Single-Target Burst

Concentrating both Pokemon's attacks on one opponent each turn to score quick KOs and create a numbers advantage (2v1 → win). No setup required.

**Depends on:** Good speed control to act before the opponent, or enough bulk to survive while targeting one threat at a time.

**Fragility:** Low dependency (just needs two attackers on the field), but requires consistent speed advantage. If the opponent outspeeds and KOs one of your attackers first, the burst plan collapses into a 1v2.

**Cross-ref:** speed-tiers.md — single-target burst needs the team to be faster or to use speed control. Without speed advantage, the opponent can do the same thing to you. synergies.md > Dual Offensive Pressure for pairs that threaten wide type coverage in burst mode.

## Evaluating Win Condition Quality

Four heuristics for assessing how reliable a win condition is.

### Dependency Count

How many things need to go right for the win condition to work?

- **Low dependency (1-2 things):** Spread pressure just needs two Pokemon on the field. Single-target burst just needs speed advantage and two attackers. These are reliable because they have few failure points.
- **Medium dependency (3 things):** Weather engine needs the setter alive + weather not overwritten + abuser on the field. Trick Room needs the setter alive + TR not blocked + slow attackers ready.
- **High dependency (4+ things):** Setup sweeper needs the enabler alive + enabler's move to succeed (Fake Out not blocked, Follow Me not bypassed) + sweeper to survive the turn + boost to go through (no Taunt/Encore). Each additional dependency is another way the plan can fail.

**Heuristic:** Count the things that must go right. Each one is a potential failure point. Fewer dependencies = more reliable. If a win condition has 4+ dependencies, the team needs a backup plan for when it fails.

### Disruption Resilience

What commonly available counterplay shuts the win condition down?

- **Ask:** Is there a single move, ability, or common lead that invalidates this win condition? How often will the opponent have access to that counterplay?
- **Red flag:** A win condition that loses to Intimidate (the most common ability in VGC), Fake Out (on many common leads), or a widely-used offensive type. If most opponents have the tools to stop your plan, it's fragile.
- **Green flag:** A win condition that requires specific, uncommon counterplay to stop. If only niche picks counter it, most opponents won't have the answer.

**Heuristic:** If a single common move or ability stops the win condition, the team must either have protection against that disruption or a backup win condition that doesn't share the same vulnerability.

### Turn Count

How many turns until the win condition is "online" and threatening?

- **Turn 0 (immediate):** Spread pressure and single-target burst are online the moment both Pokemon are on the field. No setup required.
- **Turn 1 (one setup action):** Weather engine is online if the setter leads (weather sets automatically). Tailwind is one move. One-boost sweepers (Swords Dance, Dragon Dance) need one turn.
- **Turn 2+ (extended setup):** Trick Room needs a turn to set up, then attackers need TR turns to clean. Sweepers that need 2+ boosts need multiple turns.

**Heuristic:** Faster is more reliable because the opponent has fewer turns to disrupt the plan. Every turn of setup is a turn the opponent can use to Taunt, KO, or pivot. Win conditions that take 2+ turns to come online need strong protection during setup.

### Independence

Does the win condition require specific Pokemon to be alive, or can multiple team members execute it?

- **Dependent (one Pokemon):** Only one Pokemon on the team can sweep after setup. If it's KO'd before boosting, the win condition is gone.
- **Semi-independent (one Pokemon, replaceable enabler):** The sweeper is unique, but multiple team members can enable it (Fake Out from Incineroar OR Follow Me from Clefable). Losing one enabler doesn't kill the plan.
- **Independent (multiple Pokemon):** Two or three Pokemon can independently threaten the same style of win condition. If one goes down, another can execute a similar plan.

**Heuristic:** The more Pokemon that can independently contribute to a win condition, the more resilient it is. A team where all damage comes through one sweeper is fragile. A team where 2-3 members can each threaten KOs (even without boosts) is resilient.

## Win Condition Sufficiency

Heuristics for whether a team has enough win conditions.

### Minimum: 2 Independent Win Conditions

If one win condition is shut down (weather overwritten, setup sweeper KO'd before boosting, Trick Room blocked), the team needs a second path to winning. These should ideally be in different bring-4 modes so the team can adapt at team preview.

**What "independent" means:** The two win conditions should not share the same critical failure point. If both depend on the same Pokemon surviving, or both lose to the same common counterplay (Intimidate, Taunt), they're not truly independent — they fail together.

**Cross-ref:** tempo.md > Plan B Resilience for evaluating whether the team's fallback modes actually provide independent win conditions.

### Quality Over Quantity

Three fragile win conditions (all high-dependency, all vulnerable to common counterplay) are worse than two resilient ones. Evaluate the best two win conditions, not the total count.

**Heuristic:** Rate each win condition by dependency count and disruption resilience. If the team's top two win conditions both rate poorly, adding a third poor one doesn't fix the problem — the team needs to strengthen its existing win conditions (e.g., adding protection for a setup sweeper) or replace one with a more resilient option.

### Archetype Expectations

Different archetypes have different expected win condition profiles:

- **Weather teams:** Primary win condition is the weather engine. Backup should be a non-weather-dependent attacker or mode. A weather team where every attacker relies on weather has one win condition, not several.
- **Hyper offense:** Expects multiple independent threats — several Pokemon that can each score KOs without needing each other. The win condition is overwhelming pressure from multiple angles.
- **Trick Room:** Primary win condition is TR flip. Backup is usually a fast mode (Tailwind or naturally fast Pokemon) for when TR is denied or when facing opposing TR teams.
- **Goodstuffs / Balance:** No single engine. The "win condition" is adaptability — multiple flexible Pokemon that can combine into different game plans depending on the matchup. Evaluate based on whether the team has enough offensive threat to actually close games, not based on a specific engine.

**Cross-ref:** archetypes.md for detailed archetype descriptions.

### Dual-Mode Pokemon Tension

A Pokemon that participates in two win conditions across different modes (e.g., a mid-speed Pokemon that works in both the Tailwind plan and a non-Tailwind plan) adds flexibility but may be suboptimal in both modes.

**When it's fine:** The Pokemon's role is support (Intimidate, Fake Out, redirection) and its speed tier doesn't matter much. Incineroar works in almost any mode because its value is utility, not speed-dependent.

**When it's a problem:** The Pokemon is an attacker whose speed investment creates a genuine trade-off between modes. Too fast for Trick Room, too slow without Tailwind. This means the Pokemon is a liability in at least one mode.

**Cross-ref:** speed-tiers.md > Trick Room Inverts the Heuristic for the speed investment tension on dual-mode attackers.
