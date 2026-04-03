import { BodyField } from './BodyField'
import { CustomFieldEditor } from './CustomFieldEditor'
import { StatusField } from './StatusField'
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
}: GenericItemEditFormProps): React.JSX.Element {
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
          <StatusField
            config={config}
            editStatus={editStatus}
            setEditStatus={setEditStatus}
          />
        )}
      {config &&
        config.customFields.map(field => (
          <CustomFieldEditor
            key={field.name}
            fieldName={field.name}
            value={editCustomFields[field.name] || ''}
            onChange={value =>
              setEditCustomFields({ ...editCustomFields, [field.name]: value })
            }
          />
        ))}
      {hasBody && <BodyField editBody={editBody} setEditBody={setEditBody} />}
    </div>
  )
}
