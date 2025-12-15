# Collapsible organization groups in project selector

Add collapse/expand functionality to organization groups in the ProjectSelector dropdown.

## Goal

Allow users to collapse/expand organization groups when viewing "All Organizations" in the project selector, making it easier to navigate when there are many projects across multiple organizations.

## Requirements

- Organization group headers should be clickable to toggle collapse/expand
- Collapsed state should persist across sessions (localStorage)
- Add visual indicator (chevron icon) showing current collapse state
- Only applies when viewing "All Organizations" where grouping is active

## Affected Files

- `components/project/ProjectSelector.tsx`
- `styles/components/ProjectSelector.css`
