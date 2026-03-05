'use client'

import { useState, useEffect, useCallback } from 'react'
import type { DaemonStatus } from './DaemonStatusProvider.types'
import {
  CHECK_INTERVAL_MS,
  createFallbackEditors,
  applyDemoState,
  buildDemoUrl,
  buildDemoRedirectUrl,
  initializeDemoFromUrl,
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
import { fetchLatestDaemonVersion } from '@/lib/fetchLatestDaemonVersion'

// eslint-disable-next-line max-lines-per-function
export function useDaemonStatusState() {
  const [status, setStatus] = useState<DaemonStatus>('checking')
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [hasMounted, setHasMounted] = useState(false)
  const [vscodeAvailable, setVscodeAvailable] = useState<boolean | null>(null)
  const [editors, setEditors] = useState<EditorInfo[]>([])
  const [daemonVersion, setDaemonVersion] = useState<string | null>(null)
  const [latestDaemonVersion, setLatestDaemonVersion] = useState<string | null>(
    null
  )

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      initializeDemoFromUrl(setStatus, setVscodeAvailable, setEditors)
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
      setDaemonVersion(daemonInfo.version || null)
      trackDaemonConnection(true, false)
      const resp = await centyClient.getSupportedEditors({}).catch(() => null)
      setEditors(
        resp ? resp.editors : createFallbackEditors(daemonInfo.vscodeAvailable)
      )
      const latest = await fetchLatestDaemonVersion()
      setLatestDaemonVersion(latest)
    } catch {
      setStatus('disconnected')
      setVscodeAvailable(null)
      setEditors([])
      setDaemonVersion(null)
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
    daemonVersion,
    latestDaemonVersion,
  }
}
