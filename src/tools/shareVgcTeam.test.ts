import { describe, it, expect } from "vitest";
import { shareVgcTeam } from "./shareVgcTeam";

describe("shareVgcTeam", () => {
  it("formats a single team member with an item", () => {
    const result = shareVgcTeam([
      {
        pokemon: "Venusaur",
        item: "Black Belt",
        ability: "Overgrow",
        skillPoints: {
          hp: 10,
          attack: 10,
          defense: 10,
          specialAttack: 10,
          specialDefense: 10,
          speed: 10,
        },
        nature: "Modest",
        moves: ["Energy Ball", "Sludge Bomb"],
      },
    ]);

    expect(result).toContain("Venusaur @ Black Belt");
    expect(result).toContain("Ability: Overgrow");
    expect(result).toContain("SPs: 10 HP / 10 Atk / 10 Def / 10 SpA / 10 SpD / 10 Spe");
    expect(result).toContain("Modest Nature");
    expect(result).toContain("- Energy Ball");
    expect(result).toContain("- Sludge Bomb");
  });

  it("formats a single team member without an item", () => {
    const result = shareVgcTeam([
      {
        pokemon: "Venusaur",
        ability: "Overgrow",
        skillPoints: {
          hp: 0,
          attack: 0,
          defense: 0,
          specialAttack: 0,
          specialDefense: 0,
          speed: 0,
        },
        nature: "Modest",
        moves: [],
      },
    ]);

    expect(result).toBe("Venusaur\nAbility: Overgrow\nModest Nature");
  });

  it("omits stats with 0 skill points", () => {
    const result = shareVgcTeam([
      {
        pokemon: "Venusaur",
        ability: "Overgrow",
        skillPoints: {
          hp: 20,
          attack: 0,
          defense: 0,
          specialAttack: 20,
          specialDefense: 0,
          speed: 26,
        },
        nature: "Timid",
        moves: ["Energy Ball"],
      },
    ]);

    expect(result).toContain("SPs: 20 HP / 20 SpA / 26 Spe");
    expect(result).not.toContain("Atk");
    expect(result).not.toContain("Def");
    expect(result).not.toContain("SpD");
  });

  it("formats multiple team members separated by double newlines", () => {
    const result = shareVgcTeam([
      {
        pokemon: "Venusaur",
        item: "Black Belt",
        ability: "Overgrow",
        skillPoints: {
          hp: 10,
          attack: 10,
          defense: 10,
          specialAttack: 10,
          specialDefense: 10,
          speed: 10,
        },
        nature: "Modest",
        moves: ["Energy Ball"],
      },
      {
        pokemon: "Charizard",
        item: "Charcoal",
        ability: "Blaze",
        skillPoints: {
          hp: 0,
          attack: 0,
          defense: 0,
          specialAttack: 32,
          specialDefense: 0,
          speed: 32,
        },
        nature: "Timid",
        moves: ["Flamethrower", "Air Slash"],
      },
    ]);

    const parts = result.split("\n\n");
    expect(parts).toHaveLength(2);
    expect(parts[0]).toContain("Venusaur @ Black Belt");
    expect(parts[1]).toContain("Charizard @ Charcoal");
  });

  it("formats a full team of 6 members", () => {
    const members = Array.from({ length: 6 }, (_, i) => ({
      pokemon: `Pokemon${i + 1}`,
      ability: "Overgrow",
      skillPoints: {
        hp: 11,
        attack: 11,
        defense: 11,
        specialAttack: 11,
        specialDefense: 11,
        speed: 11,
      },
      nature: "Hardy" as const,
      moves: ["Tackle"],
    }));

    const result = shareVgcTeam(members);
    const parts = result.split("\n\n");
    expect(parts).toHaveLength(6);
  });

  it("formats a full team of 6 real roster members", () => {
    const result = shareVgcTeam([
      {
        pokemon: "Venusaur",
        item: "Black Belt",
        ability: "Overgrow",
        skillPoints: { hp: 10, attack: 10, defense: 10, specialAttack: 10, specialDefense: 10, speed: 10 },
        nature: "Modest",
        moves: ["Energy Ball", "Sludge Bomb", "Protect", "Sleep Powder"],
      },
      {
        pokemon: "Charizard",
        item: "Charcoal",
        ability: "Blaze",
        skillPoints: { hp: 0, attack: 0, defense: 0, specialAttack: 32, specialDefense: 0, speed: 32 },
        nature: "Timid",
        moves: ["Flamethrower", "Air Slash", "Protect", "Solar Beam"],
      },
      {
        pokemon: "Blastoise",
        item: "Mystic Water",
        ability: "Torrent",
        skillPoints: { hp: 32, attack: 0, defense: 16, specialAttack: 16, specialDefense: 2, speed: 0 },
        nature: "Bold",
        moves: ["Scald", "Ice Beam", "Protect", "Fake Out"],
      },
      {
        pokemon: "Garchomp",
        item: "Yache Berry",
        ability: "Rough Skin",
        skillPoints: { hp: 4, attack: 32, defense: 0, specialAttack: 0, specialDefense: 0, speed: 30 },
        nature: "Jolly",
        moves: ["Earthquake", "Dragon Claw", "Rock Slide", "Protect"],
      },
      {
        pokemon: "Gardevoir",
        item: "Gardevoirite",
        ability: "Trace",
        skillPoints: { hp: 0, attack: 0, defense: 4, specialAttack: 32, specialDefense: 0, speed: 30 },
        nature: "Timid",
        moves: ["Psychic", "Moonblast", "Protect", "Thunderbolt"],
      },
      {
        pokemon: "Incineroar",
        item: "Sitrus Berry",
        ability: "Intimidate",
        skillPoints: { hp: 32, attack: 8, defense: 12, specialAttack: 0, specialDefense: 14, speed: 0 },
        nature: "Careful",
        moves: ["Fake Out", "Flare Blitz", "Parting Shot", "Protect"],
      },
    ]);

    const parts = result.split("\n\n");
    expect(parts).toHaveLength(6);
    expect(parts[0]).toContain("Venusaur @ Black Belt");
    expect(parts[3]).toContain("Garchomp @ Yache Berry");
    expect(parts[5]).toContain("Incineroar @ Sitrus Berry");
    expect(result).toContain("SPs: 10 HP / 10 Atk / 10 Def / 10 SpA / 10 SpD / 10 Spe");
    expect(result).toContain("SPs: 32 SpA / 32 Spe");
    expect(result).not.toContain("SPs: \n");
  });
});
