import z from "zod";
import { Dex } from "@pkmn/dex";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GenerationNum } from "@pkmn/types";

export default function registerGetItemsByGeneration(server: McpServer) {
  server.registerTool(
    "get-items-by-generation",
    {
      title: "Get Items by Generation",
      description: "Get a list of available Items for a given generation (1-9)",
      inputSchema: {
        generation: z
          .number()
          .min(1)
          .max(9)
          .describe("Generation number (1-9)"),
      },
    },
    ({ generation }: { generation: number }) => {
      const genDex = Dex.forGen(generation as GenerationNum);
      const availableItems = genDex.items
        .all()
        .filter((i) => !i.isNonstandard)
        .map((i) => i.name);

      return {
        content: [{ type: "text", text: JSON.stringify(availableItems) }],
      };
    },
  );
}
