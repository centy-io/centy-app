/* eslint-disable max-lines */
'use client'

import { useState, useEffect, useCallback } from 'react'
import type { DaemonStatus } from './DaemonStatusProvider.types'
import {
  CHECK_INTERVAL_MS,
  createFallbackEditors,
  applyDemoState,
  buildDemoUrl,
  buildDemoRedirectUrl,
} from './DaemonStatusProvider.helpers'
import {
  centyClient,
  enableDemoMode,
  disableDemoMode,
  isDemoMode,
} from '@/lib/grpc/client'
import { DEMO_ORG_SLUG, DEMO_PROJECT_PATH } from '@/lib/grpc/demo-data'
import type { EditorInfo } from '@/gen/centy_pb'
import { trackDaemonConnection } from '@/lib/metrics'

type SetStatus = (s: DaemonStatus) => void
type SetBool = (v: boolean | null) => void
type SetEditors = (e: EditorInfo[]) => void

function useDemoModeInit(
  setStatus: SetStatus,
  setVscodeAvailable: SetBool,
  setEditors: SetEditors,
  setHasMounted: (v: boolean) => void
) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('demo') === 'true' && !isDemoMode()) {
        enableDemoMode()
        applyDemoState(setStatus, setVscodeAvailable, setEditors)
        window.history.replaceState(
          {},
          '',
          buildDemoUrl(DEMO_ORG_SLUG, DEMO_PROJECT_PATH)
        )
      } else if (isDemoMode()) {
        applyDemoState(setStatus, setVscodeAvailable, setEditors)
      }
      setHasMounted(true)
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [setStatus, setVscodeAvailable, setEditors, setHasMounted])
}

function useCheckDaemon(
  setStatus: SetStatus,
  setVscodeAvailable: SetBool,
  setEditors: SetEditors,
  setLastChecked: (d: Date) => void
) {
  return useCallback(async () => {
    if (isDemoMode()) {
      applyDemoState(setStatus, setVscodeAvailable, setEditors)
      return
    }
    setStatus('checking')
    try {
      const daemonInfo = await centyClient.getDaemonInfo({})
      setStatus('connected')
      setVscodeAvailable(daemonInfo.vscodeAvailable)
      trackDaemonConnection(true, false)
      try {
        const resp = await centyClient.getSupportedEditors({})
        setEditors(resp.editors)
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

export function useDaemonStatusState() {
  const [status, setStatus] = useState<DaemonStatus>('checking')
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [hasMounted, setHasMounted] = useState(false)
  const [vscodeAvailable, setVscodeAvailable] = useState<boolean | null>(null)
  const [editors, setEditors] = useState<EditorInfo[]>([])

  useDemoModeInit(setStatus, setVscodeAvailable, setEditors, setHasMounted)
  const checkDaemonStatus = useCheckDaemon(
    setStatus,
    setVscodeAvailable,
    setEditors,
    setLastChecked
  )

  const enterDemoMode = useCallback(() => {
    enableDemoMode()
    setStatus('demo')
    trackDaemonConnection(true, true)
    window.location.href = buildDemoRedirectUrl(
      DEMO_ORG_SLUG,
      DEMO_PROJECT_PATH
    )
  }, [])

  const exitDemoMode = useCallback(() => {
    disableDemoMode()
    setStatus('checking')
    setTimeout(() => checkDaemonStatus(), 100)
  }, [checkDaemonStatus])

  useEffect(() => {
    if (!hasMounted || isDemoMode()) return
    const timeoutId = setTimeout(checkDaemonStatus, 0)
    const interval = setInterval(checkDaemonStatus, CHECK_INTERVAL_MS)
    return () => {
      clearTimeout(timeoutId)
      clearInterval(interval)
    }
  }, [hasMounted, checkDaemonStatus])

  return {
    status,
    lastChecked,
    checkDaemonStatus,
    enterDemoMode,
    exitDemoMode,
    vscodeAvailable,
    editors,
  }
}
