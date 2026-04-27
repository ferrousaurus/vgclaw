# Speed Tier Framework

> **Champions Rules Reminder**
> - All IVs are fixed to 31. Never reference 0 IVs or IV manipulation.
> - Stat Points (SPs) replace EVs: 1 SP = 8 EVs, max 32 per stat, 66 total.
> - Damage is deterministic — no random rolls.
> - Level 50 for all VGC calculations.
> - Item pool is limited: no Choice Band, Choice Specs, Life Orb, Assault Vest, Safety Goggles, etc.
> - Minimum Speed is achieved with **0 Speed SPs + a Speed-hindering nature** (Brave, Quiet, Relaxed, Sassy).

> **When to read this file:** This reference is invoked primarily by the **Speed Profile** dimension in `SKILL.md`. Commonly read alongside `stat-calculations.md` (for exact speed benchmarks), `synergies.md` (Speed Control + Slow Attacker is a synergy pattern), and `items.md` (Choice Scarf and Mega Stones shift speed tiers).

Qualitative speed reasoning for Pokemon Champions VGC. All guidance is tier-based and relative. Use this to evaluate speed investments, assess team composition, and reason about speed control interactions.

**How to determine a Pokémon's tier:** Look up its base Speed in `assets/pokemon.json` and match it to the base Speed ranges below. For exact benchmarks when borderline, use `stat-calculations.md`.

**Note on minimum Speed:** In Pokemon Champions, all IVs are fixed to 31. To minimize Speed, use **0 Speed SPs and a Speed-hindering nature** (Brave, Quiet, Relaxed, or Sassy). Do not reference 0 IVs — they do not exist in this format.

## Speed Tiers (by Base Speed)

**Note on boundaries:** Tier boundaries (e.g., base 94 vs. 95, 45 vs. 46) are approximate. The actual Speed stat difference at Level 50 between adjacent base stats is minimal. When a Pokemon is near a threshold, use exact stat benchmarks from `stat-calculations.md` to determine which tier it effectively occupies at its given investment level.

### Blazing
**Base Speed ≥ 115**

The fastest Pokémon in the format. These naturally outspeed nearly everything without dedicated speed investment. They don't need Tailwind or speed control support — they ARE the fast pressure.

**Role in teams:** Primary fast threats or fast support. Speed investment for these Pokémon is about outspeeding each other, not the rest of the roster. If your team runs a blazing-tier Pokémon, you often don't need Tailwind to go fast.

### Fast
**Base Speed 95 – 114**

Outspeeds most of the roster with modest speed investment. These Pokémon are naturally quick but can be outsped by the blazing tier. They benefit from speed control mainly to outrun other fast or blazing-tier Pokémon, or Choice Scarf users.

**Role in teams:** Core attackers that function well without speed control but become dominant with it. Fast-tier Pokémon under Tailwind outspeed even the blazing tier, which can be relevant but offers diminishing returns — they were already outspeeding most threats.

### Mid
**Base Speed 70 – 94**

The crowded tier where speed investment decisions matter most. Many competitively viable Pokémon cluster here, and a few SPs can flip dozens of matchups. Tailwind transforms mid-tier Pokémon into effective fast threats.

**Role in teams:** The primary beneficiaries of Tailwind. Under Tailwind, mid-tier Pokémon jump to effectively blazing. Without speed control, they need to accept being outsped by fast and blazing tiers and rely on bulk, priority, or redirection to function. Speed SP decisions for mid-tier Pokémon are the most impactful on the team.

### Slow
**Base Speed 46 – 69**

Too slow to compete without speed control. These Pokémon need Tailwind to function in a fast mode, or they lean into their bulk and accept moving second. Some operate well in a Trick Room team that also has a non-TR mode, sitting in an awkward middle ground.

**Role in teams:** Often support Pokémon whose value is utility (Intimidate, Fake Out, redirection) rather than speed, or bulky attackers that accept moving second. Speed investment is usually minimal — just enough to outspeed other slow-tier Pokémon or reach a specific threshold under Tailwind.

### Trick Room
**Base Speed ≤ 45**

So slow that Trick Room is the primary or only way to let them move first. Under Trick Room, these become the fastest Pokémon on the field. Speed investment is actively bad — **0 Speed SPs + Speed-hindering nature** is correct.

**Role in teams:** Trick Room attackers or setters. These Pokémon define the Trick Room mode. Outside of Trick Room, they move last against nearly everything, which is a liability in non-TR modes. For dual-mode teams, Trick Room-tier Pokémon typically only appear in the TR bring-4, not the fast bring-4.

### Definition of "Naturally Fast"

"Naturally fast threats" are Blazing-tier (base Speed ≥115) or Fast-tier (base 95–114) Pokemon with meaningful offensive investment (≥16 offensive SPs or a boosting nature) that do not require speed control to outspeed common mid-tier threats.

