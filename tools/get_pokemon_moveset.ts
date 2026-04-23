import z from "zod";
import { Dex } from "@pkmn/dex";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GenerationNum } from "@pkmn/types";

export default function registerGetPokemonMoveset(server: McpServer) {
  server.tool(
    "get-pokemon-moveset",
    "Get the valid moves/learnset for a Pokemon in a specific generation",
    {
      name: z.string().describe("Name of the Pokemon"),
      generation: z
        .number()
        .min(1)
        .max(9)
        .describe("Generation number (1-9)"),
    },
    async ({ name, generation }: { name: string; generation: number }) => {
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

      try {
        const learnset = await genDex.learnsets.get(species.name);
        if (!learnset || !learnset.learnset) {
           return {
            content: [{ type: "text", text: JSON.stringify([]) }],
          };
        }
        
        // Filter learnset to only include moves available in this generation or earlier
        const validMoves = Object.keys(learnset.learnset).filter((moveId) => {
          const moveSources = learnset.learnset![moveId];
          return moveSources.some((source) => parseInt(source[0], 10) <= generation);
        });

        return {
          content: [{ type: "text", text: JSON.stringify(validMoves) }],
        };
      } catch (e) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching learnset data: ${e}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
