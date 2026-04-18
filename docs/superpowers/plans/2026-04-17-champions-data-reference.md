# Champions Data Reference Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scrape Serebii's Champions-specific pages to enrich the VGC team builder skill with complete local data (abilities, movesets, Mega Evolution, move details, ability effects), replacing the PokeAPI runtime dependency.

**Architecture:** A Python scraping script (stdlib only -- urllib, re, json, html) fetches ~700 pages from Serebii, parses them with regex, and writes three JSON files. The script is a one-time tool deleted after use. SKILL.md is then updated to reference the new local data instead of PokeAPI.

**Tech Stack:** Python 3.9+ (stdlib only), curl for fallback, Serebii HTML pages

**Spec:** `docs/superpowers/specs/2026-04-17-champions-data-reference-design.md`

---

### Task 1: Write the Pokemon page scraper

**Files:**
- Create: `scripts/scrape_champions.py`

This script fetches each Pokemon's Champions page from Serebii and extracts abilities, moves, and mega data. It enriches the existing `champions-roster.json`.

- [ ] **Step 1: Create the script**

Create `scripts/scrape_champions.py`:

```python
#!/usr/bin/env python3
"""
Scrape Serebii's Pokemon Champions pages to build enriched roster data.

Usage:
    python3 scripts/scrape_champions.py pokemon
    python3 scripts/scrape_champions.py moves
    python3 scripts/scrape_champions.py abilities

Each subcommand reads from cache (tmp/serebii_cache/) if available,
fetches missing pages, and writes to the skill directory.
"""

import json
import os
import re
import sys
import time
import urllib.request
import html as html_module

SKILL_DIR = ".claude/skills/building-vgc-teams"
CACHE_DIR = "tmp/serebii_cache"
DELAY = 1.0  # seconds between requests

def fetch(url, cache_key):
    """Fetch URL, cache raw HTML. Skip if already cached."""
    cache_path = os.path.join(CACHE_DIR, cache_key)
    if os.path.exists(cache_path):
        with open(cache_path, "rb") as f:
            return f.read().decode("latin-1")
    print(f"  Fetching {url}")
    req = urllib.request.Request(url, headers={"User-Agent": "VGCTeamBuilder/1.0"})
    try:
        with urllib.request.urlopen(req) as resp:
            data = resp.read()
        os.makedirs(os.path.dirname(cache_path), exist_ok=True)
        with open(cache_path, "wb") as f:
            f.write(data)
        time.sleep(DELAY)
        return data.decode("latin-1")
    except Exception as e:
        print(f"  ERROR fetching {url}: {e}")
        return None

def serebii_slug(name):
    """Convert display name to Serebii URL slug."""
    slug = name.lower()
    slug = slug.replace("mr. rime", "mr.rime")
    slug = slug.replace(". ", ".")
    slug = slug.replace(" ", "")
    slug = slug.replace("'", "")
    slug = slug.replace(":", "")
    # Kommo-o stays as kommo-o
    return slug

def parse_pokemon_page(html_content, name):
    """Extract abilities, moves, and mega data from a Pokemon page."""
    result = {}

    # Abilities: <a href="/abilitydex/{slug}.shtml"><b>{Name}</b></a>
    # Deduplicate, take from before any Mega section
    # Split on 'Mega ' + name to separate base vs mega
    mega_marker = f"Mega {name}"
    base_html = html_content
    mega_html = None
    if mega_marker in html_content:
        idx = html_content.index(mega_marker)
        base_html = html_content[:idx]
        mega_html = html_content[idx:]

    ability_names = re.findall(
        r'/abilitydex/[\w-]+\.shtml[^>]*><b>([^<]+)</b>', base_html
    )
    result["abilities"] = list(dict.fromkeys(ability_names))

    # Moves: <a href="/attackdex-champions/{slug}.shtml">{Move Name}</a>
    attack_links = re.findall(
        r'<a href="/attackdex-champions/([^"]+)\.shtml"[^>]*>([^<]*)</a>',
        html_content
    )
    move_names = list(dict.fromkeys(m[1] for m in attack_links if m[1]))
    result["moves"] = move_names

    # Base stats: split on 'Base Stats', take numbers from first section
    parts = html_content.split("Base Stats")
    if len(parts) > 1:
        nums = re.findall(r">(\d{1,3})</td>", parts[1][:800])
        if len(nums) >= 6:
            result["baseStats"] = {
                "hp": int(nums[0]), "atk": int(nums[1]), "def": int(nums[2]),
                "spa": int(nums[3]), "spd": int(nums[4]), "spe": int(nums[5])
            }

    # Mega data
    if mega_html and len(parts) > 2:
        mega = {}
        mega_abilities = re.findall(
            r'/abilitydex/[\w-]+\.shtml[^>]*><b>([^<]+)</b>', mega_html
        )
        if mega_abilities:
            mega["ability"] = mega_abilities[0]

        # Mega stats from second 'Base Stats' section
        mega_nums = re.findall(r">(\d{1,3})</td>", parts[2][:800])
        if len(mega_nums) >= 6:
            mega["baseStats"] = {
                "hp": int(mega_nums[0]), "atk": int(mega_nums[1]),
                "def": int(mega_nums[2]), "spa": int(mega_nums[3]),
                "spd": int(mega_nums[4]), "spe": int(mega_nums[5])
            }

        # Mega types: check for type images near the mega section
        mega_types = re.findall(r'/types/(\w+)\.gif', mega_html[:2000])
        if mega_types:
            mega["types"] = [t.capitalize() for t in list(dict.fromkeys(mega_types))]

        if mega:
            result["mega"] = mega

    return result


def parse_move_page(html_content):
    """Extract move details from an attackdex page."""
    result = {}

    # Type: /pokedex-bw/type/{type}.gif
    type_match = re.search(r'/pokedex-bw/type/(\w+)\.gif', html_content)
    if type_match:
        result["type"] = type_match.group(1).capitalize()

    # Category: /pokedex-bw/type/{category}.png
    cat_match = re.search(r'/pokedex-bw/type/(\w+)\.png', html_content)
    if cat_match:
        result["category"] = cat_match.group(1).capitalize()

    # PP, Power, Accuracy: three values in sequence after the header row
    pp_section = html_content[html_content.find("Power Points"):] if "Power Points" in html_content else ""
    if pp_section:
        vals = re.findall(r'class="cen">\s*\n?\s*(\S+)', pp_section[:500])
        if len(vals) >= 3:
            result["pp"] = int(vals[0]) if vals[0] != "--" else None
            result["power"] = int(vals[1]) if vals[1] != "--" else None
            result["accuracy"] = int(vals[2]) if vals[2] != "--" else None

    # Priority and target: after 'Speed Priority' header
    priority_section = html_content[html_content.find("Speed Priority"):] if "Speed Priority" in html_content else ""
    if priority_section:
        vals = re.findall(r'class="cen">\s*\n?\s*([^<\t]+)', priority_section[:600])
        if len(vals) >= 3:
            # vals[0] = crit rate, vals[1] = priority, vals[2+] = target
            try:
                result["priority"] = int(vals[1].strip())
            except ValueError:
                result["priority"] = 0
            # Target is in a cell that may contain "All Adjacent", "Selected Target", etc.
            target_match = re.search(
                r'Hit in Battle.*?class="cen">\s*\n?\s*(.*?)\s*</td>',
                priority_section[:600], re.DOTALL
            )
            if target_match:
                target_text = re.sub(r'<[^>]+>', '', target_match.group(1)).strip()
                target_text = html_module.unescape(target_text)
                # Normalize common targets
                target_text = target_text.replace("Pokémon", "").strip()
                result["target"] = target_text

    # Effect: In-Depth Effect section
    effect_match = re.search(
        r'In-Depth Effect:.*?class="fooinfo"[^>]*>\s*<p>(.*?)</p>',
        html_content, re.DOTALL
    )
    if effect_match:
        effect_text = re.sub(r'<[^>]+>', '', effect_match.group(1)).strip()
        effect_text = html_module.unescape(effect_text)
        result["effect"] = effect_text
    else:
        result["effect"] = ""

    return result


def parse_ability_page(html_content):
    """Extract ability effect from an abilitydex page."""
    # First fooinfo section with substantial text is the game description
    infos = re.findall(r'class="fooinfo"[^>]*>(.*?)</td>', html_content, re.DOTALL)
    for info in infos:
        text = re.sub(r'<[^>]+>', '', info).strip()
        text = html_module.unescape(text)
        if len(text) > 15 and not text.startswith("#"):
            return {"effect": text}
    return {"effect": ""}


def cmd_pokemon():
    """Scrape Pokemon pages and enrich champions-roster.json."""
    roster_path = os.path.join(SKILL_DIR, "champions-roster.json")
    with open(roster_path) as f:
        roster = json.load(f)

    print(f"Enriching {len(roster)} Pokemon from Serebii...")
    os.makedirs(os.path.join(CACHE_DIR, "pokemon"), exist_ok=True)

    for i, entry in enumerate(roster):
        name = entry["name"]
        slug = serebii_slug(name)
        url = f"https://www.serebii.net/pokedex-champions/{slug}/"
        cache_key = f"pokemon/{slug}.html"

        print(f"[{i+1}/{len(roster)}] {name}")
        html_content = fetch(url, cache_key)
        if not html_content:
            print(f"  SKIPPED (fetch failed)")
            entry["abilities"] = []
            entry["moves"] = []
            continue

        parsed = parse_pokemon_page(html_content, name)
        entry["abilities"] = parsed.get("abilities", [])
        entry["moves"] = parsed.get("moves", [])
        if "baseStats" in parsed:
            entry["baseStats"] = parsed["baseStats"]
        if "mega" in parsed:
            entry["mega"] = parsed["mega"]

    with open(roster_path, "w") as f:
        json.dump(roster, f, indent=2)
    print(f"Wrote enriched roster to {roster_path}")


def cmd_moves():
    """Scrape move pages and write moves.json."""
    roster_path = os.path.join(SKILL_DIR, "champions-roster.json")
    with open(roster_path) as f:
        roster = json.load(f)

    # Collect all unique move names
    all_moves = set()
    for entry in roster:
        all_moves.update(entry.get("moves", []))

    print(f"Scraping {len(all_moves)} unique moves from Serebii...")
    os.makedirs(os.path.join(CACHE_DIR, "moves"), exist_ok=True)

    moves_data = {}
    sorted_moves = sorted(all_moves)
    for i, move_name in enumerate(sorted_moves):
        slug = move_name.lower().replace(" ", "").replace("'", "").replace("-", "")
        # Some moves keep hyphens in slug (Double-Edge -> double-edge)
        # Try the no-special-chars version first
        url = f"https://www.serebii.net/attackdex-champions/{slug}.shtml"
        cache_key = f"moves/{slug}.html"

        print(f"[{i+1}/{len(sorted_moves)}] {move_name}")
        html_content = fetch(url, cache_key)
        if not html_content:
            print(f"  SKIPPED (fetch failed)")
            moves_data[move_name] = {
                "type": "Unknown", "category": "Unknown",
                "power": None, "accuracy": None, "pp": None,
                "priority": 0, "target": "Unknown", "effect": ""
            }
            continue

        parsed = parse_move_page(html_content)
        moves_data[move_name] = {
            "type": parsed.get("type", "Unknown"),
            "category": parsed.get("category", "Unknown"),
            "power": parsed.get("power"),
            "accuracy": parsed.get("accuracy"),
            "pp": parsed.get("pp"),
            "priority": parsed.get("priority", 0),
            "target": parsed.get("target", "Unknown"),
            "effect": parsed.get("effect", "")
        }

    moves_path = os.path.join(SKILL_DIR, "moves.json")
    with open(moves_path, "w") as f:
        json.dump(moves_data, f, indent=2)
    print(f"Wrote {len(moves_data)} moves to {moves_path}")


def cmd_abilities():
    """Scrape ability pages and write abilities.json."""
    roster_path = os.path.join(SKILL_DIR, "champions-roster.json")
    with open(roster_path) as f:
        roster = json.load(f)

    # Collect all unique ability names
    all_abilities = set()
    for entry in roster:
        all_abilities.update(entry.get("abilities", []))
        if "mega" in entry and "ability" in entry["mega"]:
            all_abilities.add(entry["mega"]["ability"])

    print(f"Scraping {len(all_abilities)} unique abilities from Serebii...")
    os.makedirs(os.path.join(CACHE_DIR, "abilities"), exist_ok=True)

    abilities_data = {}
    sorted_abilities = sorted(all_abilities)
    for i, ability_name in enumerate(sorted_abilities):
        slug = ability_name.lower().replace(" ", "").replace("'", "").replace("-", "")
        url = f"https://www.serebii.net/abilitydex/{slug}.shtml"
        cache_key = f"abilities/{slug}.html"

        print(f"[{i+1}/{len(sorted_abilities)}] {ability_name}")
        html_content = fetch(url, cache_key)
        if not html_content:
            print(f"  SKIPPED (fetch failed)")
            abilities_data[ability_name] = {"effect": ""}
            continue

        parsed = parse_ability_page(html_content)
        abilities_data[ability_name] = parsed

    abilities_path = os.path.join(SKILL_DIR, "abilities.json")
    with open(abilities_path, "w") as f:
        json.dump(abilities_data, f, indent=2)
    print(f"Wrote {len(abilities_data)} abilities to {abilities_path}")


if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] not in ("pokemon", "moves", "abilities"):
        print("Usage: python3 scripts/scrape_champions.py [pokemon|moves|abilities]")
        sys.exit(1)

    os.makedirs(CACHE_DIR, exist_ok=True)

    cmd = sys.argv[1]
    if cmd == "pokemon":
        cmd_pokemon()
    elif cmd == "moves":
        cmd_moves()
    elif cmd == "abilities":
        cmd_abilities()
```

