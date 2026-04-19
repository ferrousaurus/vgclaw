---
name: evaluating-vgc-meta
description: Provides current Pokemon Champions VGC meta data via Pikalytics — usage stats, top threats, common sets, and teammates. Optional dependency for team building and evaluation skills.
---

# Evaluating VGC Meta

Data provider for current Pokemon Champions VGC meta context. This skill is not invoked directly. Other skills reference it as an optional dependency.

## Pikalytics Fetch

Fetch `https://www.pikalytics.com/champions` for current usage stats, top threats, common sets, and teammates. Parse what you can from the HTML.

**What to extract:**
- Top Pokemon by usage rate (focus on top 10-15)
- Common held items, abilities, and moves for each top Pokemon
- Common teammates and cores
- Usage trends that indicate the current meta shape (e.g., high Trick Room representation, weather-heavy, etc.)

**If the fetch fails:** Ask the user what they're seeing in the meta. Do not guess or fabricate usage data.

## How Consumer Skills Should Use Meta Data

**When available:** Use meta-relative language that references specific threats and usage data. Examples:
- "With Tailwind, Pokemon A is faster than Garchomp, a top threat in the meta."
- "Garchomp appears on 45% of teams -- your team needs an answer to it."
- "Against the current meta's Rain prevalence, consider a Grass-type."

**When this skill is unavailable:** Consumer skills should fall back to generic, stat-based assessments. Examples:
- "Pokemon A has an above-average speed stat."
- "Your team may struggle against fast Ground-types."
- "Consider type coverage for common offensive types."
