import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  GetConfigRequestSchema,
  GetManifestRequestSchema,
  GetDaemonInfoRequestSchema,
  type Config,
  type Manifest,
  type DaemonInfo,
} from '@/gen/centy_pb'

interface FetchProjectDataResult {
  config?: Config
  manifest?: Manifest
  error?: string
}

export async function fetchSettingsProjectData(
  projectPath: string
): Promise<FetchProjectDataResult> {
  const configRequest = create(GetConfigRequestSchema, {
    projectPath: projectPath.trim(),
  })
  const configResponse = await centyClient.getConfig(configRequest)

  if (!configResponse.config) {
    return {
      error: configResponse.error || 'Failed to load configuration',
    }
  }

  const manifestRequest = create(GetManifestRequestSchema, {
    projectPath: projectPath.trim(),
  })
  const manifestResponse = await centyClient.getManifest(manifestRequest)

  return {
    config: configResponse.config,
    manifest: manifestResponse.manifest ?? undefined,
  }
}

export async function fetchDaemonInfoData(): Promise<DaemonInfo | null> {
  try {
    const request = create(GetDaemonInfoRequestSchema, {})
    return await centyClient.getDaemonInfo(request)
  } catch (err) {
    console.error('Failed to fetch daemon info:', err)
    return null
  }
}
