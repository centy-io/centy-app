import type { EditorInfo } from '@/gen/centy_pb'

export type DaemonStatus = 'connected' | 'disconnected' | 'checking' | 'demo'

export interface DaemonStatusContextType {
  status: DaemonStatus
  lastChecked: Date | null
  checkNow: () => Promise<void>
  enterDemoMode: () => void
  exitDemoMode: () => void
  demoProjectPath: string
  vscodeAvailable: boolean | null
  editors: EditorInfo[]
}

export const CHECK_INTERVAL_MS = 10000
