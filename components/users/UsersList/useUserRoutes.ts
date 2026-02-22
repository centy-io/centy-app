'use client'

import { useMemo, useCallback } from 'react'
import { route, type RouteLiteral } from 'nextjs-routes'
import { useProjectContext } from './useProjectContext'

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
