# Speed Tier Framework

Qualitative speed reasoning for Pokemon Champions VGC. All guidance is tier-based and relative — no exact stat calculations. Use this to evaluate speed investments, assess team composition, and reason about speed control interactions.

## Speed Tiers

Five tiers relative to the Champions roster. When evaluating a Pokemon's speed tier, look up its base Speed via `assets/pokemon.json` and place it in the appropriate tier.

### Blazing

The fastest Pokemon in the format. These naturally outspeed nearly everything without dedicated speed investment. They don't need Tailwind or speed control support — they ARE the fast pressure.

**Examples from Champions roster:** Dragapult, Jolteon, Aerodactyl, Talonflame, Weavile, Noivern, Meowscarada, Greninja, Alakazam, Whimsicott

**Role in teams:** Primary fast threats or fast support (Prankster Tailwind from Whimsicott). Speed investment for these Pokemon is about outspeeding each other, not the rest of the roster. If your team runs a blazing-tier Pokemon, you often don't need Tailwind to go fast — you already are fast.

### Fast

Outspeeds most of the roster with modest speed investment. These Pokemon are naturally quick but can be outsped by the blazing tier. They benefit from speed control mainly to outrun other fast or blazing-tier Pokemon, or Choice Scarf users.

**Examples from Champions roster:** Garchomp, Charizard, Ninetales, Volcarona, Hydreigon, Infernape, Zoroark, Gengar, Arcanine

**Role in teams:** Core attackers that function well without speed control but become dominant with it. Fast-tier Pokemon under Tailwind outspeed even the blazing tier, which can be relevant but offers diminishing returns — they were already outspeeding most threats.

### Mid

The crowded tier where speed investment decisions matter most. Many competitively viable Pokemon cluster here, and a few EVs can flip dozens of matchups. Tailwind transforms mid-tier Pokemon into effective fast threats.

**Examples from Champions roster:** Excadrill, Lucario, Heracross, Kommo-o, Gyarados, Milotic, Feraligatr, Venusaur, Dragonite, Gardevoir, Mamoswine, Chandelure, Passimian, Corviknight, Scizor

**Role in teams:** The primary beneficiaries of Tailwind. Under Tailwind, mid-tier Pokemon jump to effectively blazing. Without speed control, they need to accept being outsped by fast and blazing tiers and rely on bulk, priority, or redirection to function. Speed EV decisions for mid-tier Pokemon are the most impactful on the team — small investment changes determine which matchups they win.

### Slow

Too slow to compete without speed control. These Pokemon need Tailwind to function in a fast mode, or they lean into their bulk and accept moving second. Some operate well in a Trick Room team that also has a non-TR mode, sitting in an awkward middle ground.

**Examples from Champions roster:** Incineroar, Tyranitar, Clefable, Sylveon, Aegislash, Primarina, Kingambit, Sableye, Azumarill, Aggron

