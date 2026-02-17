import { useCallback, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { route, type RouteLiteral } from 'nextjs-routes'
import { LinkTargetType } from '@/gen/centy_pb'
import { protoToTargetType } from './LinkSection.types'

export function useLinkRoutes() {
  const params = useParams()

  const projectContext = useMemo(() => {
    const org = params?.organization as string | undefined
    const project = params?.project as string | undefined
    if (org && project) return { organization: org, project }
    return null
  }, [params])

  const buildLinkRoute = useCallback(
    (targetType: LinkTargetType, targetId: string): RouteLiteral | '/' => {
      if (!projectContext) return '/'
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
        default:
          return '/'
      }
    },
    [projectContext]
  )

  return { buildLinkRoute }
}
