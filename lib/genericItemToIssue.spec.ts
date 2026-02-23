import { describe, it, expect } from 'vitest'
import { create } from '@bufbuild/protobuf'
import { genericItemToIssue } from './genericItemToIssue'
import { GenericItemSchema, GenericItemMetadataSchema } from '@/gen/centy_pb'

describe('genericItemToIssue', () => {
  it('converts a GenericItem with full metadata to an Issue', () => {
    const item = create(GenericItemSchema, {
      id: 'issue-1',
      title: 'Test Issue',
      body: 'Test body',
      metadata: create(GenericItemMetadataSchema, {
        displayNumber: 42,
        status: 'open',
        priority: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
        deletedAt: '',
        customFields: {
          priority_label: 'High',
          draft: 'false',
          is_org_issue: 'false',
          org_slug: '',
          org_display_number: '0',
        },
      }),
    })

    const issue = genericItemToIssue(item)

    expect(issue.id).toBe('issue-1')
    expect(issue.title).toBe('Test Issue')
    expect(issue.description).toBe('Test body')
    expect(issue.metadata && issue.metadata.displayNumber).toBe(42)
    expect(issue.metadata && issue.metadata.status).toBe('open')
    expect(issue.metadata && issue.metadata.priorityLabel).toBe('High')
  })

  it('converts a GenericItem without metadata gracefully', () => {
    const item = create(GenericItemSchema, {
      id: 'issue-2',
      title: 'No Meta',
      body: '',
    })

    const issue = genericItemToIssue(item)

    expect(issue.id).toBe('issue-2')
    expect(issue.metadata && issue.metadata.displayNumber).toBe(0)
    expect(issue.metadata && issue.metadata.status).toBe('')
    expect(issue.metadata && issue.metadata.priorityLabel).toBe('')
  })
})
