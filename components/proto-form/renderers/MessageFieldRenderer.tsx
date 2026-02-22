'use client'

import type { DescMessage } from '@bufbuild/protobuf'
import type { FieldRenderProps } from '@/lib/proto-form/types'

type MessageFieldProps = Omit<FieldRenderProps, 'field'> & {
  messageDesc: DescMessage
  // Passed to avoid circular import issues
  ProtoFormRenderer: React.ComponentType<{
    schema: DescMessage
    value: Record<string, unknown>
    onChange: (updates: Record<string, unknown>) => void
  }>
}

function toRecord(v: unknown): Record<string, unknown> {
  if (v !== null && v !== undefined && typeof v === 'object' && !Array.isArray(v)) {
    const result: Record<string, unknown> = {}
    Object.assign(result, v)
    return result
  }
  return {}
}

export function MessageFieldRenderer({
  messageDesc,
  label,
  description,
  value,
  onChange,
  ProtoFormRenderer,
}: MessageFieldProps) {
  const msgValue = toRecord(value)

  return (
    <div className="proto-form-field">
      <label className="proto-form-field-label">{label}</label>
      {description && (
        <p className="proto-form-field-description">{description}</p>
      )}
      <div className="proto-form-nested">
        <ProtoFormRenderer
          schema={messageDesc}
          value={msgValue}
          onChange={updates =>
            onChange({
              ...msgValue,
              ...updates,
            })
          }
        />
      </div>
    </div>
  )
}
