'use client'

import { DEMO_ORG_SLUG } from './constants'
import { type Issue } from '@/gen/centy_pb'

// Demo organization-level issues
export const DEMO_ORG_ISSUES: Issue[] = [
  {
    $typeName: 'centy.v1.Issue',
    id: 'demo-org-issue-1',
    displayNumber: 101,
    issueNumber: 'demo-org-issue-1',
    title: 'Establish org-wide coding standards',
    description: `## Goal
Define and document coding standards that apply across all projects in the organization.

## Areas to Cover
- TypeScript strict mode requirements
- File and folder naming conventions
- Component structure patterns
- Testing coverage minimums
- Code review process`,
    metadata: {
      $typeName: 'centy.v1.IssueMetadata',
      displayNumber: 101,
      status: 'open',
      priority: 1,
      priorityLabel: 'high',
      createdAt: '2024-12-01T09:00:00Z',
      updatedAt: '2024-12-18T12:00:00Z',
      customFields: { scope: 'organization' },
      draft: false,
      deletedAt: '',
      isOrgIssue: true,
      orgSlug: DEMO_ORG_SLUG,
      orgDisplayNumber: 1,
    },
  },
  {
    $typeName: 'centy.v1.Issue',
    id: 'demo-org-issue-2',
    displayNumber: 102,
    issueNumber: 'demo-org-issue-2',
    title: 'Set up shared CI/CD pipeline templates',
    description: `## Objective
Create reusable GitHub Actions workflow templates for all org projects.

## Deliverables
- Shared lint and test workflow
- Docker build and push workflow
- Semantic release workflow
- Security scanning workflow`,
    metadata: {
      $typeName: 'centy.v1.IssueMetadata',
      displayNumber: 102,
      status: 'in-progress',
      priority: 2,
      priorityLabel: 'medium',
      createdAt: '2024-12-05T14:00:00Z',
      updatedAt: '2024-12-19T10:00:00Z',
      customFields: { scope: 'organization' },
      draft: false,
      deletedAt: '',
      isOrgIssue: true,
      orgSlug: DEMO_ORG_SLUG,
      orgDisplayNumber: 2,
    },
  },
]
