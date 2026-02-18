/* eslint-disable max-lines */
'use client'

import { useEffect, useCallback, useMemo } from 'react'
import { usePathname, useRouter, useParams } from 'next/navigation'
import { route } from 'nextjs-routes'

// Project-scoped pages (require project context)
// These are relative paths that will be prefixed with /org/project/
const PROJECT_SCOPED_PAGES = ['issues', 'docs', 'assets', 'config'] as const

// Root-level routes that don't require project context
const ROOT_ROUTES = new Set([
  'organizations',
  'settings',
  'archived',
  'assets',
  'project',
])

function useProjectContext() {
  const pathname = usePathname()
  const params = useParams()

  const rawOrg = params ? params.organization : undefined
  const org: string | undefined =
    typeof rawOrg === 'string' ? rawOrg : undefined
  const rawProject = params ? params.project : undefined
  const project: string | undefined =
    typeof rawProject === 'string' ? rawProject : undefined

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

  return { pathSegments, hasProjectContext, effectiveOrg, effectiveProject }
}

export function useKeyboardNavigation() {
  const router = useRouter()
  const { pathSegments, hasProjectContext, effectiveOrg, effectiveProject } =
    useProjectContext()

  const getCurrentPageIndex = useCallback(() => {
    if (!hasProjectContext) return -1

    const currentPage = pathSegments[2] || 'issues'
    return PROJECT_SCOPED_PAGES.findIndex(page => currentPage.startsWith(page))
  }, [hasProjectContext, pathSegments])

  const navigateToPage = useCallback(
    (direction: 'prev' | 'next') => {
      if (!hasProjectContext || !effectiveOrg || !effectiveProject) return

      const currentIndex = getCurrentPageIndex()
      if (currentIndex === -1) return

      let newIndex: number
      if (direction === 'prev') {
        newIndex =
          currentIndex > 0 ? currentIndex - 1 : PROJECT_SCOPED_PAGES.length - 1
      } else {
        newIndex =
          currentIndex < PROJECT_SCOPED_PAGES.length - 1 ? currentIndex + 1 : 0
      }

      const newPage = PROJECT_SCOPED_PAGES[newIndex]
      router.push(
        route({
          pathname: '/[...path]',
          query: { path: [effectiveOrg, effectiveProject, newPage] },
        })
      )
    },
    [
      hasProjectContext,
      effectiveOrg,
      effectiveProject,
      getCurrentPageIndex,
      router,
    ]
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      if (
        !(target instanceof HTMLElement) ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) {
        return
      }

      if (!hasProjectContext) return

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        navigateToPage('prev')
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        navigateToPage('next')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigateToPage, hasProjectContext])
}
