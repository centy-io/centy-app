'use client'

import { useCallback } from 'react'
import { centyClient, isDemoMode } from '@/lib/grpc/client'
import { trackDaemonConnection } from '@/lib/metrics'
import type { DaemonStatusContextType } from './DaemonStatusProvider.types'
import {
  createDemoEditors,
  getTestVscodeOverride,
} from './DaemonStatusProvider.helpers'
import { createFallbackEditors } from './daemonFallbackEditors'

export function useDaemonCheck(
  setStatus: (s: DaemonStatusContextType['status']) => void,
  setVscodeAvailable: (v: boolean | null) => void,
  setEditors: (e: DaemonStatusContextType['editors']) => void,
  setLastChecked: (d: Date) => void
) {
  return useCallback(async () => {
    if (isDemoMode()) {
      setStatus('demo')
      setVscodeAvailable(getTestVscodeOverride() ?? true)
      setEditors(createDemoEditors())
      return
    }
    setStatus('checking')
    try {
      const daemonInfo = await centyClient.getDaemonInfo({})
      setStatus('connected')
      setVscodeAvailable(daemonInfo.vscodeAvailable)
      trackDaemonConnection(true, false)
      try {
        const editorsResponse = await centyClient.getSupportedEditors({})
        setEditors(editorsResponse.editors)
      } catch {
        setEditors(createFallbackEditors(daemonInfo.vscodeAvailable))
      }
    } catch {
      setStatus('disconnected')
      setVscodeAvailable(null)
      setEditors([])
      trackDaemonConnection(false, false)
    }
    setLastChecked(new Date())
  }, [setStatus, setVscodeAvailable, setEditors, setLastChecked])
}
