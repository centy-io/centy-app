'use client'

import { type Issue } from '@/gen/centy_pb'
import { createIssueMetadata } from './issue-helpers'

// Demo issues 6-7
export const DEMO_ISSUES_PART3: Issue[] = [
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
