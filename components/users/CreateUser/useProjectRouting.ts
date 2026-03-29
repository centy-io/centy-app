'use client'

import { useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { route, type RouteLiteral } from 'nextjs-routes'
import type { User } from '@/gen/centy_pb'

function extractProjectContext(
  params: ReturnType<typeof useParams>
): { organization: string; project: string } | null {
  const orgP = params ? params.organization : undefined
  const org = typeof orgP === 'string' ? orgP : undefined
  const projP = params ? params.project : undefined
  const proj = typeof projP === 'string' ? projP : undefined
  if (org && proj) return { organization: org, project: proj }
  return null
}

export function useProjectRouting() {
  const router = useRouter()
  const params = useParams()

  const projectContext = useMemo(() => extractProjectContext(params), [params])

  const usersListUrl: RouteLiteral = useMemo(() => {
    if (!projectContext) return route({ pathname: '/' })
    return route({
      pathname: '/[organization]/[project]/users',
      query: {
        organization: projectContext.organization,
        project: projectContext.project,
      },
    })
  }, [projectContext])

  const navigateAfterCreate = (user: User): void => {
    if (projectContext) {
      router.push(
        route({
          pathname: '/[organization]/[project]/users/[userId]',
          query: {
            organization: projectContext.organization,
            project: projectContext.project,
            userId: user.id,
          },
        })
      )
    } else {
      router.push(route({ pathname: '/' }))
    }
  }

  return { projectContext, usersListUrl, navigateAfterCreate }
}
