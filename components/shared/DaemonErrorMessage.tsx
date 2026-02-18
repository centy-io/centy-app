import { parseDaemonError } from '@/lib/daemon-error'

interface DaemonErrorMessageProps {
  error: string
  className?: string
}

export function DaemonErrorMessage({
  error,
  className = 'error-message',
}: DaemonErrorMessageProps) {
  const parsed = parseDaemonError(error)

  return (
    <div className={className}>
      <div className="daemon-error-content">
        <span>{parsed.message}</span>
        {parsed.tip && <span className="daemon-error-tip">{parsed.tip}</span>}
        {parsed.logs && (
          <span className="daemon-error-logs">
            Logs: <code>{parsed.logs}</code>
          </span>
        )}
      </div>
    </div>
  )
}
