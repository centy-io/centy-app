import type { GrpcMocker } from '../../utils/mock-grpc'
import { GetDaemonInfoRequestSchema, DaemonInfoSchema } from '@/gen/centy_pb'
import type { DaemonInfo } from '@/gen/centy_pb'

interface DaemonHandlerOptions {
  vscodeAvailable?: boolean
}

/**
 * Adds daemon-related handlers to the GrpcMocker.
 */
export function addDaemonHandlers(
  mocker: GrpcMocker,
  options: DaemonHandlerOptions = {}
): GrpcMocker {
  const { vscodeAvailable = true } = options

  // GetDaemonInfo - provides daemon version and VS Code availability
  mocker.addHandler(
    'GetDaemonInfo',
    GetDaemonInfoRequestSchema,
    DaemonInfoSchema,
    (): DaemonInfo => ({
      $typeName: 'centy.DaemonInfo',
      version: '1.0.0 (Test)',
      availableVersions: ['1.0.0'],
      binaryPath: '/test/centy-daemon',
      vscodeAvailable,
    })
  )

  return mocker
}

export type { DaemonHandlerOptions }
