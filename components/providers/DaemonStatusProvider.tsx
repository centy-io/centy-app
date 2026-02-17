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
import { EditorType, type EditorInfo } from '@/gen/centy_pb'
import { trackDaemonConnection } from '@/lib/metrics'

type DaemonStatus = 'connected' | 'disconnected' | 'checking' | 'demo'

interface DaemonStatusContextType {
  status: DaemonStatus
  lastChecked: Date | null
  checkNow: () => Promise<void>
  enterDemoMode: () => void
  exitDemoMode: () => void
  demoProjectPath: string
  vscodeAvailable: boolean | null // null = not yet checked
  editors: EditorInfo[] // List of supported editors with availability
}

const DaemonStatusContext = createContext<DaemonStatusContextType | null>(null)

const CHECK_INTERVAL_MS = 10000 // Check every 10 seconds

// Helper to create mock editors for demo mode
function createDemoEditors(): EditorInfo[] {
  return [
    {
      $typeName: 'centy.v1.EditorInfo',
      editorType: EditorType.VSCODE,
      name: 'VS Code',
      description: 'Open in temporary VS Code workspace with AI agent',
      available: true,
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
  ]
}

// Helper to get the test override for vscode availability
function getTestVscodeOverride(): boolean {
  const testOverride = (
    window as Window & { __TEST_VSCODE_AVAILABLE__?: boolean }
  ).__TEST_VSCODE_AVAILABLE__
  return testOverride ?? true
}

// Apply demo mode state to setters
function applyDemoState(
  setStatus: (s: DaemonStatus) => void,
  setVscodeAvailable: (v: boolean | null) => void,
  setEditors: (e: EditorInfo[]) => void
) {
  setStatus('demo')
  setVscodeAvailable(getTestVscodeOverride())
  setEditors(createDemoEditors())
}

function useDemoModeInit(
  setStatus: (s: DaemonStatus) => void,
  setVscodeAvailable: (v: boolean | null) => void,
  setEditors: (e: EditorInfo[]) => void,
  setHasMounted: (v: boolean) => void
) {
  // Check for demo mode after mount to avoid hydration mismatch
  // Also check for ?demo=true URL param to auto-enable demo mode
  useEffect(() => {
    // Schedule setState asynchronously to satisfy eslint react-hooks/set-state-in-effect
    const timeoutId = setTimeout(() => {
      // Check for ?demo=true URL param to auto-enable demo mode
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('demo') === 'true' && !isDemoMode()) {
        enableDemoMode()
        applyDemoState(setStatus, setVscodeAvailable, setEditors)
        // Clean up URL by removing demo param and adding org/project (preserve current path)
        const newUrl = `${window.location.pathname}?org=${DEMO_ORG_SLUG}&project=${encodeURIComponent(DEMO_PROJECT_PATH)}`
        window.history.replaceState({}, '', newUrl)
      } else if (isDemoMode()) {
        applyDemoState(setStatus, setVscodeAvailable, setEditors)
      }
      setHasMounted(true)
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [setStatus, setVscodeAvailable, setEditors, setHasMounted])
}

function useCheckDaemonStatus(
  setStatus: (s: DaemonStatus) => void,
  setLastChecked: (d: Date) => void,
  setVscodeAvailable: (v: boolean | null) => void,
  setEditors: (e: EditorInfo[]) => void
) {
  return useCallback(async () => {
    // Skip health checks when in demo mode
    if (isDemoMode()) {
      applyDemoState(setStatus, setVscodeAvailable, setEditors)
      return
    }

    setStatus('checking')
    try {
      // Use getDaemonInfo as a health check - it also provides VS Code availability
      const daemonInfo = await centyClient.getDaemonInfo({})
      setStatus('connected')
      setVscodeAvailable(daemonInfo.vscodeAvailable)
      trackDaemonConnection(true, false)

      // Fetch supported editors for the editor selector
      try {
        const editorsResponse = await centyClient.getSupportedEditors({})
        setEditors(editorsResponse.editors)
      } catch {
        // Fallback: create basic editor list based on vscodeAvailable
        setEditors(createFallbackEditors(daemonInfo.vscodeAvailable))
      }
    } catch {
      setStatus('disconnected')
      setVscodeAvailable(null)
      setEditors([])
      trackDaemonConnection(false, false)
    }
    setLastChecked(new Date())
  }, [setStatus, setLastChecked, setVscodeAvailable, setEditors])
}

function createFallbackEditors(vscodeAvailable: boolean): EditorInfo[] {
  return [
    {
      $typeName: 'centy.v1.EditorInfo',
      editorType: EditorType.VSCODE,
      name: 'VS Code',
      description: 'Open in temporary VS Code workspace with AI agent',
      available: vscodeAvailable,
      editorId: 'vscode',
      terminalWrapper: false,
    },
    {
      $typeName: 'centy.v1.EditorInfo',
      editorType: EditorType.TERMINAL,
      name: 'Terminal',
      description: 'Open in terminal with AI agent',
      available: true, // Terminal is always available
      editorId: 'terminal',
      terminalWrapper: true,
    },
  ]
}

function useDaemonPolling(
  hasMounted: boolean,
  checkDaemonStatus: () => Promise<void>
) {
  // Initial check and periodic polling
  useEffect(() => {
    // Wait until after mount to avoid hydration issues
    if (!hasMounted) {
      return
    }

    // Skip polling when in demo mode (use isDemoMode() directly to avoid
    // status in deps which would cause infinite re-renders)
    if (isDemoMode()) {
      return
    }

    // Schedule initial check to avoid synchronous setState in effect
    const timeoutId = setTimeout(checkDaemonStatus, 0)
    const interval = setInterval(checkDaemonStatus, CHECK_INTERVAL_MS)

    return () => {
      clearTimeout(timeoutId)
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMounted])
}

export function DaemonStatusProvider({ children }: { children: ReactNode }) {
  // Always start with 'checking' to avoid hydration mismatch
  // (sessionStorage is not available during SSR)
  const [status, setStatus] = useState<DaemonStatus>('checking')
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [hasMounted, setHasMounted] = useState(false)
  const [vscodeAvailable, setVscodeAvailable] = useState<boolean | null>(null)
  const [editors, setEditors] = useState<EditorInfo[]>([])

  useDemoModeInit(setStatus, setVscodeAvailable, setEditors, setHasMounted)

  const checkDaemonStatus = useCheckDaemonStatus(
    setStatus,
    setLastChecked,
    setVscodeAvailable,
    setEditors
  )

  const enterDemoMode = useCallback(() => {
    enableDemoMode()
    setStatus('demo')
    trackDaemonConnection(true, true)
    // Navigate to demo org and project
    window.location.href = `/?org=${DEMO_ORG_SLUG}&project=${encodeURIComponent(DEMO_PROJECT_PATH)}`
  }, [])

  const exitDemoMode = useCallback(() => {
    disableDemoMode()
    setStatus('checking')
    // Trigger a check after exiting demo mode
    setTimeout(() => {
      checkDaemonStatus()
    }, 100)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useDaemonPolling(hasMounted, checkDaemonStatus)

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
