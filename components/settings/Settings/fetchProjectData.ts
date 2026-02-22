import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  GetConfigRequestSchema,
  GetManifestRequestSchema,
  type Config,
  type Manifest,
} from '@/gen/centy_pb'

interface FetchResult {
  config?: Config
  manifest?: Manifest
  error?: string
}

export async function fetchProjectData(
  projectPath: string
): Promise<FetchResult> {
  const result: FetchResult = {}

  const configRequest = create(GetConfigRequestSchema, {
    projectPath: projectPath.trim(),
  })
  const configResponse = await centyClient.getConfig(configRequest)
  if (configResponse.config) {
    result.config = configResponse.config
  } else {
    result.error = configResponse.error || 'Failed to load configuration'
    return result
  }

  const manifestRequest = create(GetManifestRequestSchema, {
    projectPath: projectPath.trim(),
  })
  const manifestResponse = await centyClient.getManifest(manifestRequest)
  if (manifestResponse.manifest) {
    result.manifest = manifestResponse.manifest
  }

  return result
}
