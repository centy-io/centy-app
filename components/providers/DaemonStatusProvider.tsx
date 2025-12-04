'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { centyClient } from '@/lib/grpc/client'

type DaemonStatus = 'connected' | 'disconnected' | 'checking'

interface DaemonStatusContextType {
  status: DaemonStatus
  lastChecked: Date | null
  checkNow: () => Promise<void>
}

const DaemonStatusContext = createContext<DaemonStatusContextType | null>(null)

const CHECK_INTERVAL_MS = 10000 // Check every 10 seconds

export function DaemonStatusProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<DaemonStatus>('checking')
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkDaemonStatus = useCallback(async () => {
    setStatus('checking')
    try {
      // Use listProjects as a health check - it's a lightweight call
      await centyClient.listProjects({})
      setStatus('connected')
    } catch {
      setStatus('disconnected')
    }
    setLastChecked(new Date())
  }, [])

  // Initial check and periodic polling
  useEffect(() => {
    // Schedule initial check to avoid synchronous setState in effect
    const timeoutId = setTimeout(checkDaemonStatus, 0)
    const interval = setInterval(checkDaemonStatus, CHECK_INTERVAL_MS)

    return () => {
      clearTimeout(timeoutId)
      clearInterval(interval)
    }
  }, [checkDaemonStatus])

  return (
    <DaemonStatusContext.Provider
      value={{ status, lastChecked, checkNow: checkDaemonStatus }}
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
