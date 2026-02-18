import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  SetProjectUserTitleRequestSchema,
  SetProjectTitleRequestSchema,
  type ProjectInfo,
} from '@/gen/centy_pb'
import type { TitleScope } from './useProjectTitle'

export interface TitleActionResult {
  success: boolean
  project?: ProjectInfo
  error?: string
  message?: string
}

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
      project: response.project || undefined,
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
    project: response.project || undefined,
    message: 'Project title saved successfully',
  }
}

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
