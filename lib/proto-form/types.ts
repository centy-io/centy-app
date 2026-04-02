import type { DescField, DescMessage } from '@bufbuild/protobuf'

export type ProtoFormRendererType = React.ComponentType<{
  schema: DescMessage
  value: Record<string, unknown>
  onChange: (updates: Record<string, unknown>) => void
}>

export interface FieldOverride {
  label?: string
  description?: string
  hidden?: boolean
}

export interface FieldGroupRenderProps {
  value: Record<string, unknown>
  onChange: (updates: Record<string, unknown>) => void
}

export interface FieldGroup {
  key: string
  claimedFields: string[]
  title: string
  order: number
  render: (props: FieldGroupRenderProps) => React.ReactNode
}

export interface FieldRenderProps {
  field: DescField
  label: string
  description?: string
  value: unknown
  onChange: (value: unknown) => void
}
