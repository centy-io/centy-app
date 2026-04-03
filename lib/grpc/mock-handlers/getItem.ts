'use client'

import { DEMO_ISSUES, DEMO_DOCS } from '../demo-data'
import { findIssueByFlexibleId } from './resolve-issue'
import { issueToGenericItem } from './issueToGenericItem'
import { docToGenericItem } from './docToGenericItem'
import type { GetItemRequest, GetItemResponse } from '@/gen/centy_pb'

// eslint-disable-next-line @typescript-eslint/require-await
export async function getItem(
  request: GetItemRequest
): Promise<GetItemResponse> {
  if (request.itemType === 'issues') {
    const issue = findIssueByFlexibleId(DEMO_ISSUES, request.itemId)
    if (issue) {
      return {
        $typeName: 'centy.v1.GetItemResponse',
        success: true,
        error: '',
        item: issueToGenericItem(issue),
      }
    }
    return {
      $typeName: 'centy.v1.GetItemResponse',
      success: false,
      error: `Issue ${request.itemId} not found`,
    }
  }

  if (request.itemType === 'docs') {
    const doc = DEMO_DOCS.find(d => d.slug === request.itemId)
    if (doc) {
      return {
        $typeName: 'centy.v1.GetItemResponse',
        success: true,
        error: '',
        item: docToGenericItem(doc),
      }
    }
    return {
      $typeName: 'centy.v1.GetItemResponse',
      success: false,
      error: `Doc ${request.itemId} not found`,
    }
  }

  return {
    $typeName: 'centy.v1.GetItemResponse',
    success: false,
    error: `Unknown item type: ${request.itemType}`,
  }
}
