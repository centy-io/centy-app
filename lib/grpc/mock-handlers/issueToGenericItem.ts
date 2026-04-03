'use client'

import type { GenericItem, Issue } from '@/gen/centy_pb'

export function issueToGenericItem(issue: Issue): GenericItem {
  const meta = issue.metadata
  return {
    $typeName: 'centy.v1.GenericItem',
    id: issue.id,
    itemType: 'issues',
    title: issue.title,
    body: issue.description,
    metadata: {
      $typeName: 'centy.v1.GenericItemMetadata',
      displayNumber: (meta && meta.displayNumber) ?? 0,
      status: (meta && meta.status) ?? '',
      priority: (meta && meta.priority) ?? 0,
      createdAt: (meta && meta.createdAt) ?? '',
      updatedAt: (meta && meta.updatedAt) ?? '',
      deletedAt: (meta && meta.deletedAt) ?? '',
      customFields: {
        priority_label: (meta && meta.priorityLabel) ?? '',
        draft: String((meta && meta.draft) ?? false),
        is_org_issue: String((meta && meta.isOrgIssue) ?? false),
        org_slug: (meta && meta.orgSlug) ?? '',
        org_display_number: String((meta && meta.orgDisplayNumber) ?? 0),
      },
      tags: [],
    },
  }
}
