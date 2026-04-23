import z from "zod";
import { Dex } from "@pkmn/dex";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GenerationNum } from "@pkmn/types";

export default function registerGetPokemonBaseStats(server: McpServer) {
  server.registerTool(
    "get-pokemon-base-stats",
    {
      title: "Get Pokemon Base Stats",
      description: "Get base stats for a Pokemon in a specific generation",
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
      const genDex = Dex.forGen(generation as GenerationNum);
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
        content: [{ type: "text", text: JSON.stringify(species.baseStats) }],
      };
    },
  );
}
