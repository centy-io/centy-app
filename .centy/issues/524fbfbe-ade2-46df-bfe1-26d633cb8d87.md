---
displayNumber: 160
status: open
priority: 3
createdAt: 2026-02-17T14:14:56.102338+00:00
updatedAt: 2026-02-17T14:14:56.102338+00:00
---

# Remove `security/detect-object-injection` ESLint rule override

Remove the `'security/detect-object-injection': 'off'` override from `eslint.config.js`, use safe property access patterns to prevent object injection, and ensure CI passes.
