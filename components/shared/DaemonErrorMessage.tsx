import { parseDaemonError } from '@/lib/daemon-error'

interface DaemonErrorMessageProps {
  error: string
  className?: string
}

export function DaemonErrorMessage({
  error,
  className,
}: DaemonErrorMessageProps) {
  const resolvedClassName =
    className !== undefined ? className : 'error-message'
  const parsed = parseDaemonError(error)

  return (
    <div className={resolvedClassName}>
      <div className="daemon-error-content">
        <span className="daemon-error-message">{parsed.message}</span>
        {parsed.tip && <span className="daemon-error-tip">{parsed.tip}</span>}
        {parsed.logs && (
          <span className="daemon-error-logs">
            Logs: <code className="daemon-error-log-code">{parsed.logs}</code>
          </span>
        )}
      </div>
    </div>
  )
}