- [ ] **Step 2: Commit the script**

```bash
git add scripts/scrape_champions.py
git commit -m "feat: add Serebii scraping script for Champions data"
```

---

### Task 2: Run the Pokemon scrape

**Files:**
- Modify: `.claude/skills/building-vgc-teams/champions-roster.json`

- [ ] **Step 1: Run the Pokemon scraper**

```bash
python3 scripts/scrape_champions.py pokemon
```

Expected: enriches all 186 Pokemon entries with `abilities`, `moves`, and `mega` fields. Takes ~3 minutes (186 fetches with 1s delay).

- [ ] **Step 2: Verify the output**

```bash
# Check entry count is still 186
cat .claude/skills/building-vgc-teams/champions-roster.json | jq '. | length'

# Check Venusaur has abilities, moves, and mega
cat .claude/skills/building-vgc-teams/champions-roster.json | jq '.[] | select(.name == "Venusaur") | {abilities, moveCount: (.moves | length), mega: .mega.ability}'

# Expected: abilities ["Overgrow","Chlorophyll"], moveCount ~57, mega "Thick Fat"

# Check Incineroar has abilities and moves but no mega
cat .claude/skills/building-vgc-teams/champions-roster.json | jq '.[] | select(.name == "Incineroar") | {abilities, moveCount: (.moves | length), hasMega: (.mega != null)}'

# Expected: abilities ["Blaze","Intimidate"], moveCount ~77, hasMega false

# Check Garchomp moves include Earthquake and Swords Dance
cat .claude/skills/building-vgc-teams/champions-roster.json | jq '.[] | select(.name == "Garchomp") | .moves | map(select(. == "Earthquake" or . == "Swords Dance"))'

# Expected: ["Earthquake", "Swords Dance"]

# Check no Pokemon has empty abilities
cat .claude/skills/building-vgc-teams/champions-roster.json | jq '[.[] | select(.abilities | length == 0)] | length'

# Expected: 0 (all Pokemon should have at least one ability)
```

