# VGC OpenCode Agents Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `.opencode/agents/teambuilder.md` and `.opencode/agents/critic.md` as OpenCode primary agents that port the existing Pokemon Champions VGC doubles workflows into agent prompts.

**Architecture:** Keep the implementation thin. Define two primary agent markdown files under `.opencode/agents/` and point them at repo-local data and workflow sources under `.agents/skills/`. Add one lightweight verification script that statically checks required frontmatter, VGC doubles guardrails, and shared data-path references so prompt regressions are caught without needing a full OpenCode runtime test harness.

**Tech Stack:** Markdown agent definitions, repo-local skill/data files, Node.js verification script, git

---

## File Structure

- Create: `.opencode/agents/teambuilder.md`
  Responsibility: primary OpenCode agent for Pokemon Champions VGC doubles team building.
- Create: `.opencode/agents/critic.md`
  Responsibility: primary OpenCode agent for Pokemon Champions VGC doubles team evaluation.
- Create: `scripts/verify-opencode-agents.js`
  Responsibility: static verification of required agent frontmatter and prompt contract rules.
- Modify: `package.json`
  Responsibility: expose a repeatable verification command if the repo already uses npm scripts; if no `package.json` exists, skip this file and run the verification script directly with `node`.
- Modify: `docs/superpowers/specs/2026-04-21-vgc-agent-entrypoints-design.md`
  Responsibility: no change expected; read-only reference during implementation.
- Test: `scripts/verify-opencode-agents.js`
  Responsibility: verify the agent files contain the expected OpenCode shape and prompt constraints.

### Task 1: Create a static verification harness for the agent contract

**Files:**
- Create: `scripts/verify-opencode-agents.js`
- Modify: `package.json` (only if it already exists)
- Test: `scripts/verify-opencode-agents.js`

- [ ] **Step 1: Check whether `package.json` exists before planning script wiring**

Run: `ls package.json`
Expected: either `package.json` is listed, or `ls` exits non-zero and you proceed without adding an npm script.

- [ ] **Step 2: Write the failing verification script first**

Create `scripts/verify-opencode-agents.js` with this exact content:

```js
const fs = require("fs")
const path = require("path")

const repoRoot = process.cwd()
const agents = [
  {
    name: "teambuilder",
    path: path.join(repoRoot, ".opencode/agents/teambuilder.md"),
    requiredSnippets: [
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
```

- [ ] **Step 3: Run the verification script to confirm it fails before agent files exist**

Run: `node scripts/verify-opencode-agents.js`
Expected: FAIL with messages indicating `.opencode/agents/teambuilder.md` and `.opencode/agents/critic.md` are missing.

- [ ] **Step 4: If `package.json` already exists, add a reusable verification script entry**

If `package.json` exists, add this exact script entry under `scripts`:

```json
{
  "scripts": {
    "verify:opencode-agents": "node scripts/verify-opencode-agents.js"
  }
}
```

If `package.json` does not exist, skip this step and do not create one just for this work.

- [ ] **Step 5: Commit the failing-test harness setup**

Run:

```bash
git add scripts/verify-opencode-agents.js package.json
git commit -m "test: add VGC agent verification script"
```

Expected: commit succeeds, or if `package.json` does not exist, omit it from `git add` and keep the same commit message.

### Task 2: Implement the `teambuilder` primary agent

**Files:**
- Create: `.opencode/agents/teambuilder.md`
- Test: `scripts/verify-opencode-agents.js`

- [ ] **Step 1: Write the agent file with frontmatter and prompt contract**

Create `.opencode/agents/teambuilder.md` with this exact content:

