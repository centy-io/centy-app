'use client'

import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { SyncUsersRequestSchema, type GitContributor } from '@/gen/centy_pb'
import { useProject } from '@/components/providers/ProjectProvider'
import { isDaemonUnimplemented } from '@/lib/daemon-error'
import type { SyncState, SyncUsersModalProps } from './SyncUsersModal.types'

function handleSyncError(
  err: unknown,
  setError: (e: string) => void,
  setState: (s: SyncState) => void
) {
  const message =
    err instanceof Error ? err.message : 'Failed to connect to daemon'
  if (isDaemonUnimplemented(message)) {
    setError(
      'User sync is not yet available. Please update your daemon to the latest version.'
    )
  } else {
    setError(message)
  }
  setState('error')
}

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
    setState('loading')
    setError(null)
    try {
      const request = create(SyncUsersRequestSchema, {
        projectPath,
        dryRun: true,
      })
      const response = await centyClient.syncUsers(request)
      if (response.success) {
        setWouldCreate(response.wouldCreate)
        setWouldSkip(response.wouldSkip)
        setState('preview')
      } else {
        const errorMsg = response.error || 'Failed to fetch git contributors'
        if (isDaemonUnimplemented(errorMsg)) {
          setError(
            'User sync is not yet available. Please update your daemon to the latest version.'
          )
        } else {
          setError(errorMsg)
        }
        setState('error')
      }
    } catch (err) {
      handleSyncError(err, setError, setState)
    }
  }, [projectPath])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    void fetchPreview()
  }, [])

  const handleSync = useCallback(async () => {
    if (!projectPath) return
    setState('syncing')
    setError(null)
    try {
      const request = create(SyncUsersRequestSchema, {
        projectPath,
        dryRun: false,
      })
      const response = await centyClient.syncUsers(request)
      if (response.success) {
        setCreated(response.created)
        setSkipped(response.skipped)
        setSyncErrors(response.errors)
        setState('success')
      } else {
        const errorMsg = response.error || 'Failed to sync users'
        if (isDaemonUnimplemented(errorMsg)) {
          setError(
            'User sync is not yet available. Please update your daemon to the latest version.'
          )
        } else {
          setError(errorMsg)
        }
        setState('error')
      }
    } catch (err) {
      handleSyncError(err, setError, setState)
    }
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
