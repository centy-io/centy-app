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

async function fetchDaemonInfoRequest(): Promise<DaemonInfo> {
  const request = create(GetDaemonInfoRequestSchema, {})
  return centyClient.getDaemonInfo(request)
}

async function shutdownDaemon(): Promise<{
  success: boolean
  message: string
}> {
  const request = create(ShutdownRequestSchema, {})
  const response = await centyClient.shutdown(request)
  return { success: response.success, message: response.message || '' }
}

async function restartDaemon(): Promise<{ success: boolean; message: string }> {
  const request = create(RestartRequestSchema, {})
  const response = await centyClient.restart(request)
  return { success: response.success, message: response.message || '' }
}

export function useDaemonActions() {
  const [daemonInfo, setDaemonInfo] = useState<DaemonInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [shuttingDown, setShuttingDown] = useState(false)
  const [restarting, setRestarting] = useState(false)
  const [showShutdownConfirm, setShowShutdownConfirm] = useState(false)
  const [showRestartConfirm, setShowRestartConfirm] = useState(false)

  const fetchDaemonInfo = useCallback(async () => {
    try {
      setDaemonInfo(await fetchDaemonInfoRequest())
    } catch (err) {
      console.error('Failed to fetch daemon info:', err)
    }
  }, [])

  const handleShutdown = useCallback(async () => {
    setShuttingDown(true)
    setError(null)
    try {
      const result = await shutdownDaemon()
      if (result.success) {
        setSuccess(result.message || 'Daemon is shutting down...')
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
      const result = await restartDaemon()
      if (result.success) {
        setSuccess(result.message || 'Daemon is restarting...')
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
    void fetchDaemonInfo()
  }, [fetchDaemonInfo])

  return {
    daemonInfo,
    error,
    success,
    shuttingDown,
    restarting,
    showShutdownConfirm,
    setShowShutdownConfirm,
    showRestartConfirm,
    setShowRestartConfirm,
    handleShutdown,
    handleRestart,
  }
}
