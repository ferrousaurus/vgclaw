# VGC Skills Workspace

This repository defines project-local OpenCode skills in `.agents/skills/*/SKILL.md`.

On startup, load and expose those skills from the project-local `.agents/skills` directory.

Available skills in this repo:

- `building-vgc-teams`
- `checking-vgc-legality`
- `evaluating-vgc-meta`
- `evaluating-vgc-teams`
- `evaluating-vgc-viability`

Use these repo-local skills whenever the user request matches their descriptions. Prefer the local skill definitions in `.agents/skills` as the source of truth for VGC-specific behavior in this workspace.
