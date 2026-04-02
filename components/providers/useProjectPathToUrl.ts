'use client'

import { resolveProjectPath } from '@/lib/project-resolver'

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
