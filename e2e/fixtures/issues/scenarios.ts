import type { Issue } from '@/gen/centy_pb'
import { createMockIssue, createMockIssueMetadata } from './factories'

/**
 * Factory functions for common test scenarios.
 */
export const createIssueScenario = {
  /** Returns an empty array of issues */
  empty: (): Issue[] => [],

  /** Returns a single issue */
  single: (overrides: Partial<Issue> = {}): Issue[] => [
    createMockIssue(overrides),
  ],

  /** Returns multiple issues */
  many: (count: number): Issue[] =>
    Array.from({ length: count }, (_, i) =>
      createMockIssue({
        displayNumber: i + 1,
        title: `Issue ${i + 1}`,
      })
    ),

  /** Returns issues with different statuses */
  withStatuses: (): Issue[] => [
    createMockIssue({
      displayNumber: 1,
      title: 'Open Issue',
      metadata: createMockIssueMetadata({ displayNumber: 1, status: 'open' }),
    }),
    createMockIssue({
      displayNumber: 2,
      title: 'In Progress Issue',
      metadata: createMockIssueMetadata({
        displayNumber: 2,
        status: 'in-progress',
      }),
    }),
    createMockIssue({
      displayNumber: 3,
      title: 'Closed Issue',
      metadata: createMockIssueMetadata({
        displayNumber: 3,
        status: 'closed',
      }),
    }),
  ],

  /** Returns issues with different priorities */
  withPriorities: (): Issue[] => [
    createMockIssue({
      displayNumber: 1,
      title: 'High Priority Issue',
      metadata: createMockIssueMetadata({
        displayNumber: 1,
        priority: 3,
        priorityLabel: 'high',
      }),
    }),
    createMockIssue({
      displayNumber: 2,
      title: 'Medium Priority Issue',
      metadata: createMockIssueMetadata({
        displayNumber: 2,
        priority: 2,
        priorityLabel: 'medium',
      }),
    }),
    createMockIssue({
      displayNumber: 3,
      title: 'Low Priority Issue',
      metadata: createMockIssueMetadata({
        displayNumber: 3,
        priority: 1,
        priorityLabel: 'low',
      }),
    }),
  ],
}

/**
 * Default mock issues for general use.
 */
export const mockIssues: Issue[] = createIssueScenario.many(3)
