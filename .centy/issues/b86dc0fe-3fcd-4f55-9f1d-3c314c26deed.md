---
displayNumber: 147
status: in-progress
priority: 1
createdAt: 2026-02-11T17:54:06.433334+00:00
updatedAt: 2026-02-15T17:35:08.493483+00:00
---

# StatusConfigDialog broken: daemon replaced LlmConfig with WorkspaceConfig

## Problem

The **Configure Status Update Behavior** dialog (StatusConfigDialog) is completely broken after the daemon update. The daemon removed `LlmConfig` entirely and replaced it with a new `WorkspaceConfig` message.

### What changed in the daemon

The daemon’s `Config` message changed:

- **Removed**: `LlmConfig llm = 9` (field 9 is now `reserved`)
- **Added**: `WorkspaceConfig workspace = 13` with `optional bool update_status_on_open = 1`
- **Renamed**: `update_status_on_start` → `update_status_on_open`
- **Removed fields**: `auto_close_on_complete`, `allow_direct_edits`, `default_workspace_mode` (all from old LlmConfig)

The `OpenInTempWorkspaceResponse.requires_status_config` field still exists at field 8, so the trigger for showing the dialog still works.

### What’s broken

1. **StatusConfigDialog.tsx** reads `config.llm.updateStatusOnStart` → `config.llm` is always `undefined` since the daemon no longer returns it
1. **StatusConfigDialog.tsx** saves `config.llm = { updateStatusOnStart: ... }` → the daemon ignores this because field 9 is reserved
1. **LlmSettingsEditor.tsx** reads/writes `config.llm` → same issue, settings page shows stale/empty values
1. **Result**: User sees the dialog, selects an option, saves → daemon ignores the save → next workspace open triggers the dialog again (infinite loop)

### What needs to change

1. **Sync proto** from daemon — `LlmConfig` is gone, `WorkspaceConfig` is new at field 13
1. **Update StatusConfigDialog.tsx** — read/write `config.workspace.updateStatusOnOpen` instead of `config.llm.updateStatusOnStart`
1. **Update LlmSettingsEditor.tsx** — either remove it or refactor for the new config structure (the other LLM fields like `autoCloseOnComplete`, `allowDirectEdits`, `defaultWorkspaceMode` may have been removed entirely)
1. **Update ProjectConfig.tsx** — update the LLM Settings section to reflect new config shape

### Affected files

- `components/shared/StatusConfigDialog.tsx` (lines 45-46, 96-106)
- `components/settings/LlmSettingsEditor.tsx` (entire component)
- `components/settings/ProjectConfig.tsx` (lines 355-363)
- `proto/centy.proto` (needs re-sync)
- `gen/centy_pb.ts` (needs regeneration)

### Daemon evidence

```
grpcurl -plaintext localhost:50051 describe centy.v1.Config

Config message shows:
  reserved 9;                              # LlmConfig was here
  .centy.v1.WorkspaceConfig workspace = 13; # New replacement

grpcurl -plaintext localhost:50051 describe centy.v1.WorkspaceConfig

WorkspaceConfig {
  optional bool update_status_on_open = 1;
}

centy.v1.LlmConfig → Symbol not found
```
