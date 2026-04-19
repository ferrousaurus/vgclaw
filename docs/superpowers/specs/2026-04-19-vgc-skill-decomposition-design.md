# VGC Skill Decomposition

Extract duplicated reference data from `building-vgc-teams` and `evaluating-vgc-teams` into three new data-provider skills. Consumer skills reference providers instead of bundling their own copies.

## Problem

Both `building-vgc-teams` and `evaluating-vgc-teams` contain identical copies of 9 files (~22k lines total): 5 game data files and 4 strategic reference guides. Both also inline the same Pikalytics fetch instructions. Changes to any data file must be made in two places.

## New Skills

### checking-vgc-legality

Data provider for authoritative game data. No workflow — referenced by other skills.

**Owns:**
- `champions-roster.json` — legal Pokemon with types, base stats, abilities, moves, mega data
- `type-chart.json` — type effectiveness multipliers
- `moves.json` — move details (type, category, power, accuracy, priority, target, effect)
- `abilities.json` — ability effects
- `items.json` — held item details

**Also owns the Gatekeeper Rule:** "Never suggest a Pokemon not in champions-roster.json." Consumer skills inherit this rule via the required dependency.

### evaluating-vgc-viability

Data provider for strategic reference guides. No workflow — referenced by other skills.

**Owns:**
- `reference/roles.md` — VGC role definitions
- `reference/archetypes.md` — common team archetypes
- `reference/items.md` — item selection heuristics
- `reference/synergies.md` — pair synergy patterns (offensive combos, defensive pivots, mode pairs)

### evaluating-vgc-meta

Data provider for meta context. No local data files — owns the Pikalytics fetch instructions (URL, HTML parsing approach, fallback behavior when the fetch fails).

## Consumer Skill Changes

Both `building-vgc-teams` and `evaluating-vgc-teams` are updated identically in structure.

### Frontmatter Dependencies

```yaml
dependencies:
  required:
    - checking-vgc-legality
  optional:
    - evaluating-vgc-viability
    - evaluating-vgc-meta
```

### Dependency Check Section

Added near the top of each consumer SKILL.md:

- **checking-vgc-legality (required):** If missing, stop and tell the user: "This skill requires the checking-vgc-legality skill. Please install it before continuing."
- **evaluating-vgc-viability (optional):** If missing, continue without strategic reference data. Skip synergy scans, archetype references, and role checklists. Do not mention them.
- **evaluating-vgc-meta (optional):** If missing, continue without meta context. Use generic assessments (e.g., "above-average speed") instead of meta-relative ones (e.g., "faster than Garchomp, a top threat"). Skip threat lists and meta matchup mapping.

### Data Sources Section

Replaces inline file lists with grouped references naming the source skill:

```markdown
### From checking-vgc-legality (REQUIRED — stop if skill is missing)
- `champions-roster.json` -- legal Pokemon...
- (etc.)

### From evaluating-vgc-viability (optional — degrade gracefully if missing)
- `reference/roles.md` -- VGC role definitions
- (etc.)

### From evaluating-vgc-meta (optional — degrade gracefully if missing)
- Pikalytics fetch for current usage stats, top threats, common sets
```

### Workflow Changes

- The Gatekeeper Rule is removed from consumer SKILL.md files (inherited from checking-vgc-legality).
- All file references updated to name the source skill.
- Steps depending on optional skills get conditional language: "If evaluating-vgc-viability is available, load synergies.md..."
- Steps depending on evaluating-vgc-meta use meta-aware phrasing when available, generic phrasing when not. Example: with meta — "With Tailwind, Pokemon A is faster than Pokemon B, a top threat." Without meta — "Pokemon A has an above-average speed."

### Graceful Degradation Details

**Without evaluating-vgc-viability:**
- Synergy scans (pair synergy analysis) are skipped entirely
- Archetype detection/confirmation still works based on team composition signals, but without reference definitions
- Role checklists are skipped
- Item selection heuristics are unavailable; suggest items based on general knowledge only

**Without evaluating-vgc-meta:**
- No Pikalytics fetch attempted
- Threat lists and meta matchup mapping are skipped
- Speed comparisons, usage-based suggestions, and "top threat" language are replaced with stat-based generic assessments
- The user is not prompted about what they're seeing in the meta

## File Operations

**Create (3 new skill directories, 12 files):**
- `skills/checking-vgc-legality/SKILL.md`
- `skills/checking-vgc-legality/champions-roster.json` (moved)
- `skills/checking-vgc-legality/type-chart.json` (moved)
- `skills/checking-vgc-legality/moves.json` (moved)
- `skills/checking-vgc-legality/abilities.json` (moved)
- `skills/checking-vgc-legality/items.json` (moved)
- `skills/evaluating-vgc-viability/SKILL.md`
- `skills/evaluating-vgc-viability/reference/roles.md` (moved)
- `skills/evaluating-vgc-viability/reference/archetypes.md` (moved)
- `skills/evaluating-vgc-viability/reference/items.md` (moved)
- `skills/evaluating-vgc-viability/reference/synergies.md` (moved)
- `skills/evaluating-vgc-meta/SKILL.md`

**Delete (18 duplicate files):**
- All 9 data/reference files from `skills/building-vgc-teams/`
- All 9 data/reference files from `skills/evaluating-vgc-teams/`
- Empty `reference/` directories in both consumer skills

**Modify (2 files):**
- `skills/building-vgc-teams/SKILL.md`
- `skills/evaluating-vgc-teams/SKILL.md`

**Net result:** 18 duplicate files become 9 files in 3 new skill directories.
