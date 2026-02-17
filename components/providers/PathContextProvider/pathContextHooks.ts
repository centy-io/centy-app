'use client'

import { useContext, useState } from 'react'
import { resolveProjectPath } from '@/lib/project-resolver'
import type { PathContextType } from './PathContextProvider.types'
import { LAST_PROJECT_STORAGE_KEY } from './PathContextProvider.types'
import { PathContext } from './PathContextProvider'

export function usePathContext() {
  const context = useContext(PathContext)
  if (!context) {
    throw new Error('usePathContext must be used within a PathContextProvider')
  }
  return context
}

export function useLastProjectPath(): string | null {
  const [lastPath] = useState<string | null>(() => {
    if (typeof window !== 'undefined')
      return localStorage.getItem(LAST_PROJECT_STORAGE_KEY)
    return null
  })
  return lastPath
}

export function useProjectPathToUrl() {
  return async (projectPath: string) => {
    const result = await resolveProjectPath(projectPath)
    if (!result) return null
    return { orgSlug: result.orgSlug, projectName: result.projectName }
  }
}
