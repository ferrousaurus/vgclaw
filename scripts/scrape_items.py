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
    """Extract items from a table section. Returns list of (name, effect) tuples.

    Row structure (per item):
      <td class="cen"><a href="/itemdex/..."><img .../></a></td>
      <td class="fooinfo"><a href="/itemdex/...">NAME</a></td>
      <td class="fooinfo">EFFECT TEXT</td>
      <td class="fooinfo">HOW TO GET</td>
    """
    items = []
    # Match name cell followed by effect cell (both class="fooinfo")
    rows = re.findall(
        r'<td class="fooinfo"><a href="/itemdex/[^"]+">([^<]+)</a></td>\s*'
        r'<td class="fooinfo">(.*?)</td>',
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

    # Sections are delimited by <font size="4"><b><u>SECTION NAME</u></b></font>
    sections = re.split(r'<font size="4"><b><u>', html_content)

    for section in sections:
        section_lower = section[:100].lower()
        if section_lower.startswith("hold items"):
            category = "Hold Item"
        elif section_lower.startswith("mega stone"):
            category = "Mega Stone"
        elif section_lower.startswith("berries") or section_lower.startswith("berry"):
            category = "Berry"
        else:
            continue

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
