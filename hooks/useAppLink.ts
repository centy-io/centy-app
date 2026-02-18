'use client'

import { useCallback, useMemo } from 'react'
import { useParams, usePathname } from 'next/navigation'
import { route, type RouteLiteral } from 'nextjs-routes'
import { UNGROUPED_ORG_MARKER } from '@/lib/project-resolver'

// Known root-level routes that are NOT org/project paths
// Note: 'issues', 'docs', 'users' are NOT in this list
// because they require project context and are handled by project-scoped routes
const ROOT_ROUTES = new Set([
  'organizations',
  'settings',
  'archived',
  'assets',
  'project',
])

/**
 * Hook that provides functions to generate path-based links.
 * Replaces the old query-param-based link generation.
 */
function useOrgAndProject() {
  const params = useParams()
  const pathname = usePathname()

  const rawOrg = params ? params.organization : undefined
  const paramOrg: string | undefined =
    typeof rawOrg === 'string' ? rawOrg : undefined
  const rawProject = params ? params.project : undefined
  const paramProject: string | undefined =
    typeof rawProject === 'string' ? rawProject : undefined

  const pathSegments = useMemo(() => {
    return pathname.split('/').filter(Boolean)
  }, [pathname])

  const org = useMemo(() => {
    if (paramOrg) return paramOrg
    if (pathSegments.length >= 2 && !ROOT_ROUTES.has(pathSegments[0])) {
      return pathSegments[0]
    }
    return undefined
  }, [paramOrg, pathSegments])

  const project = useMemo(() => {
    if (paramProject) return paramProject
    if (pathSegments.length >= 2 && !ROOT_ROUTES.has(pathSegments[0])) {
      return pathSegments[1]
    }
    return undefined
  }, [paramProject, pathSegments])

  return { org, project }
}

export function useAppLink() {
  const { org, project } = useOrgAndProject()

  const createLink = useCallback(
    (path: string): RouteLiteral => {
      const normalizedPath = path.startsWith('/') ? path.slice(1) : path
      const pathSegments = normalizedPath.split('/').filter(Boolean)

      if (org && project) {
        return route({
          pathname: '/[...path]',
          query: { path: [org, project, ...pathSegments] },
        })
      }

      return route({
        pathname: '/[...path]',
        query: {
          path: pathSegments.length > 0 ? pathSegments : [normalizedPath],
        },
      })
    },
    [org, project]
  )

  const createProjectLink = useCallback(
    (
      orgSlug: string | null,
      projectName: string,
      path: string
    ): RouteLiteral => {
      const orgPart = orgSlug || UNGROUPED_ORG_MARKER
      const normalizedPath = path.startsWith('/') ? path.slice(1) : path
      return route({
        pathname: '/[...path]',
        query: { path: [orgPart, projectName, ...normalizedPath.split('/')] },
      })
    },
    []
  )

  const createRootLink = useCallback((path: string): string => {
    return path.startsWith('/') ? path : `/${path}`
  }, [])

  const hasProjectContext = Boolean(org && project)

  const currentContext = hasProjectContext
    ? {
        orgSlug: org === UNGROUPED_ORG_MARKER ? null : org,
        projectName: project!,
      }
    : null

  return {
    createLink,
    createProjectLink,
    createRootLink,
    hasProjectContext,
    currentContext,
  }
}
