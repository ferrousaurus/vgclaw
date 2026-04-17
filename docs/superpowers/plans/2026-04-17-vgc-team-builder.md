# VGC Team Builder Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create an agent skill that guides users through building competitive VGC teams for Pokemon Champions, with roster legality checks, meta awareness via Pikalytics, and Showdown paste export.

**Architecture:** A skill with SKILL.md as the workflow engine, backed by local JSON data files (roster, type chart) and markdown reference files (roles, archetypes). External data from PokeAPI (movesets/abilities) and Pikalytics (meta stats) is fetched at runtime. The roster JSON acts as a hard gatekeeper -- nothing gets suggested unless it's in that file.

**Tech Stack:** Claude Code skill (markdown + JSON), PokeAPI REST, Pikalytics web fetch, Showdown paste format

**Spec:** `docs/superpowers/specs/2026-04-17-vgc-team-builder-design.md`

---

### Task 1: Create type-chart.json

**Files:**
- Create: `.claude/skills/building-vgc-teams/type-chart.json`

This is static, well-known data. No external fetch needed.

- [ ] **Step 1: Create the type effectiveness matrix**

Create `.claude/skills/building-vgc-teams/type-chart.json` with the full 18x18 type chart. Each key is an attacking type, each nested key is a defending type, and the value is the damage multiplier (2, 1, 0.5, or 0). Types with a 1x multiplier can be omitted to keep the file compact -- the skill should assume 1x for any missing entry.

```json
{
  "Normal": { "Rock": 0.5, "Ghost": 0, "Steel": 0.5 },
  "Fire": { "Fire": 0.5, "Water": 0.5, "Grass": 2, "Ice": 2, "Bug": 2, "Rock": 0.5, "Dragon": 0.5, "Steel": 2 },
  "Water": { "Fire": 2, "Water": 0.5, "Grass": 0.5, "Ground": 2, "Rock": 2, "Dragon": 0.5 },
  "Electric": { "Water": 2, "Electric": 0.5, "Grass": 0.5, "Ground": 0, "Flying": 2, "Dragon": 0.5 },
  "Grass": { "Fire": 0.5, "Water": 2, "Grass": 0.5, "Poison": 0.5, "Ground": 2, "Flying": 0.5, "Bug": 0.5, "Rock": 2, "Dragon": 0.5, "Steel": 0.5 },
  "Ice": { "Fire": 0.5, "Water": 0.5, "Grass": 2, "Ice": 0.5, "Ground": 2, "Flying": 2, "Dragon": 2, "Steel": 0.5 },
  "Fighting": { "Normal": 2, "Ice": 2, "Poison": 0.5, "Flying": 0.5, "Psychic": 0.5, "Bug": 0.5, "Rock": 2, "Ghost": 0, "Dark": 2, "Steel": 2, "Fairy": 0.5 },
  "Poison": { "Grass": 2, "Poison": 0.5, "Ground": 0.5, "Rock": 0.5, "Ghost": 0.5, "Steel": 0, "Fairy": 2 },
  "Ground": { "Fire": 2, "Electric": 2, "Grass": 0.5, "Poison": 2, "Flying": 0, "Bug": 0.5, "Rock": 2, "Steel": 2 },
  "Flying": { "Electric": 0.5, "Grass": 2, "Fighting": 2, "Bug": 2, "Rock": 0.5, "Steel": 0.5 },
  "Psychic": { "Fighting": 2, "Poison": 2, "Psychic": 0.5, "Dark": 0, "Steel": 0.5 },
  "Bug": { "Fire": 0.5, "Grass": 2, "Fighting": 0.5, "Poison": 0.5, "Flying": 0.5, "Psychic": 2, "Ghost": 0.5, "Dark": 2, "Steel": 0.5, "Fairy": 0.5 },
  "Rock": { "Fire": 2, "Ice": 2, "Fighting": 0.5, "Ground": 0.5, "Flying": 2, "Bug": 2, "Steel": 0.5 },
  "Ghost": { "Normal": 0, "Psychic": 2, "Ghost": 2, "Dark": 0.5 },
  "Dragon": { "Dragon": 2, "Steel": 0.5, "Fairy": 0 },
  "Dark": { "Fighting": 0.5, "Psychic": 2, "Ghost": 2, "Dark": 0.5, "Fairy": 0.5 },
  "Steel": { "Fire": 0.5, "Water": 0.5, "Electric": 0.5, "Ice": 2, "Rock": 2, "Steel": 0.5, "Fairy": 2 },
  "Fairy": { "Fire": 0.5, "Poison": 0.5, "Fighting": 2, "Dragon": 2, "Dark": 2, "Steel": 0.5 }
}
```

- [ ] **Step 2: Validate the chart**

