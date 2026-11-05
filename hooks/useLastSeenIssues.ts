'use client'

import { useCallback } from 'react'
import { useLocalStorage } from 'usehooks-ts'

const STORAGE_KEY = 'centy-issues-last-seen'

type LastSeenMap = Record<string, number>

const EMPTY: LastSeenMap = {}
// initializeWithValue: false keeps the first client render equal to the static export.
const STORAGE_OPTIONS = { initializeWithValue: false }

export function useLastSeenIssues() {
  const [lastSeenMap, setLastSeenMap] = useLocalStorage<LastSeenMap>(
    STORAGE_KEY,
    EMPTY,
    STORAGE_OPTIONS
  )

  const recordLastSeen = useCallback(
    (issueId: string) => {
      setLastSeenMap(prev => ({ ...prev, [issueId]: Date.now() }))
    },
    [setLastSeenMap]
  )

  return { lastSeenMap, recordLastSeen }
}
