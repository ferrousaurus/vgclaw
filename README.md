# Pokemon VGC Opencode Suite

A comprehensive suite of Opencode agents, commands, and skills specifically designed for the creation, evaluation, and analysis of Pokémon VGC (Video Game Championships) teams. 

## Overview

This repository provides project-local OpenCode skills configured in `.opencode/skills/`. When you launch Opencode in this workspace, it automatically loads these specialized skills to assist you with Pokémon VGC team building.

## Available Skills

- **`checking-vgc-legality`**: Provides authoritative game data for Pokemon Champions VGC. Includes legal rosters, moves, abilities, items, and a type chart. This is a required dependency for team building and evaluation skills.
- **`evaluating-vgc-meta`**: Pulls and provides current Pokemon Champions VGC meta data via Pikalytics, including usage stats, top threats, common sets, and popular teammates.
- **`evaluating-vgc-team-viability`**: Offers strategic reference guides for Pokemon Champions VGC. Covers role definitions, team archetypes, item heuristics, and pair synergy patterns.
- **`sharing-vgc-team`**: Provides standards and instructions on how to effectively read, write, and share teams for Pokemon Champions VGC.

## Usage

Simply open this repository in your terminal and launch Opencode. The agents will automatically pick up the instructions from `AGENTS.md` and load the local skills to help you build, analyze, and format your VGC teams. Ask Opencode to evaluate a team, check the current meta, or ensure your team is legal for tournament play!
