import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  GetDaemonInfoRequestSchema,
  ShutdownRequestSchema,
  RestartRequestSchema,
  type DaemonInfo,
} from '@/gen/centy_pb'

export function useDaemonControls() {
  const [daemonInfo, setDaemonInfo] = useState<DaemonInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [shuttingDown, setShuttingDown] = useState(false)
  const [restarting, setRestarting] = useState(false)
  const [showShutdownConfirm, setShowShutdownConfirm] = useState(false)
  const [showRestartConfirm, setShowRestartConfirm] = useState(false)

  const fetchDaemonInfo = useCallback(async () => {
    try {
      const request = create(GetDaemonInfoRequestSchema, {})
      const response = await centyClient.getDaemonInfo(request)
      setDaemonInfo(response)
    } catch (err) {
      console.error('Failed to fetch daemon info:', err)
    }
  }, [])

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
  }, [])

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
  }, [])

  useEffect(() => {
    fetchDaemonInfo()
  }, [fetchDaemonInfo])

  return {
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
  }
}
