import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useOrgDetailState } from './useOrgDetailState'

describe('useOrgDetailState', () => {
  it('returns initial state values', () => {
    const { result } = renderHook(() => useOrgDetailState())
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeNull()
    expect(result.current.organization).toBeNull()
    expect(result.current.isEditing).toBe(false)
    expect(result.current.projects).toEqual([])
  })
})
