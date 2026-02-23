import type { DescMessage } from '@bufbuild/protobuf'
import type { FieldRenderProps } from '@/lib/proto-form/FieldRenderProps.types'

export interface MessageListFieldProps extends Omit<FieldRenderProps, 'field'> {
  messageDesc: DescMessage
  ProtoFormRenderer: React.ComponentType<{
    schema: DescMessage
    value: Record<string, unknown>
    onChange: (updates: Record<string, unknown>) => void
  }>
}
