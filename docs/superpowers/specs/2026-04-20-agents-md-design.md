# AGENTS.md: Contributor Guide For Repo Agents

## Summary

Add a root `AGENTS.md` that gives coding agents and contributors enough repository context to work safely and efficiently. The file is contributor-facing rather than user-facing: it should explain the repo's purpose, where important files live, how to make minimal changes, how to verify work, and which VGC-specific rules matter when editing skills or reference data.

## Approach

Create a single concise root `AGENTS.md` with operational guidance only. It should complement `README.md` rather than repeat it: README stays focused on installation and end-user skill selection, while `AGENTS.md` tells an in-repo agent how to navigate, edit, and validate this codebase.

## Changes

### 1. New root file: `AGENTS.md`

The file should be short, directive, and easy for an agent to scan.

### 2. Sections

#### Repo Overview

Explain that this repository contains agent skills for Pokemon Champions VGC workflows plus supporting reference/docs/data files. Clarify that most changes will be prompt/markdown/data edits rather than application code changes.

#### Important Paths

Call out the main directories an agent is likely to need:

- `.agents/skills/` for skill definitions and bundled resources
- `docs/superpowers/specs/` for design specs and planning artifacts
- `reference/` or skill-local `reference/` folders for heuristics and domain guides
- data files such as JSON reference files used by skills
- `README.md` for user-facing installation and usage context

The goal is to reduce repo exploration time and steer edits to the right place.

#### Working Conventions

Document the repo-specific expectations for edits:

- prefer minimal, local changes
- preserve existing prompt structure and tone unless intentionally revising it
- keep user-facing skill instructions explicit and non-handwavy
- avoid duplicating guidance already maintained elsewhere
- update nearby docs when behavior or structure changes

#### Skill Authoring Notes

Summarize how to work safely on skills:

- follow existing skill organization patterns
- keep reference material focused by topic
- keep data in data files and reasoning/instructions in markdown skill/reference files
- avoid adding speculative workflow steps or unsupported tool assumptions

#### Verification Checklist

Provide a practical checklist rather than a generic testing section:

- read adjacent files before editing to preserve local conventions
- verify links and referenced paths after edits
- if a skill mentions files, ensure they exist and names match exactly
- run relevant validation/tests if the repo exposes them; otherwise do a consistency pass on changed markdown and data

#### VGC Domain Notes

Include a few domain constraints agents should not violate:

- Showdown paste format is the standard interchange format
- teams are Level 50
- EV limit is 508
- no duplicate Pokemon or held items across a team
- do not invent current meta claims or usage stats without a real source

#### Change Boundaries

Clarify what not to do without clear need:

- do not rewrite broad sections of prompts when a local fix is enough
- do not add new files or workflows unless the task requires them
- do not turn README content into duplicated AGENTS content

## Why This Split Works

This structure gives agents a balanced mix of workflow, skill-authoring guidance, and domain context without turning `AGENTS.md` into a second README or a full maintainer manual. It should speed up routine repo changes while reducing prompt regressions and domain mistakes.
