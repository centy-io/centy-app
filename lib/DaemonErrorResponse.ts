import type { DaemonErrorItem } from './DaemonErrorItem'

export interface DaemonErrorResponse {
  cwd?: string
  logs?: string
  messages: DaemonErrorItem[]
}
