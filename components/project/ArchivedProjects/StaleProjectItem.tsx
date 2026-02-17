'use client'

interface StaleProjectItemProps {
  path: string
  confirmRemove: string | null
  setConfirmRemove: (v: string | null) => void
  handleRemoveStale: (path: string) => void
}

export function StaleProjectItem(props: StaleProjectItemProps) {
  const { path, confirmRemove, setConfirmRemove, handleRemoveStale } = props
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
              onClick={() => handleRemoveStale(path)}
            >
              Yes
            </button>
            <button
              className="confirm-no-btn"
              onClick={() => setConfirmRemove(null)}
            >
              No
            </button>
          </>
        ) : (
          <button className="remove-btn" onClick={() => setConfirmRemove(path)}>
            Remove
          </button>
        )}
      </div>
    </li>
  )
}
