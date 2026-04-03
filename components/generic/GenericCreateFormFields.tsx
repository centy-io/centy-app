import type { ItemTypeConfigProto } from '@/gen/centy_pb'

interface GenericCreateFormFieldsProps {
  config: ItemTypeConfigProto | null
  status: string
  setStatus: (v: string) => void
  customFields: Record<string, string>
  setCustomFields: (v: Record<string, string>) => void
}

function toDisplayLabel(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ')
}

export function GenericCreateFormFields({
  config,
  status,
  setStatus,
  customFields,
  setCustomFields,
}: GenericCreateFormFieldsProps) {
  return (
    <>
      {config &&
        config.features &&
        config.features.status &&
        config.statuses.length > 0 && (
          <div className="form-group">
            <label className="form-label" htmlFor="status">
              Status:
            </label>
            <select
              className="form-input"
              id="status"
              value={status}
              onChange={e => {
                setStatus(e.target.value)
              }}
            >
              {config.statuses.map(s => (
                <option key={s} value={s} className="form-option">
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

      {config &&
        config.customFields.map(field => (
          <div key={field.name} className="form-group">
            <label className="form-label" htmlFor={`field-${field.name}`}>
              {toDisplayLabel(field.name)}
              {field.required ? ' *' : ''}:
            </label>
            <textarea
              className="form-input"
              id={`field-${field.name}`}
              value={customFields[field.name] || ''}
              onChange={e => {
                setCustomFields({
                  ...customFields,
                  [field.name]: e.target.value,
                })
              }}
              placeholder={field.name}
              rows={3}
              required={field.required}
            />
          </div>
        ))}
    </>
  )
}
