---
name: sharing-vgc-team
description: Provides instructions on how to read and write teams for Pokemon Champions VGC
---

# Sharing VGC Team

Pokemon teams tend to be shared in "Pokemon Showdown" format. The format strictly follows this template:

```
[Pokemon] @ [Item]
Ability: [Ability]
Level: 50
EVs: [HP] HP / [Atk] Atk / [Def] Def / [SpA] SpA / [SpD] SpD / [Spe] Spe
IVs: [HP] HP / [Atk] Atk / [Def] Def / [SpA] SpA / [SpD] SpD / [Spe] Spe
[Nature] Nature
- [Move 1]
- [Move 2]
- [Move 3]
- [Move 4]
```

## Pokemon Champions

Pokemon Showdown format includes EVs, or "Effort Values." Pokemon Champions replaces EVs with SPs, or "Stat Points". A Pokemon may be given up to 32 SPs in any stat, with 66 SPs to distrubute total. To convert between the two, 1 SP = 8 EVs.

Pokemon Champions always sets Pokemon to level 50, and always sets all IVs to 31. A Pokemon on a team for Pokemon Champions MUST NEVER have a level other than 50, and MUST NEVER have an IV spread othtr than "31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe".

With these in mind, a VGC Champions team should follow a slightly tweaked format, by removing the Level and IV lines, and replacing EVs with the equivalent SPs.

```
[Pokemon] @ [Item]
Ability: [Ability]
SPs: [HP] HP / [Atk] Atk / [Def] Def / [SpA] SpA / [SpD] SpD / [Spe] Spe
[Nature] Nature
- [Move 1]
- [Move 2]
- [Move 3]
- [Move 4]
```
