import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useProjectPathToUrl } from '@/components/providers/PathContextProvider'
import { useAppLink } from '@/hooks/useAppLink'

export function useIssueNavigation(projectPath: string) {
  const router = useRouter()
  const { createLink, createProjectLink } = useAppLink()
  const resolvePathToUrl = useProjectPathToUrl()

  const issuesListUrl = createLink('/issues')

  const navigateToIssuesList = useCallback(() => {
    router.push(issuesListUrl)
  }, [router, issuesListUrl])

  const handleMoved = useCallback(
    async (targetProjectPath: string) => {
      const result = await resolvePathToUrl(targetProjectPath)
      if (result) {
        const url = createProjectLink(
          result.orgSlug,
          result.projectName,
          'issues'
        )
        router.push(url)
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
          const url = createProjectLink(
            result.orgSlug,
            result.projectName,
            `issues/${newIssueId}`
          )
          router.push(url)
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
    navigateToIssuesList,
    handleMoved,
    handleDuplicated,
  }
}
