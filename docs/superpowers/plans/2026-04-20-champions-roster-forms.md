# Champions Roster Forms Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split legal regional forms in `champions-roster.json` into separate Showdown-compatible entries and remove merged form data from the affected base-species records.

**Architecture:** Keep the existing flat JSON array and correct the data in place. Verification is data-focused rather than code-focused: first prove the current file is missing required form entries and contains merged-form records, then make the smallest roster edits needed to produce one internally consistent entry per legal species/form, and finally validate JSON shape and presence/absence conditions with repeatable commands.

**Tech Stack:** JSON data files, `jq`, Node.js

---

## File Map

- Modify: `skills/checking-vgc-legality/champions-roster.json`
- Maybe modify: `skills/evaluating-vgc-viability/reference/roles.md`
- Reference: `docs/superpowers/specs/2026-04-20-champions-roster-forms-design.md`

### Task 1: Write and Run the Failing Roster Validation

**Files:**
- Modify: none
- Test: `skills/checking-vgc-legality/champions-roster.json`

- [ ] **Step 1: Write the failing validation command**

Use a Node one-liner that checks for the required form names and rejects obviously merged base entries.

```bash
node -e 'const fs=require("fs"); const roster=JSON.parse(fs.readFileSync("skills/checking-vgc-legality/champions-roster.json","utf8")); const byName=new Map(roster.map(p=>[p.name,p])); const required=["Ninetales-Alola","Raichu-Alola","Arcanine-Hisui","Slowbro-Galar","Tauros-Paldea-Combat","Tauros-Paldea-Blaze","Tauros-Paldea-Aqua"]; const missing=required.filter(name=>!byName.has(name)); const merged=[]; const ninetales=byName.get("Ninetales"); if(ninetales?.types?.includes("Ice")||ninetales?.abilities?.includes("Snow Warning")||ninetales?.moves?.includes("Aurora Veil")) merged.push("Ninetales"); const raichu=byName.get("Raichu"); if(raichu?.types?.includes("Psychic")||raichu?.moves?.includes("Expanding Force")||raichu?.abilities?.includes("Surge Surfer")) merged.push("Raichu"); const arcanine=byName.get("Arcanine"); if(arcanine?.types?.includes("Rock")||arcanine?.abilities?.includes("Rock Head")||arcanine?.moves?.includes("Head Smash")) merged.push("Arcanine"); const slowbro=byName.get("Slowbro"); if(slowbro?.types?.includes("Poison")||slowbro?.abilities?.includes("Quick Draw")||slowbro?.moves?.includes("Shell Side Arm")) merged.push("Slowbro"); if(missing.length||merged.length){ console.error(JSON.stringify({missing, merged}, null, 2)); process.exit(1);} console.log("roster forms validated");'
```

- [ ] **Step 2: Run the validation to verify it fails**

Run:

```bash
node -e 'const fs=require("fs"); const roster=JSON.parse(fs.readFileSync("skills/checking-vgc-legality/champions-roster.json","utf8")); const byName=new Map(roster.map(p=>[p.name,p])); const required=["Ninetales-Alola","Raichu-Alola","Arcanine-Hisui","Slowbro-Galar","Tauros-Paldea-Combat","Tauros-Paldea-Blaze","Tauros-Paldea-Aqua"]; const missing=required.filter(name=>!byName.has(name)); const merged=[]; const ninetales=byName.get("Ninetales"); if(ninetales?.types?.includes("Ice")||ninetales?.abilities?.includes("Snow Warning")||ninetales?.moves?.includes("Aurora Veil")) merged.push("Ninetales"); const raichu=byName.get("Raichu"); if(raichu?.types?.includes("Psychic")||raichu?.moves?.includes("Expanding Force")||raichu?.abilities?.includes("Surge Surfer")) merged.push("Raichu"); const arcanine=byName.get("Arcanine"); if(arcanine?.types?.includes("Rock")||arcanine?.abilities?.includes("Rock Head")||arcanine?.moves?.includes("Head Smash")) merged.push("Arcanine"); const slowbro=byName.get("Slowbro"); if(slowbro?.types?.includes("Poison")||slowbro?.abilities?.includes("Quick Draw")||slowbro?.moves?.includes("Shell Side Arm")) merged.push("Slowbro"); if(missing.length||merged.length){ console.error(JSON.stringify({missing, merged}, null, 2)); process.exit(1);} console.log("roster forms validated");'
```

