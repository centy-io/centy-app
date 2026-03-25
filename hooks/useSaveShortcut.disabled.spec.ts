import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSaveShortcut } from './useSaveShortcut'

const mockOnSave = vi.fn()

const fireKeyboardEvent = (options: Partial<KeyboardEvent>) => {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    ...options,
  })
  window.dispatchEvent(event)
  return event
}

describe('useSaveShortcut - disabled state', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not call onSave when disabled', () => {
    renderHook(() => useSaveShortcut({ onSave: mockOnSave, enabled: false }))

    fireKeyboardEvent({ key: 's', ctrlKey: true })

    expect(mockOnSave).not.toHaveBeenCalled()
  })

  it('should re-enable when enabled changes from false to true', () => {
    const { rerender } = renderHook(
      ({ enabled }) => useSaveShortcut({ onSave: mockOnSave, enabled }),
      { initialProps: { enabled: false } }
    )

    fireKeyboardEvent({ key: 's', ctrlKey: true })
    expect(mockOnSave).not.toHaveBeenCalled()

    rerender({ enabled: true })

    fireKeyboardEvent({ key: 's', ctrlKey: true })
    expect(mockOnSave).toHaveBeenCalledTimes(1)
  })
})

describe('useSaveShortcut - preventDefault behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should prevent default browser behavior', () => {
    renderHook(() => useSaveShortcut({ onSave: mockOnSave }))

    const preventDefaultSpy = vi.fn()
    const event = new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    })
    Object.defineProperty(event, 'preventDefault', { value: preventDefaultSpy })
    window.dispatchEvent(event)

    expect(preventDefaultSpy).toHaveBeenCalled()
  })

  it('should prevent default even when disabled (to block browser save)', () => {
    renderHook(() => useSaveShortcut({ onSave: mockOnSave, enabled: false }))

    const preventDefaultSpy = vi.fn()
    const event = new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    })
    Object.defineProperty(event, 'preventDefault', { value: preventDefaultSpy })
    window.dispatchEvent(event)

    expect(preventDefaultSpy).toHaveBeenCalled()
    expect(mockOnSave).not.toHaveBeenCalled()
  })

  it('should use latest onSave callback', () => {
    const firstCallback = vi.fn()
    const secondCallback = vi.fn()

    const { rerender } = renderHook(
      ({ onSave }) => useSaveShortcut({ onSave }),
      { initialProps: { onSave: firstCallback } }
    )

    rerender({ onSave: secondCallback })

    fireKeyboardEvent({ key: 's', ctrlKey: true })

    expect(firstCallback).not.toHaveBeenCalled()
    expect(secondCallback).toHaveBeenCalledTimes(1)
  })
})
