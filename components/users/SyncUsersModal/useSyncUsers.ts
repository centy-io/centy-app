'use client'

import { useState, useCallback, useEffect } from 'react'
import type { GitContributor } from '@/gen/centy_pb'
import { useProject } from '@/components/providers/ProjectProvider'
import type { SyncState, SyncUsersModalProps } from './SyncUsersModal.types'
import { fetchSyncPreview, executeSyncUsers } from './syncUsersApi'

export function useSyncUsers({ onClose, onSynced }: SyncUsersModalProps) {
  const { projectPath } = useProject()
  const [state, setState] = useState<SyncState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [wouldCreate, setWouldCreate] = useState<GitContributor[]>([])
  const [wouldSkip, setWouldSkip] = useState<GitContributor[]>([])
  const [created, setCreated] = useState<string[]>([])
  const [skipped, setSkipped] = useState<string[]>([])
  const [syncErrors, setSyncErrors] = useState<string[]>([])

  const fetchPreview = useCallback(async () => {
    if (!projectPath) return
    await fetchSyncPreview(projectPath, {
      setState,
      setError,
      setWouldCreate,
      setWouldSkip,
    })
  }, [projectPath])

  useEffect(() => {
    void fetchPreview()
    // Run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSync = useCallback(async () => {
    if (!projectPath) return
    await executeSyncUsers(projectPath, {
      setState,
      setError,
      setCreated,
      setSkipped,
      setSyncErrors,
    })
  }, [projectPath])

  const handleClose = useCallback(() => {
    if (state === 'success') {
      onSynced(created.length)
    } else {
      onClose()
    }
  }, [state, created.length, onSynced, onClose])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleClose])

  return {
    state,
    error,
    wouldCreate,
    wouldSkip,
    created,
    skipped,
    syncErrors,
    fetchPreview,
    handleSync,
    handleClose,
  }
}
