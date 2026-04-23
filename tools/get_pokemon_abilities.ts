import z from "zod";
import { Dex } from "@pkmn/dex";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export default function registerGetPokemonAbilities(server: McpServer) {
  server.registerTool(
    "get-pokemon-abilities",
    {
      title: "Get Pokemon Abilities",
      description: "Get abilities for a Pokemon in a specific generation",
      inputSchema: {
        name: z.string().describe("Name of the Pokemon"),
        generation: z
          .number()
          .min(1)
          .max(9)
          .describe("Generation number (1-9)"),
      },
    },
    ({ name, generation }: { name: string; generation: number }) => {
      const genDex = Dex.forGen(generation as any);
      const species = genDex.species.get(name);

      if (!species || species.gen > generation) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Pokemon '${name}' not found or invalid in Generation ${generation}.`,
            },
          ],
          isError: true,
        };
      }

      return {
        content: [{ type: "text", text: JSON.stringify(species.abilities) }],
      };
    },
  );
}