If any Pokemon has empty abilities or moves, investigate:
- Check the cache file in `tmp/serebii_cache/pokemon/` for the raw HTML
- The slug may be wrong -- check `https://www.serebii.net/pokedex-champions/` for the correct URL
- Fix the `serebii_slug()` function if needed and re-run (cache will skip already-fetched pages)

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/building-vgc-teams/champions-roster.json
git commit -m "feat: enrich roster with abilities, moves, and mega data from Serebii"
```

---

### Task 3: Run the moves scrape

**Files:**
- Create: `.claude/skills/building-vgc-teams/moves.json`

- [ ] **Step 1: Run the moves scraper**

```bash
python3 scripts/scrape_champions.py moves
```

Expected: creates `moves.json` with ~400 unique moves. Takes ~7 minutes (one fetch per move with 1s delay).

- [ ] **Step 2: Verify the output**

```bash
# Check total move count
cat .claude/skills/building-vgc-teams/moves.json | jq 'keys | length'

# Expected: ~300-500 moves

# Check Earthquake details
cat .claude/skills/building-vgc-teams/moves.json | jq '.Earthquake'

# Expected: type "Ground", category "Physical", power 100, accuracy 100, pp 12, priority 0

# Check Protect details
cat .claude/skills/building-vgc-teams/moves.json | jq '.Protect'

