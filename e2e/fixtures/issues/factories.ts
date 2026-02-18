/* eslint-disable max-lines */
import type { Issue, IssueMetadata } from '@/gen/centy_pb'

/**
 * Fixed date for deterministic visual tests.
 */
const FIXED_DATE = '2024-01-15T10:30:00.000Z'

/**
 * Creates a mock issue with default values that can be overridden.
 */
export function createMockIssue(overrides?: Partial<Issue>): Issue {
  const resolvedOverrides = overrides !== undefined ? overrides : {}
  const displayNumber =
    resolvedOverrides.displayNumber !== undefined
      ? resolvedOverrides.displayNumber
      : 1
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
    id:
      resolvedOverrides.id !== undefined
        ? resolvedOverrides.id
        : `issue-${displayNumber}`,
    displayNumber,
    issueNumber:
      resolvedOverrides.issueNumber !== undefined
        ? resolvedOverrides.issueNumber
        : `uuid-${displayNumber}`,
    title:
      resolvedOverrides.title !== undefined
        ? resolvedOverrides.title
        : `Test Issue ${displayNumber}`,
    description:
      resolvedOverrides.description !== undefined
        ? resolvedOverrides.description
        : `Description for issue ${displayNumber}`,
    metadata: {
      ...defaultMetadata,
      ...resolvedOverrides.metadata,
    },
    $typeName: 'centy.v1.Issue',
  }
}

/**
 * Creates a mock issue metadata object.
 */
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
