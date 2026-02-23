import type { WorkspaceConfig } from '@/gen/centy_pb'

function isWorkspaceConfig(v: unknown): v is WorkspaceConfig {
  return (
    v !== null && v !== undefined && typeof v === 'object' && !Array.isArray(v)
  )
}

export function toWorkspaceConfig(v: unknown): WorkspaceConfig | undefined {
  return isWorkspaceConfig(v) ? v : undefined
}
