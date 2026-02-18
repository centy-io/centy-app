import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useProjectPathToUrl } from '@/components/providers/PathContextProvider'
import { useAppLink } from '@/hooks/useAppLink'

export function useIssueNavigation(projectPath: string) {
  const router = useRouter()
  const resolvePathToUrl = useProjectPathToUrl()
  const { createLink, createProjectLink } = useAppLink()
  const issuesListUrl = createLink('/issues')

  const handleMoved = useCallback(
    async (targetProjectPath: string) => {
      const result = await resolvePathToUrl(targetProjectPath)
      if (result) {
        router.push(
          createProjectLink(result.orgSlug, result.projectName, 'issues')
        )
      } else {
        router.push(issuesListUrl)
      }
    },
    [resolvePathToUrl, createProjectLink, router, issuesListUrl]
  )

  const handleDuplicated = useCallback(
    async (newIssueId: string, targetProjectPath: string) => {
      if (targetProjectPath === projectPath) {
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
          router.push(issuesListUrl)
        }
      }
    },
    [
      projectPath,
      router,
      createLink,
      resolvePathToUrl,
      createProjectLink,
      issuesListUrl,
    ]
  )

  return {
    issuesListUrl,
    handleMoved,
    handleDuplicated,
  }
}
