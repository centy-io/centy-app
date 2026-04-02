import type { DescField } from '@bufbuild/protobuf'
import type { FieldOverride } from './FieldOverride.types'
import type { FieldMeta } from './FieldMeta.types'
import { protoNameToLabel } from './protoNameToLabel'

export function getFieldMeta(
  field: DescField,
  override?: FieldOverride
): FieldMeta {
  const overrideLabel =
    override !== null && override !== undefined ? override.label : undefined
  const overrideDescription =
    override !== null && override !== undefined
      ? override.description
      : undefined
  return {
    label:
      overrideLabel !== null && overrideLabel !== undefined
        ? overrideLabel
        : protoNameToLabel(field.name),
    description: overrideDescription,
  }
}
