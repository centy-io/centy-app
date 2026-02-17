'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { enableDemoMode, disableDemoMode, isDemoMode } from '@/lib/grpc/client'
import { DEMO_ORG_SLUG, DEMO_PROJECT_PATH } from '@/lib/grpc/demo-data'
import { trackDaemonConnection } from '@/lib/metrics'
import type { DaemonStatusContextType } from './DaemonStatusProvider.types'
import { CHECK_INTERVAL_MS } from './DaemonStatusProvider.types'
import { useDaemonCheck } from './useDaemonCheck'
import { useDemoModeInit } from './useDemoModeInit'

const DaemonStatusContext = createContext<DaemonStatusContextType | null>(null)

export function DaemonStatusProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] =
    useState<DaemonStatusContextType['status']>('checking')
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [hasMounted, setHasMounted] = useState(false)
  const [vscodeAvailable, setVscodeAvailable] = useState<boolean | null>(null)
  const [editors, setEditors] = useState<DaemonStatusContextType['editors']>([])

  const checkDaemonStatus = useDaemonCheck(
    setStatus,
    setVscodeAvailable,
    setEditors,
    setLastChecked as (d: Date) => void
  )

  useDemoModeInit(setStatus, setVscodeAvailable, setEditors, setHasMounted)

  const enterDemoMode = useCallback(() => {
    enableDemoMode()
    setStatus('demo')
    trackDaemonConnection(true, true)
    window.location.href = `/?org=${DEMO_ORG_SLUG}&project=${encodeURIComponent(DEMO_PROJECT_PATH)}`
  }, [])

  const exitDemoMode = useCallback(() => {
    disableDemoMode()
    setStatus('checking')
    setTimeout(() => {
      checkDaemonStatus()
    }, 100)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!hasMounted) return
    if (isDemoMode()) return
    const timeoutId = setTimeout(checkDaemonStatus, 0)
    const interval = setInterval(checkDaemonStatus, CHECK_INTERVAL_MS)
    return () => {
      clearTimeout(timeoutId)
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMounted])

  return (
    <DaemonStatusContext.Provider
      value={{
        status,
        lastChecked,
        checkNow: checkDaemonStatus,
        enterDemoMode,
        exitDemoMode,
        demoProjectPath: DEMO_PROJECT_PATH,
        vscodeAvailable,
        editors,
      }}
    >
      {children}
    </DaemonStatusContext.Provider>
  )
}

export function useDaemonStatus() {
  const context = useContext(DaemonStatusContext)
  if (!context) {
    throw new Error(
      'useDaemonStatus must be used within a DaemonStatusProvider'
    )
  }
  return context
}
