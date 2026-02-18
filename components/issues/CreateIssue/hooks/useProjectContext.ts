import { useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useProjectPathToUrl } from '@/components/providers/PathContextProvider'
import type { ProjectContext } from '../CreateIssue.types'

export function useProjectContext(projectPath: string) {
  const params = useParams()
  const projectPathToUrl = useProjectPathToUrl()

  const getProjectContext =
    useCallback(async (): Promise<ProjectContext | null> => {
      const orgParam = params ? params.organization : undefined
      const org: string | undefined = Array.isArray(orgParam)
        ? orgParam[0]
        : orgParam
      const projectParam = params ? params.project : undefined
      const project: string | undefined = Array.isArray(projectParam)
        ? projectParam[0]
        : projectParam

      if (org && project) {
        return {
          organization: org,
          project,
        }
      }

      // Fall back to resolving from projectPath
      if (projectPath) {
        const result = await projectPathToUrl(projectPath)
        if (result) {
          return {
            organization: result.orgSlug,
            project: result.projectName,
          }
        }
      }

      return null
    }, [params, projectPath, projectPathToUrl])

  return { getProjectContext }
}
