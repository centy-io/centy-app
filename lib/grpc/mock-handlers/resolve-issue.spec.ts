import { describe, it, expect } from 'vitest'
import { findIssueByFlexibleId } from './resolve-issue'
import type { Issue } from '@/gen/centy_pb'

const MOCK_ISSUES: Issue[] = [
  {
    $typeName: 'centy.v1.Issue',
    id: 'abc-uuid-123',
    displayNumber: 42,
    issueNumber: 'abc-uuid-123',
    title: 'Implement dark mode toggle',
    description: '',
  },
  {
    $typeName: 'centy.v1.Issue',
    id: 'def-uuid-456',
    displayNumber: 7,
    issueNumber: 'def-uuid-456',
    title: 'Fix login bug',
    description: '',
  },
]

describe('findIssueByFlexibleId', () => {
  it('resolves by UUID', () => {
    const result = findIssueByFlexibleId(MOCK_ISSUES, 'abc-uuid-123')
    expect(result).toBeDefined()
    expect(result!.id).toBe('abc-uuid-123')
  })

  it('resolves by display number', () => {
    const result = findIssueByFlexibleId(MOCK_ISSUES, '42')
    expect(result).toBeDefined()
    expect(result!.id).toBe('abc-uuid-123')
  })

  it('resolves by slug ID', () => {
    const result = findIssueByFlexibleId(MOCK_ISSUES, 'fix-login-bug')
    expect(result).toBeDefined()
    expect(result!.id).toBe('def-uuid-456')
  })

  it('returns undefined for no match', () => {
    const result = findIssueByFlexibleId(MOCK_ISSUES, 'nonexistent')
    expect(result).toBeUndefined()
  })

  it('prefers UUID match over slug', () => {
    const result = findIssueByFlexibleId(MOCK_ISSUES, 'def-uuid-456')
    expect(result).toBeDefined()
    expect(result!.id).toBe('def-uuid-456')
  })
})
