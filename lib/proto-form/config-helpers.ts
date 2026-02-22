import type { CustomFieldDefinition, WorkspaceConfig } from '@/gen/centy_pb'

export function toStringArray(v: unknown): string[] {
  return Array.isArray(v)
    ? v.filter((item): item is string => typeof item === 'string')
    : []
}

export function toStringRecord(v: unknown): Record<string, string> {
  if (
    v !== null &&
    v !== undefined &&
    typeof v === 'object' &&
    !Array.isArray(v)
  ) {
    const result: Record<string, string> = {}
    for (const [k, val] of Object.entries(v)) {
      if (typeof val === 'string') {
        // eslint-disable-next-line security/detect-object-injection
        result[k] = val
      }
    }
    return result
  }
  return {}
}

export function toNumber(v: unknown, fallback: number): number {
  return typeof v === 'number' ? v : fallback
}

function isCustomFieldDefinition(v: unknown): v is CustomFieldDefinition {
  return (
    v !== null && v !== undefined && typeof v === 'object' && !Array.isArray(v)
  )
}

export function toCustomFields(v: unknown): CustomFieldDefinition[] {
  return Array.isArray(v) ? v.filter(isCustomFieldDefinition) : []
}

function isWorkspaceConfig(v: unknown): v is WorkspaceConfig {
  return (
    v !== null && v !== undefined && typeof v === 'object' && !Array.isArray(v)
  )
}

export function toWorkspaceConfig(v: unknown): WorkspaceConfig | undefined {
  return isWorkspaceConfig(v) ? v : undefined
}
