import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useProjectPathToUrl } from '@/components/providers/PathContextProvider'
import { useAppLink } from '@/hooks/useAppLink'

export function useContextMenuNavigation(
  projectPath: string,
  fetchIssues: () => Promise<void>
) {
  const router = useRouter()
  const resolvePathToUrl = useProjectPathToUrl()
  const { createLink, createProjectLink } = useAppLink()

  const handleMoved = useCallback(
    async (targetProjectPath: string) => {
      const result = await resolvePathToUrl(targetProjectPath)
      if (result) {
        router.push(
          createProjectLink(result.orgSlug, result.projectName, 'issues')
        )
      } else {
        router.push('/')
      }
    },
    [resolvePathToUrl, createProjectLink, router]
  )

  const handleDuplicated = useCallback(
    async (newIssueId: string, targetProjectPath: string) => {
      if (targetProjectPath === projectPath) {
        fetchIssues()
        router.push(createLink(`/issues/${newIssueId}`))
      } else {
        const result = await resolvePathToUrl(targetProjectPath)
        if (result) {
          router.push(
            createProjectLink(
              result.orgSlug,
              result.projectName,
              `issues/${newIssueId}`
            )
          )
        } else {
          router.push('/')
        }
      }
    },
    [
      projectPath,
      router,
      fetchIssues,
      createLink,
      resolvePathToUrl,
      createProjectLink,
    ]
  )

  return {
    router,
    createLink,
    handleMoved,
    handleDuplicated,
  }
}
