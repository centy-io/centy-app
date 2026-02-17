import { useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { route } from 'nextjs-routes'
import { useProjectPathToUrl } from '@/components/providers/PathContextProvider'

export function useProjectContext(projectPath: string) {
  const router = useRouter()
  const params = useParams()
  const projectPathToUrl = useProjectPathToUrl()

  const getProjectContext = useCallback(async () => {
    const org = params?.organization as string | undefined
    const project = params?.project as string | undefined
    if (org && project) return { organization: org, project }
    if (projectPath) {
      const result = await projectPathToUrl(projectPath)
      if (result)
        return { organization: result.orgSlug, project: result.projectName }
    }
    return null
  }, [params, projectPath, projectPathToUrl])

  const navigateToIssue = useCallback(
    async (issueNumber: string | number) => {
      const ctx = await getProjectContext()
      if (ctx) {
        router.push(
          route({
            pathname: '/[organization]/[project]/issues/[issueId]',
            query: {
              organization: ctx.organization,
              project: ctx.project,
              issueId: String(issueNumber),
            },
          })
        )
      } else {
        router.push('/')
      }
    },
    [getProjectContext, router]
  )

  const navigateToIssuesList = useCallback(async () => {
    const ctx = await getProjectContext()
    if (ctx) {
      router.push(
        route({
          pathname: '/[organization]/[project]/issues',
          query: { organization: ctx.organization, project: ctx.project },
        })
      )
    } else {
      router.push('/')
    }
  }, [getProjectContext, router])

  return { navigateToIssue, navigateToIssuesList }
}
