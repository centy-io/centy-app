'use client'

import { useEffect, useRef } from 'react'

interface UseSaveShortcutOptions {
  onSave: () => void | Promise<void>
  enabled?: boolean
}

export function useSaveShortcut({ onSave, enabled }: UseSaveShortcutOptions) {
  const resolvedEnabled = enabled !== undefined ? enabled : true
  const onSaveRef = useRef(onSave)

  useEffect(() => {
    onSaveRef.current = onSave
  }, [onSave])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle Ctrl+S or Cmd+S
      const isSaveShortcut =
        (event.ctrlKey || event.metaKey) &&
        !event.altKey &&
        !event.shiftKey &&
        event.key.toLowerCase() === 's'

      if (!isSaveShortcut) return

      // Always prevent browser save dialog
      event.preventDefault()

      if (resolvedEnabled) {
        onSaveRef.current()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [resolvedEnabled])
}