# Expected: type "Normal", category "Status", power null, priority 4

# Check for moves with "Unknown" type (failed parses)
cat .claude/skills/building-vgc-teams/moves.json | jq '[to_entries[] | select(.value.type == "Unknown")] | length'

# Expected: 0 or very few
```

If many moves have "Unknown" type, the slug mapping may be off for some moves. Check the failed fetches in the script output and fix the slug generation. Common issues:
- Moves with apostrophes: King's Shield -> kingsshield
- Moves with hyphens: Double-Edge -> doubleedge (Serebii may use double-edge)
- Delete the bad cache file, fix the slug, re-run

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/building-vgc-teams/moves.json
git commit -m "feat: add moves.json with full move details from Serebii"
```

---

### Task 4: Run the abilities scrape

**Files:**
- Create: `.claude/skills/building-vgc-teams/abilities.json`

- [ ] **Step 1: Run the abilities scraper**

```bash
python3 scripts/scrape_champions.py abilities
```

Expected: creates `abilities.json` with ~80-120 unique abilities. Takes ~2 minutes.

- [ ] **Step 2: Verify the output**

```bash
# Check total ability count
cat .claude/skills/building-vgc-teams/abilities.json | jq 'keys | length'

# Expected: ~80-120 abilities

# Check Intimidate
cat .claude/skills/building-vgc-teams/abilities.json | jq '.Intimidate'

# Expected: effect mentioning "Attack" and "lowering"

# Check Chlorophyll
cat .claude/skills/building-vgc-teams/abilities.json | jq '.Chlorophyll'

# Expected: effect mentioning "Speed" and "sun"

# Check for empty effects
cat .claude/skills/building-vgc-teams/abilities.json | jq '[to_entries[] | select(.value.effect == "")] | length'

# Expected: 0
```

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/building-vgc-teams/abilities.json
git commit -m "feat: add abilities.json with ability effects from Serebii"
```

---

### Task 5: Update SKILL.md

**Files:**
- Modify: `.claude/skills/building-vgc-teams/SKILL.md`

- [ ] **Step 1: Update the Data Sources section**

Replace lines 16-22 (the current Data Sources section) with:

```markdown
**Local (always read first):**
- `champions-roster.json` -- legal Pokemon with types, base stats, abilities, moves, and mega data
- `type-chart.json` -- type effectiveness multipliers (2, 1, 0.5, 0). Missing entries = 1x.
- `moves.json` -- move details (type, category, power, accuracy, priority, target, effect)
- `abilities.json` -- ability effects

