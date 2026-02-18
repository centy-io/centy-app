import { useCallback, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { IsInitializedRequestSchema } from '@/gen/centy_pb'
import { useProject } from '@/components/providers/ProjectProvider'
import { useProjectPathToUrl } from '@/components/providers/PathContextProvider'

export function useProjectContext() {
  const params = useParams()
  const { projectPath, isInitialized, setIsInitialized } = useProject()
  const projectPathToUrl = useProjectPathToUrl()

  const getProjectContext = useCallback(async () => {
    const orgParam = params ? params.organization : undefined
    const org: string | undefined = Array.isArray(orgParam)
      ? orgParam[0]
      : orgParam
    const projectParam = params ? params.project : undefined
    const project: string | undefined = Array.isArray(projectParam)
      ? projectParam[0]
      : projectParam

    if (org && project) {
      return { organization: org, project }
    }

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

  const checkInitialized = useCallback(
    async (path: string) => {
      if (!path.trim()) {
        setIsInitialized(null)
        return
      }

      try {
        const request = create(IsInitializedRequestSchema, {
          projectPath: path.trim(),
        })
        const response = await centyClient.isInitialized(request)
        setIsInitialized(response.initialized)
      } catch {
        setIsInitialized(false)
      }
    },
    [setIsInitialized]
  )

  useEffect(() => {
    if (projectPath && isInitialized === null) {
      checkInitialized(projectPath)
    }
  }, [projectPath, isInitialized, checkInitialized])

  return {
    projectPath,
    isInitialized,
    getProjectContext,
  }
}
