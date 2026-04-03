import type { IssueMetadata } from '@/gen/centy_pb'

const FIXED_DATE = '2024-01-15T10:30:00.000Z'

export function createMockIssueMetadata(
  overrides?: Partial<IssueMetadata>
): IssueMetadata {
  const resolvedMetaOverrides = overrides ?? {}
  const now = FIXED_DATE

  return {
    displayNumber: resolvedMetaOverrides.displayNumber ?? 1,
    status: resolvedMetaOverrides.status ?? 'open',
    priority: resolvedMetaOverrides.priority ?? 2,
    priorityLabel: resolvedMetaOverrides.priorityLabel ?? 'medium',
    createdAt: resolvedMetaOverrides.createdAt ?? now,
    updatedAt: resolvedMetaOverrides.updatedAt ?? now,
    customFields: resolvedMetaOverrides.customFields ?? {},
    draft: resolvedMetaOverrides.draft ?? false,
    deletedAt: resolvedMetaOverrides.deletedAt ?? '',
    isOrgIssue: resolvedMetaOverrides.isOrgIssue ?? false,
    orgSlug: resolvedMetaOverrides.orgSlug ?? '',
    orgDisplayNumber: resolvedMetaOverrides.orgDisplayNumber ?? 0,
    $typeName: 'centy.v1.IssueMetadata',
  }
}
