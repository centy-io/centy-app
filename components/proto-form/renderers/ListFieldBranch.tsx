'use client'

import { ListFieldRenderer } from './ListFieldRenderer'
import { MessageListFieldRenderer } from './MessageListFieldRenderer'
import type {
  FieldRenderProps,
  ProtoFormRendererType,
} from '@/lib/proto-form/types'

type ListField = Extract<FieldRenderProps['field'], { fieldKind: 'list' }>

interface ListFieldBranchProps {
  field: ListField
  label: string
  description?: string
  value: unknown
  onChange: (value: unknown) => void
  ProtoFormRenderer: ProtoFormRendererType
}

export function ListFieldBranch({
  field,
  label,
  description,
  value,
  onChange,
  ProtoFormRenderer,
}: ListFieldBranchProps) {
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
  // scalar list or enum list — render as scalar list
  return (
    <ListFieldRenderer
      label={label}
      description={description}
      value={value}
      onChange={onChange}
    />
  )
}