Spot-check well-known interactions to confirm correctness:
- `Fire.Grass` = 2 (Fire is super effective vs Grass)
- `Ground.Electric` = 2 (Ground is super effective vs Electric)
- `Ghost.Normal` = 0 (Ghost can't hit Normal)
- `Fairy.Dragon` = 2 (Fairy is super effective vs Dragon)
- `Dragon.Fairy` = 0 (Dragon can't hit Fairy)
- `Steel.Fairy` = 2 (Steel is super effective vs Fairy)

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/building-vgc-teams/type-chart.json
git commit -m "feat: add type effectiveness chart for VGC team builder skill"
```

---

### Task 2: Create champions-roster.json

**Files:**
- Create: `.claude/skills/building-vgc-teams/champions-roster.json`

This file is the single source of truth for what's legal in Pokemon Champions. It must contain every available Pokemon with their name, types, and base stats.

- [ ] **Step 1: Fetch the roster from Serebii**

Use WebFetch to get the full list of available Pokemon from `https://www.serebii.net/pokemonchampions/pokemon.shtml`. The current roster (as of 2026-04-17) is:

Venusaur, Charizard, Blastoise, Beedrill, Pidgeot, Arbok, Pikachu, Raichu, Clefable, Ninetales, Arcanine, Alakazam, Machamp, Victreebel, Slowbro, Gengar, Kangaskhan, Starmie, Pinsir, Tauros, Gyarados, Ditto, Vaporeon, Jolteon, Flareon, Aerodactyl, Snorlax, Dragonite, Meganium, Typhlosion, Feraligatr, Ariados, Ampharos, Azumarill, Politoed, Espeon, Umbreon, Slowking, Forretress, Steelix, Scizor, Heracross, Skarmory, Houndoom, Tyranitar, Pelipper, Gardevoir, Sableye, Aggron, Medicham, Manectric, Sharpedo, Camerupt, Torkoal, Altaria, Milotic, Castform, Banette, Chimecho, Absol, Glalie, Torterra, Infernape, Empoleon, Luxray, Roserade, Rampardos, Bastiodon, Lopunny, Spiritomb, Garchomp, Lucario, Hippowdon, Toxicroak, Abomasnow, Weavile, Rhyperior, Leafeon, Glaceon, Gliscor, Mamoswine, Gallade, Froslass, Rotom, Serperior, Emboar, Samurott, Watchog, Liepard, Simisage, Simisear, Simipour, Excadrill, Audino, Conkeldurr, Whimsicott, Krookodile, Cofagrigus, Garbodor, Zoroark, Reuniclus, Vanilluxe, Emolga, Chandelure, Beartic, Stunfisk, Golurk, Hydreigon, Volcarona, Chesnaught, Delphox, Greninja, Diggersby, Talonflame, Vivillon, Floette, Florges, Pangoro, Furfrou, Meowstic, Aegislash, Aromatisse, Slurpuff, Clawitzer, Heliolisk, Tyrantrum, Aurorus, Sylveon, Hawlucha, Dedenne, Goodra, Klefki, Trevenant, Gourgeist, Avalugg, Noivern, Decidueye, Incineroar, Primarina, Toucannon, Crabominable, Lycanroc, Toxapex, Mudsdale, Araquanid, Salazzle, Tsareena, Oranguru, Passimian, Mimikyu, Drampa, Kommo-o, Corviknight, Flapple, Appletun, Sandaconda, Polteageist, Hatterene, Mr. Rime, Runerigus, Alcremie, Morpeko, Dragapult, Wyrdeer, Kleavor, Basculegion, Sneasler, Meowscarada, Skeledirge, Quaquaval, Maushold, Garganacl, Armarouge, Ceruledge, Bellibolt, Scovillain, Espathra, Tinkaton, Palafin, Orthworm, Glimmora, Farigiraf, Kingambit, Sinistcha, Archaludon, Hydrapple

- [ ] **Step 2: Build the JSON by fetching types and base stats from PokeAPI**

For each Pokemon in the roster, fetch `https://pokeapi.co/api/v2/pokemon/{name}` (lowercase, hyphenated) to get types and base stats.

PokeAPI name mapping notes:
- Most names are lowercase: `garchomp`, `incineroar`
- Hyphenated names: `mr-rime`, `kommo-o` stays as `kommo-o`
- Special forms: `basculegion-male` for Basculegion, `lycanroc-midday` for Lycanroc (check which forms Champions uses)

The JSON schema per entry:
```json
{
  "name": "Garchomp",
  "types": ["Dragon", "Ground"],
  "baseStats": { "hp": 108, "atk": 130, "def": 95, "spa": 80, "spd": 85, "spe": 102 }
}
```

Map PokeAPI's `stats` array to `baseStats`:
- `stats[0].base_stat` -> `hp`
- `stats[1].base_stat` -> `atk`
- `stats[2].base_stat` -> `def`
- `stats[3].base_stat` -> `spa`
- `stats[4].base_stat` -> `spd`
- `stats[5].base_stat` -> `spe`

Map PokeAPI's `types` array:
- `types[n].type.name` -> capitalize first letter (e.g., `"dragon"` -> `"Dragon"`)

Write a script to automate this. Create a temporary `scripts/build-roster.sh` (or use inline bash with `curl` and `jq`):

```bash
#!/bin/bash
# Fetch types and base stats for each Pokemon from PokeAPI
# Usage: bash scripts/build-roster.sh > champions-roster.json

POKEMON_NAMES=(
  venusaur charizard blastoise beedrill pidgeot arbok pikachu raichu
  clefable ninetales arcanine alakazam machamp victreebel slowbro gengar
  kangaskhan starmie pinsir tauros gyarados ditto vaporeon jolteon
  flareon aerodactyl snorlax dragonite meganium typhlosion feraligatr
  ariados ampharos azumarill politoed espeon umbreon slowking forretress
  steelix scizor heracross skarmory houndoom tyranitar pelipper gardevoir
  sableye aggron medicham manectric sharpedo camerupt torkoal altaria
  milotic castform banette chimecho absol glalie torterra infernape
  empoleon luxray roserade rampardos bastiodon lopunny spiritomb garchomp
  lucario hippowdon toxicroak abomasnow weavile rhyperior leafeon glaceon
  gliscor mamoswine gallade froslass rotom serperior emboar samurott
  watchog liepard simisage simisear simipour excadrill audino conkeldurr
  whimsicott krookodile cofagrigus garbodor zoroark reuniclus vanilluxe
  emolga chandelure beartic stunfisk golurk hydreigon volcarona chesnaught
  delphox greninja diggersby talonflame vivillon floette florges pangoro
  furfrou meowstic-male aegislash aromatisse slurpuff clawitzer heliolisk
  tyrantrum aurorus sylveon hawlucha dedenne goodra klefki trevenant
  gourgeist-average avalugg noivern decidueye incineroar primarina
  toucannon crabominable lycanroc-midday toxapex mudsdale araquanid
  salazzle tsareena oranguru passimian mimikyu drampa kommo-o corviknight
  flapple appletun sandaconda polteageist hatterene mr-rime runerigus
  alcremie morpeko dragapult wyrdeer kleavor basculegion-male sneasler
  meowscarada skeledirge quaquaval maushold garganacl armarouge ceruledge
  bellibolt scovillain espathra tinkaton palafin orthworm glimmora
  farigiraf kingambit sinistcha archaludon hydrapple
)

# Display names (properly capitalized) - map from API name to display name
declare -A DISPLAY_NAMES
DISPLAY_NAMES=(
  [venusaur]="Venusaur" [charizard]="Charizard" [blastoise]="Blastoise"
  [beedrill]="Beedrill" [pidgeot]="Pidgeot" [arbok]="Arbok"
  [pikachu]="Pikachu" [raichu]="Raichu" [clefable]="Clefable"
  [ninetales]="Ninetales" [arcanine]="Arcanine" [alakazam]="Alakazam"
  [machamp]="Machamp" [victreebel]="Victreebel" [slowbro]="Slowbro"
  [gengar]="Gengar" [kangaskhan]="Kangaskhan" [starmie]="Starmie"
  [pinsir]="Pinsir" [tauros]="Tauros" [gyarados]="Gyarados"
  [ditto]="Ditto" [vaporeon]="Vaporeon" [jolteon]="Jolteon"
  [flareon]="Flareon" [aerodactyl]="Aerodactyl" [snorlax]="Snorlax"
  [dragonite]="Dragonite" [meganium]="Meganium" [typhlosion]="Typhlosion"
  [feraligatr]="Feraligatr" [ariados]="Ariados" [ampharos]="Ampharos"
  [azumarill]="Azumarill" [politoed]="Politoed" [espeon]="Espeon"
  [umbreon]="Umbreon" [slowking]="Slowking" [forretress]="Forretress"
  [steelix]="Steelix" [scizor]="Scizor" [heracross]="Heracross"
  [skarmory]="Skarmory" [houndoom]="Houndoom" [tyranitar]="Tyranitar"
  [pelipper]="Pelipper" [gardevoir]="Gardevoir" [sableye]="Sableye"
  [aggron]="Aggron" [medicham]="Medicham" [manectric]="Manectric"
  [sharpedo]="Sharpedo" [camerupt]="Camerupt" [torkoal]="Torkoal"
  [altaria]="Altaria" [milotic]="Milotic" [castform]="Castform"
  [banette]="Banette" [chimecho]="Chimecho" [absol]="Absol"
  [glalie]="Glalie" [torterra]="Torterra" [infernape]="Infernape"
  [empoleon]="Empoleon" [luxray]="Luxray" [roserade]="Roserade"
  [rampardos]="Rampardos" [bastiodon]="Bastiodon" [lopunny]="Lopunny"
  [spiritomb]="Spiritomb" [garchomp]="Garchomp" [lucario]="Lucario"
  [hippowdon]="Hippowdon" [toxicroak]="Toxicroak" [abomasnow]="Abomasnow"
  [weavile]="Weavile" [rhyperior]="Rhyperior" [leafeon]="Leafeon"
  [glaceon]="Glaceon" [gliscor]="Gliscor" [mamoswine]="Mamoswine"
  [gallade]="Gallade" [froslass]="Froslass" [rotom]="Rotom"
  [serperior]="Serperior" [emboar]="Emboar" [samurott]="Samurott"
  [watchog]="Watchog" [liepard]="Liepard" [simisage]="Simisage"
  [simisear]="Simisear" [simipour]="Simipour" [excadrill]="Excadrill"
  [audino]="Audino" [conkeldurr]="Conkeldurr" [whimsicott]="Whimsicott"
  [krookodile]="Krookodile" [cofagrigus]="Cofagrigus" [garbodor]="Garbodor"
  [zoroark]="Zoroark" [reuniclus]="Reuniclus" [vanilluxe]="Vanilluxe"
  [emolga]="Emolga" [chandelure]="Chandelure" [beartic]="Beartic"
  [stunfisk]="Stunfisk" [golurk]="Golurk" [hydreigon]="Hydreigon"
  [volcarona]="Volcarona" [chesnaught]="Chesnaught" [delphox]="Delphox"
  [greninja]="Greninja" [diggersby]="Diggersby" [talonflame]="Talonflame"
  [vivillon]="Vivillon" [floette]="Floette" [florges]="Florges"
  [pangoro]="Pangoro" [furfrou]="Furfrou" [meowstic-male]="Meowstic"
  [aegislash]="Aegislash" [aromatisse]="Aromatisse" [slurpuff]="Slurpuff"
  [clawitzer]="Clawitzer" [heliolisk]="Heliolisk" [tyrantrum]="Tyrantrum"
  [aurorus]="Aurorus" [sylveon]="Sylveon" [hawlucha]="Hawlucha"
  [dedenne]="Dedenne" [goodra]="Goodra" [klefki]="Klefki"
  [trevenant]="Trevenant" [gourgeist-average]="Gourgeist" [avalugg]="Avalugg"
  [noivern]="Noivern" [decidueye]="Decidueye" [incineroar]="Incineroar"
  [primarina]="Primarina" [toucannon]="Toucannon" [crabominable]="Crabominable"
  [lycanroc-midday]="Lycanroc" [toxapex]="Toxapex" [mudsdale]="Mudsdale"
  [araquanid]="Araquanid" [salazzle]="Salazzle" [tsareena]="Tsareena"
  [oranguru]="Oranguru" [passimian]="Passimian" [mimikyu]="Mimikyu"
  [drampa]="Drampa" [kommo-o]="Kommo-o" [corviknight]="Corviknight"
  [flapple]="Flapple" [appletun]="Appletun" [sandaconda]="Sandaconda"
  [polteageist]="Polteageist" [hatterene]="Hatterene" [mr-rime]="Mr. Rime"
  [runerigus]="Runerigus" [alcremie]="Alcremie" [morpeko]="Morpeko"
  [dragapult]="Dragapult" [wyrdeer]="Wyrdeer" [kleavor]="Kleavor"
  [basculegion-male]="Basculegion" [sneasler]="Sneasler"
  [meowscarada]="Meowscarada" [skeledirge]="Skeledirge"
  [quaquaval]="Quaquaval" [maushold]="Maushold" [garganacl]="Garganacl"
  [armarouge]="Armarouge" [ceruledge]="Ceruledge" [bellibolt]="Bellibolt"
  [scovillain]="Scovillain" [espathra]="Espathra" [tinkaton]="Tinkaton"
  [palafin]="Palafin" [orthworm]="Orthworm" [glimmora]="Glimmora"
  [farigiraf]="Farigiraf" [kingambit]="Kingambit" [sinistcha]="Sinistcha"
  [archaludon]="Archaludon" [hydrapple]="Hydrapple"
)

echo "["
FIRST=true
for name in "${POKEMON_NAMES[@]}"; do
  data=$(curl -s "https://pokeapi.co/api/v2/pokemon/${name}")
  if [ $? -ne 0 ] || [ -z "$data" ]; then
    echo "FAILED: ${name}" >&2
    continue
  fi

  display="${DISPLAY_NAMES[$name]}"
  types=$(echo "$data" | jq -r '[.types[].type.name] | map(split("") | .[0] |= ascii_upcase | join("")) | @json')
  hp=$(echo "$data" | jq '.stats[0].base_stat')
  atk=$(echo "$data" | jq '.stats[1].base_stat')
  def=$(echo "$data" | jq '.stats[2].base_stat')
  spa=$(echo "$data" | jq '.stats[3].base_stat')
  spd=$(echo "$data" | jq '.stats[4].base_stat')
  spe=$(echo "$data" | jq '.stats[5].base_stat')

  if [ "$FIRST" = true ]; then
    FIRST=false
  else
    echo ","
  fi
  printf '  {"name":"%s","types":%s,"baseStats":{"hp":%s,"atk":%s,"def":%s,"spa":%s,"spd":%s,"spe":%s}}' \
    "$display" "$types" "$hp" "$atk" "$def" "$spa" "$spd" "$spe"

  sleep 0.5  # Be polite to PokeAPI
done
echo ""
echo "]"
```

Run it:
```bash
bash scripts/build-roster.sh > .claude/skills/building-vgc-teams/champions-roster.json
```

**Important:** After running, manually verify a few entries against Serebii or Bulbapedia. Check Garchomp (Dragon/Ground, 108/130/95/80/85/102), Incineroar (Fire/Dark, 95/115/90/80/90/60), and Sylveon (Fairy, 95/65/65/110/130/60).

**PokeAPI name edge cases to watch for:**
- If any fetch fails, check whether the API name differs (e.g., `sinistcha` may need a different slug). Fix the `POKEMON_NAMES` array and re-run for just that entry.
- Alternate forms: Meowstic, Lycanroc, Gourgeist, Basculegion use their default/male/midday forms. Verify these match what Champions uses.

- [ ] **Step 3: Delete the build script**

```bash
rm scripts/build-roster.sh
rmdir scripts  # Only if empty
```

The script is a one-time tool. The roster JSON is the artifact we keep. Future updates are manual edits or re-runs of the script (recreate if needed).

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/building-vgc-teams/champions-roster.json
git commit -m "feat: add Pokemon Champions roster (types + base stats for all available Pokemon)"
```

---

### Task 3: Create reference/roles.md

**Files:**
- Create: `.claude/skills/building-vgc-teams/reference/roles.md`

This file defines VGC team roles so the skill can check whether a team has adequate coverage. Loaded on demand during the "Build Out" phase.

- [ ] **Step 1: Create the roles reference**

```markdown
# VGC Team Roles

## Speed Control

Manipulate turn order to let your team move first or guarantee slow Pokemon move in the right order.

- **Tailwind** (doubles Speed for 4 turns): Talonflame, Whimsicott, Pelipper, Noivern, Corviknight, Dragapult
- **Trick Room** (reverses Speed for 5 turns): Hatterene, Oranguru, Porygon2, Reuniclus, Aromatisse, Farigiraf, Slowbro, Slowking, Chimecho, Mr. Rime
- **Icy Wind / Electroweb** (lower opponent Speed): Milotic, Greninja, Froslass, Glaceon, Aurorus
- **Thunder Wave / Glare** (paralysis): Klefki, Grimmsnarl, Arbok

## Intimidate / Attack Drops

Reduce the opponent's Attack stat to weaken physical threats.

- **Intimidate ability**: Incineroar, Gyarados, Arcanine, Krookodile, Salamence, Scrafty, Luxray, Tauros
- **Snarl** (lowers Sp.Atk): Incineroar, Arcanine, Hydreigon, Houndoom

## Redirection

Force opponent's attacks toward a designated team member using:

- **Follow Me**: Clefable, Lucario, Togekiss, Pachirisu, Indeedee
- **Rage Powder**: Volcarona, Amoonguss
- **Ally Switch**: Aegislash, Aromatisse, Sableye

Note: Check champions-roster.json for availability. Not all Pokemon listed here may be in Champions.

## Fake Out Pressure

Flinch an opponent on Turn 1 to enable safe setup or positioning.

- Incineroar, Mienshao, Ambipom, Ludicolo, Weavile, Scrafty, Passimian, Crabominable, Tsareena (has Queenly Majesty to block opponent Fake Out)

## Setup

Boost stats for a sweeper or support role.

- **Swords Dance**: Garchomp, Kingambit, Ceruledge, Scizor, Excadrill
- **Calm Mind**: Gardevoir, Reuniclus, Florges, Hatterene, Armarouge
- **Dragon Dance**: Dragonite, Gyarados, Tyranitar, Kommo-o, Dragapult
- **Nasty Plot**: Hydreigon, Zoroark, Toedscruel, Lucario
- **Quiver Dance**: Volcarona

## Spread Damage

Hit both opponents simultaneously.

- **Earthquake**: Garchomp, Excadrill, Mamoswine, Rhyperior (be careful -- hits your partner too)
- **Rock Slide**: Garchomp, Tyranitar, Aerodactyl, Lycanroc (chance to flinch)
- **Heat Wave**: Chandelure, Arcanine, Volcarona, Charizard
- **Dazzling Gleam**: Sylveon, Gardevoir, Florges, Hatterene
- **Muddy Water**: Politoed, Milotic, Basculegion
- **Discharge**: Rotom, Jolteon, Ampharos (hits partner -- pair with Ground-type or Lightning Rod)

## Protect

Almost every VGC Pokemon runs Protect. It's not a role to "fill" but a red flag if a Pokemon doesn't learn it or has no reason to skip it. Pokemon that commonly skip Protect:
- Fake Out users (need 4 offensive/support moves)
- Choice item holders (locked into one move)
- Assault Vest holders (can't use status moves)

## Weather Setters

Enable weather-dependent strategies.

- **Sun** (Drought): Torkoal, Ninetales
- **Rain** (Drizzle): Politoed, Pelipper
- **Sand** (Sand Stream): Tyranitar, Hippowdon
- **Snow** (Snow Warning): Abomasnow, Ninetales-Alola (check Champions availability)

## Terrain Setters

Enable terrain-dependent strategies.

- **Electric Terrain** (Surge): via moves (Electric Terrain)
- **Grassy Terrain** (Seed): via moves (Grassy Terrain) or abilities
- **Psychic Terrain** (Surge): via moves (Psychic Terrain) or abilities
- **Misty Terrain** (Surge): via moves (Misty Terrain)

Note: Champions may not include the Tapu Pokemon. Terrain is set via moves or Seed-type abilities on available Pokemon. Verify against roster.
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/building-vgc-teams/reference/roles.md
git commit -m "feat: add VGC roles reference (speed control, intimidate, redirect, etc.)"
```

---

### Task 4: Create reference/archetypes.md

**Files:**
- Create: `.claude/skills/building-vgc-teams/reference/archetypes.md`

- [ ] **Step 1: Create the archetypes reference**

```markdown
# VGC Team Archetypes

## Rain

**Core:** Politoed (Drizzle) + Swift Swim attacker (Basculegion, Beartic) or rain abusers (Pelipper + Barraskewda)

**Strategy:** Politoed sets rain with Drizzle. Swift Swim users double their Speed. Water moves get 50% boost, Fire moves weakened. Pelipper can also set rain and provides Tailwind.

**Key Moves:** Muddy Water, Hydro Pump, Hurricane (100% accuracy in rain), Thunder (100% accuracy in rain), Weather Ball

**Strengths:** Fast and powerful Water offense, weakens Fire-types, Hurricane/Thunder become reliable
**Weaknesses:** Opposing weather (Sand, Sun), Grass-types, Water Absorb/Storm Drain, Electric-types

**Champions Core Example:** Politoed + Basculegion + Pelipper (backup rain + Tailwind)

## Sun

**Core:** Torkoal (Drought) + Chlorophyll user or sun abusers

**Strategy:** Torkoal sets sun with Drought. Chlorophyll users double Speed. Fire moves boosted 50%, Water weakened. Synergizes with Solar Beam (no charge turn) and Growth (double boost in sun).

**Key Moves:** Eruption (power scales with HP -- lead with it), Heat Wave, Solar Beam, Growth, Weather Ball

**Strengths:** Massive Fire damage via Eruption, weakens Water, Solar Beam covers Water/Ground/Rock
**Weaknesses:** Rock-type attacks, opposing weather, Rain teams, Flash Fire

**Champions Core Example:** Torkoal + Venusaur (Chlorophyll) + Armarouge (Flash Fire synergy)

## Sand

**Core:** Tyranitar or Hippowdon (Sand Stream) + Sand Rush user (Excadrill)

**Strategy:** Sand Stream sets sandstorm passively. Excadrill doubles Speed via Sand Rush. Rock/Ground/Steel types get Sp.Def boost in sand.

**Key Moves:** Rock Slide, Earthquake, Iron Head, High Horsepower, Protect

**Strengths:** Strong physical offense, Sp.Def boost for Rock-types, Excadrill is very fast in sand
**Weaknesses:** Water, Grass, Fighting, opposing weather, Wide Guard blocks Rock Slide + Earthquake

**Champions Core Example:** Tyranitar + Excadrill + Gastrodon (Storm Drain to cover Water weakness)

## Snow / Hail

**Core:** Abomasnow (Snow Warning) + Aurora Veil + Slush Rush users

**Strategy:** Snow Warning sets snow. Aurora Veil can be used (reduces damage for 5 turns). Blizzard becomes 100% accurate.

**Key Moves:** Blizzard (100% in snow, hits both opponents), Aurora Veil, Ice Shard (priority)

**Strengths:** Aurora Veil is very strong defensively, Blizzard is powerful spread move
**Weaknesses:** Weakest weather offensively, many Ice-type weaknesses, opposing weather

**Champions Core Example:** Abomasnow + Beartic (Slush Rush) or Froslass (Aurora Veil)

## Trick Room

**Core:** Trick Room setter + slow heavy hitters

**Strategy:** Reverse Speed for 5 turns. Slowest Pokemon move first. Build around Pokemon with very low Speed and high offenses.

**Key Moves:** Trick Room, Close Combat, Gyro Ball (stronger when slower), Eruption under TR with Torkoal

**Strengths:** Flips speed advantage, slow Pokemon hit extremely hard, opponent fast Pokemon become liabilities
**Weaknesses:** Limited to 5 turns, Taunt blocks setup, opposing Trick Room, Imprison

**Key Setters in Champions:** Hatterene (Magic Bounce blocks Taunt), Oranguru (Inner Focus + Instruct), Farigiraf (Armor Tail blocks priority), Slowbro, Slowking, Reuniclus, Aromatisse, Mr. Rime, Chimecho

**Key Attackers:** Torkoal, Rhyperior, Mamoswine, Conkeldurr, Snorlax, Crabominable, Tyranitar

## Hyper Offense

**Core:** Fast, hard-hitting Pokemon with setup or immediate pressure

**Strategy:** Overwhelm the opponent with damage before they can respond. Less reliance on defensive pivoting.

**Key Moves:** Fake Out (enable safe setup), Tailwind, Swords Dance, Protect, powerful STAB attacks

**Strengths:** Forces opponent to react, punishes passive play, less concerned with longevity
**Weaknesses:** Intimidate, priority moves, opposing speed control, needs to win quickly

**Champions Core Example:** Dragapult + Kingambit + Whimsicott (Tailwind + Fake Out via Incineroar)

## Goodstuffs / Balance

**Core:** No specific gimmick -- strong, versatile Pokemon with good matchups across the meta

**Strategy:** Flexible game plan. Can adapt to different opponents. Wins through better plays, not a specific combo.

**Key Traits:** Good type coverage, multiple win conditions, Intimidate support, speed control options, no single point of failure

**Strengths:** No auto-loss matchups, adaptable, doesn't rely on one combo working
**Weaknesses:** No overwhelming advantage in any specific matchup, requires strong piloting

**Champions Core Example:** Incineroar + Garchomp + Whimsicott + Sylveon + flexible last 2
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/building-vgc-teams/reference/archetypes.md
git commit -m "feat: add VGC team archetypes reference (Rain, Sun, Sand, TR, HO, Balance)"
```

---

### Task 5: Create SKILL.md

**Files:**
- Create: `.claude/skills/building-vgc-teams/SKILL.md`

This is the main skill file. It defines the workflow, analysis logic, and instructions for the agent.

- [ ] **Step 1: Create SKILL.md**

```markdown
---
name: building-vgc-teams
description: Use when the user wants to build a competitive VGC team for Pokemon Champions, needs help choosing Pokemon, checking type coverage, or evaluating meta matchups
---

# Building VGC Teams

Conversational team builder for Pokemon Champions VGC. Guides intermediate players through constructing a 6-Pokemon team, analyzing its strengths and weaknesses, and exporting in Showdown paste format.

## Gatekeeper Rule

**NEVER suggest a Pokemon that is not in champions-roster.json.** Before suggesting any Pokemon, verify it exists in the roster. This applies regardless of what PokeAPI or Pikalytics data says. The roster is the single source of truth for Champions legality.

## Data Sources

**Local (always read first):**
- `champions-roster.json` -- legal Pokemon with types and base stats
- `type-chart.json` -- type effectiveness multipliers (2, 1, 0.5, 0). Missing entries = 1x.

**Runtime fetches:**
- **PokeAPI** -- `https://pokeapi.co/api/v2/pokemon/{name}` for abilities, moves. Use lowercase hyphenated names (e.g., `mr-rime`, `kommo-o`). User is final authority on moveset accuracy -- PokeAPI reflects mainline games, not Champions-specific changes.
- **Pikalytics** -- Fetch `https://www.pikalytics.com/champions` for current usage stats, top threats, common sets, and teammates. Parse what you can from the HTML. If the fetch fails, ask the user what they're seeing in the meta.

**Reference (load when needed):**
- `reference/roles.md` -- VGC role definitions
- `reference/archetypes.md` -- common team archetypes

## Workflow

### 1. Ask the user how to start

Three entry points:
- **"I want to build around X"** -- User names 1-2 Pokemon. Verify they're in the roster. Proceed to Foundation.
- **"I want to play [archetype]"** -- Load archetypes.md, present the relevant core. Proceed to Foundation.
- **"What's good right now?"** -- Fetch Pikalytics. Present top-usage Pokemon and common cores. Let the user pick a direction.

### 2. Foundation (slots 1-2)

Establish the team's core pair. For each Pokemon:
1. Verify it's in champions-roster.json
2. Fetch its data from PokeAPI (abilities, moves)
3. Suggest a competitive set (moves, ability, item) as a starting point
4. Explain why these two work together (type synergy, role coverage, archetype fit)

### 3. Build Out (slots 3-4)

Identify gaps in the current team:
1. **Type gaps** -- Read type-chart.json + roster types. Which types can the team not resist? Which types can't the team hit super-effectively?
2. **Role gaps** -- Load roles.md. Does the team have speed control? Intimidate? Redirection? Fake Out?
3. **Meta threats** -- Fetch Pikalytics. Which top-usage Pokemon threaten the current core?

For each gap, suggest 2-3 Pokemon from the roster that address it. Prefer Pokemon that fill multiple gaps. Present trade-offs.

### 4. Final Slots (5-6)

Fill remaining holes:
- Coverage gaps from the type analysis
- Anti-meta picks that handle common threats
- "Glue" Pokemon that support the team's game plan

### 5. Set Refinement

For each of the 6 Pokemon, suggest a starting set:
- Ability
- Held item (no duplicate items across the team)
- 4 moves
- Nature
- EVs (suggest a simple spread like 252/252/4 as a baseline)

Pull known competitive sets from PokeAPI move data + Pikalytics common sets. The user customizes from here.

### 6. Team Analysis

Run all three analysis layers. Present results clearly.

**Type Coverage Matrix:**

Defensive -- for each team member, list weaknesses and resistances using type-chart.json. Flag any type that hits 3+ team members super-effectively.

Offensive -- for each team member's STAB types + main coverage moves, list what types the team hits super-effectively. Flag types the team has no super-effective coverage against.

**Threat List:**

Fetch Pikalytics top-usage Pokemon. For each high-usage threat:
- Which team members handle it well?
- Which team members lose to it?
- If the team has no good answer, suggest counterplay (move change, item swap, or team member replacement)

**Role Checklist:**

Load roles.md. Check which roles the team covers:
- [ ] Speed control
- [ ] Intimidate / Attack drops
- [ ] Redirection
- [ ] Fake Out
- [ ] Setup
- [ ] Spread damage
- [ ] Weather/Terrain (if relevant to the archetype)

Not every team needs every role. Flag gaps as information, not failures.

### 7. Export

Output the team in Showdown paste format:

```
[Pokemon] @ [Item]
Ability: [Ability]
Level: 50
EVs: [HP] HP / [Atk] Atk / [Def] Def / [SpA] SpA / [SpD] SpD / [Spe] Spe
[Nature] Nature
- [Move 1]
- [Move 2]
- [Move 3]
- [Move 4]
```

Rules: Level 50, EVs total 508 max, no duplicate items, no duplicate Pokemon.

## Conversation Style

- The user can jump around: swap a Pokemon, revisit an earlier slot, re-run analysis, or change direction at any time
- Present 2-3 options when suggesting Pokemon, not a single "correct" answer
- Explain trade-offs concisely -- the user understands VGC basics
- When in doubt about Champions-specific data (modified movesets, availability of specific forms), ask the user rather than guessing
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/building-vgc-teams/SKILL.md
git commit -m "feat: add SKILL.md for VGC team builder -- workflow, analysis, and export logic"
```

---

### Task 6: Register the skill and final verification

**Files:**
- Modify: `.claude/skills/` (create directory symlink or direct directory)

- [ ] **Step 1: Ensure the skill directory exists at the right path**

The skill lives at `.claude/skills/building-vgc-teams/`. Verify all files are in place:

```bash
ls -R .claude/skills/building-vgc-teams/
```

Expected output:
```
SKILL.md
champions-roster.json
type-chart.json
reference/

reference:
archetypes.md
roles.md
```

- [ ] **Step 2: Verify the skill frontmatter**

Read the first 5 lines of SKILL.md and confirm:
- `name: building-vgc-teams`
- `description:` starts with "Use when" and mentions VGC, Pokemon Champions, team building

- [ ] **Step 3: Quick smoke test**

Read champions-roster.json and verify:
- It's valid JSON (pipe through `jq .` without errors)
- Has ~180 entries
- Garchomp entry: types = ["Dragon", "Ground"], baseStats.spe = 102
- Incineroar entry: types = ["Fire", "Dark"], baseStats.atk = 115

Read type-chart.json and verify:
- Valid JSON
- `Fire.Grass` = 2
- `Ghost.Normal` = 0
- `Dragon.Fairy` = 0

```bash
cat .claude/skills/building-vgc-teams/champions-roster.json | jq '. | length'
# Expected: ~180

cat .claude/skills/building-vgc-teams/champions-roster.json | jq '.[] | select(.name == "Garchomp")'
# Expected: types ["Dragon","Ground"], spe 102

cat .claude/skills/building-vgc-teams/type-chart.json | jq '.Fire.Grass'
# Expected: 2

cat .claude/skills/building-vgc-teams/type-chart.json | jq '.Dragon.Fairy'
# Expected: 0
```

- [ ] **Step 4: Final commit**

```bash
git add -A .claude/skills/building-vgc-teams/
git commit -m "feat: complete VGC team builder skill -- all data files and references"
```
