import type { Issue, IssueMetadata } from '@/gen/centy_pb'

/**
 * Fixed date for deterministic visual tests.
 */
const FIXED_DATE = '2024-01-15T10:30:00.000Z'

/**
 * Creates a mock issue with default values that can be overridden.
 */
export function createMockIssue(overrides: Partial<Issue> = {}): Issue {
  const displayNumber =
    overrides.displayNumber !== undefined ? overrides.displayNumber : 1
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
    id: overrides.id !== undefined ? overrides.id : `issue-${displayNumber}`,
    displayNumber,
    issueNumber:
      overrides.issueNumber !== undefined
        ? overrides.issueNumber
        : `uuid-${displayNumber}`,
    title:
      overrides.title !== undefined
        ? overrides.title
        : `Test Issue ${displayNumber}`,
    description:
      overrides.description !== undefined
        ? overrides.description
        : `Description for issue ${displayNumber}`,
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
    displayNumber:
      overrides.displayNumber !== undefined ? overrides.displayNumber : 1,
    status: overrides.status !== undefined ? overrides.status : 'open',
    priority: overrides.priority !== undefined ? overrides.priority : 2,
    priorityLabel:
      overrides.priorityLabel !== undefined
        ? overrides.priorityLabel
        : 'medium',
    createdAt: overrides.createdAt !== undefined ? overrides.createdAt : now,
    updatedAt: overrides.updatedAt !== undefined ? overrides.updatedAt : now,
    customFields:
      overrides.customFields !== undefined ? overrides.customFields : {},
    draft: overrides.draft !== undefined ? overrides.draft : false,
    deletedAt: overrides.deletedAt !== undefined ? overrides.deletedAt : '',
    isOrgIssue:
      overrides.isOrgIssue !== undefined ? overrides.isOrgIssue : false,
    orgSlug: overrides.orgSlug !== undefined ? overrides.orgSlug : '',
    orgDisplayNumber:
      overrides.orgDisplayNumber !== undefined ? overrides.orgDisplayNumber : 0,
    $typeName: 'centy.v1.IssueMetadata',
  }
}
