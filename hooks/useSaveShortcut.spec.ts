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

describe('useSaveShortcut - key combinations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call onSave when Ctrl+S is pressed', () => {
    renderHook(() => useSaveShortcut({ onSave: mockOnSave }))

    fireKeyboardEvent({ key: 's', ctrlKey: true })

    expect(mockOnSave).toHaveBeenCalledTimes(1)
  })

  it('should call onSave when Cmd+S (metaKey) is pressed', () => {
    renderHook(() => useSaveShortcut({ onSave: mockOnSave }))

    fireKeyboardEvent({ key: 's', metaKey: true })

    expect(mockOnSave).toHaveBeenCalledTimes(1)
  })

  it('should call onSave with uppercase S key', () => {
    renderHook(() => useSaveShortcut({ onSave: mockOnSave }))

    fireKeyboardEvent({ key: 'S', ctrlKey: true })

    expect(mockOnSave).toHaveBeenCalledTimes(1)
  })
})

describe('useSaveShortcut - non-save shortcuts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not call onSave when Alt+S is pressed (not save shortcut)', () => {
    renderHook(() => useSaveShortcut({ onSave: mockOnSave }))

    fireKeyboardEvent({ key: 's', altKey: true })

    expect(mockOnSave).not.toHaveBeenCalled()
  })

  it('should not call onSave when Shift+S is pressed (not save shortcut)', () => {
    renderHook(() => useSaveShortcut({ onSave: mockOnSave }))

    fireKeyboardEvent({ key: 's', shiftKey: true })

    expect(mockOnSave).not.toHaveBeenCalled()
  })

  it('should not call onSave when Ctrl+Alt+S is pressed', () => {
    renderHook(() => useSaveShortcut({ onSave: mockOnSave }))

    fireKeyboardEvent({ key: 's', ctrlKey: true, altKey: true })

    expect(mockOnSave).not.toHaveBeenCalled()
  })

  it('should not call onSave when Ctrl+Shift+S is pressed', () => {
    renderHook(() => useSaveShortcut({ onSave: mockOnSave }))

    fireKeyboardEvent({ key: 's', ctrlKey: true, shiftKey: true })

    expect(mockOnSave).not.toHaveBeenCalled()
  })

  it('should not call onSave for other keys with Ctrl', () => {
    renderHook(() => useSaveShortcut({ onSave: mockOnSave }))

    fireKeyboardEvent({ key: 'a', ctrlKey: true })

    expect(mockOnSave).not.toHaveBeenCalled()
  })
})
