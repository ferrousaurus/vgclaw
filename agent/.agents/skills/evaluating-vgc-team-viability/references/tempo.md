# Tempo and Game-Plan Resilience

> **Champions Rules Reminder**
> - All IVs are fixed to 31. Never reference 0 IVs or IV manipulation.
> - Stat Points (SPs) replace EVs: 1 SP = 8 EVs, max 32 per stat, 66 total.
> - Damage is deterministic — no random rolls.
> - Level 50 for all VGC calculations.
> - Item pool is limited: no Choice Band, Choice Specs, Life Orb, Assault Vest, Safety Goggles, etc.

> **When to read this file:** This reference is invoked primarily by the **Lead & Resilience** and **Field Condition Management** dimensions in `SKILL.md`. Commonly read alongside `speed-tiers.md` (speed control interaction determines lead viability) and `win-conditions.md` (fallback modes and preview independence).

Heuristics for evaluating lead pairs and whether a team was built with fallback options. Scoped to team construction decisions — this is about whether the team has the tools to execute strong opening turns and recover from disruption, not about in-game piloting.

## Scoring Anchors for Lead & Resilience

Use these anchors when assigning a score to the **Lead & Resilience** dimension in `SKILL.md`:

- **5 (Optimal):** Strong leads with complementary actions and multiple fallback lines. Alternate modes are independent.
- **4 (Strong):** Good leads with one minor brittleness (e.g., one lead pattern that's slightly telegraphed but hard to punish).
- **3 (Acceptable):** Functional leads, but disruption exposes a real weakness with limited backup.
- **2 (Weak):** Brittle leads with one clear line and no fallback. Disruption collapses the game plan.
- **1 (Critical flaw):** No viable lead pair. The team cannot execute a productive Turn 1 in any mode.

## Lead Pair Evaluation

Each bring-4 mode implies a lead pair — the two Pokemon you put on the field Turn 1. Strong leads set the tone. Weak leads let the opponent dictate the pace.

### What Makes a Strong Lead Pair

#### Complementary Turn 1 Actions

The two Pokemon want to do different things on Turn 1, and those actions don't conflict.

- **Strong complementary leads:** Fake Out + Setup, Tailwind + Protect, spread attack + redirect. Both have a clear, useful action.
- **Weak leads:** Both want to set up, both use support moves with no offensive pressure, or one has no useful Turn 1 action.

**Heuristic:** If removing either Pokemon from the lead makes Turn 1 significantly worse, the pair has strong Turn 1 synergy.

#### Threat Projection

The lead pair should force the opponent into a difficult choice. If the opponent can freely ignore one lead, your lead is passive.

- **Strong threat projection:** Both threaten damage or meaningful disruption. The opponent can't address both.
- **Weak threat projection:** One is obviously non-threatening, allowing the opponent to double-target the sole threat.

**Cross-ref:** `synergies.md` > Dual Offensive Pressure.

#### Flexibility Under Disruption

What happens when the opponent disrupts your planned Turn 1?

- **Strong flexibility:** The lead has alternative lines. The Fake Out user can attack if the opponent Protects. The setter has Focus Sash. The sweeper can attack instead of setting up.
- **Weak flexibility:** The lead has one line and folds if disrupted.

**Heuristic:** Ask "What happens if the opponent's Turn 1 stops our primary plan?" If the answer is "we have no backup," the lead is brittle.

#### Information Hiding

Some leads telegraph the game plan immediately (Torkoal + Hatterene = Trick Room). Others are ambiguous.

- **When it matters:** Goodstuffs and balance teams benefit from ambiguous leads.
- **When it doesn't:** Dedicated archetype teams don't hide their plan — their strength is execution.

**Scoring relevance:** When evaluating `Lead & Resilience` in `SKILL.md`:
- For **Goodstuffs / Balance**, information hiding is a **positive scoring factor**. An ambiguous lead that forces the opponent to guess between 2+ plausible game plans raises the score.
- For **dedicated archetypes** (Rain, Tailwind HO, Trick Room, etc.), information hiding is **neutral**. These teams are scored on execution strength, not deception. Do not penalize a dedicated archetype for having a telegraphed lead.

### Common Lead-Pair Patterns

#### Fake Out + Attacker/Setter

One Pokemon uses Fake Out to flinch an opponent, giving the partner a free action.

- **Strong when:** The partner's Turn 1 is high-impact. The Fake Out user has follow-up utility.
- **Weak when:** The partner's Turn 1 is low-impact. The Fake Out user has nothing to do on Turn 2+.
- **Vulnerable to:** Inner Focus, Psychic Terrain, Armor Tail, Queenly Majesty. Opposing double-target into the partner.

#### Dual Offense

Two attackers threatening immediate KOs from Turn 1. No setup phase.

- **Strong when:** Both are in the fast or blazing speed tier and threaten KOs with STAB. Physical + special split.
- **Weak when:** The pair is slower than common threats. Both are the same attack category.
- **Vulnerable to:** Intimidate, opposing Fake Out, opposing speed control.

#### Redirect + Setup

One Pokemon uses Follow Me or Rage Powder while the partner boosts or attacks.

- **Strong when:** The redirector is bulky enough for multiple hits. The partner threatens a sweep after one boost.
- **Weak when:** The opponent has spread moves that bypass redirection. The redirector goes down in one hit.
- **Telegraphed:** Announces setup. The opponent can use spread moves or double-target the sweeper.

#### Speed Control + Attacker

One Pokemon sets Tailwind or Trick Room. The partner Protects or attacks.

- **Strong when:** The setter is fast or bulky enough to get the speed control up. The attacker is in the right speed tier.
- **Weak when:** The setter is fragile. The attacker doesn't benefit enough from the speed change.
- **Backup plan matters:** If the setter goes down Turn 1, does the team have secondary speed control? See Plan B Resilience.

## Plan B Resilience

Does the team have fallback options when the primary plan is disrupted?

### Disruption Scenarios

Evaluate the team against these common scenarios. For each, ask: "Does the team have a path to winning if this happens?"

#### Lead Pokemon KO'd Turn 1

The opponent concentrates fire on your key lead and KOs it. Does the team have a bring-4 mode that doesn't depend on any single Pokemon surviving Turn 1?

**What to check:** Identify the most critical Pokemon in each mode. If it's KO'd, does the remaining trio have a coherent plan? Does the team have an alternate mode that doesn't include the vulnerable Pokemon?

**Cross-ref:** `win-conditions.md` > Independence.

#### Speed Control Denied

Tailwind is Taunted. Trick Room is Imprisoned. The setter is flinched or KO'd.

**What to check:** Does the team have secondary speed control? Does it have naturally fast Pokemon (blazing or fast tier) that can function without speed control?

**Cross-ref:** `speed-tiers.md` > Blazing Tier — teams with blazing-tier attackers are inherently more resilient.

#### Weather/Terrain Overwritten

The opponent brings their own setter and overwrites your field condition.

**What to check:** Does the team have at least one attacker that functions without the field condition? A second setter to re-establish? Can the non-condition mode compete independently?

**Cross-ref:** `win-conditions.md` > Disruption Resilience and `roles.md` > Field Condition Reset.

#### Setup Denied

Taunt, Encore, or a Turn 1 KO prevents boosting.

**What to check:** Does the team have a non-setup win condition? Can it apply spread pressure or single-target burst without boosts? An alternate mode that doesn't depend on setup?

**Cross-ref:** `win-conditions.md` > Win Condition Sufficiency.

### Resilience Heuristics

#### Mode Independence

A resilient team's alternate modes don't share the same points of failure. If both your Tailwind mode and your offensive mode rely on the same Pokemon surviving Turn 1, losing that Pokemon collapses both plans.

**What to check:** For each bring-4 mode, identify the single most important Pokemon. Is it the same Pokemon across multiple modes? If yes, the team has a concentration risk.

**Ideal:** Each mode's critical Pokemon is different.

**Cross-ref:** `synergies.md` — evaluate whether modes share key Pokemon.

#### Role Redundancy as Insurance

Role redundancy within a bring-4 is flagged in `synergies.md` > Role Redundancy. But having the same role across different modes is insurance.

**Example:** Fake Out on your primary lead AND on a slot 5-6 alternate. If the primary is KO'd, the team still has Fake Out access.

**Heuristic:**
- **Within a single bring-4:** Usually wasteful.
- **Across the full team of 6:** Often valuable.

#### Preview & Counter-Lead Resilience

At Team Preview, the opponent sees your 6 Pokemon and can infer your game plan. A team that telegraphs a single, counterable strategy is structurally brittle.

**What to check:**
- Does the opponent's preview reveal a single game plan? (e.g., Whimsicott + Feraligatr + 4 obvious support = "Tailwind setup sweep").
- Can the opponent safely counter-lead? (e.g., leading a Pokemon with Fake Out immunity + a Tailwind setter of their own).
- Are there multiple plausible bring-4 groups that don't share the same lead pattern?

**Severity heuristics:**
- **Strong:** The team has 2+ distinct lead patterns that look different in preview. The opponent cannot safely prepare for all of them.
- **Weak:** The team has one obvious lead and 2+ "filler" Pokemon that never see play. The opponent knows exactly what to expect.

**Cross-ref:** `win-conditions.md` > Independence and `synergies.md` > Mode Pairs for how shared critical Pokemon across modes create concentration risk.

#### Preview Threat Density

At preview, the opponent decides which 4 Pokemon to bring. If 2+ slots on your team are obvious "never bring" filler, the opponent's decision is trivial. If all 6 look viable, the opponent must guess.

**What to check:**
- How many of the 6 Pokemon would a competent opponent seriously consider bringing against a generic meta team? (Minimum threshold: 4+)
- Are there 2+ slots with zero synergy layers, no viable bring-4 inclusion, or roles fully duplicated by another slot?
- Does the team have "decoy" slots — Pokemon that look threatening in preview but are actually secondary?

**Severity heuristics:**
- **High threat density (5-6 viable slots):** The opponent cannot safely prepare for all possibilities. This is a structural advantage.
- **Medium threat density (4 viable slots):** Functional. The opponent has a good guess but not a guaranteed read.
- **Low threat density (2-3 viable slots):** The opponent knows exactly what to bring. The team has filler slots that waste team-building resources.

**Cross-ref:** `synergies.md` > Sampling Heuristic for how to identify the core vs. filler slots.

## Switching & Positioning Flexibility

VGC is a game of positioning as much as raw stats. Teams that can switch safely maintain tempo; teams that must hard-switch to answer threats lose it.

**What to check:**
- Does the team have pivot moves (U-turn, Volt Switch, Parting Shot, Flip Turn)? Query `assets/moves.json` for availability.
- Does any Pokemon have the Regenerator ability? Query `assets/abilities.json`.
- Are there naturally safe switch-ins — Pokemon that resist common offensive types and have enough bulk to take a hit on switch-in?
- Can the team answer a threat without sacrificing a Pokemon to a double-target?

**Severity heuristics:**
- **Strong:** 2+ pivot users or Regenerator users, or multiple safe switch-ins into common coverage (Ground, Ice, Fairy).
- **Weak:** No pivoting, no Regenerator, and every switch-in risks a KO. The team must win through raw trading because it cannot reposition.

**Cross-ref:** `roles.md` > Pivoting / Momentum. Evaluate alongside `synergies.md` > Defensive Pivot Pairs > Type Complement — safe switch-ins often come from pairs that cover each other's weaknesses.

### Graceful Degradation

The best teams win cleanly when the plan works and still compete when it doesn't.

**Heuristic:** Describe a common disruption scenario. If the team has zero path to winning, it's a construction flaw. The backup plan doesn't have to be as strong as Plan A — it just has to exist.
