import { useDaemonStatus } from '../context/DaemonStatusContext.tsx'
import './DaemonStatusIndicator.css'

export function DaemonStatusIndicator() {
  const { status, checkNow } = useDaemonStatus()

  const statusConfig = {
    connected: {
      label: 'Daemon Online',
      className: 'connected',
    },
    disconnected: {
      label: 'Daemon Offline',
      className: 'disconnected',
    },
    checking: {
      label: 'Checking...',
      className: 'checking',
    },
  }

  const config = statusConfig[status]

  return (
    <button
      className={`daemon-status-indicator ${config.className}`}
      onClick={checkNow}
      title={`${config.label} - Click to refresh`}
    >
      <span className="daemon-status-dot" />
      <span className="daemon-status-label">{config.label}</span>
    </button>
  )
}
