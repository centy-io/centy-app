import type { ItemTypeConfigProto } from '@/gen/centy_pb'

interface GenericItemEditFormProps {
  config: ItemTypeConfigProto | null
  editTitle: string
  setEditTitle: (v: string) => void
  editBody: string
  setEditBody: (v: string) => void
  editStatus: string
  setEditStatus: (v: string) => void
  editCustomFields: Record<string, string>
  setEditCustomFields: (v: Record<string, string>) => void
  hasBody: boolean
}

function toLabel(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ')
}

export function GenericItemEditForm({
  config,
  editTitle,
  setEditTitle,
  editBody,
  setEditBody,
  editStatus,
  setEditStatus,
  editCustomFields,
  setEditCustomFields,
  hasBody,
}: GenericItemEditFormProps) {
  return (
    <div className="generic-item-edit-form">
      <div className="form-group">
        <label className="form-label" htmlFor="edit-title">
          Title:
        </label>
        <input
          className="form-input"
          id="edit-title"
          type="text"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
        />
      </div>
      {config &&
        config.features &&
        config.features.status &&
        config.statuses.length > 0 && (
          <div className="form-group">
            <label className="form-label" htmlFor="edit-status">
              Status:
            </label>
            <select
              className="form-input"
              id="edit-status"
              value={editStatus}
              onChange={e => setEditStatus(e.target.value)}
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
        config.customFields &&
        config.customFields.map(field => (
          <div key={field.name} className="form-group">
            <label className="form-label" htmlFor={`edit-field-${field.name}`}>
              {toLabel(field.name)}:
            </label>
            <textarea
              className="form-input"
              id={`edit-field-${field.name}`}
              value={editCustomFields[field.name] || ''}
              rows={3}
              onChange={e =>
                setEditCustomFields({
                  ...editCustomFields,
                  [field.name]: e.target.value,
                })
              }
            />
          </div>
        ))}
      {hasBody && (
        <div className="form-group">
          <label className="form-label" htmlFor="edit-body">
            Body:
          </label>
          <textarea
            className="form-input"
            id="edit-body"
            rows={6}
            value={editBody}
            onChange={e => setEditBody(e.target.value)}
          />
        </div>
      )}
    </div>
  )
}
