# App: Get entity actions from daemon via gRPC

Replace hardcoded action options in IssueDetail, PrDetail, and DocDetail components with dynamic actions fetched from the daemon's new GetEntityActions gRPC endpoint.

## Context

The daemon now provides a GetEntityActions endpoint that returns available actions (create, delete, duplicate, move, status changes, open in vscode) based on entity type and current state.

## Tasks

- [ ] Sync proto file from centy-daemon
- [ ] Regenerate TypeScript types
- [ ] Create useEntityActions hook to fetch actions
- [ ] Update IssueDetail.tsx to use dynamic actions
- [ ] Update PrDetail.tsx to use dynamic actions
- [ ] Update DocDetail.tsx to use dynamic actions
- [ ] Implement missing actions: Duplicate, Move
- [ ] Use 'enabled' flag to disable unavailable actions
- [ ] Use 'destructive' flag for confirmation dialogs
- [ ] Add keyboard shortcuts from action metadata
