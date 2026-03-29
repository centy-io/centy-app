import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useOrgIssueMutations } from './useOrgIssueMutations'

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))
vi.mock('./performSaveIssue', () => ({ performSaveIssue: vi.fn() }))
vi.mock('./performDeleteIssue', () => ({ performDeleteIssue: vi.fn() }))

describe('useOrgIssueMutations', () => {
  it('returns mutation handlers', () => {
    const params = {
      orgSlug: 'test-org',
      issueId: 'issue-1',
      orgProjectPath: null,
      issue: null,
      editTitle: '',
      editDescription: '',
      editPriority: 2,
      editStatus: 'open',
      setIssue: vi.fn(),
      setIsEditing: vi.fn(),
      setError: vi.fn(),
      setSaving: vi.fn(),
      setDeleteError: vi.fn(),
      setDeleting: vi.fn(),
      setEditTitle: vi.fn(),
      setEditDescription: vi.fn(),
      setEditPriority: vi.fn(),
      setEditStatus: vi.fn(),
    }
    const { result } = renderHook(() => useOrgIssueMutations(params))
    expect(typeof result.current.handleSave).toBe('function')
    expect(typeof result.current.handleDelete).toBe('function')
    expect(typeof result.current.handleCancelEdit).toBe('function')
  })
})
