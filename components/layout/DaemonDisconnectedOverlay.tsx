/* eslint-disable max-lines */
'use client'

import { useState } from 'react'
import { useDaemonStatus } from '@/components/providers/DaemonStatusProvider'
import { DAEMON_INSTALL_URL } from '@/lib/constants/urls'

const INSTALL_COMMAND = `curl -fsSL ${DAEMON_INSTALL_URL} | sh`

function DisconnectedIcon() {
  return (
    <div className="daemon-disconnected-icon">
      <svg
        className="daemon-disconnected-svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line className="svg-line" x1="1" y1="1" x2="23" y2="23" />
        <path className="svg-path" d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
        <path className="svg-path" d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
        <path className="svg-path" d="M10.71 5.05A16 16 0 0 1 22.58 9" />
        <path className="svg-path" d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
        <path className="svg-path" d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line className="svg-line" x1="12" y1="20" x2="12.01" y2="20" />
      </svg>
    </div>
  )
}

function CopyButton({
  copied,
  onCopy,
}: {
  copied: boolean
  onCopy: () => void
}) {
  return (
    <button
      className="daemon-copy-button"
      onClick={onCopy}
      title="Copy to clipboard"
    >
      {copied ? (
        <svg
          className="copy-icon-svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline className="svg-polyline" points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          className="copy-icon-svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect className="svg-rect" x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path className="svg-path" d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  )
}

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
          <p className="daemon-instruction-text">If you haven&apos;t installed the daemon yet, run:</p>
          <div className="daemon-code-block">
            <code className="daemon-install-command">{INSTALL_COMMAND}</code>
            <CopyButton copied={copied} onCopy={handleCopy} />
          </div>
          <p className="daemon-instruction-text">Then start the daemon:</p>
          <code className="daemon-start-command">pnpm dlx centy start</code>
        </div>
        <button className="daemon-retry-button" onClick={checkNow}>
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
