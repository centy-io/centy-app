import type { IssueMetadata } from '@/gen/centy_pb'

const FIXED_DATE = '2024-01-15T10:30:00.000Z'

export function createMockIssueMetadata(
  overrides?: Partial<IssueMetadata>
): IssueMetadata {
  const resolvedMetaOverrides = overrides !== undefined ? overrides : {}
  const now = FIXED_DATE

  return {
    displayNumber:
      resolvedMetaOverrides.displayNumber !== undefined
        ? resolvedMetaOverrides.displayNumber
        : 1,
    status:
      resolvedMetaOverrides.status !== undefined
        ? resolvedMetaOverrides.status
        : 'open',
    priority:
      resolvedMetaOverrides.priority !== undefined
        ? resolvedMetaOverrides.priority
        : 2,
    priorityLabel:
      resolvedMetaOverrides.priorityLabel !== undefined
        ? resolvedMetaOverrides.priorityLabel
        : 'medium',
    createdAt:
      resolvedMetaOverrides.createdAt !== undefined
        ? resolvedMetaOverrides.createdAt
        : now,
    updatedAt:
      resolvedMetaOverrides.updatedAt !== undefined
        ? resolvedMetaOverrides.updatedAt
        : now,
    customFields:
      resolvedMetaOverrides.customFields !== undefined
        ? resolvedMetaOverrides.customFields
        : {},
    draft:
      resolvedMetaOverrides.draft !== undefined
        ? resolvedMetaOverrides.draft
        : false,
    deletedAt:
      resolvedMetaOverrides.deletedAt !== undefined
        ? resolvedMetaOverrides.deletedAt
        : '',
    isOrgIssue:
      resolvedMetaOverrides.isOrgIssue !== undefined
        ? resolvedMetaOverrides.isOrgIssue
        : false,
    orgSlug:
      resolvedMetaOverrides.orgSlug !== undefined
        ? resolvedMetaOverrides.orgSlug
        : '',
    orgDisplayNumber:
      resolvedMetaOverrides.orgDisplayNumber !== undefined
        ? resolvedMetaOverrides.orgDisplayNumber
        : 0,
    $typeName: 'centy.v1.IssueMetadata',
  }
}
