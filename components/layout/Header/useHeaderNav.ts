/* eslint-disable max-lines */
'use client'

import { useState, useEffect, useMemo } from 'react'
import { usePathname, useParams } from 'next/navigation'
import { route } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import type { NavLinks, NavItemType } from './types'
import { ROOT_ROUTES } from './types'
import { ListItemTypesRequestSchema } from '@/gen/centy_pb'
import { centyClient } from '@/lib/grpc/client'
import { resolveProject } from '@/lib/project-resolver'

// eslint-disable-next-line max-lines-per-function
export function useHeaderNav() {
  const pathname = usePathname()
  const params = useParams()

  const orgParam = params ? params.organization : undefined
  const org: string | undefined =
    typeof orgParam === 'string' ? orgParam : undefined
  const projectParam = params ? params.project : undefined
  const project: string | undefined =
    typeof projectParam === 'string' ? projectParam : undefined

  const pathSegments = useMemo(() => {
    return pathname.split('/').filter(Boolean)
  }, [pathname])

  const hasProjectContext = useMemo(() => {
    if (org && project) return true
    if (pathSegments.length >= 2 && !ROOT_ROUTES.has(pathSegments[0])) {
      return true
    }
    return false
  }, [org, project, pathSegments])

  const effectiveOrg = org || (hasProjectContext ? pathSegments[0] : undefined)
  const effectiveProject =
    project || (hasProjectContext ? pathSegments[1] : undefined)

  const [itemTypes, setItemTypes] = useState<NavItemType[]>([])

  useEffect(() => {
    if (!hasProjectContext || !effectiveOrg || !effectiveProject) {
      setItemTypes([])
      return
    }
    let cancelled = false
    async function fetchItemTypes() {
      try {
        const resolution = await resolveProject(
          effectiveOrg!,
          effectiveProject!
        )
        if (cancelled || !resolution) return
        const req = create(ListItemTypesRequestSchema, {
          projectPath: resolution.projectPath,
        })
        const res = await centyClient.listItemTypes(req)
        if (cancelled) return
        setItemTypes(
          res.itemTypes.map(t => ({ name: t.name, plural: t.plural }))
        )
      } catch {
        // silently fall back to empty
      }
    }
    fetchItemTypes()
    return () => {
      cancelled = true
    }
  }, [hasProjectContext, effectiveOrg, effectiveProject])

  const navLinks: NavLinks | null = useMemo(() => {
    if (hasProjectContext && effectiveOrg && effectiveProject) {
      return {
        assets: route({
          pathname: '/[organization]/[project]/assets',
          query: {
            organization: effectiveOrg,
            project: effectiveProject,
          },
        }),
        users: route({
          pathname: '/[organization]/[project]/users',
          query: {
            organization: effectiveOrg,
            project: effectiveProject,
          },
        }),
        config: route({
          pathname: '/[organization]/[project]/config',
          query: {
            organization: effectiveOrg,
            project: effectiveProject,
          },
        }),
      }
    }
    return null
  }, [hasProjectContext, effectiveOrg, effectiveProject])

  const isActive = (href: string, checkPrefix?: boolean) => {
    const resolvedCheckPrefix = checkPrefix !== undefined ? checkPrefix : true
    if (resolvedCheckPrefix) {
      if (hasProjectContext) {
        const page = href.split('/').slice(3).join('/')
        const currentPage = pathname.split('/').slice(3).join('/')
        return currentPage.startsWith(page.split('/')[0])
      }
      return pathname.startsWith(href)
    }
    return pathname === href
  }

  return {
    pathname,
    hasProjectContext,
    effectiveOrg,
    effectiveProject,
    navLinks,
    isActive,
    itemTypes,
  }
}
