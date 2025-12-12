# Add UI for move/duplicate issues and docs

## Summary

Add web UI support for moving and duplicating issues and docs between centy projects.

## Background

The daemon now supports these operations via gRPC:

- `MoveIssue` / `DuplicateIssue` - Transfer/copy issues between projects
- `MoveDoc` / `DuplicateDoc` - Transfer/copy docs between projects

Related: centy-daemon Issue #43

## Features to implement

### 1. Issue detail page actions

Add new action buttons in IssueDetail header:

- **Move** - Opens modal to select target project
- **Duplicate** - Opens modal with duplicate options

Button placement: Next to existing Edit/Delete buttons in issue-actions div

### 2. Doc detail page actions

Add same actions in DocDetail:

- **Move** - Opens modal to select target project
- **Duplicate** - Opens modal with duplicate options

### 3. Move modal component

`MoveModal.tsx`:

- Project selector dropdown (fetches from daemon registry)
- Current project shown but disabled
- Confirm/Cancel buttons
- Loading state during operation
- Error display

### 4. Duplicate modal component

`DuplicateModal.tsx`:

- Target project dropdown (includes current project)
- Title input (default: "Copy of {original}")
- For docs: slug input (default: "{slug}-copy")
- Confirm/Cancel buttons
- Loading state
- Validation (slug uniqueness warning)

### 5. User feedback

- Success toast: "Issue moved to {project}" / "Issue duplicated"
- On move: redirect to target project's issue
- On duplicate: show link to new issue in success message
- Error handling with clear messages

### 6. Context menu option (optional enhancement)

Add move/duplicate to issue/doc list context menus for quick access

## Implementation details

### New components

- `components/shared/MoveModal.tsx` - Reusable move modal
- `components/shared/DuplicateModal.tsx` - Reusable duplicate modal

### Files to modify

- `components/issues/IssueDetail.tsx` - Add move/duplicate buttons and modals
- `components/docs/DocDetail.tsx` - Add move/duplicate buttons and modals
- `lib/grpc/client.ts` - Ensure moveIssue, duplicateIssue, moveDoc, duplicateDoc are exported

### gRPC types needed

Import from `@/gen/centy_pb`:

- `MoveIssueRequestSchema`, `DuplicateIssueRequestSchema`
- `MoveDocRequestSchema`, `DuplicateDocRequestSchema`

### Styling

- Add styles for new modals in existing CSS
- Match existing modal patterns (delete-confirm style)
