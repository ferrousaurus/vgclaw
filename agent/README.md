# VGC OpenCode Agent Workspace

This directory contains the OpenCode agent configuration for Pokémon Champions VGC team building.

## For AI Agents
See [`AGENTS.md`](./AGENTS.md) for operational instructions, domain rules, and workflows.

## For Humans
- **`teams/`** — Saved VGC teams in Markdown + Showdown format.
- **`.agents/`** — Agent definitions, commands (`/evaluate`, `/teambuild`), skills, and tool wrappers.
- **`tools/`** — Core deterministic TypeScript tools providing Pokémon Champions data.
- **`assets/`** — Authoritative JSON data (Pokémon, moves, abilities, items, type chart).
