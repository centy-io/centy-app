'use client'

import { useMemo } from 'react'
import { usePathname, useParams } from 'next/navigation'
import { route } from 'nextjs-routes'
import type { NavLinks } from './types'
import { ROOT_ROUTES } from './types'

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

  const navLinks: NavLinks | null = useMemo(() => {
    if (hasProjectContext && effectiveOrg && effectiveProject) {
      return {
        issues: route({
          pathname: '/[organization]/[project]/issues',
          query: {
            organization: effectiveOrg,
            project: effectiveProject,
          },
        }),
        docs: route({
          pathname: '/[organization]/[project]/docs',
          query: {
            organization: effectiveOrg,
            project: effectiveProject,
          },
        }),
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

  const isActive = (href: string, checkPrefix = true) => {
    if (checkPrefix) {
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
  }
}
