interface ResultSectionProps {
  title: string
  items: string[]
  itemClassName: string
}

function ResultSection({ title, items, itemClassName }: ResultSectionProps) {
  if (items.length === 0) return null
  return (
    <div className="sync-section">
      <h4>
        {title} ({items.length})
      </h4>
      <ul className="result-list">
        {items.map((item, i) => (
          <li key={i} className={`result-item ${itemClassName}`}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

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
      <ResultSection title="Created" items={created} itemClassName="created" />
      <ResultSection title="Skipped" items={skipped} itemClassName="skipped" />
      <ResultSection title="Errors" items={syncErrors} itemClassName="error" />
    </div>
  )
}
