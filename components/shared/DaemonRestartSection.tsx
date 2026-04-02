interface CommandBlockProps {
  command: string
  copied: boolean
  onCopy: () => void
}

function CommandBlock({ command, copied, onCopy }: CommandBlockProps) {
  return (
    <div className="daemon-update-code-block">
      <code className="daemon-update-command">{command}</code>
      <button
        className="daemon-update-copy-btn"
        onClick={onCopy}
        title="Copy to clipboard"
      >
        {copied ? '✓' : 'Copy'}
      </button>
    </div>
  )
}

interface DaemonRestartSectionProps {
  restartCommand: string
  restartCopied: boolean
  restarting: boolean
  restartResult: { success: boolean; message: string } | null
  onRestartCopy: () => void
  onRestart: () => void
}

export function DaemonRestartSection({
  restartCommand,
  restartCopied,
  restarting,
  restartResult,
  onRestartCopy,
  onRestart,
}: DaemonRestartSectionProps) {
  return (
    <>
      <p className="daemon-update-restart-notice">
        After updating, you must restart the daemon for the changes to take
        effect.
      </p>
      <p className="daemon-update-dialog-desc">Restart command:</p>
      <CommandBlock
        command={restartCommand}
        copied={restartCopied}
        onCopy={onRestartCopy}
      />
      {restartResult && (
        <p
          className={
            restartResult.success
              ? 'daemon-update-restart-success'
              : 'daemon-update-restart-error'
          }
        >
          {restartResult.message ||
            (restartResult.success
              ? 'Daemon is restarting...'
              : 'Failed to restart daemon')}
        </p>
      )}
      <button
        className="daemon-update-restart-btn"
        onClick={onRestart}
        disabled={restarting}
      >
        {restarting ? 'Restarting...' : 'Restart Daemon'}
      </button>
    </>
  )
}
