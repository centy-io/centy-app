'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import { useProjectContext } from './useProjectContext'

const PROJECT_SCOPED_PAGES = ['issues', 'docs', 'assets', 'config'] as const

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

      const newPage = PROJECT_SCOPED_PAGES.at(newIndex)
      if (!newPage) return
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
