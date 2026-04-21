const fs = require("fs")
const path = require("path")

const repoRoot = process.cwd()
const agents = [
  {
    name: "teambuilder",
    path: path.join(repoRoot, ".opencode/agents/teambuilder.md"),
    requiredSnippets: [
      "description:",
      "mode: primary",
      "Pokemon Champions VGC doubles",
      "Bring 6 / Pick 4",
      ".agents/skills/checking-vgc-legality/",
      ".agents/skills/building-vgc-teams/SKILL.md",
    ],
  },
  {
    name: "critic",
    path: path.join(repoRoot, ".opencode/agents/critic.md"),
    requiredSnippets: [
      "description:",
      "mode: primary",
      "Pokemon Champions VGC doubles",
      "Bring 6 / Pick 4",
      ".agents/skills/checking-vgc-legality/",
      ".agents/skills/evaluating-vgc-teams/SKILL.md",
      "summary-first",
    ],
  },
]

const failures = []

for (const agent of agents) {
  if (!fs.existsSync(agent.path)) {
    failures.push(`${agent.name}: missing file ${agent.path}`)
    continue
  }

  const contents = fs.readFileSync(agent.path, "utf8")

  for (const snippet of agent.requiredSnippets) {
    if (!contents.includes(snippet)) {
      failures.push(`${agent.name}: missing snippet ${JSON.stringify(snippet)}`)
    }
  }

  if (!contents.includes("do not switch silently into singles assumptions")) {
    failures.push(`${agent.name}: missing singles guardrail`)
  }

  if (!contents.includes("do not suggest out-of-roster Pokemon")) {
    failures.push(`${agent.name}: missing legality guardrail`)
  }
}

if (failures.length > 0) {
  console.error("Agent verification failed:\n")
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log("Agent verification passed")