**Role in teams:** Often support Pokemon (Incineroar's value is Intimidate + Fake Out, not speed) or bulky attackers that accept moving second. Speed investment is usually minimal — just enough to outspeed other slow-tier Pokemon or reach a specific threshold under Tailwind. Some slow-tier Pokemon (Kingambit, Azumarill) have high enough Attack that moving second doesn't matter if they survive to hit back.

### Trick Room

So slow that Trick Room is the primary or only way to let them move first. Under Trick Room, these become the fastest Pokemon on the field. Speed investment is actively bad — minimum speed (0 speed EVs, speed-lowering nature) is correct.

**Examples from Champions roster:** Torkoal, Rhyperior, Hatterene, Slowbro, Slowking, Conkeldurr, Snorlax, Reuniclus, Aromatisse, Crabominable, Avalugg

**Role in teams:** Trick Room attackers or setters. These Pokemon define the Trick Room mode — if your team has them, it should have Trick Room too. Outside of Trick Room, they move last against nearly everything, which is a liability in non-TR modes. For dual-mode teams, Trick Room-tier Pokemon typically only appear in the TR bring-4, not the fast bring-4.

## Speed Investment Heuristics

Qualitative guidelines for when and how to invest in Speed EVs.

### Invest to outspeed your tier, not the tier above

A mid-tier Pokemon trying to outspeed fast-tier Pokemon without Tailwind is usually wasting EVs that could go into bulk or offense. Speed investment should target the relevant matchups within your tier — other mid-tier Pokemon you want to outspeed, or specific slow-tier threats you need to move before.

**Exception:** A mid-tier Pokemon that's right at the boundary of the fast tier might justify a few extra EVs to cross over. But if it takes max Speed + a boosting Nature to barely reach fast-tier range, those EVs are better spent elsewhere.

### Tailwind is tier-shifting, not fine-tuning

Under Tailwind, a mid-tier Pokemon jumps to effectively blazing. This means: if your team has reliable Tailwind, your mid-tier attackers don't need heavy speed investment. They can invest in bulk or offense instead, and let Tailwind handle the speed. Over-investing in speed on a Tailwind team means you're fast when you don't need to be (under Tailwind) and still not fast enough when it matters (without Tailwind against blazing-tier threats).

**Implication for team building:** Tailwind teams should prioritize mid-tier attackers that benefit most from the tier shift, not fast-tier Pokemon that get diminishing returns from the double.

### Trick Room inverts the heuristic

Under Trick Room, minimum speed is maximum priority. For Trick Room attackers, use a speed-lowering nature (Brave for physical, Quiet for special) and 0 Speed EVs. Every point of Speed you add makes them slower under Trick Room.

**Dual-mode tension:** A Pokemon that operates in both a Trick Room mode and a non-TR mode faces a genuine conflict. Minimum speed is optimal under TR but terrible outside it. Maximum speed is useless under TR. There is no good middle ground — the Pokemon will be suboptimal in one mode. Acknowledge this trade-off explicitly when it comes up. See win-conditions.md > Dual-Mode Pokemon Tension for how this affects win condition evaluation.

### Choice Scarf shifts one tier up

A mid-tier Pokemon with Choice Scarf behaves like a fast-tier Pokemon. A slow-tier Pokemon with Scarf behaves like a mid-tier Pokemon. This makes Scarf strongest on mid-tier Pokemon with one dominant attacking move — they get fast-tier speed while retaining their bulk and offensive stat investment.

**Trade-off:** Scarf locks you into one move and prevents Protect. The Pokemon becomes a one-dimensional fast attacker. Best when the team needs a revenge killer that can clean up without setup, worst when the team needs the flexibility of move choice.

### Speed ties are coin flips — avoid building around them

If your game plan requires outspeeding a specific threat and your Pokemon is in the same speed tier with similar investment, you're relying on a coin flip. Either invest to clearly outspeed (a few extra EVs) or find a different answer — speed control, priority moves, or a Pokemon from a faster tier that naturally outspeeds the threat.

**When ties are acceptable:** If both your Pokemon and the threat are in the mid tier and you have Tailwind as a backup plan, the tie only matters on turns without Tailwind. That's a manageable risk, not a fatal one.

## Speed Control Interaction

How speed tiers interact with team speed control options. Cross-references roles.md (Speed Control section) for which Pokemon provide each type of speed control, and synergies.md (Speed Control + Slow Attacker pattern) for pair evaluation.

### Tailwind Teams

Tailwind doubles Speed for 4 turns. The ideal Tailwind beneficiaries are mid-tier attackers — they jump from "outsped by most threats" to "outspeeding nearly everything." Fast-tier Pokemon get diminishing returns from Tailwind (they were already fast). Slow-tier Pokemon under Tailwind reach mid-tier speed at best, which may not be enough.

**Team composition heuristic:** A Tailwind team wants 2-3 mid-tier attackers as its core damage dealers, a blazing or fast-tier Tailwind setter (so it can set Tailwind before being KO'd), and possibly one slow-tier support Pokemon (Incineroar, Clefable) whose speed doesn't matter because their role is utility, not offense.

### Trick Room Teams

Trick Room reverses speed for 5 turns. The ideal Trick Room attackers are Trick Room-tier Pokemon — they move first under TR and hit extremely hard. Mid-tier and fast-tier Pokemon become liabilities under Trick Room (they move last).

**Team composition heuristic:** A Trick Room team wants 2-3 Trick Room-tier attackers, a bulky TR setter (preferably Trick Room-tier itself so it moves first under its own TR on subsequent turns), and support Pokemon whose value doesn't depend on speed (Intimidate users, redirectors).

### Dual-Mode Teams (Tailwind + Trick Room)

Dual-mode teams have both Tailwind and Trick Room options. This creates flexibility but demands careful mode separation.

**Composition heuristic:** Each mode should have its own speed-appropriate attackers. The Tailwind mode uses mid-tier attackers, the Trick Room mode uses TR-tier attackers. Pokemon that appear in both modes should be speed-agnostic — support Pokemon (Incineroar, Clefable) or redirectors whose value is independent of turn order.

Mid-tier Pokemon in a Trick Room mode are awkward (too fast for TR, too slow without it). Similarly, Trick Room-tier Pokemon in a Tailwind mode are dead weight (even doubled, their speed is still low). Avoid fielding these mismatches.

See tempo.md > Lead Pair Evaluation for how to assess lead choices in dual-mode teams, and tempo.md > Plan B Resilience for how modes serve as fallbacks for each other.

### No Dedicated Speed Control

If the team lacks Tailwind, Trick Room, and Choice Scarf, it relies on naturally fast Pokemon (blazing and fast tiers) and reactive speed control (Icy Wind, Thunder Wave, Electroweb) to manage turn order.

**When this works:** Hyper offense teams that bring blazing-tier threats and simply outspeed most opponents. The "speed control" is having faster Pokemon. Cross-ref win-conditions.md > Single-Target Burst for how this feeds a win condition.

**When this is a problem:** If the team's main attackers are mid-tier or slow without speed control support, they'll consistently move second against common threats. Flag this as a structural speed issue. Cross-ref roles.md > Speed Control for potential additions.
