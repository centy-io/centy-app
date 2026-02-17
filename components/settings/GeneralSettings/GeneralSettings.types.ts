import type { DaemonInfo } from '@/gen/centy_pb'

export interface DaemonInfoSectionProps {
  daemonInfo: DaemonInfo | null
  restarting: boolean
  shuttingDown: boolean
  showRestartConfirm: boolean
  showShutdownConfirm: boolean
  onShowRestart: () => void
  onShowShutdown: () => void
  onCancelRestart: () => void
  onCancelShutdown: () => void
  onRestart: () => void
  onShutdown: () => void
}
