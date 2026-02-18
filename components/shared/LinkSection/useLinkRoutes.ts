import { useCallback, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { route, type RouteLiteral } from 'nextjs-routes'
import { protoToTargetType } from './LinkSection.types'
import { LinkTargetType } from '@/gen/centy_pb'

export function useLinkRoutes(): {
  buildLinkRoute: (
    targetType: LinkTargetType,
    targetId: string
  ) => RouteLiteral | '/'
} {
  const params = useParams()

  const projectContext = useMemo(() => {
    const orgParam = params ? params.organization : undefined
    const org = typeof orgParam === 'string' ? orgParam : undefined
    const projectParam = params ? params.project : undefined
    const project = typeof projectParam === 'string' ? projectParam : undefined
    if (org && project) return { organization: org, project }
    return null
  }, [params])

  const buildLinkRoute = useCallback(
    (targetType: LinkTargetType, targetId: string): RouteLiteral | '/' => {
      if (!projectContext) return '/'
      // eslint-disable-next-line security/detect-object-injection
      const targetTypeName = protoToTargetType[targetType]
      switch (targetTypeName) {
        case 'issue':
          return route({
            pathname: '/[organization]/[project]/issues/[issueId]',
            query: { ...projectContext, issueId: targetId },
          })
        case 'doc':
          return route({
            pathname: '/[organization]/[project]/docs/[slug]',
            query: { ...projectContext, slug: targetId },
          })
        case 'unknown':
          return '/'
      }
      return '/'
    },
    [projectContext]
  )

  return { buildLinkRoute }
}
