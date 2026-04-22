# VGC OpenCode Workspace

This repository is an OpenCode suite for managing, building, and evaluating Pokémon Champions VGC teams. 

## Repository Structure & Assets
- **`teams/`**: The storage directory for all VGC teams. Teams must be saved here as `.md` files containing a standard Pokemon Showdown text block.
- **Commands (`.opencode/commands/`)**:
  - `/evaluate <filepath>`: Auto-detects archetype and provides tier-based feedback on a Showdown team file.
  - `/teambuild`: Conversational guide to constructing a 6-Pokemon team from scratch.
- **Skills (`.agents/skills/`)**: Contains authoritative game data and meta data. 
- **Agents (`.opencode/agents/`)**: Includes the `wolfey` subagent, an elite VGC analyst.

## Agent Instructions
- **Executing Workflows**: When the user asks to evaluate an existing team or build a new one, use the `Task` tool to invoke the custom slash commands (e.g., `prompt="/evaluate teams/001-mega-feraligatr-hyper-offense.md"` or `prompt="/teambuild"`).
- **Domain Rules**: This repo targets "Pokemon Champions", which removes IVs and replaces EVs with **SPs** (Stat Points). 1 SP = 8 EVs, max 32 SPs per stat, 66 total.
- **Loading Skills**: When manually answering questions or modifying teams without slash commands, proactively use the `skill` tool to load the relevant VGC skills (e.g., `checking-vgc-legality`, `sharing-vgc-team`). Do not rely on generic pre-trained Pokemon knowledge, as it will be factually incorrect for the Champions ruleset.
- **Saving Teams**: Always save or update team drafts as Markdown files in the `teams/` directory.
