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
      displayNumber: meta?.displayNumber ?? 0,
      status: meta?.status ?? '',
      priority: meta?.priority ?? 0,
      createdAt: meta?.createdAt ?? '',
      updatedAt: meta?.updatedAt ?? '',
      deletedAt: meta?.deletedAt ?? '',
      customFields: {
        priority_label: meta?.priorityLabel ?? '',
        draft: String(meta?.draft ?? false),
        is_org_issue: String(meta?.isOrgIssue ?? false),
        org_slug: meta?.orgSlug ?? '',
        org_display_number: String(meta?.orgDisplayNumber ?? 0),
      },
      tags: [],
      projects: [],
    },
  }
}
