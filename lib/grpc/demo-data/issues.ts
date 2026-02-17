'use client'

import { type Issue } from '@/gen/centy_pb'
import { createIssueMetadata } from './issue-helpers'

// Demo issues 1-3
export const DEMO_ISSUES_PART1: Issue[] = [
  {
    $typeName: 'centy.v1.Issue',
    id: 'demo-issue-1',
    displayNumber: 1,
    issueNumber: 'demo-issue-1',
    title: 'Implement dark mode toggle',
    description: `## Overview
Add a dark mode toggle to the application settings that allows users to switch between light and dark themes.

## Requirements
- Toggle switch in settings panel
- Persist user preference in localStorage
- Smooth transition between themes
- Support system preference detection

## Acceptance Criteria
- [ ] Dark mode toggle is visible in settings
- [ ] Theme persists across page reloads
- [ ] Respects system preference by default`,
    metadata: createIssueMetadata(
      1,
      'open',
      1,
      '2024-12-01T10:00:00Z',
      '2024-12-15T14:30:00Z',
      { component: 'ui', effort: 'medium' }
    ),
  },
  {
    $typeName: 'centy.v1.Issue',
    id: 'demo-issue-2',
    displayNumber: 2,
    issueNumber: 'demo-issue-2',
    title: 'Fix login timeout issue',
    description: `## Bug Description
Users are being logged out unexpectedly after 5 minutes of inactivity instead of the configured 30 minutes.

## Steps to Reproduce
1. Log into the application
2. Leave the browser idle for 5 minutes
3. Try to perform any action
4. User is redirected to login page

## Expected Behavior
Session should remain active for 30 minutes of inactivity.

## Root Cause Analysis
Investigating the session management middleware...`,
    metadata: createIssueMetadata(
      2,
      'in-progress',
      2,
      '2024-12-05T09:00:00Z',
      '2024-12-18T11:00:00Z',
      { component: 'auth', effort: 'small' }
    ),
  },
  {
    $typeName: 'centy.v1.Issue',
    id: 'demo-issue-3',
    displayNumber: 3,
    issueNumber: 'demo-issue-3',
    title: 'Update API documentation',
    description: `## Task
Update the API documentation to reflect the new endpoints added in v2.0.

## Sections to Update
- Authentication endpoints
- User management endpoints
- Project endpoints
- Webhook configurations

## Notes
Include example requests and responses for each endpoint.`,
    metadata: createIssueMetadata(
      3,
      'closed',
      3,
      '2024-11-20T14:00:00Z',
      '2024-12-01T16:00:00Z',
      { component: 'docs', effort: 'medium' },
      false
    ),
  },
]
