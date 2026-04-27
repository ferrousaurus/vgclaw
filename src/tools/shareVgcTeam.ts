import { McpServer } from "@modelcontextprotocol/server";
import z from "zod";
type SkillPoints = {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
};

type ShareVgcTeamArgs = {
  pokemon: string;
  item?: string;
  ability: string;
  skillPoints: SkillPoints;
  nature: string;
  moves: string[];
};

const statLabels: Array<[keyof SkillPoints, string]> = [
  ["hp", "HP"],
  ["attack", "Atk"],
  ["defense", "Def"],
  ["specialAttack", "SpA"],
  ["specialDefense", "SpD"],
  ["speed", "Spe"],
];

function formatMember(args: ShareVgcTeamArgs): string {
  const lines = [args.item ? `${args.pokemon} @ ${args.item}` : args.pokemon];

  lines.push(`Ability: ${args.ability}`);

  const skillPointLine = statLabels
    .filter(([stat]) => args.skillPoints[stat] > 0)
    .map(([stat, label]) => `${args.skillPoints[stat]} ${label}`)
    .join(" / ");

  if (skillPointLine) {
    lines.push(`SPs: ${skillPointLine}`);
  }
  lines.push(`${args.nature} Nature`);

  for (const move of args.moves) {
    lines.push(`- ${move}`);
  }

  return lines.join("\n");
}

export function shareVgcTeam(args: ShareVgcTeamArgs[]) {
  return args.map(formatMember).join("\n\n");
}

export default function registerShareVgcTeam(server: McpServer) {
  const memberSchema = z.object({
    pokemon: z.string().describe("Name of the Pokemon"),
    item: z.string().optional().describe("Held item"),
    ability: z.string().describe("Pokemon ability"),
    skillPoints: z
      .object({
        hp: z.number().int().nonnegative().describe("HP skill points"),
        attack: z
          .number()
          .int()
          .nonnegative()
          .describe("Attack skill points"),
        defense: z
          .number()
          .int()
          .nonnegative()
          .describe("Defense skill points"),
        specialAttack: z
          .number()
          .int()
          .nonnegative()
          .describe("Special Attack skill points"),
        specialDefense: z
          .number()
          .int()
          .nonnegative()
          .describe("Special Defense skill points"),
        speed: z
          .number()
          .int()
          .nonnegative()
          .describe("Speed skill points"),
      })
      .describe("Pokemon skill point spread"),
    nature: z.string().describe("Pokemon nature"),
    moves: z.array(z.string()).describe("Moves in display order"),
  });

  server.registerTool(
    "share-vgc-team",
    {
      description:
        "Format one or more Pokemon Champions team members as Showdown text",
      inputSchema: z.object({
        team: z
          .array(memberSchema)
          .min(1)
          .max(6)
          .describe("Array of 1-6 team members"),
      }),
    },
    async (args) => {
      const result = shareVgcTeam(args.team);
      return { content: [{ type: "text", text: result }] };
    },
  );
}
