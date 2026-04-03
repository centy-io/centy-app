'use client'

import type { NavLinks, NavItemType } from './types'
import { useProjectContext } from './useProjectContext'
import { useNavItemTypes } from './useNavItemTypes'
import { useNavLinks } from './useNavLinks'

function useIsActive(
  pathname: string,
  hasProjectContext: boolean
): (href: string, checkPrefix?: boolean) => boolean {
  return (href: string, checkPrefix?: boolean) => {
    const resolvedCheckPrefix = checkPrefix ?? true
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
}

export function useHeaderNav(): {
  pathname: string
  hasProjectContext: boolean
  effectiveOrg: string | undefined
  effectiveProject: string | undefined
  navLinks: NavLinks | null
  isActive: (href: string, checkPrefix?: boolean) => boolean
  itemTypes: NavItemType[]
} {
  const { pathname, hasProjectContext, effectiveOrg, effectiveProject } =
    useProjectContext()
  const itemTypes = useNavItemTypes(
    hasProjectContext,
    effectiveOrg,
    effectiveProject
  )
  const navLinks = useNavLinks(
    hasProjectContext,
    effectiveOrg,
    effectiveProject
  )
  const isActive = useIsActive(pathname, hasProjectContext)

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
