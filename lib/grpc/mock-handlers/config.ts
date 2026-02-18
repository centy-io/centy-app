'use client'

import { DEMO_PROJECT_PATH, DEMO_CONFIG, DEMO_DAEMON_INFO } from '../demo-data'
import type {
  GetConfigRequest,
  Config,
  GetDaemonInfoRequest,
  DaemonInfo,
} from '@/gen/centy_pb'

export async function getConfig(request: GetConfigRequest): Promise<{
  success: boolean
  error: string
  config: Config
}> {
  if (request.projectPath === DEMO_PROJECT_PATH) {
    return {
      success: true,
      error: '',
      config: DEMO_CONFIG,
    }
  }
  // Return default config for other projects
  return {
    success: true,
    error: '',
    config: DEMO_CONFIG,
  }
}

export async function getDaemonInfo(
  _request: GetDaemonInfoRequest
): Promise<DaemonInfo> {
  return DEMO_DAEMON_INFO
}
