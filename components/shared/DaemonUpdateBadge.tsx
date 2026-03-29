'use client'

import { useState } from 'react'
import { useDaemonStatus } from '@/components/providers/DaemonStatusProvider'
import { isNewerVersion } from '@/lib/compareVersions'
import { DAEMON_INSTALL_URL } from '@/lib/constants/urls'

const INSTALL_COMMAND = `curl -fsSL ${DAEMON_INSTALL_URL} | sh`

interface UpdateDialogProps {
  daemonVersion: string
  latestDaemonVersion: string
  copied: boolean
  onClose: () => void
  onCopy: () => void
}

function UpdateDialog({
  daemonVersion,
  latestDaemonVersion,
  copied,
  onClose,
  onCopy,
}: UpdateDialogProps) {
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
        <div className="daemon-update-code-block">
          <code className="daemon-update-command">{INSTALL_COMMAND}</code>
          <button
            className="daemon-update-copy-btn"
            onClick={onCopy}
            title="Copy to clipboard"
          >
            {copied ? '✓' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function DaemonUpdateBadge() {
  const { daemonVersion, latestDaemonVersion } = useDaemonStatus()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  if (
    !daemonVersion ||
    !latestDaemonVersion ||
    !isNewerVersion(daemonVersion, latestDaemonVersion)
  ) {
    return null
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(INSTALL_COMMAND)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <button
        className="daemon-update-badge"
        onClick={() => setDialogOpen(true)}
        title={`Daemon update available: ${latestDaemonVersion}`}
      >
        <span className="daemon-update-dot" />
        <span className="daemon-update-label">Update available</span>
      </button>
      {dialogOpen && (
        <UpdateDialog
          daemonVersion={daemonVersion}
          latestDaemonVersion={latestDaemonVersion}
          copied={copied}
          onClose={() => setDialogOpen(false)}
          onCopy={handleCopy}
        />
      )}
    </>
  )
}
