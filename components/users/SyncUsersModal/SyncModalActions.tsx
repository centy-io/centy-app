import type { SyncState } from './SyncUsersModal.types'

interface SyncModalActionsProps {
  state: SyncState
  wouldCreateCount: number
  handleClose: () => void
  handleSync: () => void
}

export function SyncModalActions({
  state,
  wouldCreateCount,
  handleClose,
  handleSync,
}: SyncModalActionsProps) {
  return (
    <div className="sync-modal-actions">
      {state === 'preview' && wouldCreateCount > 0 && (
        <>
          <button onClick={handleClose} className="cancel-btn">
            Cancel
          </button>
          <button onClick={handleSync} className="sync-confirm-btn">
            Create {wouldCreateCount} User
            {wouldCreateCount !== 1 ? 's' : ''}
          </button>
        </>
      )}
      {state === 'preview' && wouldCreateCount === 0 && (
        <button onClick={handleClose} className="done-btn">
          Done
        </button>
      )}
      {state === 'success' && (
        <button onClick={handleClose} className="done-btn">
          Done
        </button>
      )}
      {state === 'error' && (
        <button onClick={handleClose} className="cancel-btn">
          Close
        </button>
      )}
    </div>
  )
}
