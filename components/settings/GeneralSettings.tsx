'use client'

import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  GetDaemonInfoRequestSchema,
  ShutdownRequestSchema,
  RestartRequestSchema,
  type DaemonInfo,
} from '@/gen/centy_pb'
import { DaemonSettings } from '@/components/settings/DaemonSettings'
import { AgentConfigEditor } from '@/components/settings/AgentConfigEditor'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

const { NEXT_PUBLIC_COMMIT_SHA } = process.env

interface ConfirmDialogProps {
  message: string
  danger?: boolean
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
}

function ConfirmDialog({
  message,
  danger,
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <div className={`confirm-dialog${danger ? ' danger' : ''}`}>
      <p>{message}</p>
      <div className="confirm-actions">
        <button onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={danger ? 'confirm-danger-btn' : 'confirm-btn'}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  )
}

interface DaemonInfoSectionProps {
  daemonInfo: DaemonInfo | null
  restarting: boolean
  shuttingDown: boolean
  showRestartConfirm: boolean
  showShutdownConfirm: boolean
  onShowRestart: () => void
  onShowShutdown: () => void
  onHideRestart: () => void
  onHideShutdown: () => void
  onRestart: () => void
  onShutdown: () => void
}

function DaemonInfoSection({
  daemonInfo,
  restarting,
  shuttingDown,
  showRestartConfirm,
  showShutdownConfirm,
  onShowRestart,
  onShowShutdown,
  onHideRestart,
  onHideShutdown,
  onRestart,
  onShutdown,
}: DaemonInfoSectionProps) {
  return (
    <section className="settings-section">
      <h3>Daemon Information</h3>
      <div className="settings-card">
        {daemonInfo ? (
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Version</span>
              <span className="info-value">{daemonInfo.version}</span>
            </div>
          </div>
        ) : (
          <div className="loading-inline">Loading daemon info...</div>
        )}

        <div className="daemon-controls">
          <button
            onClick={onShowRestart}
            className="restart-btn"
            disabled={restarting}
          >
            {restarting ? 'Restarting...' : 'Restart Daemon'}
          </button>
          <button
            onClick={onShowShutdown}
            className="shutdown-btn"
            disabled={shuttingDown}
          >
            {shuttingDown ? 'Shutting down...' : 'Shutdown Daemon'}
          </button>
        </div>

        {showRestartConfirm && (
          <ConfirmDialog
            message="Are you sure you want to restart the daemon?"
            confirmLabel="Yes, Restart"
            onCancel={onHideRestart}
            onConfirm={onRestart}
          />
        )}

        {showShutdownConfirm && (
          <ConfirmDialog
            message="Are you sure you want to shutdown the daemon? You will need to manually restart it."
            danger
            confirmLabel="Yes, Shutdown"
            onCancel={onHideShutdown}
            onConfirm={onShutdown}
          />
        )}
      </div>
    </section>
  )
}

function useDaemonActions(
  setError: (error: string | null) => void,
  setSuccess: (success: string | null) => void
) {
  const [shuttingDown, setShuttingDown] = useState(false)
  const [restarting, setRestarting] = useState(false)
  const [showShutdownConfirm, setShowShutdownConfirm] = useState(false)
  const [showRestartConfirm, setShowRestartConfirm] = useState(false)

  const handleShutdown = useCallback(async () => {
    setShuttingDown(true)
    setError(null)

    try {
      const request = create(ShutdownRequestSchema, {})
      const response = await centyClient.shutdown(request)

      if (response.success) {
        setSuccess(response.message || 'Daemon is shutting down...')
      } else {
        setError('Failed to shutdown daemon')
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setShuttingDown(false)
      setShowShutdownConfirm(false)
    }
  }, [setError, setSuccess])

  const handleRestart = useCallback(async () => {
    setRestarting(true)
    setError(null)

    try {
      const request = create(RestartRequestSchema, {})
      const response = await centyClient.restart(request)

      if (response.success) {
        setSuccess(response.message || 'Daemon is restarting...')
      } else {
        setError('Failed to restart daemon')
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setRestarting(false)
      setShowRestartConfirm(false)
    }
  }, [setError, setSuccess])

  return {
    shuttingDown,
    restarting,
    showShutdownConfirm,
    showRestartConfirm,
    setShowShutdownConfirm,
    setShowRestartConfirm,
    handleShutdown,
    handleRestart,
  }
}

function useGeneralSettingsState() {
  const [daemonInfo, setDaemonInfo] = useState<DaemonInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const daemonActions = useDaemonActions(setError, setSuccess)

  const fetchDaemonInfo = useCallback(async () => {
    try {
      const request = create(GetDaemonInfoRequestSchema, {})
      const response = await centyClient.getDaemonInfo(request)
      setDaemonInfo(response)
    } catch (err) {
      console.error('Failed to fetch daemon info:', err)
    }
  }, [])

  useEffect(() => {
    fetchDaemonInfo()
  }, [fetchDaemonInfo])

  return {
    daemonInfo,
    error,
    success,
    ...daemonActions,
  }
}

export function GeneralSettings() {
  const {
    daemonInfo,
    error,
    success,
    shuttingDown,
    restarting,
    showShutdownConfirm,
    showRestartConfirm,
    setShowShutdownConfirm,
    setShowRestartConfirm,
    handleShutdown,
    handleRestart,
  } = useGeneralSettingsState()

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>General Settings</h2>
      </div>

      {error && <DaemonErrorMessage error={error} />}
      {success && <div className="success-message">{success}</div>}

      <DaemonInfoSection
        daemonInfo={daemonInfo}
        restarting={restarting}
        shuttingDown={shuttingDown}
        showRestartConfirm={showRestartConfirm}
        showShutdownConfirm={showShutdownConfirm}
        onShowRestart={() => setShowRestartConfirm(true)}
        onShowShutdown={() => setShowShutdownConfirm(true)}
        onHideRestart={() => setShowRestartConfirm(false)}
        onHideShutdown={() => setShowShutdownConfirm(false)}
        onRestart={handleRestart}
        onShutdown={handleShutdown}
      />

      {NEXT_PUBLIC_COMMIT_SHA && (
        <section className="settings-section">
          <h3>App Information</h3>
          <div className="settings-card">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Commit SHA</span>
                <span className="info-value commit-sha">
                  {NEXT_PUBLIC_COMMIT_SHA.slice(0, 7)}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="settings-section">
        <h3>Daemon Connection</h3>
        <div className="settings-card">
          <DaemonSettings />
        </div>
      </section>

      <section className="settings-section">
        <h3>Agent Configuration</h3>
        <div className="settings-card">
          <AgentConfigEditor />
        </div>
      </section>
    </div>
  )
}
