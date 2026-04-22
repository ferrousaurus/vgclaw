---
name: evaluating-vgc-meta
description: Provides current Pokemon Champions VGC meta data via Pikalytics — usage stats, top threats, common sets, and teammates.
---

# Evaluating VGC Meta

Data provider for current Pokemon Champions VGC meta context.

## Pikalytics Fetch

Fetch `https://www.pikalytics.com/champions` for current usage stats, top threats, common sets, and teammates. Parse what you can from the HTML.

**What to extract:**
- Top Pokemon by usage rate (focus on top 10-15)
- Common held items, abilities, and moves for each top Pokemon
- Common teammates and cores
- Usage trends that indicate the current meta shape (e.g., high Trick Room representation, weather-heavy, etc.)

**If the fetch fails:** Ask the user what they're seeing in the meta. Do not guess or fabricate usage data.

## How Consumer Skills Should Use Meta Data

Use meta-relative language that references specific threats and usage data. Examples:
- "With Tailwind, Pokemon A is faster than Garchomp, a top threat in the meta."
- "Garchomp appears on 45% of teams -- your team needs an answer to it."
- "Against the current meta's Rain prevalence, consider a Grass-type."
