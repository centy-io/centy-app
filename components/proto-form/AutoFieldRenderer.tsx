'use client'

import type { DescMessage } from '@bufbuild/protobuf'
import { ScalarFieldRenderer } from './renderers/ScalarFieldRenderer'
import { MapFieldRenderer } from './renderers/MapFieldRenderer'
import { ListFieldRenderer } from './renderers/ListFieldRenderer'
import { MessageFieldRenderer } from './renderers/MessageFieldRenderer'
import { MessageListFieldRenderer } from './renderers/MessageListFieldRenderer'
import type { FieldRenderProps } from '@/lib/proto-form/types'

type ProtoFormRendererType = React.ComponentType<{
  schema: DescMessage
  value: Record<string, unknown>
  onChange: (updates: Record<string, unknown>) => void
}>

interface AutoFieldRendererProps extends FieldRenderProps {
  ProtoFormRenderer: ProtoFormRendererType
}

type SharedProps = Pick<
  AutoFieldRendererProps,
  'label' | 'description' | 'value' | 'onChange' | 'ProtoFormRenderer'
>

function renderList(
  field: Extract<FieldRenderProps['field'], { fieldKind: 'list' }>,
  shared: SharedProps
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

export function AutoFieldRenderer({
  field,
  label,
  description,
  value,
  onChange,
  ProtoFormRenderer,
}: AutoFieldRendererProps) {
  if (field.fieldKind === 'scalar') {
    return (
      <ScalarFieldRenderer
        scalar={field.scalar}
        label={label}
        description={description}
        value={value}
        onChange={onChange}
      />
    )
  }

  if (field.fieldKind === 'map') {
    return (
      <MapFieldRenderer
        label={label}
        description={description}
        value={value}
        onChange={onChange}
      />
    )
  }

  if (field.fieldKind === 'list') {
    return renderList(field, {
      label,
      description,
      value,
      onChange,
      ProtoFormRenderer,
    })
  }

  if (field.fieldKind === 'message') {
    return (
      <MessageFieldRenderer
        messageDesc={field.message}
        label={label}
        description={description}
        value={value}
        onChange={onChange}
        ProtoFormRenderer={ProtoFormRenderer}
      />
    )
  }

  // enum scalar — render as text input fallback
  return (
    <div className="proto-form-field">
      <label className="proto-form-field-label">{label}</label>
      {description && (
        <p className="proto-form-field-description">{description}</p>
      )}
      <input
        type="text"
        className="proto-form-input"
        value={String(value !== null && value !== undefined ? value : '')}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}
