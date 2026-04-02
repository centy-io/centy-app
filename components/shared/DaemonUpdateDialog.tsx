import { DaemonRestartSection } from './DaemonRestartSection'

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

interface DaemonUpdateDialogProps {
  daemonVersion: string
  latestDaemonVersion: string
  copied: boolean
  restartCopied: boolean
  restarting: boolean
  restartResult: { success: boolean; message: string } | null
  installCommand: string
  restartCommand: string
  onClose: () => void
  onCopy: () => void
  onRestartCopy: () => void
  onRestart: () => void
}

export function DaemonUpdateDialog({
  daemonVersion,
  latestDaemonVersion,
  copied,
  restartCopied,
  restarting,
  restartResult,
  installCommand,
  restartCommand,
  onClose,
  onCopy,
  onRestartCopy,
  onRestart,
}: DaemonUpdateDialogProps) {
  return (
    <div className="daemon-update-overlay" onClick={onClose}>
      <div className="daemon-update-dialog" onClick={e => e.stopPropagation()}>
        <div className="daemon-update-dialog-header">
          <h3 className="daemon-update-dialog-title">
            Daemon update available
          </h3>
          <button
            className="daemon-update-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <p className="daemon-update-dialog-desc">
          A new version of the centy daemon is available:{' '}
          <strong className="daemon-update-version">
            {latestDaemonVersion}
          </strong>{' '}
          (current: {daemonVersion}).
        </p>
        <p className="daemon-update-dialog-desc">
          Run the following command to upgrade:
        </p>
        <CommandBlock
          command={installCommand}
          copied={copied}
          onCopy={onCopy}
        />
        <DaemonRestartSection
          restartCommand={restartCommand}
          restartCopied={restartCopied}
          restarting={restarting}
          restartResult={restartResult}
          onRestartCopy={onRestartCopy}
          onRestart={onRestart}
        />
      </div>
    </div>
  )
}
