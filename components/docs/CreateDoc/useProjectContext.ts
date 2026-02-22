import { useCallback } from 'react'
import { usePathContext } from '@/components/providers/PathContextProvider'
import { UNGROUPED_ORG_MARKER } from '@/lib/project-resolver'

export function useProjectContext() {
  const { projectPath, isInitialized, orgSlug, projectName } = usePathContext()

  const getProjectContext = useCallback(async () => {
    if (!projectName) return null
    return {
      organization: orgSlug !== null && orgSlug !== undefined ? orgSlug : UNGROUPED_ORG_MARKER,
      project: projectName,
    }
  }, [orgSlug, projectName])

  return {
    projectPath,
    isInitialized,
    getProjectContext,
  }
}
