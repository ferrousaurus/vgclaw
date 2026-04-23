# Pokemon MCP Tools Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a comprehensive suite of granular, generation-specific MCP tools to query `@pkmn/dex` for Pokemon and item data necessary for teambuilding.

**Architecture:** Each new tool will have its own TypeScript file in the `tools/` directory, exposing a registration function. These functions use `zod` for input validation and `@pkmn/dex`'s `Dex.forGen(generation)` to ensure historical accuracy of Pokemon stats, types, abilities, and items. The tools will then be registered in the main `mcp.ts` file.

**Tech Stack:** Deno, TypeScript, `@modelcontextprotocol/sdk`, `@pkmn/dex`, `zod`

---

### Task 1: Items by Generation Tool

**Files:**
- Create: `tools/get_items_by_generation.ts`

- [ ] **Step 1: Write implementation**

```typescript
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
```

- [ ] **Step 2: Check syntax**

Run: `deno check tools/get_items_by_generation.ts`
Expected: PASS (No errors)

- [ ] **Step 3: Commit**

```bash
git add tools/get_items_by_generation.ts
git commit -m "feat: add get-items-by-generation mcp tool"
```

### Task 2: Pokemon Abilities Tool

**Files:**
- Create: `tools/get_pokemon_abilities.ts`

- [ ] **Step 1: Write implementation**

```typescript
import z from "zod";
import { Dex } from "@pkmn/dex";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GenerationNum } from "@pkmn/types";

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
        content: [{ type: "text", text: JSON.stringify(species.abilities) }],
      };
    },
  );
}
```

- [ ] **Step 2: Check syntax**

Run: `deno check tools/get_pokemon_abilities.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add tools/get_pokemon_abilities.ts
git commit -m "feat: add get-pokemon-abilities mcp tool"
```

### Task 3: Pokemon Types Tool

**Files:**
- Create: `tools/get_pokemon_types.ts`

- [ ] **Step 1: Write implementation**

```typescript
import z from "zod";
import { Dex } from "@pkmn/dex";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GenerationNum } from "@pkmn/types";

export default function registerGetPokemonTypes(server: McpServer) {
  server.registerTool(
    "get-pokemon-types",
    {
      title: "Get Pokemon Types",
      description: "Get types for a Pokemon in a specific generation",
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
        content: [{ type: "text", text: JSON.stringify(species.types) }],
      };
    },
  );
}
```

- [ ] **Step 2: Check syntax**

Run: `deno check tools/get_pokemon_types.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add tools/get_pokemon_types.ts
git commit -m "feat: add get-pokemon-types mcp tool"
```

### Task 4: Pokemon Base Stats Tool

**Files:**
- Create: `tools/get_pokemon_base_stats.ts`

- [ ] **Step 1: Write implementation**

```typescript
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
```

- [ ] **Step 2: Check syntax**

Run: `deno check tools/get_pokemon_base_stats.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add tools/get_pokemon_base_stats.ts
git commit -m "feat: add get-pokemon-base-stats mcp tool"
```

### Task 5: Pokemon Moveset Tool

**Files:**
- Create: `tools/get_pokemon_moveset.ts`

- [ ] **Step 1: Write implementation**
*Note: We handle learnsets asynchronously as they might need to be resolved depending on the @pkmn/dex version, but await works fine.*

```typescript
import z from "zod";
import { Dex } from "@pkmn/dex";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GenerationNum } from "@pkmn/types";

export default function registerGetPokemonMoveset(server: McpServer) {
  server.registerTool(
    "get-pokemon-moveset",
    {
      title: "Get Pokemon Moveset",
      description: "Get the valid moves/learnset for a Pokemon in a specific generation",
      inputSchema: {
        name: z.string().describe("Name of the Pokemon"),
        generation: z
          .number()
          .min(1)
          .max(9)
          .describe("Generation number (1-9)"),
      },
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
```

- [ ] **Step 2: Check syntax**

Run: `deno check tools/get_pokemon_moveset.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add tools/get_pokemon_moveset.ts
git commit -m "feat: add get-pokemon-moveset mcp tool"
```

### Task 6: Register new tools in `mcp.ts`

**Files:**
- Modify: `mcp.ts`

- [ ] **Step 1: Add imports and registration calls**

Modify `mcp.ts` to include the new tools.

```typescript
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
```

- [ ] **Step 2: Verify the whole server checks out**

Run: `deno check mcp.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add mcp.ts
git commit -m "feat: register all new pokemon teambuilding mcp tools"
```