Expected: FAIL with JSON output showing missing alternate-form names and merged base entries such as `Ninetales`, `Raichu`, `Arcanine`, and `Slowbro`.

- [ ] **Step 3: Commit the failing-check milestone**

```bash
git status --short
```

Expected: no tracked file changes yet; this step is only the explicit red-phase checkpoint before editing data.

### Task 2: Split Regional Forms into Separate Roster Entries

**Files:**
- Modify: `skills/checking-vgc-legality/champions-roster.json`
- Reference: `docs/superpowers/specs/2026-04-20-champions-roster-forms-design.md`

- [ ] **Step 1: Edit the Ninetales entries**

Update the existing `Ninetales` object so it contains only the Fire-form typing, abilities, and move list. Add a new sibling entry for `Ninetales-Alola` with Ice/Fairy typing, Snow Warning/Snow Cloak, and only Alolan-compatible moves.

Required object names and key distinctions:

```json
{
  "name": "Ninetales"
}
```

```json
{
  "name": "Ninetales-Alola",
  "types": ["Ice", "Fairy"],
  "abilities": ["Snow Cloak", "Snow Warning"]
}
```

- [ ] **Step 2: Edit the Raichu entries**

Update the existing `Raichu` object so it contains only Electric-form data. Add a new sibling entry for `Raichu-Alola` containing Electric/Psychic typing and the Psychic-form move pool.

Required object names and key distinctions:

```json
{
  "name": "Raichu"
}
```

```json
{
  "name": "Raichu-Alola",
  "types": ["Electric", "Psychic"],
  "abilities": ["Surge Surfer"]
}
```

- [ ] **Step 3: Edit the Arcanine and Slowbro entries**

Update the existing `Arcanine` and `Slowbro` objects so they retain only Kantonian data. Add new entries for `Arcanine-Hisui` and `Slowbro-Galar` with the regional typings, abilities, and move pools.

Required object names and key distinctions:

```json
{
  "name": "Arcanine-Hisui",
  "types": ["Fire", "Rock"],
  "abilities": ["Intimidate", "Flash Fire", "Rock Head"]
}
```

```json
{
  "name": "Slowbro-Galar",
  "types": ["Poison", "Psychic"],
  "abilities": ["Quick Draw", "Own Tempo", "Regenerator"]
}
```

- [ ] **Step 4: Replace the Tauros record with Paldean form-specific entries if legal**

Inspect the current `Tauros` record and split Paldean data out into form-specific entries. Keep the base `Tauros` record strictly Normal-type. Add `Tauros-Paldea-Combat`, `Tauros-Paldea-Blaze`, and `Tauros-Paldea-Aqua` entries only if those exact forms are legal in Champions and supported by the move list already present in the roster source data.

Required object names:

```json
{"name": "Tauros"}
```

```json
{"name": "Tauros-Paldea-Combat"}
```

```json
{"name": "Tauros-Paldea-Blaze"}
```

```json
{"name": "Tauros-Paldea-Aqua"}
```

- [ ] **Step 5: Run a formatting pass that preserves valid JSON**

Run:

```bash
jq . skills/checking-vgc-legality/champions-roster.json > /tmp/champions-roster.json && mv /tmp/champions-roster.json skills/checking-vgc-legality/champions-roster.json
```

Expected: command succeeds silently and rewrites the file as valid, consistently formatted JSON.

- [ ] **Step 6: Commit the data split**

```bash
git add skills/checking-vgc-legality/champions-roster.json
git commit -m "fix: split regional forms in champions roster"
```

