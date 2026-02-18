'use client'

import { type IssueMetadata } from '@/gen/centy_pb'

// Helper to create issue metadata
export function createIssueMetadata(
  displayNumber: number,
  status: string,
  priority: number,
  createdAt: string,
  updatedAt: string,
  customFields: Record<string, string> = {},
  draft = false
): IssueMetadata {
  return {
    $typeName: 'centy.v1.IssueMetadata',
    displayNumber,
    status,
    priority,
    priorityLabel: priority === 1 ? 'high' : priority === 2 ? 'medium' : 'low',
    createdAt,
    updatedAt,
    customFields,
    draft,
    deletedAt: '',
    isOrgIssue: false,
    orgSlug: '',
    orgDisplayNumber: 0,
  }
}
