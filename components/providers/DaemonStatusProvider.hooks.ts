'use client'

import { useState, useEffect, useCallback } from 'react'
import type { DaemonStatus } from './DaemonStatusProvider.types'
import {
  CHECK_INTERVAL_MS,
  buildDemoRedirectUrl,
  initializeDemoFromUrl,
} from './DaemonStatusProvider.helpers'
import {
  useEditorState,
  useCheckDaemonStatus,
} from './DaemonStatusProvider.hooks.helpers'
import { enableDemoMode, disableDemoMode, isDemoMode } from '@/lib/grpc/client'
import { DEMO_ORG_SLUG, DEMO_PROJECT_PATH } from '@/lib/grpc/demo-data'
import { trackDaemonConnection } from '@/lib/metrics'

export function useDaemonStatusState() {
  const [status, setStatus] = useState<DaemonStatus>('checking')
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [hasMounted, setHasMounted] = useState(false)
  const [daemonVersion, setDaemonVersion] = useState<string | null>(null)
  const [daemonUpdateAvailable, setDaemonUpdateAvailable] =
    useState<boolean>(false)

  const { editors, vscodeAvailable, setEditors, setEditorsLoaded } =
    useEditorState()

  const checkDaemonStatus = useCheckDaemonStatus({
    setStatus,
    setDaemonVersion,
    setDaemonUpdateAvailable,
    setLastChecked,
    setEditors,
    setEditorsLoaded,
  })

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
    setTimeout(() => {
      void checkDaemonStatus()
    }, 100)
  }, [checkDaemonStatus])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      initializeDemoFromUrl(setStatus, setEditors, setEditorsLoaded)
      setHasMounted(true)
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [setEditors, setEditorsLoaded])

  useEffect(() => {
    if (!hasMounted || isDemoMode()) return
    const timeoutId = setTimeout(() => {
      void checkDaemonStatus()
    }, 0)
    const interval = setInterval(() => {
      void checkDaemonStatus()
    }, CHECK_INTERVAL_MS)
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
    daemonUpdateAvailable,
  }
}
