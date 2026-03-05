import { describe, it, expect, vi } from 'vitest'
import { callItemApi } from './callItemApi'

describe('callItemApi', () => {
  it('calls the api function and returns the response', async () => {
    const mockFn = vi.fn().mockResolvedValueOnce({ success: true, error: '' })
    const setLoading = vi.fn()
    const setError = vi.fn()

    const result = await callItemApi(mockFn, setLoading, setError)

    expect(mockFn).toHaveBeenCalled()
    expect(result).toEqual({ success: true, error: '' })
    expect(setLoading).toHaveBeenCalledWith(true)
    expect(setLoading).toHaveBeenCalledWith(false)
    expect(setError).toHaveBeenCalledWith(null)
  })

  it('sets error and returns null when api throws', async () => {
    const err = new Error()
    err.message = 'Connection refused'
    const mockFn = vi.fn().mockRejectedValueOnce(err)
    const setLoading = vi.fn()
    const setError = vi.fn()

    const result = await callItemApi(mockFn, setLoading, setError)

    expect(result).toBeNull()
    expect(setError).toHaveBeenCalledWith('Connection refused')
    expect(setLoading).toHaveBeenCalledWith(false)
  })
})
