# Pokemon Teambuilding MCP Suite Design

## Overview
Create a comprehensive suite of granular, generation-specific MCP tools to query `@pkmn/dex` for Pokemon and item data necessary for teambuilding. All data lookups will be strictly tied to a specific generation to ensure accuracy (e.g., Fairy typing starting in Gen 6).

## Tool Architecture (One File Per Tool)
The following tools will be implemented in the `tools/` directory. Each tool will export a default function `registerToolName(server: McpServer)` and will be imported and registered in `mcp.ts`.

*   `get_pokemon_by_generation.ts`: (Update existing) Returns a list of all valid Pokémon species for a given generation (1-9).
*   `get_items_by_generation.ts`: Returns a list of all valid items for a given generation (1-9).
*   `get_pokemon_abilities.ts`: Returns the abilities (slots 0, 1, H, S) for a Pokémon in a specific generation.
*   `get_pokemon_types.ts`: Returns the types (e.g., Normal/Flying) for a Pokémon in a specific generation.
*   `get_pokemon_base_stats.ts`: Returns the base stats (HP, Atk, Def, SpA, SpD, Spe) for a Pokémon in a specific generation.
*   `get_pokemon_moveset.ts`: Returns the available moves/learnset for a Pokémon in a specific generation.

## Data Flow & Dependencies
*   All queries will rely on `Dex.forGen(generation as GenerationNum)` from `@pkmn/dex` to ensure we are retrieving the historical state of the Pokémon/Item for that specific generation.
*   Moveset lookups will utilize species learnset data from the corresponding generation `Dex` object to compile a list of legal moves.

## Error Handling & Validation
*   **Input Validation:** `zod` will be used to enforce that `generation` is a number between 1 and 9, and `name` is a valid string.
*   **Missing Entity:** If a Pokémon or Item did not exist in the requested generation (e.g., querying Dragapult in Gen 7), the tool will return a clear, descriptive error indicating the entity is invalid for that generation.
