interface ArchivedBannerProps {
  restoring: boolean
  onRestore: () => void
}

export function ArchivedBanner({
  restoring,
  onRestore,
}: ArchivedBannerProps): React.JSX.Element {
  return (
    <div className="deleted-item-banner">
      <span className="deleted-item-banner-text">
        This item has been archived.
      </span>
      <button onClick={onRestore} disabled={restoring} className="restore-btn">
        {restoring ? 'Restoring...' : 'Restore'}
      </button>
    </div>
  )
}
