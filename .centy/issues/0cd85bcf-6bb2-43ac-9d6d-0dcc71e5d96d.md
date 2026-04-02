---
# This file is managed by Centy. Use the Centy CLI to modify it.
displayNumber: 212
status: open
priority: 2
createdAt: 2026-04-02T22:19:46.429371+00:00
updatedAt: 2026-04-02T22:19:46.429371+00:00
---

# Unify issue-title and issue-content into a generic component for all item types

Currently `issue-title` and `issue-content` are separate components specific to issues. We want to refactor these into a single generic component that works across all item types, not just issues.

## Goals

- Merge `issue-title` and `issue-content` into one unified component
- Make the component generic so it can be reused by all item types
- Reduce duplication and improve consistency across item type views

## Considerations

- The new component should accept item type as a prop or be driven by item type metadata
- Existing issue rendering behavior must be preserved
- Other item types should be able to adopt the component with minimal configuration
