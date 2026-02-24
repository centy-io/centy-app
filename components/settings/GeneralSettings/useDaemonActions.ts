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

type StatusSetter = (msg: string | null) => void

async function runDaemonOperation(
  action: () => Promise<{ success: boolean; message?: string }>,
  labels: { success: string; fail: string },
  setError: StatusSetter,
  setSuccess: StatusSetter,
  setRunning: (v: boolean) => void,
  setShowConfirm: (v: boolean) => void
) {
  setRunning(true)
  setError(null)
  try {
    const response = await action()
    if (response.success) {
      setSuccess(response.message || labels.success)
    } else {
      setError(labels.fail)
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to connect to daemon')
  } finally {
    setRunning(false)
    setShowConfirm(false)
  }
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
      const request = create(GetDaemonInfoRequestSchema, {})
      const response = await centyClient.getDaemonInfo(request)
      setDaemonInfo(response)
    } catch (err) {
      console.error('Failed to fetch daemon info:', err)
    }
  }, [])

  const handleShutdown = useCallback(
    () =>
      runDaemonOperation(
        () => centyClient.shutdown(create(ShutdownRequestSchema, {})),
        {
          success: 'Daemon is shutting down...',
          fail: 'Failed to shutdown daemon',
        },
        setError,
        setSuccess,
        setShuttingDown,
        setShowShutdownConfirm
      ),
    []
  )

  const handleRestart = useCallback(
    () =>
      runDaemonOperation(
        () => centyClient.restart(create(RestartRequestSchema, {})),
        {
          success: 'Daemon is restarting...',
          fail: 'Failed to restart daemon',
        },
        setError,
        setSuccess,
        setRestarting,
        setShowRestartConfirm
      ),
    []
  )

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
    setShowShutdownConfirm,
    showRestartConfirm,
    setShowRestartConfirm,
    handleShutdown,
    handleRestart,
  }
}
