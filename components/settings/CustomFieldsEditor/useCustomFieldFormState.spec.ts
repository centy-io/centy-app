import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCustomFieldFormState } from './useCustomFieldFormState'

describe('useCustomFieldFormState', () => {
  it('returns initial state when no field provided', () => {
    const { result } = renderHook(() => useCustomFieldFormState(undefined))
    expect(result.current.name).toBe('')
    expect(result.current.fieldType).toBe('string')
    expect(result.current.required).toBe(false)
    expect(result.current.enumValues).toEqual([])
  })
})
