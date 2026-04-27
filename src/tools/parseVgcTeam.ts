import { McpServer } from "@modelcontextprotocol/server";
import z from "zod";

type SkillPoints = {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
};

type ParsedMember = {
  pokemon: string;
  item?: string;
  ability: string;
  nature: string;
  skillPoints: SkillPoints;
  moves: string[];
};

const statMap: Record<string, keyof SkillPoints> = {
  HP: "hp",
  Atk: "attack",
  Def: "defense",
  SpA: "specialAttack",
  SpD: "specialDefense",
  Spe: "speed",
};

function parseStats(input: string): Partial<SkillPoints> {
  const result: Partial<SkillPoints> = {};
  const regex = /(\d+)\s+(HP|Atk|Def|SpA|SpD|Spe)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(input)) !== null) {
    const value = parseInt(match[1], 10);
    const label = match[2];
    const key = statMap[label];
    if (key) {
      result[key] = value;
    }
  }
  return result;
}

export function parseVgcTeam(paste: string): { team: ParsedMember[]; warnings: string[] } {
  const warnings: string[] = [];
  const team: ParsedMember[] = [];

  if (!paste.trim()) {
    warnings.push("No valid team members found.");
    return { team, warnings };
  }

  const blocks = paste
    .split(/\n\s*\n+/)
    .map((b) => b.trim())
    .filter(Boolean);

  for (const block of blocks) {
    const lines = block.split("\n").map((l) => l.trim());

    let pokemon = "";
    let item: string | undefined;
    let ability = "";
    let nature = "";
    const skillPoints: SkillPoints = {
      hp: 0,
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0,
    };
    const moves: string[] = [];
    let hasEvs = false;
    let hasIvs = false;

    for (const line of lines) {
      if (!line) continue;

      // Name/Item line — first line that isn't a known prefixed line
      if (
        !pokemon &&
        !line.startsWith("Ability:") &&
        !line.startsWith("Level:") &&
        !line.startsWith("SPs:") &&
        !line.startsWith("EVs:") &&
        !line.startsWith("IVs:") &&
        !line.startsWith("-") &&
        !line.endsWith("Nature")
      ) {
        const match = line.match(/^(.*?)(?:\s+\(([MF])\))?\s*(?:@\s+(.*))?$/);
        if (match) {
          pokemon = match[1].trim();
          if (match[3]) item = match[3].trim();
        }
        continue;
      }

      if (line.startsWith("Ability:")) {
        ability = line.slice("Ability:".length).trim();
        continue;
      }

      if (line.startsWith("Level:")) {
        // Champions is always Level 50; no need to store
        continue;
      }

      if (line.startsWith("SPs:")) {
        const spText = line.slice("SPs:".length).trim();
        const parsed = parseStats(spText);
        Object.assign(skillPoints, parsed);
        continue;
      }

      if (line.startsWith("EVs:")) {
        const evText = line.slice("EVs:".length).trim();
        const parsed = parseStats(evText);
        for (const key of Object.keys(parsed) as Array<keyof SkillPoints>) {
          skillPoints[key] = Math.floor((parsed[key] ?? 0) / 8);
        }
        hasEvs = true;
        continue;
      }

      if (line.startsWith("IVs:")) {
        hasIvs = true;
        continue;
      }

      const natureMatch = line.match(/^(\w+)\s+Nature$/);
      if (natureMatch) {
        nature = natureMatch[1];
        continue;
      }

      if (line.startsWith("-")) {
        moves.push(line.slice(1).trim());
        continue;
      }
    }

    if (!pokemon) {
      warnings.push(`Skipped unrecognized block:\n${block}`);
      continue;
    }

    team.push({ pokemon, item, ability, nature, skillPoints, moves });

    if (hasEvs) {
      warnings.push(
        `Converted legacy EVs to SPs for ${pokemon}. Champions uses Stat Points (SPs), not EVs.`,
      );
    }
    if (hasIvs) {
      warnings.push(
        `Ignored IVs for ${pokemon}; Champions sets all IVs to 31.`,
      );
    }
  }

  if (team.length === 0 && warnings.length === 0) {
    warnings.push("No valid team members found.");
  }

  return { team, warnings };
}

export default function registerParseVgcTeam(server: McpServer) {
  server.registerTool(
    "parse-vgc-team",
    {
      description:
        "Parse a Pokemon Showdown paste into structured Champions VGC team data",
      inputSchema: z.object({
        paste: z.string().describe("Raw Showdown paste text"),
      }),
    },
    async (args) => {
      const { team, warnings } = parseVgcTeam(args.paste);
      const outputLines: string[] = [];
      if (warnings.length > 0) {
        outputLines.push("## Warnings");
        for (const w of warnings) {
          outputLines.push(`- ${w}`);
        }
        outputLines.push("");
      }
      outputLines.push("## Team JSON");
      outputLines.push(JSON.stringify(team, null, 2));
      return { content: [{ type: "text", text: outputLines.join("\n") }] };
    },
  );
}
