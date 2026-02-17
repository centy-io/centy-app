import type { Issue, IssueMetadata } from '@/gen/centy_pb'

/**
 * Creates a mock issue with default values that can be overridden.
 */
// Fixed date for deterministic visual tests
const FIXED_DATE = '2024-01-15T10:30:00.000Z'

export function createMockIssue(overrides: Partial<Issue> = {}): Issue {
  const displayNumber = overrides.displayNumber ?? 1
  const now = FIXED_DATE

  const defaultMetadata: IssueMetadata = {
    displayNumber,
    status: 'open',
    priority: 2,
    priorityLabel: 'medium',
    createdAt: now,
    updatedAt: now,
    customFields: {},
    draft: false,
    deletedAt: '',
    isOrgIssue: false,
    orgSlug: '',
    orgDisplayNumber: 0,
    $typeName: 'centy.v1.IssueMetadata',
  }

  return {
    id: overrides.id ?? `issue-${displayNumber}`,
    displayNumber,
    issueNumber: overrides.issueNumber ?? `uuid-${displayNumber}`,
    title: overrides.title ?? `Test Issue ${displayNumber}`,
    description:
      overrides.description ?? `Description for issue ${displayNumber}`,
    metadata: {
      ...defaultMetadata,
      ...overrides.metadata,
    },
    $typeName: 'centy.v1.Issue',
  }
}

/**
 * Creates a mock issue metadata object.
 */
export function createMockIssueMetadata(
  overrides: Partial<IssueMetadata> = {}
): IssueMetadata {
  const now = FIXED_DATE

  return {
    displayNumber: overrides.displayNumber ?? 1,
    status: overrides.status ?? 'open',
    priority: overrides.priority ?? 2,
    priorityLabel: overrides.priorityLabel ?? 'medium',
    createdAt: overrides.createdAt ?? now,
    updatedAt: overrides.updatedAt ?? now,
    customFields: overrides.customFields ?? {},
    draft: overrides.draft ?? false,
    deletedAt: overrides.deletedAt ?? '',
    isOrgIssue: overrides.isOrgIssue ?? false,
    orgSlug: overrides.orgSlug ?? '',
    orgDisplayNumber: overrides.orgDisplayNumber ?? 0,
    $typeName: 'centy.v1.IssueMetadata',
  }
}
