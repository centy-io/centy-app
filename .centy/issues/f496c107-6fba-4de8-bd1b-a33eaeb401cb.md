---
# This file is managed by Centy. Use the Centy CLI to modify it.
displayNumber: 272
status: open
priority: 2
createdAt: 2026-06-10T20:14:44.081677+00:00
updatedAt: 2026-06-10T20:14:44.081677+00:00
---

# feat: kanban board view for issues

## Overview

Add a Kanban board view to the issues list as a toggleable alternative to the existing table view. Columns map to issue statuses (driven by `StateManager`), and drag-and-drop between columns updates `metadata.status` via `UpdateItem`.

## User Story

As a developer, I want to see issues grouped by status in a visual board so I can track workflow at a glance and update status by dragging cards between columns — without opening each issue.

## Acceptance Criteria

- [ ] Toggle in `IssuesHeader` switches between **List** (current table) and **Board** views
- [ ] Board renders one column per status from `stateManager.getAllowedStates()`
- [ ] Each card displays: `#displayNumber`, title, priority badge (reuses `.priority-badge` classes)
- [ ] Drag-and-drop a card to another column → calls `UpdateItem` to change `metadata.status`
- [ ] Optimistic UI: card moves immediately, reverts on API error
- [ ] View preference persisted in `localStorage` (key: `issues-view-mode`)
- [ ] Empty columns render with 0-count badge (not hidden)
- [ ] Columns scroll horizontally on narrow viewports
- [ ] Card click navigates to issue detail (same as table row)

## Technical Plan

### New dependencies

```
@dnd-kit/core
@dnd-kit/sortable
@dnd-kit/utilities
```

### New files

| File | Purpose |
|------|---------|
| `components/issues/IssuesList/IssuesBoard.tsx` | Board root — `DndContext` wrapper, groups issues by status, renders columns |
| `components/issues/IssuesList/IssueBoardColumn.tsx` | `useDroppable` column — header with status + count, scrollable card list |
| `components/issues/IssuesList/IssueBoardCard.tsx` | `useDraggable` card — `#num`, title, priority badge, click-to-navigate |
| `components/issues/IssuesList/hooks/useBoardDrag.ts` | `onDragEnd` handler: optimistic mutation + `UpdateItem` + revert on error |

### Modified files

| File | Change |
|------|--------|
| `IssuesList.types.ts` | Add `export type ViewMode = 'list' \| 'board'` |
| `IssuesList.tsx` | Own `viewMode` state, pass to Header + Content |
| `IssuesHeader.tsx` | Add list/board toggle (segmented control style) |
| `IssuesContent.tsx` | Render `IssuesBoard` when `viewMode === 'board'` |

### Drag-and-drop logic (`useBoardDrag`)

```ts
onDragEnd(event):
  sourceStatus = active.data.current.status
  destinationStatus = over?.id  // column droppableId = status string
  if (!destinationStatus || sourceStatus === destinationStatus) return
  setIssues(optimisticMove(issues, activeId, destinationStatus))
  UpdateItem(projectPath, activeId, { status: destinationStatus })
    .catch(() => setIssues(originalIssues))  // revert
```

### Issue grouping

```ts
const columns = useMemo(() =>
  stateManager.getAllowedStates().map(status => ({
    status,
    issues: issues.filter(i => i.metadata?.status === status),
  })),
  [issues, stateManager]
)
```

## Open Questions

- Within-column card order: persist manual order, or always server order? Recommend server order for v1.
- Closed columns: visually dimmed or collapsible? Recommend subtle opacity for `closed` status.
- Should board respect active column filters from list view? Recommend yes — share filter state across views.
