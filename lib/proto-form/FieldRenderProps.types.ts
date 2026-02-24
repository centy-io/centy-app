import type { DescField } from '@bufbuild/protobuf'

export interface FieldRenderProps {
  field: DescField
  label: string
  description?: string
  value: unknown
  onChange: (value: unknown) => void
}
