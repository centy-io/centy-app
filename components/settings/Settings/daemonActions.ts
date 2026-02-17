import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { ShutdownRequestSchema, RestartRequestSchema } from '@/gen/centy_pb'

interface DaemonActionCallbacks {
  setError: (error: string | null) => void
  setSuccess: (success: string | null) => void
}

export async function performShutdown(
  callbacks: DaemonActionCallbacks
): Promise<void> {
  const { setError, setSuccess } = callbacks
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
    setError(err instanceof Error ? err.message : 'Failed to connect to daemon')
  }
}

export async function performRestart(
  callbacks: DaemonActionCallbacks
): Promise<void> {
  const { setError, setSuccess } = callbacks
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
    setError(err instanceof Error ? err.message : 'Failed to connect to daemon')
  }
}
