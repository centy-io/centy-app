'use client'

import { useState } from 'react'
import { create } from '@bufbuild/protobuf'
import { DaemonUpdateDialog } from './DaemonUpdateDialog'
import { centyClient } from '@/lib/grpc/client'
import { RestartRequestSchema } from '@/gen/centy_pb'
import { useDaemonStatus } from '@/components/providers/DaemonStatusProvider'
import { DAEMON_INSTALL_URL } from '@/lib/constants/urls'

const INSTALL_COMMAND = `curl -fsSL ${DAEMON_INSTALL_URL} | sh`
const RESTART_COMMAND = 'centy daemon restart'

interface RestartResult {
  success: boolean
  message: string
}

async function restartDaemon(): Promise<{ success: boolean; message: string }> {
  const request = create(RestartRequestSchema, {})
  const response = await centyClient.restart(request)
  return { success: response.success, message: response.message || '' }
}

export function DaemonUpdateBadge() {
  const { daemonUpdateAvailable } = useDaemonStatus()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [restartCopied, setRestartCopied] = useState(false)
  const [restarting, setRestarting] = useState(false)
  const [restartResult, setRestartResult] = useState<RestartResult | null>(null)

  if (!daemonUpdateAvailable) {
    return null
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(INSTALL_COMMAND)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const handleRestartCopy = async () => {
    await navigator.clipboard.writeText(RESTART_COMMAND)
    setRestartCopied(true)
    setTimeout(() => {
      setRestartCopied(false)
    }, 2000)
  }

  const handleRestart = async () => {
    setRestarting(true)
    setRestartResult(null)
    try {
      const result = await restartDaemon()
      setRestartResult(result)
    } catch (err) {
      setRestartResult({
        success: false,
        message:
          err instanceof Error ? err.message : 'Failed to connect to daemon',
      })
    } finally {
      setRestarting(false)
    }
  }

  return (
    <>
      <button
        className="daemon-update-badge"
        onClick={() => {
          setDialogOpen(true)
        }}
        title="Daemon update available"
      >
        <span className="daemon-update-dot" />
        <span className="daemon-update-label">Update available</span>
      </button>
      {dialogOpen && (
        <DaemonUpdateDialog
          copied={copied}
          restartCopied={restartCopied}
          restarting={restarting}
          restartResult={restartResult}
          installCommand={INSTALL_COMMAND}
          restartCommand={RESTART_COMMAND}
          onClose={() => {
            setDialogOpen(false)
          }}
          onCopy={() => {
            void handleCopy()
          }}
          onRestartCopy={() => {
            void handleRestartCopy()
          }}
          onRestart={() => {
            void handleRestart()
          }}
        />
      )}
    </>
  )
}
