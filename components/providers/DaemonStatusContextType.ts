import type { DaemonStatus } from './DaemonStatus'
import type { EditorInfo } from '@/gen/centy_pb'

export interface DaemonStatusContextType {
  status: DaemonStatus
  lastChecked: Date | null
  checkNow: () => Promise<void>
  enterDemoMode: () => void
  exitDemoMode: () => void
  demoProjectPath: string
  vscodeAvailable: boolean | null // null = not yet checked
  editors: EditorInfo[] // List of supported editors with availability
}