Expected: commit succeeds with only the roster data change unless a nearby doc change is required in Task 3.

### Task 3: Verify the Corrected Roster and Fix Nearby Wording if Needed

**Files:**
- Modify: `skills/evaluating-vgc-viability/reference/roles.md`
- Test: `skills/checking-vgc-legality/champions-roster.json`

- [ ] **Step 1: Re-run the form validation and verify it passes**

Run:

```bash
node -e 'const fs=require("fs"); const roster=JSON.parse(fs.readFileSync("skills/checking-vgc-legality/champions-roster.json","utf8")); const byName=new Map(roster.map(p=>[p.name,p])); const required=["Ninetales-Alola","Raichu-Alola","Arcanine-Hisui","Slowbro-Galar","Tauros-Paldea-Combat","Tauros-Paldea-Blaze","Tauros-Paldea-Aqua"]; const missing=required.filter(name=>!byName.has(name)); const merged=[]; const ninetales=byName.get("Ninetales"); if(ninetales?.types?.includes("Ice")||ninetales?.abilities?.includes("Snow Warning")||ninetales?.moves?.includes("Aurora Veil")) merged.push("Ninetales"); const raichu=byName.get("Raichu"); if(raichu?.types?.includes("Psychic")||raichu?.moves?.includes("Expanding Force")||raichu?.abilities?.includes("Surge Surfer")) merged.push("Raichu"); const arcanine=byName.get("Arcanine"); if(arcanine?.types?.includes("Rock")||arcanine?.abilities?.includes("Rock Head")||arcanine?.moves?.includes("Head Smash")) merged.push("Arcanine"); const slowbro=byName.get("Slowbro"); if(slowbro?.types?.includes("Poison")||slowbro?.abilities?.includes("Quick Draw")||slowbro?.moves?.includes("Shell Side Arm")) merged.push("Slowbro"); if(missing.length||merged.length){ console.error(JSON.stringify({missing, merged}, null, 2)); process.exit(1);} console.log("roster forms validated");'
```

Expected: PASS with `roster forms validated`.

- [ ] **Step 2: Verify JSON structure and Showdown-compatible names with `jq`**

Run:

```bash
jq '[.[] | .name] | map(select(. == "Ninetales-Alola" or . == "Raichu-Alola" or . == "Arcanine-Hisui" or . == "Slowbro-Galar" or . == "Tauros-Paldea-Combat" or . == "Tauros-Paldea-Blaze" or . == "Tauros-Paldea-Aqua"))' skills/checking-vgc-legality/champions-roster.json
```

Expected: JSON array containing those Showdown-compatible names exactly once each.

- [ ] **Step 3: Fix nearby documentation wording only if the roster correction exposes stale names**

If `skills/evaluating-vgc-viability/reference/roles.md` or another adjacent file still refers to natural-language regional names in a way that should now match the roster key, update only the nearby wording.

Target wording example if needed:

```md
- **Snow** (Snow Warning): Abomasnow, Ninetales-Alola (check Champions availability)
```

If no doc change is needed, leave docs untouched.

- [ ] **Step 4: Run final status check**

Run:

```bash
git status --short
```

Expected: clean working tree, or only unrelated pre-existing user changes outside this task.

- [ ] **Step 5: Commit any doc follow-up if Task 3 changed docs**

```bash
git add skills/evaluating-vgc-viability/reference/roles.md
git commit -m "docs: align roster references with showdown form names"
```

Expected: skip this step entirely if no doc file changed.

## Self-Review

- Spec coverage: the plan covers separate Showdown-compatible form entries, cleanup of merged base records, flat-schema preservation, and explicit validation commands.
- Placeholder scan: removed generic testing language and replaced it with exact `node` and `jq` commands.
- Type consistency: all referenced form names match the approved spec naming (`Ninetales-Alola`, `Raichu-Alola`, `Arcanine-Hisui`, `Slowbro-Galar`, `Tauros-Paldea-Combat`, `Tauros-Paldea-Blaze`, `Tauros-Paldea-Aqua`).
