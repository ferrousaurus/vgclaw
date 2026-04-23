import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import registerGetPokemonDetails from "./tools/get_pokemon_details.ts";
import registerGetPokemonByGeneration from "./tools/get_pokemon_by_generation.ts";
import registerGetItemsByGeneration from "./tools/get_items_by_generation.ts";
import registerGetPokemonAbilities from "./tools/get_pokemon_abilities.ts";
import registerGetPokemonTypes from "./tools/get_pokemon_types.ts";
import registerGetPokemonBaseStats from "./tools/get_pokemon_base_stats.ts";
import registerGetPokemonMoveset from "./tools/get_pokemon_moveset.ts";

const server = new McpServer({
  name: "vgc-mcp",
  version: "1.0.0",
});

registerGetPokemonDetails(server);
registerGetPokemonByGeneration(server);
registerGetItemsByGeneration(server);
registerGetPokemonAbilities(server);
registerGetPokemonTypes(server);
registerGetPokemonBaseStats(server);
registerGetPokemonMoveset(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("VGC MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
