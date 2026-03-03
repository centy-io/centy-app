'use client'

import { DEMO_ISSUES } from '../demo-data'
import type {
  GetItemRequest,
  GetItemResponse,
  GenericItem,
  Issue,
} from '@/gen/centy_pb'

function issueToGenericItem(issue: Issue): GenericItem {
  const meta = issue.metadata
  return {
    $typeName: 'centy.v1.GenericItem',
    id: issue.id,
    itemType: 'issues',
    title: issue.title,
    body: issue.description,
    metadata: {
      $typeName: 'centy.v1.GenericItemMetadata',
      displayNumber: (meta && meta.displayNumber) || 0,
      status: (meta && meta.status) || '',
      priority: (meta && meta.priority) || 0,
      createdAt: (meta && meta.createdAt) || '',
      updatedAt: (meta && meta.updatedAt) || '',
      deletedAt: (meta && meta.deletedAt) || '',
      customFields: {
        priority_label: (meta && meta.priorityLabel) || '',
        draft: String((meta && meta.draft) || false),
        is_org_issue: String((meta && meta.isOrgIssue) || false),
        org_slug: (meta && meta.orgSlug) || '',
        org_display_number: String((meta && meta.orgDisplayNumber) || 0),
      },
    },
  }
}

export async function getItem(
  request: GetItemRequest
): Promise<GetItemResponse> {
  if (request.itemType === 'issues') {
    const issue = DEMO_ISSUES.find(i => i.id === request.itemId)
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
  return {
    $typeName: 'centy.v1.GetItemResponse',
    success: false,
    error: `Unknown item type: ${request.itemType}`,
  }
}
