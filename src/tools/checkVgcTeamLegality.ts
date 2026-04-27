import { McpServer } from "@modelcontextprotocol/server";
import z from "zod";
import pokemon from "../../agent/assets/pokemon.json" with { type: "json" };
import abilities from "../../agent/assets/abilities.json" with { type: "json" };
import moves from "../../agent/assets/moves.json" with { type: "json" };
import items from "../../agent/assets/items.json" with { type: "json" };
import { sum } from "es-toolkit";
import { keys, values } from "../utils/object";

export const PokemonTeamValidator = z
  .array(
    z
      .object({
        pokemon: z.enum(keys(pokemon)),
        item: z.enum(keys(items)),
        ability: z.enum(keys(abilities)),
        nature: z.enum([
          "Hardy",
          "Lonely",
          "Brave",
          "Adamant",
          "Naughty",
          "Bold",
          "Docile",
          "Relaxed",
          "Impish",
          "Lax",
          "Timid",
          "Hasty",
          "Serious",
          "Jolly",
          "Naive",
          "Modest",
          "Mild",
          "Quiet",
          "Bashful",
          "Rash",
          "Calm",
          "Gentle",
          "Sassy",
          "Careful",
          "Quirky",
        ]),
        skillPoints: z.record(
          z.enum([
            "hp",
            "attack",
            "defense",
            "specialAttack",
            "specialDefense",
            "speed",
          ]),
          z.number().int().min(0).max(32),
        ),
        moves: z.array(z.string()).min(1).max(4),
      })
      .refine(
        (p) =>
          pokemon[p.pokemon as keyof typeof pokemon].abilities.includes(
            p.ability as keyof typeof abilities,
          ),
        "A Pokemon must be able to have the ability it has.",
      )
      .refine(
        (p) =>
          p.moves.every((m) =>
            pokemon[p.pokemon as keyof typeof pokemon].moves.includes(
              m as keyof typeof moves,
            ),
          ),
        "A Pokemon must be able to learn every move it knows.",
      )
      .refine(
        (p) => sum(values(p.skillPoints)) <= 66,
        "A Pokemon may only have 66 Skill Points.",
      ),
  )
  .max(6, "A team may only have 6 Pokemon.")
  .refine(
    (team) => new Set(team.map((m) => m.item)).size === team.length,
    "A team may not have duplicate items.",
  )
  .refine(
    (team) => new Set(team.map((m) => m.pokemon)).size === team.length,
    "A team may not have duplicate Pokemon.",
  );

export default function registerCheckVgcTeamLegality(server: McpServer) {
  server.registerTool(
    "check-vgc-team-legality",
    {
      description: "Validate a structured Pokemon Champions VGC team",
      inputSchema: z.object({
        team: z.array(
          z.object({
            pokemon: z.string().describe("Name of the Pokemon"),
            item: z.string().describe("Held item"),
            ability: z.string().describe("Pokemon ability"),
            skillPoints: z
              .object({
                hp: z.number().describe("HP skill points"),
                attack: z.number().describe("Attack skill points"),
                defense: z.number().describe("Defense skill points"),
                specialAttack: z
                  .number()
                  .describe("Special Attack skill points"),
                specialDefense: z
                  .number()
                  .describe("Special Defense skill points"),
                speed: z.number().describe("Speed skill points"),
              })
              .describe("Pokemon skill point spread"),
            nature: z.string().describe("Pokemon nature"),
            moves: z.array(z.string()).describe("Moves in display order"),
          }),
        ),
      }),
    },
    async (args) => {
      const validated = PokemonTeamValidator.safeParse(args.team);

      if (validated.success) {
        return { content: [{ type: "text", text: "The team is valid" }] };
      }

      const errorLines = validated.error.issues.map((issue) => {
        const path = issue.path.length > 0 ? issue.path.join(".") : "team";
        return `- **Path**: ${path}\n  **Message**: ${issue.message}`;
      });

      return {
        content: [
          {
            type: "text",
            text: `# Team Validation Errors\n${errorLines.join("\n")}`,
          },
        ],
      };
    },
  );
}
