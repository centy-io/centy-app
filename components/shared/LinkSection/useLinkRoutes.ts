import { useCallback, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { route, type RouteLiteral } from 'nextjs-routes'

export function useLinkRoutes(): {
  buildLinkRoute: (targetItemType: string, targetId: string) => RouteLiteral
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
    (targetItemType: string, targetId: string): RouteLiteral => {
      if (!projectContext) return route({ pathname: '/' })
      if (targetItemType === 'issue') {
        return route({
          pathname: '/[organization]/[project]/issues/[issueId]',
          query: { ...projectContext, issueId: targetId },
        })
      }
      if (targetItemType === 'doc') {
        return route({
          pathname: '/[organization]/[project]/docs/[slug]',
          query: { ...projectContext, slug: targetId },
        })
      }
      return route({
        pathname: '/[organization]/[project]/[itemType]/[slug]',
        query: { ...projectContext, itemType: targetItemType, slug: targetId },
      })
    },
    [projectContext]
  )

  return { buildLinkRoute }
}
