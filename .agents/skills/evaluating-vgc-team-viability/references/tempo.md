# Tempo and Game-Plan Resilience

Heuristics for evaluating lead pairs and whether a team was built with fallback options. Scoped to team construction decisions — this is about whether the team has the tools to execute strong opening turns and recover from disruption, not about in-game piloting.

## Lead Pair Evaluation

Each bring-4 mode implies a lead pair — the two Pokemon you put on the field Turn 1. Strong leads set the tone for the game. Weak leads let the opponent dictate the pace.

### What Makes a Strong Lead Pair

#### Complementary Turn 1 Actions

The two Pokemon want to do different things on Turn 1, and those actions don't conflict with each other.

- **Strong complementary leads:** Fake Out + Setup (one flinches, one boosts), Tailwind + Protect (one sets speed, one stays safe), spread attack + redirect (one deals damage, one absorbs incoming fire). In each case, both Pokemon have a clear, useful action that supports the shared game plan.
- **Weak leads:** Both want to set up (neither pressures the opponent), both use support moves with no offensive pressure (the opponent gets a free Turn 1), one Pokemon has no useful Turn 1 action (dead weight in the lead position).

**Heuristic:** If removing either Pokemon from the lead makes Turn 1 significantly worse, the pair has strong Turn 1 synergy. If one Pokemon could be replaced with any other and Turn 1 wouldn't change, it's not contributing to the lead dynamic.

#### Threat Projection

The lead pair should force the opponent into a difficult choice on Turn 1. If the opponent can freely ignore one of your leads — because it's not threatening and not enabling anything threatening — your lead is passive.

- **Strong threat projection:** Both Pokemon threaten damage or meaningful disruption. The opponent has to choose which threat to address and accepts that the other will execute its plan. Example: Garchomp threatens Earthquake while Gardevoir threatens Dazzling Gleam — the opponent can't Protect against both types.
- **Weak threat projection:** One Pokemon is obviously non-threatening (a pure support Pokemon with no offensive presence), allowing the opponent to double-target the sole threat and ignore the support. This is especially bad if the support Pokemon's contribution can be played around (e.g., Protecting against a predicted Fake Out).

**Cross-ref:** synergies.md > Dual Offensive Pressure for the offensive pairing pattern.

#### Flexibility Under Disruption

What happens when the opponent disrupts your planned Turn 1? The opponent leads Fake Out into your setter, double-targets your sweeper, or brings an unexpected counter.

- **Strong flexibility:** The lead pair has alternative lines. The Fake Out user can attack if the opponent Protects. The setter has Focus Sash to survive a hit. The sweeper can attack instead of setting up if the opponent's lead matchup is favorable. Multiple reasonable Turn 1 choices exist.
- **Weak flexibility:** The lead has one line and folds if it's disrupted. If the setter goes down, there's no backup. If Fake Out is blocked (Inner Focus, Psychic Terrain, Armor Tail), the enabler has nothing to do. The pair was built for one scenario and doesn't adapt.

**Heuristic:** For each lead pair, ask: "What happens if the opponent's Turn 1 stops our primary plan?" If the answer is "we have no backup," the lead is brittle.

#### Information Hiding

Some leads telegraph the game plan immediately (Torkoal + Venusaur = sun, Hatterene + Torkoal = Trick Room). The opponent knows what's coming and can plan accordingly. Other leads are ambiguous — they could be executing multiple different plans, and the opponent has to guess.

- **When information hiding matters:** Goodstuffs and balance teams benefit most from ambiguous leads. The opponent's uncertainty is your advantage. Leads that could be Tailwind mode OR offensive mode depending on what you click force the opponent to respect both options.
- **When it doesn't matter:** Dedicated archetype teams (weather, Trick Room) don't hide their plan — their strength comes from executing the engine, not from surprise. A Trick Room team's lead telegraphs TR, and that's fine because the opponent's answer to TR might not be on their team.

### Common Lead-Pair Patterns

These are lead-pair patterns (how two Pokemon perform on Turn 1 together), not team archetypes.

#### Fake Out + Attacker/Setter

The safe default. One Pokemon uses Fake Out to flinch an opponent, giving the partner a free action — setup move, Tailwind, Trick Room, or a powerful attack without fear of disruption from the flinched target.

- **Strong when:** The partner's Turn 1 action is high-impact (Trick Room, Dragon Dance, or a STAB attack that threatens a KO). The Fake Out user has follow-up utility after Turn 1 (Helping Hand, Intimidate, pivoting moves).
- **Weak when:** The partner's Turn 1 action is low-impact (a support move that doesn't change the game state meaningfully). The Fake Out user has nothing to do on Turn 2+.
- **Vulnerable to:** Inner Focus, Psychic Terrain, Armor Tail, Queenly Majesty (block Fake Out). Opposing double-target into the partner (Fake Out only stops one opponent).

#### Dual Offense

Two attackers threatening immediate KOs from Turn 1. No setup phase — just damage.

- **Strong when:** Both Pokemon are in the fast or blazing speed tier (see speed-tiers.md) and threaten KOs with their STAB moves. The opponent can't Protect against both because they hit different types. Physical + special split makes it hard to wall both.
- **Weak when:** The pair is slower than common threats (they take hits before dealing damage). Both are the same attack category (Intimidate weakens both physical attackers, or both special attackers share vulnerabilities).
- **Vulnerable to:** Intimidate (weakens physical attackers), opposing Fake Out (steals initiative), and opposing speed control that outspeeds both.

#### Redirect + Setup

One Pokemon uses Follow Me or Rage Powder to absorb single-target attacks while the partner boosts or attacks freely.

