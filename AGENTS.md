# VGC Skills Workspace

This repository defines project-local OpenCode skills in `.opencode/skills/*/SKILL.md`.

On startup, load and expose those skills from the project-local `.opencode/skills` directory.

Available skills in this repo:

- `checking-vgc-team-legality`
- `evaluating-vgc-meta`
- `evaluating-vgc-team-viability`
- `sharing-vgc-team`

Use these repo-local skills whenever the user request matches their descriptions. Prefer the local skill definitions in `.opencode/skills` as the source of truth for VGC-specific behavior in this workspace.
