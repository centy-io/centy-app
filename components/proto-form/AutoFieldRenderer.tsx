'use client'

import { ScalarFieldRenderer } from './renderers/ScalarFieldRenderer'
import { MapFieldRenderer } from './renderers/MapFieldRenderer'
import { MessageFieldRenderer } from './renderers/MessageFieldRenderer'
import { ListFieldBranch } from './renderers/ListFieldBranch'
import type {
  FieldRenderProps,
  ProtoFormRendererType,
} from '@/lib/proto-form/types'

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
    return (
      <ListFieldBranch
        field={field}
        label={label}
        description={description}
        value={value}
        onChange={onChange}
        ProtoFormRenderer={ProtoFormRenderer}
      />
    )
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
