'use client'

interface NumericFieldProps {
  label: string
  description?: string
  value: unknown
  is64bit: boolean
  onChange: (value: unknown) => void
}

export function NumericField({
  label,
  description,
  value,
  is64bit,
  onChange,
}: NumericFieldProps) {
  const displayValue = is64bit
    ? typeof value === 'bigint'
      ? String(value)
      : ''
    : typeof value === 'number'
      ? value
      : ''
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    if (is64bit) {
      onChange(raw === '' ? BigInt(0) : BigInt(raw))
    } else {
      onChange(raw === '' ? 0 : Number(raw))
    }
  }
  return (
    <div className="proto-form-field">
      <label className="proto-form-field-label">{label}</label>
      {description && (
        <p className="proto-form-field-description">{description}</p>
      )}
      <input
        type="number"
        className="proto-form-input"
        value={String(displayValue)}
        onChange={handleChange}
      />
    </div>
  )
}
