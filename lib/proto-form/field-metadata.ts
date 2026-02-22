import type { DescField } from '@bufbuild/protobuf'
import type { FieldOverride } from './types'

export function protoNameToLabel(name: string): string {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export interface FieldMeta {
  label: string
  description?: string
}

export function getFieldMeta(
  field: DescField,
  override?: FieldOverride
): FieldMeta {
  const overrideLabel = override !== null && override !== undefined ? override.label : undefined
  const overrideDescription = override !== null && override !== undefined ? override.description : undefined
  return {
    label: overrideLabel !== null && overrideLabel !== undefined ? overrideLabel : protoNameToLabel(field.name),
    description: overrideDescription,
  }
}
