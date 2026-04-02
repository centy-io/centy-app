'use client'

import type { DescMessage } from '@bufbuild/protobuf'
import { ListFieldRenderer } from './renderers/ListFieldRenderer'
import { MessageListFieldRenderer } from './renderers/MessageListFieldRenderer'
import type { FieldRenderProps } from '@/lib/proto-form/FieldRenderProps.types'

interface RenderListSharedProps {
  label: string
  description?: string
  value: unknown
  onChange: (v: unknown) => void
  ProtoFormRenderer: React.ComponentType<{
    schema: DescMessage
    value: Record<string, unknown>
    onChange: (updates: Record<string, unknown>) => void
  }>
}

export function renderListField(
  field: Extract<FieldRenderProps['field'], { fieldKind: 'list' }>,
  shared: RenderListSharedProps
) {
  const { label, description, value, onChange, ProtoFormRenderer } = shared
  if (field.listKind === 'message') {
    return (
      <MessageListFieldRenderer
        messageDesc={field.message}
        label={label}
        description={description}
        value={value}
        onChange={onChange}
        ProtoFormRenderer={ProtoFormRenderer}
      />
    )
  }
  return (
    <ListFieldRenderer
      label={label}
      description={description}
      value={value}
      onChange={onChange}
    />
  )
}
