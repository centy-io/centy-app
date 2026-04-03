import { create } from '@bufbuild/protobuf'
import type { TitleScope } from './TitleScope'
import type { TitleActionResult } from './TitleActionResult'
import { centyClient } from '@/lib/grpc/client'
import {
  SetProjectUserTitleRequestSchema,
  SetProjectTitleRequestSchema,
} from '@/gen/centy_pb'

export async function saveTitle(
  projectPath: string,
  scope: TitleScope,
  userTitle: string,
  projectTitle: string
): Promise<TitleActionResult> {
  if (scope === 'user') {
    const request = create(SetProjectUserTitleRequestSchema, {
      projectPath,
      title: userTitle,
    })
    const response = await centyClient.setProjectUserTitle(request)
    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to save user title',
      }
    }
    return {
      success: true,
      project: response.project ?? undefined,
      message: 'User title saved successfully',
    }
  }

  const request = create(SetProjectTitleRequestSchema, {
    projectPath,
    title: projectTitle,
  })
  const response = await centyClient.setProjectTitle(request)
  if (!response.success) {
    return {
      success: false,
      error: response.error || 'Failed to save project title',
    }
  }
  return {
    success: true,
    project: response.project ?? undefined,
    message: 'Project title saved successfully',
  }
}
