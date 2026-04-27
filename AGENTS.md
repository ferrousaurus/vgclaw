
# VGC OpenCode Workspace

This repository is an OpenCode suite for managing, building, and evaluating Pokémon Champions VGC teams.

## Repository Structure & Assets
- **`agent/teams/`**: The storage directory for all VGC teams. Teams must be saved here as `.md` files containing a standard Pokemon Showdown text block.
- **Skills (`agent/.agents/skills/`)**: Contains authoritative game data and meta data.
- **MCP Server**: A root-level concern. The server entry point is at `../src/mcp.ts` (relative to the `agent/` working directory), with individual tools implemented in `../src/tools/`.
- **Configuration**: Local agent configuration is in `agent/opencode.jsonc`.

## Development Constraints & Tech Stack
- **Bun**: This project uses `bun` instead of `node`/`npm`. Use `bun install`, `bun run`, and `bun test`.
- **MCP SDK**: The server uses `@modelcontextprotocol/sdk`.

## Agent Instructions
- **Executing Workflows**: When the user asks to evaluate an existing team or build a new one, use the relevant skill (e.g., `prompt="/building-vgc-team"` or `/evaluating-vgc-team-viability prompt="The team in agent/teams/001-mega-feraligatr-hyper-offense.md"`).
- **Domain Rules**: This repo targets "Pokemon Champions", which removes IVs and replaces EVs with **SPs** (Stat Points). 1 SP = 8 EVs, max 32 SPs per stat, 66 total.
- **Loading Context**: When manually answering questions or modifying teams without slash commands, proactively use the deterministic tools like `check-vgc-team-legality` and `share-vgc-team`. Do not rely on generic pre-trained Pokemon knowledge, as it will be factually incorrect for the Champions ruleset.
- **Saving Teams**: Always save or update team drafts as Markdown files in the `agent/teams/` directory.
- **Referencing Availability**: When thinking about availability of a Pokemon, Held Item, Move, or Ability, you MUST use the `referencing-valid-vgc-data` skill and the static JSON files in `agent/assets/` (e.g., `pokemon.json`, `abilities.json`, `moves.json`, `items.json`). NEVER use grep to find this data.