**Runtime fetches:**
- **Pikalytics** -- Fetch `https://www.pikalytics.com/champions` for current usage stats, top threats, common sets, and teammates. Parse what you can from the HTML. If the fetch fails, ask the user what they're seeing in the meta.
```

- [ ] **Step 2: Update the Gatekeeper Rule (line 12)**

Replace:

```markdown
**NEVER suggest a Pokemon that is not in champions-roster.json.** Before suggesting any Pokemon, verify it exists in the roster. This applies regardless of what PokeAPI or Pikalytics data says. The roster is the single source of truth for Champions legality.
```

With:

```markdown
**NEVER suggest a Pokemon that is not in champions-roster.json.** Before suggesting any Pokemon, verify it exists in the roster. This applies regardless of what Pikalytics data says. The roster is the single source of truth for Champions legality.
```

- [ ] **Step 3: Update workflow step 2 (Foundation, line 40-44)**

Replace:

```markdown
Establish the team's core pair. For each Pokemon:
1. Verify it's in champions-roster.json
2. Fetch its data from PokeAPI (abilities, moves)
3. Suggest a competitive set (moves, ability, item) as a starting point
4. Explain why these two work together (type synergy, role coverage, archetype fit)
```

With:

```markdown
Establish the team's core pair. For each Pokemon:
1. Verify it's in champions-roster.json
2. Read its abilities and moves from the roster. Look up move details in moves.json and ability effects in abilities.json as needed.
3. Suggest a competitive set (moves, ability, item) as a starting point
4. Explain why these two work together (type synergy, role coverage, archetype fit)
```

- [ ] **Step 4: Update workflow step 5 (Set Refinement, line 70)**

Replace:

```markdown
Pull known competitive sets from PokeAPI move data + Pikalytics common sets. The user customizes from here.
```

With:

```markdown
Build sets from the Pokemon's available moves and abilities in champions-roster.json. Look up move details (type, power, category) in moves.json. Cross-reference with Pikalytics common sets when available. The user customizes from here.
```

- [ ] **Step 5: Update Conversation Style (line 125)**

Replace:

```markdown
- When in doubt about Champions-specific data (modified movesets, availability of specific forms), ask the user rather than guessing
```

With:

```markdown
- All move and ability data is Champions-accurate from Serebii. If the user reports a discrepancy, trust the user and note it for roster updates.
```

- [ ] **Step 6: Commit**

```bash
git add .claude/skills/building-vgc-teams/SKILL.md
git commit -m "feat: update SKILL.md to use local Serebii data instead of PokeAPI"
```

---

### Task 6: Cleanup and final verification

**Files:**
- Delete: `scripts/scrape_champions.py`
- Delete: `tmp/` (cache directory)

- [ ] **Step 1: Delete the scraping script and cache**

```bash
rm scripts/scrape_champions.py
rmdir scripts 2>/dev/null  # Only if empty
rm -rf tmp/
```

- [ ] **Step 2: Verify final file structure**

```bash
ls -la .claude/skills/building-vgc-teams/
```

Expected:
```
SKILL.md
abilities.json
champions-roster.json
moves.json
type-chart.json
reference/
```

- [ ] **Step 3: Verify data integrity**

```bash
# All files are valid JSON
cat .claude/skills/building-vgc-teams/champions-roster.json | jq empty && echo "roster: valid"
cat .claude/skills/building-vgc-teams/moves.json | jq empty && echo "moves: valid"
cat .claude/skills/building-vgc-teams/abilities.json | jq empty && echo "abilities: valid"
cat .claude/skills/building-vgc-teams/type-chart.json | jq empty && echo "type-chart: valid"

# Roster: 186 entries, all have abilities and moves
cat .claude/skills/building-vgc-teams/champions-roster.json | jq '. | length'
cat .claude/skills/building-vgc-teams/champions-roster.json | jq '[.[] | select(.abilities | length == 0)] | length'
cat .claude/skills/building-vgc-teams/champions-roster.json | jq '[.[] | select(.moves | length == 0)] | length'

# Cross-reference: every move in roster exists in moves.json
cat .claude/skills/building-vgc-teams/champions-roster.json | jq '[.[].moves[]] | unique | length' 
cat .claude/skills/building-vgc-teams/moves.json | jq 'keys | length'

# SKILL.md: no PokeAPI references remain
grep -c "PokeAPI\|pokeapi" .claude/skills/building-vgc-teams/SKILL.md
# Expected: 0
```

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: remove scraping script and cache, finalize Champions data reference"
```
