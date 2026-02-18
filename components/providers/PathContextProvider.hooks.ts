'use client'

import { useState, useContext } from 'react'
import { createContext } from 'react'
import { resolveProjectPath } from '@/lib/project-resolver'
import type { PathContextType } from './PathContextProvider.types'
import { LAST_PROJECT_STORAGE_KEY } from './PathContextProvider.types'

export const PathContext = createContext<PathContextType | null>(null)

/**
 * Hook to access path context
 */
export function usePathContext() {
  const context = useContext(PathContext)
  if (!context) {
    throw new Error('usePathContext must be used within a PathContextProvider')
  }
  return context
}

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

/**
 * Hook to resolve a project path to URL params
 */
export function useProjectPathToUrl() {
  return async (projectPath: string) => {
    const result = await resolveProjectPath(projectPath)
    if (!result) return null
    return {
      orgSlug: result.orgSlug,
      projectName: result.projectName,
    }
  }
}
