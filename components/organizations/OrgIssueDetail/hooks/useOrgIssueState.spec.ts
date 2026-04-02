import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useOrgIssueState } from './useOrgIssueState'

describe('useOrgIssueState', () => {
  it('returns initial state values', () => {
    const { result } = renderHook(() => useOrgIssueState())
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeNull()
    expect(result.current.issue).toBeNull()
    expect(result.current.orgProjectPath).toBeNull()
    expect(result.current.isEditing).toBe(false)
  })
})
