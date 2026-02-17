'use client'

import { type Issue } from '@/gen/centy_pb'
import { createIssueMetadata } from './issue-helpers'

// Demo issues 4-5
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
]
