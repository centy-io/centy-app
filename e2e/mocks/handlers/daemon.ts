import type { GrpcMocker } from '../../utils/mock-grpc'
import { GetDaemonInfoRequestSchema, DaemonInfoSchema } from '@/gen/centy_pb'
import type { DaemonInfo } from '@/gen/centy_pb'

export interface DaemonHandlerOptions {
  vscodeAvailable?: boolean
}

/**
 * Adds daemon-related handlers to the GrpcMocker.
 */
export function addDaemonHandlers(
  mocker: GrpcMocker,
  options?: DaemonHandlerOptions
): GrpcMocker {
  const resolvedOptions = options !== undefined ? options : {}
  const { vscodeAvailable = true } = resolvedOptions

  // GetDaemonInfo - provides daemon version and VS Code availability
  mocker.addHandler(
    'GetDaemonInfo',
    GetDaemonInfoRequestSchema,
    DaemonInfoSchema,
    (): DaemonInfo => ({
      $typeName: 'centy.v1.DaemonInfo',
      version: '1.0.0 (Test)',
      binaryPath: '/test/centy-daemon',
      vscodeAvailable,
    })
  )

  return mocker
}
