'use client'

import { useCallback, useState } from 'react'

function toggleSetItem(prev: Set<string>, path: string): Set<string> {
  const next = new Set(prev)
  if (next.has(path)) next.delete(path)
  else next.add(path)
  return next
}

export function useInitProjectSelections() {
  const [selectedRestore, setSelectedRestore] = useState<Set<string>>(new Set())
  const [selectedReset, setSelectedReset] = useState<Set<string>>(new Set())

  const toggleRestore = useCallback((path: string) => {
    setSelectedRestore(prev => toggleSetItem(prev, path))
  }, [])

  const toggleReset = useCallback((path: string) => {
    setSelectedReset(prev => toggleSetItem(prev, path))
  }, [])

  return {
    selectedRestore,
    setSelectedRestore,
    selectedReset,
    setSelectedReset,
    toggleRestore,
    toggleReset,
  }
}
