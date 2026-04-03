'use client'

import { useCallback, useEffect } from 'react'
import { useSyncUsers } from './useSyncUsers'
import { SyncModalContent } from './SyncModalContent'
import { SyncModalActions } from './SyncModalActions'

interface SyncUsersModalProps {
  onClose: () => void
  onSynced: (createdCount: number) => void
}

export function SyncUsersModal({ onClose, onSynced }: SyncUsersModalProps) {
  const sync = useSyncUsers()

  const handleClose = useCallback(() => {
    if (sync.state === 'success') {
      onSynced(sync.created.length)
    } else {
      onClose()
    }
  }, [sync.state, sync.created.length, onSynced, onClose])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleClose])

  return (
    <div className="sync-modal-overlay" onClick={handleClose}>
      <div
        className="sync-modal"
        onClick={e => {
          e.stopPropagation()
        }}
      >
        <div className="sync-modal-header">
          <h3 className="sync-modal-title">Sync Users from Git</h3>
          <button className="close-btn" onClick={handleClose}>
            &times;
          </button>
        </div>
        <SyncModalContent
          state={sync.state}
          error={sync.error}
          wouldCreate={sync.wouldCreate}
          wouldSkip={sync.wouldSkip}
          created={sync.created}
          skipped={sync.skipped}
          syncErrors={sync.syncErrors}
          fetchPreview={() => {
            void sync.fetchPreview()
          }}
        />
        <SyncModalActions
          state={sync.state}
          wouldCreateCount={sync.wouldCreate.length}
          handleClose={handleClose}
          handleSync={() => {
            void sync.handleSync()
          }}
        />
      </div>
    </div>
  )
}
