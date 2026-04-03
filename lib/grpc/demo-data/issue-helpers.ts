'use client'

import { type IssueMetadata } from '@/gen/centy_pb'
import { getPriorityLabel } from '@/components/shared/getPriorityLabel'

// Helper to create issue metadata
export function createIssueMetadata(
  displayNumber: number,
  status: string,
  priority: number,
  createdAt: string,
  updatedAt: string,
  customFields?: Record<string, string>,
  draft?: boolean
): IssueMetadata {
  const resolvedCustomFields = customFields !== undefined ? customFields : {}
  const resolvedDraft = draft !== undefined ? draft : false
  return {
    $typeName: 'centy.v1.IssueMetadata',
    displayNumber,
    status,
    priority,
    priorityLabel: getPriorityLabel(priority).toLowerCase(),
    createdAt,
    updatedAt,
    customFields: resolvedCustomFields,
    draft: resolvedDraft,
    deletedAt: '',
    isOrgIssue: false,
    orgSlug: '',
    orgDisplayNumber: 0,
  }
}
