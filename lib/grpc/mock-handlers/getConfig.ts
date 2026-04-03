'use client'

import { DEMO_CONFIG } from '../demo-data'
import type { GetConfigRequest, Config } from '@/gen/centy_pb'

// eslint-disable-next-line @typescript-eslint/require-await
export async function getConfig(request: GetConfigRequest): Promise<{
  success: boolean
  error: string
  config: Config
}> {
  if (request.projectPath) {
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
