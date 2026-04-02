import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useOrgListState } from './useOrgListState'

describe('useOrgListState', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useOrgListState())
    expect(result.current.organizations).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.deleting).toBe(false)
  })
})
