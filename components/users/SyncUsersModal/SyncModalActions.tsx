'use client'

import type { useSyncUsers } from './useSyncUsers'

export function SyncModalActions({
  sync,
  onClose,
}: {
  sync: ReturnType<typeof useSyncUsers>
  onClose: () => void
}) {
  return (
    <div className="sync-modal-actions">
      {sync.state === 'preview' && sync.wouldCreate.length > 0 && (
        <>
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button onClick={sync.handleSync} className="sync-confirm-btn">
            Create {sync.wouldCreate.length} User
            {sync.wouldCreate.length !== 1 ? 's' : ''}
          </button>
        </>
      )}
      {sync.state === 'preview' && sync.wouldCreate.length === 0 && (
        <button onClick={onClose} className="done-btn">
          Done
        </button>
      )}
      {sync.state === 'success' && (
        <button onClick={onClose} className="done-btn">
          Done
        </button>
      )}
      {sync.state === 'error' && (
        <button onClick={onClose} className="cancel-btn">
          Close
        </button>
      )}
    </div>
  )
}
