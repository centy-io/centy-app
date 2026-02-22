import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  UpdateConfigRequestSchema,
  type Config,
} from '@/gen/centy_pb'

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
