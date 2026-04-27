# Pokemon VGC Opencode Suite

A comprehensive suite of Opencode agents, commands, and skills specifically designed for the creation, evaluation, and analysis of Pokémon VGC (Video Game Championships) teams. 

## Overview

This repository provides project-local OpenCode skills configured in `agent/.agents/skills/`. When you launch Opencode inside the `agent/` directory, it automatically loads these specialized skills to assist you with Pokémon VGC team building.

## Available Skills

- **Deterministic Data**: The workspace provides authoritative game data for Pokemon Champions VGC via static JSON files in `agent/assets/`. Includes legal rosters (`pokemon.json`), moves (`moves.json`), abilities (`abilities.json`), items (`items.json`), and a type chart (`type-chart.json`). Use the `referencing-valid-vgc-data` skill to guide verification.
- **`evaluating-vgc-team-viability`**: Offers strategic reference guides under `agent/.agents/skills/evaluating-vgc-team-viability/references/` for Pokemon Champions VGC. Covers role definitions, team archetypes, item heuristics, and pair synergy patterns.

## Usage

Open the `agent/` directory in your terminal and launch Opencode. The agents will automatically pick up the instructions from `AGENTS.md` and load the local skills to help you build, analyze, and format your VGC teams. Ask Opencode to evaluate a team, check the current meta, or ensure your team is legal for tournament play!

Opening the repository root puts you in maintenance mode for editing source files, not for running the agent.
