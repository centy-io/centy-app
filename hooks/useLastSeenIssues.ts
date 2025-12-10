'use client'

import { useState, useCallback } from 'react'

const STORAGE_KEY = 'centy-issues-last-seen'

type LastSeenMap = Record<string, number>

function getInitialLastSeenMap(): LastSeenMap {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

export function useLastSeenIssues() {
  const [lastSeenMap, setLastSeenMap] = useState<LastSeenMap>(
    getInitialLastSeenMap
  )

  const recordLastSeen = useCallback((issueId: string) => {
    const timestamp = Date.now()
    setLastSeenMap(prev => {
      const updated = { ...prev, [issueId]: timestamp }
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      }
      return updated
    })
  }, [])

  return { lastSeenMap, recordLastSeen }
}
