import { describe, it, expect } from "vitest";
import { PokemonTeamValidator } from "./checkVgcTeamLegality";

const validMember = {
  pokemon: "Venusaur",
  item: "Black Belt",
  ability: "Overgrow",
  nature: "Modest",
  skillPoints: {
    hp: 10,
    attack: 10,
    defense: 10,
    specialAttack: 10,
    specialDefense: 10,
    speed: 10,
  },
  moves: ["Acid Spray", "Amnesia", "Body Slam", "Bulldoze"],
};

describe("PokemonTeamValidator", () => {
  it("accepts a valid team of one member", () => {
    const result = PokemonTeamValidator.safeParse([validMember]);
    expect(result.success).toBe(true);
  });

  it("accepts a valid team up to 6 members", () => {
    const team = [
      validMember,
      {
        pokemon: "Charizard",
        item: "Charcoal",
        ability: "Blaze",
        nature: "Timid",
        skillPoints: { hp: 0, attack: 0, defense: 0, specialAttack: 32, specialDefense: 0, speed: 32 },
        moves: ["Flamethrower", "Air Slash", "Protect", "Body Slam"],
      },
      {
        pokemon: "Blastoise",
        item: "Mystic Water",
        ability: "Torrent",
        nature: "Bold",
        skillPoints: { hp: 32, attack: 0, defense: 16, specialAttack: 16, specialDefense: 2, speed: 0 },
        moves: ["Surf", "Ice Beam", "Protect", "Body Slam"],
      },
      {
        pokemon: "Beedrill",
        item: "Silver Powder",
        ability: "Swarm",
        nature: "Jolly",
        skillPoints: { hp: 0, attack: 32, defense: 0, specialAttack: 0, specialDefense: 0, speed: 32 },
        moves: ["Protect", "Bug Buzz", "Aerial Ace", "Acrobatics"],
      },
      {
        pokemon: "Pidgeot",
        item: "Sharp Beak",
        ability: "Keen Eye",
        nature: "Timid",
        skillPoints: { hp: 10, attack: 0, defense: 10, specialAttack: 20, specialDefense: 10, speed: 16 },
        moves: ["Protect", "Air Slash", "Brave Bird", "Aerial Ace"],
      },
      {
        pokemon: "Arbok",
        item: "Poison Barb",
        ability: "Intimidate",
        nature: "Adamant",
        skillPoints: { hp: 20, attack: 20, defense: 10, specialAttack: 0, specialDefense: 10, speed: 6 },
        moves: ["Protect", "Body Slam", "Bite", "Crunch"],
      },
    ];
    const result = PokemonTeamValidator.safeParse(team);
    expect(result.success).toBe(true);
  });

  it("rejects a team with more than 6 members", () => {
    const team = Array.from({ length: 7 }, () => validMember);
    const result = PokemonTeamValidator.safeParse(team);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]!.message).toContain("6");
    }
  });

  it("rejects a member with an invalid ability for the Pokemon", () => {
    const team = [{ ...validMember, ability: "Blaze" }];
    const result = PokemonTeamValidator.safeParse(team);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]!.message).toContain("ability");
    }
  });

  it("rejects a member with a move the Pokemon cannot learn", () => {
    const team = [{ ...validMember, moves: ["Thunderbolt"] }];
    const result = PokemonTeamValidator.safeParse(team);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]!.message).toContain("move");
    }
  });

  it("rejects a member with more than 66 total skill points", () => {
    const team = [
      {
        ...validMember,
        skillPoints: {
          hp: 20,
          attack: 20,
          defense: 20,
          specialAttack: 20,
          specialDefense: 20,
          speed: 20,
        },
      },
    ];
    const result = PokemonTeamValidator.safeParse(team);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]!.message).toContain("66");
    }
  });

  it("accepts a member with exactly 66 skill points", () => {
    const team = [
      {
        ...validMember,
        skillPoints: {
          hp: 11,
          attack: 11,
          defense: 11,
          specialAttack: 11,
          specialDefense: 11,
          speed: 11,
        },
      },
    ];
    const result = PokemonTeamValidator.safeParse(team);
    expect(result.success).toBe(true);
  });

  it("rejects a member with a skill point value above 32", () => {
    const team = [
      {
        ...validMember,
        skillPoints: {
          hp: 33,
          attack: 0,
          defense: 0,
          specialAttack: 0,
          specialDefense: 0,
          speed: 0,
        },
      },
    ];
    const result = PokemonTeamValidator.safeParse(team);
    expect(result.success).toBe(false);
  });

  it("rejects a member with a negative skill point value", () => {
    const team = [
      {
        ...validMember,
        skillPoints: {
          hp: -1,
          attack: 0,
          defense: 0,
          specialAttack: 0,
          specialDefense: 0,
          speed: 0,
        },
      },
    ];
    const result = PokemonTeamValidator.safeParse(team);
    expect(result.success).toBe(false);
  });

  it("rejects a member with more than 4 moves", () => {
    const team = [
      {
        ...validMember,
        moves: ["Acid Spray", "Amnesia", "Body Slam", "Bulldoze", "Bullet Seed"],
      },
    ];
    const result = PokemonTeamValidator.safeParse(team);
    expect(result.success).toBe(false);
  });

  it("rejects a team with duplicate items", () => {
    const team = [
      validMember,
      {
        pokemon: "Charizard",
        item: "Black Belt",
        ability: "Blaze",
        nature: "Timid",
        skillPoints: { hp: 0, attack: 0, defense: 0, specialAttack: 32, specialDefense: 0, speed: 32 },
        moves: ["Flamethrower", "Air Slash", "Protect", "Body Slam"],
      },
    ];
    const result = PokemonTeamValidator.safeParse(team);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]!.message).toContain("duplicate items");
    }
  });

  it("rejects a team with duplicate Pokemon", () => {
    const team = [
      validMember,
      {
        ...validMember,
        item: "Black Glasses",
      },
    ];
    const result = PokemonTeamValidator.safeParse(team);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]!.message).toContain("duplicate Pokemon");
    }
  });

  it("rejects a member with an empty moveset", () => {
    const team = [
      {
        ...validMember,
        moves: [],
      },
    ];
    const result = PokemonTeamValidator.safeParse(team);
    expect(result.success).toBe(false);
  });
});
