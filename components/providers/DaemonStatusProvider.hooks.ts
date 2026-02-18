'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  centyClient,
  enableDemoMode,
  disableDemoMode,
  isDemoMode,
} from '@/lib/grpc/client'
import { DEMO_ORG_SLUG, DEMO_PROJECT_PATH } from '@/lib/grpc/demo-data'
import type { EditorInfo } from '@/gen/centy_pb'
import { trackDaemonConnection } from '@/lib/metrics'
import type { DaemonStatus } from './DaemonStatusProvider.types'
import {
  CHECK_INTERVAL_MS,
  createFallbackEditors,
  applyDemoState,
  buildDemoUrl,
  buildDemoRedirectUrl,
} from './DaemonStatusProvider.helpers'

export function useDaemonStatusState() {
  const [status, setStatus] = useState<DaemonStatus>('checking')
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [hasMounted, setHasMounted] = useState(false)
  const [vscodeAvailable, setVscodeAvailable] = useState<boolean | null>(null)
  const [editors, setEditors] = useState<EditorInfo[]>([])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('demo') === 'true' && !isDemoMode()) {
        enableDemoMode()
        applyDemoState(setStatus, setVscodeAvailable, setEditors)
        const newUrl = buildDemoUrl(DEMO_ORG_SLUG, DEMO_PROJECT_PATH)
        window.history.replaceState({}, '', newUrl)
      } else if (isDemoMode()) {
        applyDemoState(setStatus, setVscodeAvailable, setEditors)
      }
      setHasMounted(true)
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [])

  const checkDaemonStatus = useCallback(async () => {
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
  }, [])

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!hasMounted || isDemoMode()) return
    const timeoutId = setTimeout(checkDaemonStatus, 0)
    const interval = setInterval(checkDaemonStatus, CHECK_INTERVAL_MS)
    return () => {
      clearTimeout(timeoutId)
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMounted])

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
