'use client'

import { useMemo, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { route, type RouteLiteral } from 'nextjs-routes'

export function useProjectContext() {
  const params = useParams()
  return useMemo(() => {
    const orgParam = params ? params.organization : undefined
    const org = typeof orgParam === 'string' ? orgParam : undefined
    const projectParam = params ? params.project : undefined
    const project = typeof projectParam === 'string' ? projectParam : undefined
    if (org && project) return { organization: org, project }
    return null
  }, [params])
}

export function useUserRoutes() {
  const projectContext = useProjectContext()

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
