import type { ItemTypeConfigProto } from '@/gen/centy_pb'

interface StatusFieldProps {
  config: ItemTypeConfigProto
  editStatus: string
  setEditStatus: (v: string) => void
}

export function StatusField({
  config,
  editStatus,
  setEditStatus,
}: StatusFieldProps): React.JSX.Element {
  return (
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
  )
}
