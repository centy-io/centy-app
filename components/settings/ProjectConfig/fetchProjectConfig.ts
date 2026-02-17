import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  GetConfigRequestSchema,
  GetManifestRequestSchema,
  type Config,
  type Manifest,
} from '@/gen/centy_pb'

interface FetchProjectConfigResult {
  config?: Config
  manifest?: Manifest
  error?: string
}

export async function fetchProjectConfig(
  projectPath: string
): Promise<FetchProjectConfigResult> {
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
