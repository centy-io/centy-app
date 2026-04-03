'use client'

import type { DescMessage } from '@bufbuild/protobuf'
import { ScalarFieldRenderer } from './renderers/ScalarFieldRenderer'
import { MapFieldRenderer } from './renderers/MapFieldRenderer'
import { MessageFieldRenderer } from './renderers/MessageFieldRenderer'
import { renderListField } from './renderListField'
import type { FieldRenderProps } from '@/lib/proto-form/FieldRenderProps.types'

type ProtoFormRendererType = React.ComponentType<{
  schema: DescMessage
  value: Record<string, unknown>
  onChange: (updates: Record<string, unknown>) => void
}>

interface AutoFieldRendererProps extends FieldRenderProps {
  ProtoFormRenderer: ProtoFormRendererType
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
    return renderListField(field, {
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
        value={
          typeof value === 'number' || typeof value === 'string'
            ? String(value)
            : ''
        }
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}
