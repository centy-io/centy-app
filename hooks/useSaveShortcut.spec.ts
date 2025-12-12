import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useSaveShortcut } from './useSaveShortcut'

describe('useSaveShortcut', () => {
  const mockOnSave = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Clean up any listeners
  })

  const fireKeyboardEvent = (options: Partial<KeyboardEvent>) => {
    const event = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      ...options,
    })
    window.dispatchEvent(event)
    return event
  }

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

  it('should not call onSave when disabled', () => {
    renderHook(() => useSaveShortcut({ onSave: mockOnSave, enabled: false }))

    fireKeyboardEvent({ key: 's', ctrlKey: true })

    expect(mockOnSave).not.toHaveBeenCalled()
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
