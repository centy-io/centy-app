'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { DaemonStatusContextType } from './DaemonStatusProvider.types'
import { useDaemonStatusState } from './DaemonStatusProvider.hooks'
import { DEMO_PROJECT_PATH } from '@/lib/grpc/demo-data'
import { DaemonStatusProviderError } from '@/lib/errors'

const DaemonStatusContext = createContext<DaemonStatusContextType | null>(null)

export function DaemonStatusProvider({ children }: { children: ReactNode }) {
  const {
    status,
    lastChecked,
    checkDaemonStatus,
    enterDemoMode,
    exitDemoMode,
    vscodeAvailable,
    editors,
  } = useDaemonStatusState()

  return (
    // eslint-disable-next-line custom/jsx-classname-required
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
    throw new DaemonStatusProviderError()
  }
  return context
}
