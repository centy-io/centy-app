'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import {
  centyClient,
  enableDemoMode,
  disableDemoMode,
  isDemoMode,
} from '@/lib/grpc/client'
import { DEMO_ORG_SLUG, DEMO_PROJECT_PATH } from '@/lib/grpc/demo-data'
import { EditorType } from '@/gen/centy_pb'
import { trackDaemonConnection } from '@/lib/metrics'
import type { DaemonStatusContextType } from './DaemonStatusProvider.types'
import { CHECK_INTERVAL_MS } from './DaemonStatusProvider.types'
import {
  createDemoEditors,
  getTestVscodeOverride,
} from './DaemonStatusProvider.helpers'

const DaemonStatusContext = createContext<DaemonStatusContextType | null>(null)

export function DaemonStatusProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] =
    useState<DaemonStatusContextType['status']>('checking')
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [hasMounted, setHasMounted] = useState(false)
  const [vscodeAvailable, setVscodeAvailable] = useState<boolean | null>(null)
  const [editors, setEditors] = useState<DaemonStatusContextType['editors']>([])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('demo') === 'true' && !isDemoMode()) {
        enableDemoMode()
        setStatus('demo')
        setVscodeAvailable(getTestVscodeOverride() ?? true)
        setEditors(createDemoEditors())
        const newUrl = `${window.location.pathname}?org=${DEMO_ORG_SLUG}&project=${encodeURIComponent(DEMO_PROJECT_PATH)}`
        window.history.replaceState({}, '', newUrl)
      } else if (isDemoMode()) {
        setStatus('demo')
        setVscodeAvailable(getTestVscodeOverride() ?? true)
        setEditors(createDemoEditors())
      }
      setHasMounted(true)
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [])

  const checkDaemonStatus = useCallback(async () => {
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
        setEditors([
          {
            $typeName: 'centy.v1.EditorInfo',
            editorType: EditorType.VSCODE,
            name: 'VS Code',
            description: 'Open in temporary VS Code workspace with AI agent',
            available: daemonInfo.vscodeAvailable,
            editorId: 'vscode',
            terminalWrapper: false,
          },
          {
            $typeName: 'centy.v1.EditorInfo',
            editorType: EditorType.TERMINAL,
            name: 'Terminal',
            description: 'Open in terminal with AI agent',
            available: true,
            editorId: 'terminal',
            terminalWrapper: true,
          },
        ])
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
    window.location.href = `/?org=${DEMO_ORG_SLUG}&project=${encodeURIComponent(DEMO_PROJECT_PATH)}`
  }, [])

  const exitDemoMode = useCallback(() => {
    disableDemoMode()
    setStatus('checking')

    setTimeout(() => {
      checkDaemonStatus()
    }, 100)
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