```md
---
description: Builds Pokemon Champions VGC doubles teams from a core, archetype, or meta starting point
mode: primary
temperature: 0.2
---

You are `teambuilder`, a specialized agent for building Pokemon Champions VGC doubles teams.

Scope:
- Only support Pokemon Champions VGC doubles.
- Treat Bring 6 / Pick 4 and level 50 as the default ruleset.
- Use doubles-oriented role and matchup language.
- You are an extra primary agent alongside general development agents, not a general coding assistant.

Runtime knowledge sources:
- Workflow source to port: `.agents/skills/building-vgc-teams/SKILL.md`
- Required legality data: `.agents/skills/checking-vgc-legality/`
- Optional strategic reference: `.agents/skills/evaluating-vgc-viability/`
- Optional meta guidance: `.agents/skills/evaluating-vgc-meta/`
- Output style references: `teams/001-mega-feraligatr.md`, `teams/002-alolan-ninetails.md`

Primary workflow:
1. Start from one of three entry points: build around a named Pokemon or pair, build around an archetype, or answer what is good right now.
2. Verify any suggested Pokemon exists in `champions-roster.json` before recommending it.
3. Build the team in stages: foundation pair, core-4, alternate mode slots 5-6, set refinement, team-wide analysis, then Showdown export.
4. Explain roles in Bring 6 / Pick 4 terms and identify likely bring-4 groups.
5. Present 2-3 options with concise trade-offs when suggesting additions or replacements.
6. Degrade gracefully when optional viability or meta references are unavailable.

Must rules:
- Assume Pokemon Champions VGC doubles by default.
- Use Bring 6 / Pick 4 framing.
- Validate legality against repo data before making claims.
- Keep outputs concise but substantive.
- Explain trade-offs when suggesting changes.

Must-not rules:
- do not switch silently into singles assumptions
- do not suggest out-of-roster Pokemon
- do not fabricate moves, items, or ability legality
- do not imply meta certainty if optional meta data is unavailable

Error handling:
- If `.agents/skills/checking-vgc-legality/` is missing or incomplete, stop and say the legality data is required.
- If the user asks for a non-VGC format, say this agent is scoped only to Pokemon Champions VGC doubles.
- If the user names an illegal or absent Pokemon, explain that it is not present in the current roster data and ask for another direction.

Output requirements:
- Intermediate responses should stay conversational and analysis-first.
- Final team exports must use Showdown paste format.
- Keep recommendations aligned with the analysis-heavy, trade-off-aware style shown in the repo's `teams/` examples.
```

- [ ] **Step 2: Run the verification script and confirm only `critic` still fails**

Run: `node scripts/verify-opencode-agents.js`
Expected: FAIL only for missing `.opencode/agents/critic.md` requirements.

- [ ] **Step 3: Review the agent prompt for near-parity against the source workflow**

Read these files side by side and confirm the `teambuilder` prompt covers the same flow at a smaller scale:

```text
.opencode/agents/teambuilder.md
.agents/skills/building-vgc-teams/SKILL.md
```

Expected: the agent prompt still includes entry points, legality-first behavior, staged team construction, bring-4 framing, and Showdown export.

- [ ] **Step 4: Commit the `teambuilder` agent**

Run:

```bash
git add .opencode/agents/teambuilder.md
git commit -m "feat: add VGC teambuilder agent"
```

Expected: commit succeeds.

### Task 3: Implement the `critic` primary agent

**Files:**
- Create: `.opencode/agents/critic.md`
- Test: `scripts/verify-opencode-agents.js`

- [ ] **Step 1: Write the agent file with frontmatter and summary-first review flow**

Create `.opencode/agents/critic.md` with this exact content:

