# Items Data Reference Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add held item data and item selection guidance to the VGC team builder skill.

**Architecture:** A Python script scrapes Serebii's single items page, parses three sections (Hold Items, Berries, Mega Stones) from HTML tables, and writes `items.json`. A hand-written `reference/items.md` provides competitive item selection heuristics. SKILL.md is updated to integrate items into the teambuilding workflow.

**Tech Stack:** Python 3.9+ (stdlib only), Serebii HTML page

**Spec:** `docs/superpowers/specs/2026-04-17-items-data-reference-design.md`

---

### Task 1: Write and run the items scraper

**Files:**
- Create: `scripts/scrape_items.py`
- Create: `.claude/skills/building-vgc-teams/items.json`

- [ ] **Step 1: Create the scraping script**

Create `scripts/scrape_items.py`:

```python
#!/usr/bin/env python3
"""
Scrape Serebii's Pokemon Champions items page to build items.json.

Usage:
    python3 scripts/scrape_items.py
"""

import json
import re
import sys
import urllib.request
import html as html_module

SKILL_DIR = ".claude/skills/building-vgc-teams"
URL = "https://www.serebii.net/pokemonchampions/items.shtml"

def fetch(url):
    """Fetch URL and return HTML as string."""
    print(f"Fetching {url}")
    req = urllib.request.Request(url, headers={"User-Agent": "VGCTeamBuilder/1.0"})
    with urllib.request.urlopen(req) as resp:
        return resp.read().decode("latin-1")

def parse_section(html_section):
    """Extract items from a table section. Returns list of (name, effect) tuples."""
    items = []
    # Each item row has: <td><a href="..."><img></a></td> <td><a href="...">Name</a></td> <td>Effect</td> <td>Location</td>
    # Match rows by finding item name links followed by effect text
    rows = re.findall(
        r'<a href="/itemdex/[^"]+\.shtml">([^<]+)</a>\s*</td>\s*<td[^>]*>(.*?)</td>',
        html_section, re.DOTALL
    )
    for name, effect_html in rows:
        name = html_module.unescape(name.strip())
        effect = re.sub(r'<[^>]+>', '', effect_html).strip()
        effect = html_module.unescape(effect)
        effect = re.sub(r'\s+', ' ', effect)
        if name and effect:
            items.append((name, effect))
    return items

def main():
    html_content = fetch(URL)

    items_data = {}

    # Split page into sections by h2 headings
    # Sections: Hold Items, Mega Stone, Berries, Miscellaneous Items
    sections = re.split(r'<h2[^>]*>', html_content)

    for section in sections:
        section_lower = section[:100].lower()
        if section_lower.startswith("hold item"):
            category = "Hold Item"
        elif section_lower.startswith("mega stone"):
            category = "Mega Stone"
        elif section_lower.startswith("berries") or section_lower.startswith("berry"):
            category = "Berry"
        else:
            continue  # Skip Miscellaneous and non-item sections

        parsed = parse_section(section)
        print(f"  {category}: {len(parsed)} items")
        for name, effect in parsed:
            items_data[name] = {
                "category": category,
                "effect": effect
            }

    items_path = f"{SKILL_DIR}/items.json"
    with open(items_path, "w") as f:
        json.dump(items_data, f, indent=2)
    print(f"Wrote {len(items_data)} items to {items_path}")

if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Run the scraper**

```bash
python3 scripts/scrape_items.py
```

Expected output:
```
Fetching https://www.serebii.net/pokemonchampions/items.shtml
  Hold Item: ~30 items
  Mega Stone: ~60 items
  Berry: ~28 items
Wrote ~115 items to .claude/skills/building-vgc-teams/items.json
```

- [ ] **Step 3: Verify the output**

```bash
# Check total item count
cat .claude/skills/building-vgc-teams/items.json | jq 'keys | length'
# Expected: ~115

# Check category counts
cat .claude/skills/building-vgc-teams/items.json | jq '[to_entries[] | .value.category] | group_by(.) | map({key: .[0], count: length}) | from_entries'
# Expected: {"Berry": ~28, "Hold Item": ~30, "Mega Stone": ~60}

# Spot check a hold item
cat .claude/skills/building-vgc-teams/items.json | jq '."Choice Scarf"'
# Expected: {"category": "Hold Item", "effect": "...boosts Speed..."}

# Spot check a berry
cat .claude/skills/building-vgc-teams/items.json | jq '."Sitrus Berry"'
# Expected: {"category": "Berry", "effect": "...restores HP..."}

