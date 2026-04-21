# AGENTS.md

## Repo Overview

This repository contains agent skills and supporting reference material for Pokemon Champions VGC team building and evaluation workflows. Most changes in this repo are markdown or data-file edits rather than application code changes.

Use `README.md` for user-facing installation and skill selection context. Use this file for in-repo contributor guidance.

## Important Paths

- `skills/`: primary product surface for the VGC skills in this repository
- `skills/*/SKILL.md`: skill definitions and top-level instructions
- `skills/*/reference/`: skill-local markdown reference material
- `skills/checking-vgc-legality/*.json`: core structured game data used by other skills
- `.agents/skills/`: internal superpowers workflow skills used for local agent development
- `docs/superpowers/specs/`: design specs for recent work
- `docs/superpowers/plans/`: implementation plans for approved work
- `README.md`: user-facing overview and installation instructions

When editing a skill, inspect nearby files first so your changes match the existing structure and wording style.

## Working Conventions

- Prefer the smallest correct change.
- Preserve existing prompt structure and tone unless the task is explicitly rewriting them.
- Keep instructions concrete. Avoid vague guidance that leaves room for agent guesswork.
- Do not duplicate guidance already maintained in another file unless the duplication is intentional and necessary.
- If behavior changes, update the closest relevant documentation in the same change.

## Skill Authoring Notes

- Follow the existing organization pattern in each skill directory.
- Keep reasoning and workflow guidance in markdown files.
- Keep structured facts and machine-readable values in data files.
- If a skill references a file, command, or dependency, verify that it exists and that the name matches exactly.
- Avoid adding speculative workflow steps, unsupported tool assumptions, or fake capabilities.

## Verification Checklist

Before finishing a change:

- Read adjacent files to confirm local conventions.
- Verify any referenced paths, file names, and links.
- Check that updated instructions still match the actual repository layout.
- If you changed structured data, do a consistency pass for field names and value formats.
- Run relevant validation or tests when the task or repo provides them.

## VGC Domain Notes

- Showdown paste format is the default team interchange format.
- Teams are built for Level 50 play.
- Total EVs are capped at 508.
- Teams cannot contain duplicate Pokemon or duplicate held items.
- Do not invent current meta claims, usage stats, or matchup data without a real source.

## Change Boundaries

- Do not rewrite large prompt sections when a local edit is enough.
- Do not add new files or workflows unless the task actually requires them.
- Do not turn `README.md` into contributor guidance; keep README user-facing and `AGENTS.md` contributor-facing.
