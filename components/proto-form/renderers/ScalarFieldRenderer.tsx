'use client'

import { ScalarType } from '@bufbuild/protobuf'
import { NumericField } from './NumericField'
import type { FieldRenderProps } from '@/lib/proto-form/FieldRenderProps.types'

interface ScalarFieldProps extends Omit<FieldRenderProps, 'field'> {
  scalar: ScalarType
}

export function ScalarFieldRenderer({
  scalar,
  label,
  description,
  value,
  onChange,
}: ScalarFieldProps) {
  if (scalar === ScalarType.BOOL) {
    return (
      <label className="proto-form-checkbox-label">
        <input
          type="checkbox"
          className="proto-form-checkbox"
          checked={Boolean(value)}
          onChange={e => onChange(e.target.checked)}
        />
        <span className="proto-form-checkbox-text">
          <strong className="proto-form-field-label">{label}</strong>
          {description && (
            <span className="proto-form-field-description">{description}</span>
          )}
        </span>
      </label>
    )
  }

  const is64bit =
    scalar === ScalarType.INT64 ||
    scalar === ScalarType.UINT64 ||
    scalar === ScalarType.SINT64 ||
    scalar === ScalarType.FIXED64 ||
    scalar === ScalarType.SFIXED64

  const isNumeric =
    is64bit ||
    scalar === ScalarType.INT32 ||
    scalar === ScalarType.UINT32 ||
    scalar === ScalarType.SINT32 ||
    scalar === ScalarType.FIXED32 ||
    scalar === ScalarType.SFIXED32 ||
    scalar === ScalarType.FLOAT ||
    scalar === ScalarType.DOUBLE

  if (isNumeric) {
    return (
      <NumericField
        label={label}
        description={description}
        value={value}
        is64bit={is64bit}
        onChange={onChange}
      />
    )
  }

  // STRING, BYTES → text input
  return (
    <div className="proto-form-field">
      <label className="proto-form-field-label">{label}</label>
      {description && (
        <p className="proto-form-field-description">{description}</p>
      )}
      <input
        type="text"
        className="proto-form-input"
        value={String(value ?? '')}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}
