import z from "zod";
import { Dex } from "@pkmn/dex";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";

export default function registerGetPokemon(server: McpServer) {
  server.registerTool(
    "get-pokemon-details",
    {
      title: "Get Pokemon Details",
      description: "Get details for a Pokemon",
      inputSchema: {
        name: z
          .enum(Dex.species.all().map((s) => s.name))
          .describe("Name of the Pokemon"),
      },
    },
    ({ name }) => {
      const pokemon = Dex.species.get(name);

      return {
        content: [{ type: "text", text: JSON.stringify(pokemon) }],
      };
    },
  );
}
