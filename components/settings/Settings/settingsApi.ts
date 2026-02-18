import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  GetConfigRequestSchema,
  GetManifestRequestSchema,
  IsInitializedRequestSchema,
  UpdateConfigRequestSchema,
  type Config,
  type Manifest,
} from '@/gen/centy_pb'

interface FetchResult {
  config?: Config
  manifest?: Manifest
  error?: string
}

export async function checkProjectInitialized(
  path: string
): Promise<boolean | null> {
  if (!path.trim()) return null
  try {
    const request = create(IsInitializedRequestSchema, {
      projectPath: path.trim(),
    })
    const response = await centyClient.isInitialized(request)
    return response.initialized
  } catch {
    return false
  }
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

interface SaveResult {
  config?: Config
  error?: string
}

export async function saveConfig(
  projectPath: string,
  config: Config
): Promise<SaveResult> {
  const request = create(UpdateConfigRequestSchema, {
    projectPath: projectPath.trim(),
    config: config,
  })
  const response = await centyClient.updateConfig(request)
  if (response.success && response.config) {
    return { config: response.config }
  }
  return { error: response.error || 'Failed to save configuration' }
}
