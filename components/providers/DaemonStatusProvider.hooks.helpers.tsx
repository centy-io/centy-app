'use client'

import { useState, useCallback, useMemo } from 'react'
import { applyDemoState } from './DaemonStatusProvider.helpers'
import type { DaemonStatus } from './DaemonStatusProvider.types'
import { centyClient, isDemoMode } from '@/lib/grpc/client'
import type { EditorInfo } from '@/gen/centy_pb'
import { trackDaemonConnection } from '@/lib/metrics'
import { fetchLatestDaemonVersion } from '@/lib/fetchLatestDaemonVersion'

export interface EditorState {
  editors: EditorInfo[]
  vscodeAvailable: boolean | null
  setEditors: React.Dispatch<React.SetStateAction<EditorInfo[]>>
  setEditorsLoaded: React.Dispatch<React.SetStateAction<boolean>>
}

export function useEditorState(): EditorState {
  const [editors, setEditors] = useState<EditorInfo[]>([])
  const [editorsLoaded, setEditorsLoaded] = useState(false)

  const vscodeAvailable = useMemo<boolean | null>(() => {
    if (!editorsLoaded) return null
    return editors.some(e => e.editorId === 'vscode' && e.available)
  }, [editors, editorsLoaded])

  return { editors, vscodeAvailable, setEditors, setEditorsLoaded }
}

export interface DaemonCheckArgs {
  setStatus: React.Dispatch<React.SetStateAction<DaemonStatus>>
  setDaemonVersion: React.Dispatch<React.SetStateAction<string | null>>
  setLatestDaemonVersion: React.Dispatch<React.SetStateAction<string | null>>
  setLastChecked: React.Dispatch<React.SetStateAction<Date | null>>
  setEditors: React.Dispatch<React.SetStateAction<EditorInfo[]>>
  setEditorsLoaded: React.Dispatch<React.SetStateAction<boolean>>
}

export function useCheckDaemonStatus(
  args: DaemonCheckArgs
): () => Promise<void> {
  const {
    setStatus,
    setDaemonVersion,
    setLatestDaemonVersion,
    setLastChecked,
    setEditors,
    setEditorsLoaded,
  } = args

  return useCallback(async () => {
    if (isDemoMode()) {
      applyDemoState(setStatus, setEditors, setEditorsLoaded)
      return
    }
    setStatus('checking')
    try {
      const daemonInfo = await centyClient.getDaemonInfo({})
      setStatus('connected')
      setDaemonVersion(daemonInfo.version || null)
      trackDaemonConnection(true, false)
      const resp = await centyClient.getSupportedEditors({})
      setEditors(resp.editors)
      setEditorsLoaded(true)
      const latest = await fetchLatestDaemonVersion()
      setLatestDaemonVersion(latest)
    } catch {
      setStatus('disconnected')
      setEditors([])
      setEditorsLoaded(false)
      setDaemonVersion(null)
      trackDaemonConnection(false, false)
    }
    setLastChecked(new Date())
  }, [
    setStatus,
    setDaemonVersion,
    setLatestDaemonVersion,
    setLastChecked,
    setEditors,
    setEditorsLoaded,
  ])
}
