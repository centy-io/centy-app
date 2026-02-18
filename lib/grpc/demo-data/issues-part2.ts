'use client'

import { createIssueMetadata } from './issue-helpers'
import { type Issue } from '@/gen/centy_pb'

// Demo issues part 2 (issues 4-7)
export const DEMO_ISSUES_PART2: Issue[] = [
  {
    $typeName: 'centy.v1.Issue',
    id: 'demo-issue-4',
    displayNumber: 4,
    issueNumber: 'demo-issue-4',
    title: 'Add search functionality to project list',
    description: `## Feature Request
Implement a search bar in the project list view that allows users to quickly find projects by name or description.

## Requirements
- Real-time filtering as user types
- Search by project name
- Search by project description
- Highlight matching text
- Show "No results" message when appropriate`,
    metadata: createIssueMetadata(
      4,
      'open',
      2,
      '2024-12-10T11:00:00Z',
      '2024-12-17T09:00:00Z',
      { component: 'ui', effort: 'medium' }
    ),
  },
  {
    $typeName: 'centy.v1.Issue',
    id: 'demo-issue-5',
    displayNumber: 5,
    issueNumber: 'demo-issue-5',
    title: 'Performance optimization for large datasets',
    description: `## Problem
The application becomes slow when loading projects with more than 1000 issues.

## Proposed Solution
- Implement virtual scrolling for issue lists
- Add pagination to API endpoints
- Optimize database queries
- Add caching layer

## Technical Notes
This is still in the planning phase. Need to profile the application first.`,
    metadata: createIssueMetadata(
      5,
      'open',
      1,
      '2024-12-15T16:00:00Z',
      '2024-12-18T10:00:00Z',
      { component: 'performance', effort: 'large' },
      true
    ),
  },
  {
    $typeName: 'centy.v1.Issue',
    id: 'demo-issue-6',
    displayNumber: 6,
    issueNumber: 'demo-issue-6',
    title: 'Add keyboard shortcuts',
    description: `## Feature
Add keyboard shortcuts for common actions to improve productivity.

## Proposed Shortcuts
- \`Ctrl+K\` - Quick search
- \`Ctrl+N\` - New issue
- \`Ctrl+S\` - Save
- \`Esc\` - Close modal
- \`J/K\` - Navigate list`,
    metadata: createIssueMetadata(
      6,
      'for-validation',
      3,
      '2024-12-08T13:00:00Z',
      '2024-12-16T15:00:00Z',
      { component: 'ui', effort: 'small' }
    ),
  },
  {
    $typeName: 'centy.v1.Issue',
    id: 'demo-issue-7',
    displayNumber: 7,
    issueNumber: 'demo-issue-7',
    title: 'Implement webhook notifications',
    description: `## Feature
Allow users to configure webhooks to receive notifications when issues are created or updated.

## Requirements
- Webhook URL configuration
- Event type selection
- Secret key for verification
- Retry logic for failed deliveries
- Activity log for webhook calls`,
    metadata: createIssueMetadata(
      7,
      'open',
      2,
      '2024-12-12T10:00:00Z',
      '2024-12-18T08:00:00Z',
      { component: 'integrations', effort: 'large' }
    ),
  },
]
