'use client'

import { useState } from 'react'
import { LAST_PROJECT_STORAGE_KEY } from './LAST_PROJECT_STORAGE_KEY'

/**
 * Hook to get last used project path (for redirect from root)
 */
export function useLastProjectPath(): string | null {
  const [lastPath] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(LAST_PROJECT_STORAGE_KEY)
    }
    return null
  })

  return lastPath
}
