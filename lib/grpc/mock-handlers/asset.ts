'use client'

import { DEMO_PROJECT_PATH, DEMO_ASSETS } from '../demo-data'
import type { ListAssetsRequest, ListAssetsResponse } from '@/gen/centy_pb'

export async function listAssets(
  request: ListAssetsRequest
): Promise<ListAssetsResponse> {
  if (request.projectPath !== DEMO_PROJECT_PATH) {
    return {
      $typeName: 'centy.v1.ListAssetsResponse',
      assets: [],
      totalCount: 0,
      success: true,
      error: '',
    }
  }

  return {
    $typeName: 'centy.v1.ListAssetsResponse',
    assets: DEMO_ASSETS,
    totalCount: DEMO_ASSETS.length,
    success: true,
    error: '',
  }
}

export async function listSharedAssets(
  request: ListAssetsRequest
): Promise<ListAssetsResponse> {
  if (request.projectPath !== DEMO_PROJECT_PATH) {
    return {
      $typeName: 'centy.v1.ListAssetsResponse',
      assets: [],
      totalCount: 0,
      success: true,
      error: '',
    }
  }

  return {
    $typeName: 'centy.v1.ListAssetsResponse',
    assets: DEMO_ASSETS,
    totalCount: DEMO_ASSETS.length,
    success: true,
    error: '',
  }
}
