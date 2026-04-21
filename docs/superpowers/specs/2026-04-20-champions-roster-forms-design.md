# Champions Roster: Explicit Regional Forms

## Summary

Correct `skills/checking-vgc-legality/champions-roster.json` so legal regional forms are represented as separate roster entries instead of being merged into base-species entries. Keep the roster as a flat array and keep Showdown-compatible species names in the `name` field so the data can round-trip cleanly with Showdown import/export format.

## Approach

Use the existing flat roster structure and split each legal regional form into its own self-consistent entry. This is the smallest change that fixes the incorrect merged data while preserving the shape already consumed by the repository's other skills.

## Changes

### 1. Update `champions-roster.json` entry semantics

Each object in `champions-roster.json` represents exactly one legal species or form. The `name` field remains the lookup key and must use Showdown-compatible species names.

Examples:

- `Ninetales`
- `Ninetales-Alola`
- `Raichu`
- `Raichu-Alola`
- `Arcanine`
- `Arcanine-Hisui`
- `Slowbro`
- `Slowbro-Galar`
- `Tauros-Paldea-Combat`
- `Tauros-Paldea-Blaze`
- `Tauros-Paldea-Aqua`

Natural-language regional wording such as "Alolan Ninetales" remains documentation language only, not the serialized `name` value.

### 2. Split merged base/form records

Any species currently combining base-form and regional-form data into a single record must be separated into distinct entries.

For each affected species:

- The base entry keeps only the base form's types, base stats, abilities, moves, and mega data.
- Each legal regional form gets its own entry with only that form's types, base stats, abilities, and moves.
- Form-exclusive moves or abilities must not remain on the wrong form after the split.

Known affected entries already visible in the current file include:

- `Ninetales` / `Ninetales-Alola`
- `Raichu` / `Raichu-Alola`
- `Arcanine` / `Arcanine-Hisui`
- `Slowbro` / `Slowbro-Galar`
- `Tauros` / Paldean Tauros entries

Implementation should also scan the full file for any other merged-form records and normalize them to the same rule.

### 3. Preserve downstream compatibility

No schema change is needed in downstream skills because they already treat `champions-roster.json` as a flat list of legal Pokemon records keyed by `name`.

The only behavioral change is data correctness:

- legal regional forms become directly addressable
- base forms stop reporting incompatible moves, typings, stats, or abilities
- Showdown paste species names can be checked directly against the roster

### 4. Validation expectations

After the roster edit:

- every entry should be internally consistent for exactly one species/form
- known legal regional forms should be present as their own entries
- no base entry should include regional-only typings, stats, abilities, or moves
- `name` values for alternate forms should match Showdown-compatible species names

## Out Of Scope

- introducing a nested `forms` schema
- changing move, item, ability, or type-chart file formats
- broad documentation rewrites unless a nearby file becomes inaccurate because of the roster correction
