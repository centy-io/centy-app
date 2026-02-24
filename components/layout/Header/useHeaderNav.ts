'use client'

import { useState, useEffect, useMemo } from 'react'
import { usePathname, useParams } from 'next/navigation'
import type { NavItemType, NavLinks } from './types'
import { ROOT_ROUTES } from './types'
import { buildNavLinks } from './buildNavLinks'
import { loadItemTypes } from './loadItemTypes'

export function useHeaderNav() {
  const pathname = usePathname()
  const params = useParams()

  const orgParam = params ? params.organization : undefined
  const org: string | undefined =
    typeof orgParam === 'string' ? orgParam : undefined
  const projectParam = params ? params.project : undefined
  const project: string | undefined =
    typeof projectParam === 'string' ? projectParam : undefined

  const pathSegments = useMemo(
    () => pathname.split('/').filter(Boolean),
    [pathname]
  )

  const hasProjectContext = useMemo(() => {
    if (org && project) return true
    return pathSegments.length >= 2 && !ROOT_ROUTES.has(pathSegments[0])
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
        const types = await loadItemTypes(effectiveOrg!, effectiveProject!)
        if (!cancelled) setItemTypes(types)
      } catch {
        // silently fall back to empty
      }
    }
    fetchItemTypes()
    return () => {
      cancelled = true
    }
  }, [hasProjectContext, effectiveOrg, effectiveProject])

  const navLinks: NavLinks | null = useMemo(
    () => buildNavLinks(hasProjectContext, effectiveOrg, effectiveProject),
    [hasProjectContext, effectiveOrg, effectiveProject]
  )

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