- **Strong when:** The redirector is bulky enough to take multiple hits, giving the partner several free turns. The partner threatens a sweep after one boost.
- **Weak when:** The opponent has spread moves (Heat Wave, Rock Slide, Earthquake) that bypass redirection entirely. The redirector goes down in one hit, providing barely more value than Fake Out.
- **Telegraphed:** This lead announces "we're setting up." The opponent knows to use spread moves or double-target the sweeper before the redirector can act (if faster).

#### Speed Control + Attacker

One Pokemon sets Tailwind or Trick Room. The partner either Protects (safe line) or attacks (aggressive line, risking the setter being KO'd before moving).

- **Strong when:** The setter is fast enough or bulky enough to reliably get the speed control up. The attacker is in the right speed tier to benefit (mid tier for Tailwind, TR tier for Trick Room — see speed-tiers.md > Speed Control Interaction).
- **Weak when:** The setter is fragile and likely to be KO'd before moving. The attacker doesn't benefit enough from the speed change (already fast for Tailwind, not slow enough for TR).
- **Backup plan matters:** If the setter goes down Turn 1, does the team have a secondary speed control option? See Plan B Resilience below.

## Plan B Resilience

Does the team have fallback options when the primary game plan is disrupted? This is about team construction — whether the team was built with backup plans, not about in-game adaptation.

### Disruption Scenarios

Evaluate the team against these common disruption scenarios. For each, ask: "Does the team have a path to winning if this happens?"

#### Lead Pokemon KO'd Turn 1

The opponent concentrates fire on your key lead and KOs it before it acts. Does the team have a bring-4 mode that doesn't depend on any single Pokemon surviving Turn 1?

**What to check:** Identify which Pokemon is most critical to each mode's Turn 1 plan. If that Pokemon is KO'd, does the remaining trio have a coherent plan? Does the team have an alternate mode that doesn't include the vulnerable Pokemon?

**Cross-ref:** win-conditions.md > Independence — a team where the only win condition depends on one specific Pokemon surviving is structurally fragile.

#### Speed Control Denied

Tailwind is Taunted. Trick Room is Imprisoned. The setter is flinched by Fake Out or KO'd before moving. The opponent has blocked your speed plan.

**What to check:** Does the team have a secondary speed control option (a second Tailwind user, Icy Wind, Thunder Wave, Choice Scarf)? Does the team have naturally fast Pokemon (blazing or fast tier) that can function without speed control?

**Cross-ref:** speed-tiers.md — teams with blazing-tier attackers are inherently more resilient to speed control denial because they don't depend on Tailwind/TR to move first. Teams where every attacker is mid-tier or slower and the only speed control is one Tailwind setter are extremely fragile to this scenario.

#### Weather/Terrain Overwritten

The opponent brings their own weather setter and overwrites your weather. Your weather-dependent attackers lose their speed doubling and damage boost.

**What to check:** Does the weather team have at least one attacker that deals meaningful damage without the weather active? Does the team have a second weather setter to re-establish weather? Can the team's non-weather mode compete independently?

**Cross-ref:** win-conditions.md > Disruption Resilience — a weather team where every attacker depends on weather has a single point of failure.

#### Setup Denied

Taunt, Encore, or a Turn 1 KO prevents the sweeper from boosting. The setup win condition is offline.

**What to check:** Does the team have a non-setup win condition? Can the team apply spread pressure or single-target burst without needing boosts? Is there an alternate mode that doesn't depend on setup?

**Cross-ref:** win-conditions.md > Win Condition Sufficiency — if the team's only win condition is a setup sweeper, this scenario is an auto-loss.

### Resilience Heuristics

#### Mode Independence

A resilient team's alternate modes don't share the same points of failure. If both your Tailwind mode and your offensive mode rely on the same Pokemon surviving Turn 1, losing that Pokemon collapses both plans.

**What to check:** For each bring-4 mode, identify the single most important Pokemon. Is it the same Pokemon across multiple modes? If yes, the team has a concentration risk — one well-placed KO eliminates multiple game plans.

**Ideal:** Each mode's critical Pokemon is different. Losing a key player in one mode still leaves another mode fully functional.

**Cross-ref:** synergies.md — evaluate whether modes share key Pokemon by looking at which synergy pairs appear in multiple bring-4 groups.

#### Role Redundancy as Insurance

Role redundancy is flagged as an anti-synergy in synergies.md > Role Redundancy when both Pokemon appear in the same bring-4. But having the same role available across different modes is insurance, not waste.

**Example:** Fake Out on your primary lead (Incineroar in the core-4) AND on a slot 5-6 alternate (Scrafty in a backup mode). If Incineroar is KO'd or the opponent leads a matchup where Incineroar is bad, the team still has Fake Out access through a different mode.

**Heuristic:** Evaluate redundancy at two levels:
- **Within a single bring-4:** Usually wasteful. Two Fake Out users in the same mode means one slot is doing a job the other could do. The redundant slot would be better filled by a different role.
- **Across the full team of 6:** Often valuable. The same role in different modes means the role survives even if one mode is countered. This is resilience by design.

#### Graceful Degradation

The best teams don't need everything to go right. They win cleanly when the plan works and still compete when it doesn't.

**Heuristic:** Describe a common disruption scenario (speed control denied, weather overwritten, key Pokemon KO'd Turn 1). If the team has zero path to winning in that scenario, it's a team construction flaw, not a piloting problem. The team needs to be built with at least a suboptimal path to victory in each common scenario.

**What "suboptimal path" means:** The backup plan doesn't have to be as strong as Plan A. A weather team that can still apply some pressure without weather (even if it's weaker) is more resilient than one that literally cannot threaten the opponent when weather is down. The question isn't "is Plan B as good as Plan A?" — it's "does Plan B exist at all?"
