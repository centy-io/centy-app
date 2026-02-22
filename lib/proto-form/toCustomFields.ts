import type { CustomFieldDefinition } from '@/gen/centy_pb'

function isCustomFieldDefinition(v: unknown): v is CustomFieldDefinition {
  return (
    v !== null && v !== undefined && typeof v === 'object' && !Array.isArray(v)
  )
}

export function toCustomFields(v: unknown): CustomFieldDefinition[] {
  return Array.isArray(v) ? v.filter(isCustomFieldDefinition) : []
}