# Spot check a mega stone
cat .claude/skills/building-vgc-teams/items.json | jq '.Venusaurite'
# Expected: {"category": "Mega Stone", "effect": "...Mega Evolve..."}

# Check for empty effects
cat .claude/skills/building-vgc-teams/items.json | jq '[to_entries[] | select(.value.effect == "")] | length'
# Expected: 0
```

If the regex doesn't capture items correctly, inspect the raw HTML:
```bash
curl -s https://www.serebii.net/pokemonchampions/items.shtml | iconv -f latin1 -t utf8 | head -200
```
Fix the `parse_section` regex and re-run.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/building-vgc-teams/items.json scripts/scrape_items.py
git commit -m "feat: add items.json with held items, berries, and mega stones from Serebii"
```

---

### Task 2: Write the item selection reference guide

**Files:**
- Create: `.claude/skills/building-vgc-teams/reference/items.md`

- [ ] **Step 1: Create the reference file**

Create `.claude/skills/building-vgc-teams/reference/items.md`:

```markdown
# Item Selection Guide

## Offensive Items

Items that boost damage output. Best on Pokemon whose primary job is dealing damage.

- **Choice Band** -- 50% Attack boost, locked to one move. Best on physical attackers with one dominant STAB move (e.g., Garchomp Earthquake). Pair with U-turn to pivot out.
- **Choice Specs** -- 50% Sp.Atk boost, locked to one move. Same logic for special attackers (e.g., Hydreigon Dark Pulse).
- **Life Orb** -- 30% damage boost to all moves, costs 10% HP per attack. Best when you need move flexibility but still want damage. Common on mixed attackers.
- **Type-boosting items** (Charcoal, Mystic Water, Miracle Seed, etc.) -- 20% boost to one type, no drawback. Weaker than Life Orb but no HP cost. Good on Pokemon that primarily use one type's moves but need Protect access.

**When to use what:**
- Need raw power and will mostly use one move? Choice Band/Specs
- Need flexibility + power? Life Orb
- Want a boost without recoil or move lock? Type-boosting item

## Speed Items

- **Choice Scarf** -- 50% Speed boost, locked to one move. Turns a mid-speed Pokemon into a fast threat. Best on Pokemon that can revenge kill (e.g., Garchomp, Tyranitar). Less useful on already-fast Pokemon or in Trick Room.

## Defensive / Survival Items

Items that help a Pokemon survive hits or recover HP.

- **Focus Sash** -- Survive any single hit at 1 HP (from full HP). Best on fragile leads that need one turn to do their job (Tailwind setter, Fake Out user). Useless after the first hit or with chip damage.
- **Sitrus Berry** -- Restores 25% HP when below 50%. Good on bulky Pokemon that expect to take a hit and stick around (e.g., Intimidate users, Trick Room setters).
- **Leftovers** -- Restores 1/16 HP each turn. Best in longer games on bulky Pokemon. Less impactful in VGC's faster pace than singles.
- **Resistance berries** (Shuca, Yache, Babiri, etc.) -- Halve damage from one super-effective hit. Best when a Pokemon has one key weakness it needs to survive (e.g., Shuca Berry on Heatran to live Earthquake, Yache on Garchomp to live Ice Beam).

**When to use what:**
- Fragile and must do one thing turn 1? Focus Sash
- Bulky and expects to take several hits? Sitrus Berry or Leftovers
- Has one specific weakness that would KO it? Resistance berry

## Utility Items

- **Mental Herb** -- Cures Taunt, Encore, Disable, Torment (one-time). Best on support Pokemon that must use status moves (Trick Room setters, Tailwind users). Critical against Prankster Taunt.
- **White Herb** -- Restores any lowered stats (one-time). Counters Intimidate on physical attackers. Useful on Pokemon that lower their own stats (Close Combat users).
- **Light Ball** -- Doubles Pikachu's Attack and Sp.Atk. Only for Pikachu. If you're running Pikachu, this is mandatory.
- **Bright Powder** -- Lowers opponent accuracy by 10%. Unreliable but can steal games. Niche pick.

## Mega Stones

- A Pokemon holding its Mega Stone can Mega Evolve once per battle
- Only one Mega Evolution per team -- choose which Pokemon benefits most from the stat boost and ability change
- The Mega Stone is mandatory for that Pokemon (no alternative item)
- A Mega Pokemon's stone is deterministic: Venusaur always uses Venusaurite, Charizard uses Charizardite X or Y, etc.
- Consider whether the Mega form is worth giving up a flexible item slot

## General Heuristics

1. **No duplicate items** -- VGC rules prohibit two Pokemon holding the same item
2. **Match item to role** -- Sweepers want damage items, supports want survival/utility items, leads want Sash or speed
3. **Check Pikalytics** -- Common sets on Pikalytics show what items top players use on each Pokemon. Start there and adjust.
4. **Don't over-invest in offense** -- A team of 6 Choice item holders can't adapt. Balance offensive and defensive items.
5. **Protect compatibility** -- Choice items and Assault Vest prevent or discourage Protect. Make sure your Protect users have compatible items.
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/building-vgc-teams/reference/items.md
git commit -m "feat: add item selection reference guide"
```