**Not naturally fast:**
- A Fast-tier Pokemon with 0 Speed SPs and a neutral nature will be outsped by invested mid-tier Pokemon.
- A mid-tier or slow-tier Pokemon, regardless of investment, is not naturally fast — it requires speed control to compete with fast threats.
- **Exception:** A mid-tier Pokemon holding **Choice Scarf** with ≥16 offensive SPs counts as a naturally fast threat, because Scarf provides a reliable 1.5x speed multiplier that shifts it to Fast-tier speed without requiring team-wide speed control.

**Role in evaluation:** A team with "no speed control and no naturally fast threats" has a structural speed deficit. Such teams rely entirely on reactive speed drops (Icy Wind, Thunder Wave) or must accept moving second against common threats.

## Priority Moves as Speed Control Backup

Priority moves allow a Pokemon to move before the opponent regardless of Speed stat, functioning as a backup plan when primary speed control (Tailwind, Trick Room, Choice Scarf) is denied.

- **Common priority moves:** Quick Attack, Ice Shard, Sucker Punch, Mach Punch, Bullet Punch, Aqua Jet, Extreme Speed, Shadow Sneak.
- **How to query:** Check `assets/moves.json` for `priority` field > 0.

**Role in team evaluation:**
- A team with 1-2 priority users has a reactive answer to fast threats even without speed control.
- Priority is particularly valuable on teams with slow attackers that need to pick off low-HP opponents before they move.
- Sucker Punch's reliance on the opponent attacking makes it less reliable as a "guaranteed" priority move.

**Cross-ref:** `win-conditions.md` > Disruption Resilience. Priority coverage is a form of disruption resilience — it provides a path to winning even when the primary speed plan fails.

---

## Speed Investment Heuristics

### Invest to outspeed your tier, not the tier above

A mid-tier Pokémon trying to outspeed fast-tier Pokémon without Tailwind is usually wasting SPs that could go into bulk or offense. Speed investment should target the relevant matchups within your tier — other mid-tier Pokémon you want to outspeed, or specific slow-tier threats you need to move before.

**Exception:** A mid-tier Pokémon that's right at the boundary of the fast tier might justify a few extra SPs to cross over. But if it takes max Speed + a boosting Nature to barely reach fast-tier range, those SPs are better spent elsewhere.

### Tailwind is tier-shifting, not fine-tuning

Under Tailwind, a mid-tier Pokémon jumps to effectively blazing. This means: if your team has reliable Tailwind, your mid-tier attackers don't need heavy speed investment. They can invest in bulk or offense instead, and let Tailwind handle the speed. Over-investing in speed on a Tailwind team means you're fast when you don't need to be (under Tailwind) and still not fast enough when it matters (without Tailwind against blazing-tier threats).

**Implication for team building:** Tailwind teams should prioritize mid-tier attackers that benefit most from the tier shift, not fast-tier Pokémon that get diminishing returns from the double.

### Trick Room inverts the heuristic

Under Trick Room, minimum speed is maximum priority. For Trick Room attackers, use a speed-lowering nature (Brave for physical, Quiet for special) and **0 Speed SPs**. Every point of Speed you add makes them slower under Trick Room.

**Dual-mode tension:** A Pokémon that operates in both a Trick Room mode and a non-TR mode faces a genuine conflict. Minimum speed is optimal under TR but terrible outside it. Maximum speed is useless under TR. There is no good middle ground — the Pokémon will be suboptimal in one mode. Acknowledge this trade-off explicitly when it comes up. See `win-conditions.md` > Dual-Mode Pokémon Tension for how this affects win condition evaluation.

### Choice Scarf shifts one tier up

A mid-tier Pokémon with Choice Scarf behaves like a fast-tier Pokémon. A slow-tier Pokémon with Scarf behaves like a mid-tier Pokémon. This makes Scarf strongest on mid-tier Pokémon with one dominant attacking move — they get fast-tier speed while retaining their bulk and offensive stat investment.

**Trade-off:** Scarf locks you into one move and prevents Protect. The Pokémon becomes a one-dimensional fast attacker. Best when the team needs a revenge killer that can clean up without setup, worst when the team needs the flexibility of move choice.

### Speed ties are coin flips — avoid building around them

If your game plan requires outspeeding a specific threat and your Pokémon is in the same speed tier with similar investment, you're relying on a coin flip. Either invest to clearly outspeed (a few extra SPs) or find a different answer — speed control, priority moves, or a Pokémon from a faster tier that naturally outspeeds the threat.

**When ties are acceptable:** If both your Pokémon and the threat are in the mid tier and you have Tailwind as a backup plan, the tie only matters on turns without Tailwind. That's a manageable risk, not a fatal one.

### Reactive speed drops are a secondary speed-control tier

A fast support Pokémon with **Icy Wind**, **Electroweb**, or **Thunder Wave** provides pseudo-speed-control without dedicating a team slot to Tailwind or Trick Room.

- **Icy Wind / Electroweb:** Lower all opponents' Speed by one stage (-0.67x multiplier). A mid-tier attacker that was being outsped by a fast-tier threat may now outspeed it after one drop.
- **Thunder Wave / Glare:** Paralysis halves Speed (0.5x multiplier) and adds a 25% chance of full paralysis. More disruptive but less reliable for consistent speed management.