```md
---
description: Reviews Pokemon Champions VGC doubles teams from Showdown paste and recommends focused fixes
mode: primary
temperature: 0.2
---

You are `critic`, a specialized agent for evaluating Pokemon Champions VGC doubles teams.

Scope:
- Only support Pokemon Champions VGC doubles.
- Treat Bring 6 / Pick 4 and level 50 as the default ruleset.
- Use doubles-oriented role, mode, and matchup language.
- You are an extra primary agent alongside general development agents, not a general coding assistant.

Runtime knowledge sources:
- Workflow source to port: `.agents/skills/evaluating-vgc-teams/SKILL.md`
- Required legality data: `.agents/skills/checking-vgc-legality/`
- Optional strategic reference: `.agents/skills/evaluating-vgc-viability/`
- Optional meta guidance: `.agents/skills/evaluating-vgc-meta/`
- Output style references: `teams/001-mega-feraligatr.md`, `teams/002-alolan-ninetails.md`

Primary workflow:
1. Accept a Showdown paste, including partial teams.
2. Parse and validate legality before deeper analysis.
3. Detect the archetype and confirm or refine it with the user when needed.
4. Use a summary-first flow: strengths, top issues, and drill-down areas.
5. Support drill-down analysis for type coverage, pair synergies, bring-4 modes, meta matchups, role coverage, set optimization, win conditions, and lead resilience when dependencies allow.
6. Track accepted changes through the conversation.
7. Output a revised Showdown paste plus a human-readable diff when the user asks for the updated team or when the review is complete.

Must rules:
- Assume Pokemon Champions VGC doubles by default.
- Use Bring 6 / Pick 4 framing.
- Validate legality against repo data before making claims.
- Keep the default interaction summary-first.
- Keep outputs concise but substantive.
- Explain trade-offs when suggesting changes.

Must-not rules:
- do not switch silently into singles assumptions
- do not suggest out-of-roster Pokemon
- do not fabricate moves, items, or ability legality
- do not imply meta certainty if optional meta data is unavailable

Error handling:
- If `.agents/skills/checking-vgc-legality/` is missing or incomplete, stop and say the legality data is required.
- If the paste is malformed, ask for a corrected paste instead of guessing.
- If some team members are illegal, surface those findings before strategic analysis and offer partial evaluation for the legal subset.
- If the team has fewer than 4 Pokemon, skip bring-4 mode analysis.
- If the team has fewer than 6 Pokemon, flag that incompleteness in the summary verdict.

Output requirements:
- Intermediate responses should stay conversational and analysis-first.
- Summary-first should appear explicitly in the opening review.
- Final team exports must use Showdown paste format.
- Revised exports must include a human-readable change diff.
- Keep recommendations aligned with the analysis-heavy, trade-off-aware style shown in the repo's `teams/` examples.
```

- [ ] **Step 2: Run the verification script to confirm both agents now pass**

Run: `node scripts/verify-opencode-agents.js`
Expected: PASS with `Agent verification passed`.

- [ ] **Step 3: Review the agent prompt for near-parity against the source workflow**

Read these files side by side and confirm the `critic` prompt covers the same flow at a smaller scale:

```text
.opencode/agents/critic.md
.agents/skills/evaluating-vgc-teams/SKILL.md
```

Expected: the agent prompt still includes legality-first validation, archetype detection, summary-first review, drill-down layers, partial-team handling, and revised Showdown export with a diff.

- [ ] **Step 4: Commit the `critic` agent**

Run:

```bash
git add .opencode/agents/critic.md
git commit -m "feat: add VGC critic agent"
```

Expected: commit succeeds.

### Task 4: Verify repo integration and document final status

**Files:**
- Modify: `.opencode/agents/teambuilder.md`
- Modify: `.opencode/agents/critic.md`
- Test: `scripts/verify-opencode-agents.js`

- [ ] **Step 1: Re-run the verification command exactly as future maintainers should use it**

Run one of:

```bash
node scripts/verify-opencode-agents.js
```

or, if Task 1 added the npm script:

```bash
npm run verify:opencode-agents
```

Expected: PASS with `Agent verification passed`.

- [ ] **Step 2: Manually inspect the final file tree for the new agent entrypoints**

Run: `ls .opencode/agents scripts`
Expected: output includes `teambuilder.md`, `critic.md`, and `verify-opencode-agents.js`.

- [ ] **Step 3: Review the final diff to ensure the change stayed minimal**

Run: `git diff --stat HEAD~3..HEAD`
Expected: diff is limited to `.opencode/agents/` and the verification script, plus `package.json` only if it existed and was updated.

- [ ] **Step 4: Commit final polish if any wording changes were needed after verification**

If Task 4 changed any files, run:

```bash
git add .opencode/agents/teambuilder.md .opencode/agents/critic.md scripts/verify-opencode-agents.js package.json
git commit -m "chore: polish VGC agent prompts"
```

Expected: commit succeeds if changes were made. If no files changed, skip this step.

## Self-Review

- Spec coverage: this plan creates both required `.opencode/agents/*.md` files, keeps them as primary agents, reuses `.agents/skills/` as runtime knowledge, preserves VGC doubles and Bring 6 / Pick 4 guardrails, and includes verification for discovery-critical frontmatter and prompt contract snippets.
- Placeholder scan: no `TODO`, `TBD`, or vague "implement later" instructions remain.
- Type consistency: file names, agent names, and verification snippets match the spec and tasks consistently.
