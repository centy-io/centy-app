import { create } from '@bufbuild/protobuf'
import type { TitleScope } from './TitleScope'
import type { TitleActionResult } from './TitleActionResult'
import { centyClient } from '@/lib/grpc/client'
import {
  SetProjectUserTitleRequestSchema,
  SetProjectTitleRequestSchema,
} from '@/gen/centy_pb'

export async function clearTitle(
  projectPath: string,
  scope: TitleScope
): Promise<TitleActionResult> {
  if (scope === 'user') {
    const request = create(SetProjectUserTitleRequestSchema, {
      projectPath,
      title: '',
    })
    const response = await centyClient.setProjectUserTitle(request)
    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to clear user title',
      }
    }
    return {
      success: true,
      project: response.project || undefined,
      message: 'User title cleared',
    }
  }

  const request = create(SetProjectTitleRequestSchema, {
    projectPath,
    title: '',
  })
  const response = await centyClient.setProjectTitle(request)
  if (!response.success) {
    return {
      success: false,
      error: response.error || 'Failed to clear project title',
    }
  }
  return {
    success: true,
    project: response.project || undefined,
    message: 'Project title cleared',
  }
}
