import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { SyncUsersRequestSchema, type GitContributor } from '@/gen/centy_pb'
import type { SyncState } from './SyncUsersModal.types'
import { handleSyncError, handleResponseError } from './syncErrorHandler'

interface PreviewCallbacks {
  setState: (s: SyncState) => void
  setError: (e: string | null) => void
  setWouldCreate: (v: GitContributor[]) => void
  setWouldSkip: (v: GitContributor[]) => void
}

export async function fetchSyncPreview(
  projectPath: string,
  callbacks: PreviewCallbacks
) {
  const { setState, setError, setWouldCreate, setWouldSkip } = callbacks
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
      handleResponseError(
        response.error || 'Failed to fetch git contributors',
        setError,
        setState
      )
    }
  } catch (err) {
    handleSyncError(err, setError, setState)
  }
}

interface SyncCallbacks {
  setState: (s: SyncState) => void
  setError: (e: string | null) => void
  setCreated: (v: string[]) => void
  setSkipped: (v: string[]) => void
  setSyncErrors: (v: string[]) => void
}

export async function executeSyncUsers(
  projectPath: string,
  callbacks: SyncCallbacks
) {
  const { setState, setError, setCreated, setSkipped, setSyncErrors } =
    callbacks
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
      handleResponseError(
        response.error || 'Failed to sync users',
        setError,
        setState
      )
    }
  } catch (err) {
    handleSyncError(err, setError, setState)
  }
}
