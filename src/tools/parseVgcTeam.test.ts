import { describe, it, expect } from "vitest";
import { parseVgcTeam } from "./parseVgcTeam";

describe("parseVgcTeam", () => {
  it("parses a standard SP-format paste", () => {
    const paste = `Feraligatr @ Feraligatrite
Ability: Sheer Force
SPs: 32 HP / 17 Atk / 16 Spe
Adamant Nature
- Protect
- Liquidation
- Ice Punch
- Dragon Dance`;
    const { team, warnings } = parseVgcTeam(paste);
    expect(team).toHaveLength(1);
    expect(team[0]).toMatchObject({
      pokemon: "Feraligatr",
      item: "Feraligatrite",
      ability: "Sheer Force",
      nature: "Adamant",
      skillPoints: {
        hp: 32,
        attack: 17,
        defense: 0,
        specialAttack: 0,
        specialDefense: 0,
        speed: 16,
      },
      moves: ["Protect", "Liquidation", "Ice Punch", "Dragon Dance"],
    });
    expect(warnings).toHaveLength(0);
  });

  it("parses a paste with gender markers", () => {
    const paste = `Sableye (M) @ Focus Sash
Ability: Prankster
SPs: 31 HP / 1 Def / 31 SpD
Careful Nature
- Fake Out`;
    const { team, warnings } = parseVgcTeam(paste);
    expect(team[0].pokemon).toBe("Sableye");
    expect(team[0].item).toBe("Focus Sash");
    expect(warnings).toHaveLength(0);
  });

  it("parses a paste with a female gender marker", () => {
    const paste = `Volcarona (F) @ Charti Berry
Ability: Flame Body
SPs: 31 HP / 1 Def / 31 Spe
Timid Nature
- Protect`;
    const { team } = parseVgcTeam(paste);
    expect(team[0].pokemon).toBe("Volcarona");
    expect(team[0].item).toBe("Charti Berry");
  });

  it("parses a paste without an item", () => {
    const paste = `Venusaur
Ability: Overgrow
SPs: 10 HP / 10 SpA / 10 Spe
Modest Nature
- Energy Ball`;
    const { team } = parseVgcTeam(paste);
    expect(team[0].pokemon).toBe("Venusaur");
    expect(team[0].item).toBeUndefined();
  });

  it("converts legacy EVs to SPs and warns", () => {
    const paste = `Charizard @ Charcoal
Ability: Blaze
Level: 50
EVs: 252 HP / 4 Atk / 252 Spe
Jolly Nature
- Flamethrower`;
    const { team, warnings } = parseVgcTeam(paste);
    expect(team[0].skillPoints.hp).toBe(31); // floor(252/8)
    expect(team[0].skillPoints.attack).toBe(0); // floor(4/8)
    expect(team[0].skillPoints.speed).toBe(31); // floor(252/8)
    expect(
      warnings.some((w) => w.includes("Converted legacy EVs")),
    ).toBe(true);
  });

  it("ignores IVs and warns", () => {
    const paste = `Clefable @ Sitrus Berry
Ability: Unaware
Level: 50
EVs: 244 HP / 164 Def / 100 SpD
IVs: 0 Atk
Bold Nature
- Follow Me`;
    const { team, warnings } = parseVgcTeam(paste);
    expect(team[0].moves).toContain("Follow Me");
    expect(warnings.some((w) => w.includes("Ignored IVs"))).toBe(true);
    expect(warnings.some((w) => w.includes("Converted legacy EVs"))).toBe(true);
  });

  it("returns empty team and warning for empty input", () => {
    const { team, warnings } = parseVgcTeam("");
    expect(team).toHaveLength(0);
    expect(warnings).toContain("No valid team members found.");
  });

  it("handles a full team of multiple members", () => {
    const paste = `Venusaur @ Black Belt
Ability: Overgrow
SPs: 10 HP / 10 Atk / 10 Def / 10 SpA / 10 SpD / 10 Spe
Modest Nature
- Energy Ball

Charizard @ Charcoal
Ability: Blaze
SPs: 32 SpA / 32 Spe
Timid Nature
- Flamethrower`;
    const { team } = parseVgcTeam(paste);
    expect(team).toHaveLength(2);
    expect(team[1].skillPoints.specialAttack).toBe(32);
    expect(team[1].skillPoints.hp).toBe(0);
  });

  it("handles mixed SP and EV members in one team", () => {
    const paste = `Venusaur @ Black Belt
Ability: Overgrow
SPs: 10 HP / 10 SpA / 10 Spe
Modest Nature
- Energy Ball

Charizard @ Charcoal
Ability: Blaze
Level: 50
EVs: 252 HP / 252 SpA / 4 Spe
Timid Nature
- Flamethrower`;
    const { team, warnings } = parseVgcTeam(paste);
    expect(team).toHaveLength(2);
    expect(team[0].skillPoints.hp).toBe(10);
    expect(team[1].skillPoints.hp).toBe(31);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain("Charizard");
  });

  it("handles a member with no moves gracefully", () => {
    const paste = `Venusaur @ Black Belt
Ability: Overgrow
SPs: 10 HP
Modest Nature`;
    const { team } = parseVgcTeam(paste);
    expect(team[0].moves).toHaveLength(0);
  });
});
