'use client'

interface ArchivedStaleItemProps {
  path: string
  confirmRemove: string | null
  onRemoveStale: (path: string) => void
  onSetConfirmRemove: (v: string | null) => void
}

export function ArchivedStaleItem({
  path,
  confirmRemove,
  onRemoveStale,
  onSetConfirmRemove,
}: ArchivedStaleItemProps) {
  return (
    <li className="archived-item stale">
      <div className="archived-item-info">
        <span className="archived-item-name">
          {path.split('/').pop() || path}
        </span>
        <span className="archived-item-path">{path}</span>
        <div className="archived-item-stats">
          <span className="stale-badge">Not tracked by daemon</span>
        </div>
      </div>
      <div className="archived-item-actions">
        {confirmRemove === path ? (
          <>
            <span className="confirm-text">Remove permanently?</span>
            <button
              className="confirm-yes-btn"
              onClick={() => onRemoveStale(path)}
            >
              Yes
            </button>
            <button
              className="confirm-no-btn"
              onClick={() => onSetConfirmRemove(null)}
            >
              No
            </button>
          </>
        ) : (
          <button
            className="remove-btn"
            onClick={() => onSetConfirmRemove(path)}
          >
            Remove
          </button>
        )}
      </div>
    </li>
  )
}
