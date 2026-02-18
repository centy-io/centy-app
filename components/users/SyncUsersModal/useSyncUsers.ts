'use client'

import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { SyncUsersRequestSchema, type GitContributor } from '@/gen/centy_pb'
import { useProject } from '@/components/providers/ProjectProvider'
import { isDaemonUnimplemented } from '@/lib/daemon-error'

export type SyncState = 'loading' | 'preview' | 'syncing' | 'success' | 'error'

function formatError(err: unknown): string {
  const msg = err instanceof Error ? err.message : 'Failed to connect to daemon'
  return isDaemonUnimplemented(msg)
    ? 'User sync is not yet available. Please update your daemon to the latest version.'
    : msg
}

export function useSyncUsers() {
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
      const req = create(SyncUsersRequestSchema, { projectPath, dryRun: true })
      const res = await centyClient.syncUsers(req)
      if (res.success) {
        setWouldCreate(res.wouldCreate)
        setWouldSkip(res.wouldSkip)
        setState('preview')
      } else {
        setError(formatError(new Error(res.error || 'Failed to fetch')))
        setState('error')
      }
    } catch (err) {
      setError(formatError(err))
      setState('error')
    }
  }, [projectPath])

  useEffect(() => {
    void fetchPreview()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSync = useCallback(async () => {
    if (!projectPath) return
    setState('syncing')
    setError(null)
    try {
      const req = create(SyncUsersRequestSchema, { projectPath, dryRun: false })
      const res = await centyClient.syncUsers(req)
      if (res.success) {
        setCreated(res.created)
        setSkipped(res.skipped)
        setSyncErrors(res.errors)
        setState('success')
      } else {
        setError(formatError(new Error(res.error || 'Failed to sync')))
        setState('error')
      }
    } catch (err) {
      setError(formatError(err))
      setState('error')
    }
  }, [projectPath])

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
  }
}
