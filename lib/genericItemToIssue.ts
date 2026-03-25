import type { GenericItem } from '@/gen/centy_pb'
import type { Issue } from '@/gen/centy_pb'

/**
 * Convert a GenericItem (from the new generic items API) to the legacy Issue type.
 * Custom fields carry issue-specific metadata like draft, is_org_issue, org_slug, etc.
 */
export function genericItemToIssue(item: GenericItem): Issue {
  const meta = item.metadata
  const cf = (meta && meta.customFields) || {}

  return {
    $typeName: 'centy.v1.Issue',
    id: item.id,
    displayNumber: (meta && meta.displayNumber) || 0,
    issueNumber: item.id,
    title: item.title,
    description: item.body,
    metadata: {
      $typeName: 'centy.v1.IssueMetadata',
      displayNumber: (meta && meta.displayNumber) || 0,
      status: (meta && meta.status) || '',
      priority: (meta && meta.priority) || 0,
      createdAt: (meta && meta.createdAt) || '',
      updatedAt: (meta && meta.updatedAt) || '',
      customFields: {},
      priorityLabel: cf['priority_label'] || '',
      draft: cf['draft'] === 'true',
      deletedAt: (meta && meta.deletedAt) || '',
      isOrgIssue: cf['is_org_issue'] === 'true',
      orgSlug: cf['org_slug'] || '',
      orgDisplayNumber: cf['org_display_number']
        ? parseInt(cf['org_display_number'], 10)
        : 0,
    },
  }
}
