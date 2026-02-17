export interface SyncUsersModalProps {
  onClose: () => void
  onSynced: (createdCount: number) => void
}

export type SyncState = 'loading' | 'preview' | 'syncing' | 'success' | 'error'
