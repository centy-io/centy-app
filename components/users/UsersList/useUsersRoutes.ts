import { useCallback, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { route, type RouteLiteral } from 'nextjs-routes'

export function useUsersRoutes() {
  const params = useParams()

  const projectContext = useMemo(() => {
    const org = params?.organization as string | undefined
    const project = params?.project as string | undefined
    return org && project ? { organization: org, project } : null
  }, [params])

  const getUserRoute = useCallback(
    (userId: string): RouteLiteral | '/' => {
      if (!projectContext) return '/'
      return route({
        pathname: '/[organization]/[project]/users/[userId]',
        query: { ...projectContext, userId },
      })
    },
    [projectContext]
  )

  const newUserRoute: RouteLiteral | '/' = useMemo(() => {
    if (!projectContext) return '/'
    return route({
      pathname: '/[organization]/[project]/users/new',
      query: projectContext,
    })
  }, [projectContext])

  return { getUserRoute, newUserRoute }
}