---

### Task 3: Update SKILL.md

**Files:**
- Modify: `.claude/skills/building-vgc-teams/SKILL.md`

- [ ] **Step 1: Add items.json to Data Sources (line 20)**

After the line:
```markdown
- `abilities.json` -- ability effects
```

Add:
```markdown
- `items.json` -- held item details (category, effect)
```

- [ ] **Step 2: Add items.md to Reference section (line 27)**

After the line:
```markdown
- `reference/archetypes.md` -- common team archetypes
```

Add:
```markdown
- `reference/items.md` -- item selection heuristics
```

- [ ] **Step 3: Update Set Refinement step (lines 64-71)**

Replace:
```markdown
For each of the 6 Pokemon, suggest a starting set:
- Ability
- Held item (no duplicate items across the team)
- 4 moves
- Nature
- EVs (suggest a simple spread like 252/252/4 as a baseline)

Build sets from the Pokemon's available moves and abilities in champions-roster.json. Look up move details (type, power, category) in moves.json. Cross-reference with Pikalytics common sets when available. The user customizes from here.
```

With:
```markdown
For each of the 6 Pokemon, suggest a starting set:
- Ability
- Held item
- 4 moves
- Nature
- EVs (suggest a simple spread like 252/252/4 as a baseline)

Build sets from the Pokemon's available moves and abilities in champions-roster.json. Look up move details (type, power, category) in moves.json.

**Item selection:** Load `reference/items.md` for selection heuristics. For each Pokemon, suggest an item based on its role and the team's existing items. Verify the item exists in `items.json`. Enforce no duplicate items across the team. If a Pokemon is Mega-eligible and the team doesn't already have a Mega, consider whether the Mega Stone is worth the item slot.

Cross-reference with Pikalytics common sets when available. The user customizes from here.
```

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/building-vgc-teams/SKILL.md
git commit -m "feat: integrate items into SKILL.md workflow"
```

---

### Task 4: Cleanup and verification

**Files:**
- Delete: `scripts/scrape_items.py`

- [ ] **Step 1: Delete the scraping script**

```bash
rm scripts/scrape_items.py
rmdir scripts 2>/dev/null  # Only if empty
```

- [ ] **Step 2: Verify final file structure**

```bash
ls -la .claude/skills/building-vgc-teams/
ls -la .claude/skills/building-vgc-teams/reference/
```

Expected:
```
SKILL.md
abilities.json
champions-roster.json
items.json
moves.json
type-chart.json
reference/
  archetypes.md
  items.md
  roles.md
```

- [ ] **Step 3: Verify data integrity**

```bash
# items.json is valid JSON with expected count
cat .claude/skills/building-vgc-teams/items.json | jq 'keys | length'
# Expected: ~115

# All three categories present
cat .claude/skills/building-vgc-teams/items.json | jq '[to_entries[] | .value.category] | unique'
# Expected: ["Berry", "Hold Item", "Mega Stone"]

# No empty effects
cat .claude/skills/building-vgc-teams/items.json | jq '[to_entries[] | select(.value.effect == "")] | length'
# Expected: 0

# SKILL.md references items.json and items.md
grep "items.json" .claude/skills/building-vgc-teams/SKILL.md
grep "items.md" .claude/skills/building-vgc-teams/SKILL.md
# Expected: both return matches

# Cross-reference: every mega stone in items.json corresponds to a mega Pokemon in roster
cat .claude/skills/building-vgc-teams/items.json | jq '[to_entries[] | select(.value.category == "Mega Stone")] | length'
cat .claude/skills/building-vgc-teams/champions-roster.json | jq '[.[] | select(.mega != null)] | length'
# Expected: Mega stone count >= Pokemon-with-mega count (some Pokemon may have X/Y variants)
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove scraping script, finalize items data reference"
```
