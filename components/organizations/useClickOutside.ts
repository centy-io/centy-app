'use client'

import { useEffect } from 'react'

export function useClickOutside(
  isOpen: boolean,
  onClose: () => void,
  containerClass: string
): void {
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent): void => {
      const target = e.target
      if (!(target instanceof HTMLElement) || !target.closest(containerClass)) {
        onClose()
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen, onClose, containerClass])
}