**Team composition heuristic:** A team with Icy Wind or Electroweb on a fast support Pokémon can treat that as **secondary speed control**. It is less reliable than Tailwind (which benefits the whole team for 4 turns) but more flexible — it can be used reactively on turns when primary speed control is not up or has been denied.

**Cross-reference:** `roles.md` > Speed Control for which Pokémon provide these moves. See also `SKILL.md` > Speed Profile > Speed Control Redundancy.

## Speed Control Interaction

How speed tiers interact with team speed control options. Cross-references `roles.md` > Speed Control for which moves provide each type of speed control, and `synergies.md` > Speed Control + Slow Attacker for pair evaluation.

### Tailwind Teams

Tailwind doubles Speed for 4 turns. The ideal Tailwind beneficiaries are mid-tier attackers — they jump from "outsped by most threats" to "outspeeding nearly everything." Fast-tier Pokémon get diminishing returns from Tailwind (they were already fast). Slow-tier Pokémon under Tailwind reach mid-tier speed at best, which may not be enough.

**Team composition heuristic:** A Tailwind team wants 2-3 mid-tier attackers as its core damage dealers, a blazing or fast-tier Tailwind setter (so it can set Tailwind before being KO'd), and possibly one slow-tier support Pokémon whose speed doesn't matter because their role is utility, not offense.

### Trick Room Teams

Trick Room reverses speed for 5 turns. The ideal Trick Room attackers are Trick Room-tier Pokémon — they move first under TR and hit extremely hard. Mid-tier and fast-tier Pokémon become liabilities under Trick Room (they move last).

**Team composition heuristic:** A Trick Room team wants 2-3 Trick Room-tier attackers, a bulky TR setter (preferably Trick Room-tier itself so it moves first under its own TR on subsequent turns), and support Pokémon whose value doesn't depend on speed (Intimidate users, redirectors).

### Dual-Mode Teams (Tailwind + Trick Room)

Dual-mode teams have both Tailwind and Trick Room options. This creates flexibility but demands careful mode separation.

**Composition heuristic:** Each mode should have its own speed-appropriate attackers. The Tailwind mode uses mid-tier attackers, the Trick Room mode uses TR-tier attackers. Pokémon that appear in both modes should be speed-agnostic — support Pokémon or redirectors whose value is independent of turn order.

Mid-tier Pokémon in a Trick Room mode are awkward (too fast for TR, too slow without it). Similarly, Trick Room-tier Pokémon in a Tailwind mode are dead weight (even doubled, their speed is still low). Avoid fielding these mismatches.

See `tempo.md` > Lead Pair Evaluation for how to assess lead choices in dual-mode teams, and `tempo.md` > Plan B Resilience for how modes serve as fallbacks for each other.

### No Dedicated Speed Control

If the team lacks Tailwind, Trick Room, and Choice Scarf, it relies on naturally fast Pokémon (blazing and fast tiers) and reactive speed control (Icy Wind, Thunder Wave, Electroweb) to manage turn order.

**When this works:** Hyper offense teams that bring blazing-tier threats and simply outspeed most opponents. The "speed control" is having faster Pokémon. Cross-ref `win-conditions.md` > Single-Target Burst for how this feeds a win condition.

**When this is a problem:** If the team's main attackers are mid-tier or slow without speed control support, they'll consistently move second against common threats. This is a structural speed issue **unless** the team has naturally fast threats (see Definition of "Naturally Fast" above). A team with blazing-tier attackers and no speed control is fast by default; a team with mid-tier attackers and no speed control is structurally slow. Cross-ref `roles.md` > Speed Control for potential additions.

### Reactive Speed Drops as Pseudo-Control

A fast support Pokemon with Icy Wind, Electroweb, or Thunder Wave can effectively downshift the opponent's speed tier, allowing mid-tier attackers to function without dedicated Tailwind or Trick Room.

- **Icy Wind / Electroweb:** Lower all opponents' Speed by one stage (-0.67x multiplier). A mid-tier attacker that was being outsped by a fast-tier threat may now outspeed it after one drop.
- **Thunder Wave / Glare:** Paralysis halves Speed (0.5x multiplier) and adds a 25% chance of full paralysis. More disruptive but less reliable for consistent speed management.

**Team composition heuristic:** A team with Icy Wind or Electroweb on a fast support Pokemon can treat that as secondary speed control. It is less reliable than Tailwind (which benefits the whole team for 4 turns) but more flexible — it can be used reactively on turns when Tailwind is not up.

**Cross-ref:** `roles.md` > Speed Control for which Pokemon provide these moves.

## Cross-References

| Primary Dimension | Read Together With | Why |
|---|---|---|
| Speed Profile | `items.md` | Choice Scarf shifts speed tier; Mega Stones may change base Speed |
| Speed Profile | `synergies.md` | Speed Control + Slow Attacker is a synergy pattern; tempo mismatches are anti-synergies |
| Speed Profile | `stat-calculations.md` | Exact speed benchmarks and modifier stacking |
| Speed Profile | `tempo.md` | Speed control interaction determines whether leads can execute their plan |
