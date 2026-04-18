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
        vals = re.findall(r'class="cen">\s*\n?\s*([^<\s]+)', pp_section[:500])
        if len(vals) >= 3:
            result["pp"] = int(vals[0]) if vals[0] != "--" else None
            result["power"] = int(vals[1]) if vals[1] != "--" else None
            result["accuracy"] = int(vals[2]) if vals[2] != "--" else None

    # Priority and target: after 'Speed Priority' header
    # Layout: 3 header cells (Crit Rate, Speed Priority, Hit in Battle)
    #         3 value cells  (4.17%,     0,              All Adjacent Pokemon)
    priority_section = html_content[html_content.find("Speed Priority"):] if "Speed Priority" in html_content else ""
    if priority_section:
        vals = re.findall(r'class="cen"[^>]*>\s*\n?\s*(.*?)\s*</td>', priority_section[:600], re.DOTALL)
        if len(vals) >= 3:
            # vals[0] = crit rate, vals[1] = priority, vals[2] = target
            try:
                result["priority"] = int(vals[1].strip())
            except ValueError:
                result["priority"] = 0
            target_text = re.sub(r'<[^>]+>', '', vals[2]).strip()
            target_text = html_module.unescape(target_text)
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
        slug = move_name.lower().replace(" ", "")
        # Serebii keeps hyphens and apostrophes, just strips spaces
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
        category = parsed.get("category", "Unknown")
        if category == "Other":
            category = "Status"
        power = parsed.get("power")
        accuracy = parsed.get("accuracy")
        if category == "Status":
            power = None
            if accuracy is not None and accuracy > 100:
                accuracy = None  # "always hits" encoded as 101
        moves_data[move_name] = {
            "type": parsed.get("type", "Unknown"),
            "category": category,
            "power": power,
            "accuracy": accuracy,
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
