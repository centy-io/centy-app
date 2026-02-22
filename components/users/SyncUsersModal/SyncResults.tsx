'use client'

interface SyncResultsProps {
  created: string[]
  skipped: string[]
  syncErrors: string[]
}

export function SyncResults({
  created,
  skipped,
  syncErrors,
}: SyncResultsProps) {
  return (
    <div className="sync-results">
      <div className="sync-success-message">Sync completed successfully!</div>
      {created.length > 0 && (
        <div className="sync-section">
          <h4 className="sync-section-title">Created ({created.length})</h4>
          <ul className="result-list">
            {created.map((userId, i) => (
              <li key={i} className="result-item created">
                {userId}
              </li>
            ))}
          </ul>
        </div>
      )}
      {skipped.length > 0 && (
        <div className="sync-section">
          <h4 className="sync-section-title">Skipped ({skipped.length})</h4>
          <ul className="result-list">
            {skipped.map((email, i) => (
              <li key={i} className="result-item skipped">
                {email}
              </li>
            ))}
          </ul>
        </div>
      )}
      {syncErrors.length > 0 && (
        <div className="sync-section">
          <h4 className="sync-section-title">Errors ({syncErrors.length})</h4>
          <ul className="result-list">
            {syncErrors.map((err, i) => (
              <li key={i} className="result-item error">
                {err}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
