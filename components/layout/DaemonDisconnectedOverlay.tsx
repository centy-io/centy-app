'use client'

import { useState } from 'react'
import { DisconnectedIcon } from './DisconnectedIcon'
import { CopyButton } from './CopyButton'
import { useDaemonStatus } from '@/components/providers/DaemonStatusProvider'
import { DAEMON_INSTALL_URL } from '@/lib/constants/urls'

const INSTALL_COMMAND = `curl -fsSL ${DAEMON_INSTALL_URL} | sh`

export function DaemonDisconnectedOverlay() {
  const { status, checkNow, enterDemoMode } = useDaemonStatus()
  const [copied, setCopied] = useState(false)

  if (status !== 'disconnected') {
    return null
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(INSTALL_COMMAND)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="daemon-disconnected-overlay">
      <div className="daemon-disconnected-content">
        <DisconnectedIcon />
        <h2 className="daemon-disconnected-title">Daemon Not Connected</h2>
        <p className="daemon-disconnected-description">
          The Centy daemon is not running or cannot be reached.
          <br className="daemon-line-break" />
          Please start the daemon to use the application.
        </p>
        <div className="daemon-disconnected-instructions">
          <p className="daemon-instruction-text">
            If you haven&apos;t installed the daemon yet, run:
          </p>
          <div className="daemon-code-block">
            <code className="daemon-install-command">{INSTALL_COMMAND}</code>
            <CopyButton
              copied={copied}
              onCopy={() => {
                void handleCopy()
              }}
            />
          </div>
          <p className="daemon-instruction-text">Then start the daemon:</p>
          <code className="daemon-start-command">pnpm dlx centy start</code>
        </div>
        <button
          className="daemon-retry-button"
          onClick={() => {
            void checkNow()
          }}
        >
          Retry Connection
        </button>
        <div className="daemon-disconnected-demo-section">
          <p className="daemon-demo-text">Or explore with sample data:</p>
          <button className="daemon-demo-button" onClick={enterDemoMode}>
            Try Demo Mode
          </button>
        </div>
      </div>
    </div>
  )
}
