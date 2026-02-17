import type { GitContributor } from '@/gen/centy_pb'

interface ContributorListProps {
  title: string
  contributors: GitContributor[]
  itemClassName: string
}

function ContributorList({
  title,
  contributors,
  itemClassName,
}: ContributorListProps) {
  return (
    <div className="sync-section">
      <h4>
        {title} ({contributors.length})
      </h4>
      <ul className="contributor-list">
        {contributors.map((c, i) => (
          <li key={i} className={`contributor-item ${itemClassName}`}>
            <span className="contributor-name">{c.name}</span>
            <span className="contributor-email">{c.email}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

interface SyncPreviewProps {
  wouldCreate: GitContributor[]
  wouldSkip: GitContributor[]
}

export function SyncPreview({ wouldCreate, wouldSkip }: SyncPreviewProps) {
  if (wouldCreate.length === 0 && wouldSkip.length === 0) {
    return (
      <div className="sync-empty">
        <p>No git contributors found in this repository.</p>
      </div>
    )
  }
  if (wouldCreate.length === 0) {
    return (
      <div className="sync-up-to-date">
        <p>All git contributors are already in the users list.</p>
      </div>
    )
  }
  return (
    <>
      <ContributorList
        title="Will Create"
        contributors={wouldCreate}
        itemClassName="create"
      />
      {wouldSkip.length > 0 && (
        <ContributorList
          title="Will Skip"
          contributors={wouldSkip}
          itemClassName="skip"
        />
      )}
    </>
  )
}
