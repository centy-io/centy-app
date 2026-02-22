'use client'

import { type DaemonInfo } from '@/gen/centy_pb'

// Demo daemon info
export const DEMO_DAEMON_INFO: DaemonInfo = {
  $typeName: 'centy.v1.DaemonInfo',
  version: '0.1.5 (Demo)',
  binaryPath: '/demo/centy-daemon',
  vscodeAvailable: true,
}
