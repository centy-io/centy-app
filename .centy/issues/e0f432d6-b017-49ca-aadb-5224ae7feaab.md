---
# This file is managed by Centy. Use the Centy CLI to modify it.
displayNumber: 221
status: open
priority: 2
createdAt: 2026-04-03T08:14:44.295566+00:00
updatedAt: 2026-04-03T08:14:44.295566+00:00
---

# Enable @typescript-eslint/restrict-template-expressions

Currently disabled in `eslint.config.js` due to template literals containing non-string types. Fix by adding explicit `.toString()` calls or type-safe conversions at each violation site, then re-enable the rule globally.
