import z from "zod";
import { Dex } from "@pkmn/dex";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export default function registerGetPokemonByGeneration(server: McpServer) {
  server.registerTool(
    "get-pokemon-by-generation",
    {
      title: "Get Pokemon by Generation",
      description:
        "Get a list of available Pokemon for a given generation (1-9)",
      inputSchema: {
        generation: z
          .number()
          .min(1)
          .max(9)
          .describe("Generation number (1-9)"),
      },
    },
    ({ generation }: { generation: number }) => {
      const genDex = Dex.forGen(generation as any);
      const availablePokemon = genDex.species
        .all()
        .filter((p) => !p.isNonstandard)
        .map((p) => p.name);

      return {
        content: [{ type: "text", text: JSON.stringify(availablePokemon) }],
      };
    },
  );
}
