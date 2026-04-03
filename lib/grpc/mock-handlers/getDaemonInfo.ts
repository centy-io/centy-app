'use client'

import { DEMO_DAEMON_INFO } from '../demo-data'
import type { GetDaemonInfoRequest, DaemonInfo } from '@/gen/centy_pb'

// eslint-disable-next-line @typescript-eslint/require-await
export async function getDaemonInfo(
  _request: GetDaemonInfoRequest
): Promise<DaemonInfo> {
  return DEMO_DAEMON_INFO
}
