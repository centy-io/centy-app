'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useMemo, useEffect, type ReactNode } from 'react'
import Link from 'next/link'
import {
  PROJECT_SCOPED_ROUTES,
  resolveRoute,
} from './CatchAllRouter.routeConfig'
import { PathContextProvider } from '@/components/providers/PathContextProvider'

/**
 * Component displayed when a project-scoped route is accessed without project context
 */
function ProjectContextRequired({ requestedPage }: { requestedPage: string }) {
  const pageLabel =
    requestedPage === 'issues'
      ? 'Issues'
      : requestedPage === 'docs'
        ? 'Docs'
        : requestedPage === 'users'
          ? 'Users'
          : requestedPage

  return (
    <div className="project-context-required">
      <h2 className="project-context-title">Project Required</h2>
      <p className="project-context-description">
        {pageLabel} are project-scoped. Please select a project to view its{' '}
        {pageLabel.toLowerCase()}.
      </p>
      <Link href="/organizations" className="select-project-link">
        Select a Project
      </Link>
    </div>
  )
}

/**
 * Client-side router for catch-all paths
 *
 * Parses the pathname and renders the appropriate component for
 * [organization]/[project]/... paths that don't match explicit routes.
 *
 * Routes like /issues, /docs, /users require project context
 * and will show a message directing users to select a project.
 */
export function CatchAllRouter(): ReactNode {
  const pathname = usePathname()
  const router = useRouter()

  const { content, shouldRedirect, redirectTo } = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean)

    // Handle single-segment project-scoped routes specially
    if (segments.length === 1 && PROJECT_SCOPED_ROUTES.has(segments[0])) {
      return {
        content: <ProjectContextRequired requestedPage={segments[0]} />,
        shouldRedirect: false,
        redirectTo: null,
      }
    }

    return resolveRoute(pathname)
  }, [pathname])

  useEffect(() => {
    if (shouldRedirect && redirectTo) {
      router.replace(redirectTo)
    }
  }, [shouldRedirect, redirectTo, router])

  if (shouldRedirect) {
    return null
  }

  return <PathContextProvider>{content}</PathContextProvider>
}
