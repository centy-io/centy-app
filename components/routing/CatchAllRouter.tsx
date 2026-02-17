'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useMemo, useEffect, type ReactNode } from 'react'
import Link from 'next/link'
import { route, type RouteLiteral } from 'nextjs-routes'
import { PathContextProvider } from '@/components/providers/PathContextProvider'

// Components for different route types
import { IssuesList } from '@/components/issues/IssuesList'
import { IssueDetail } from '@/components/issues/IssueDetail'
import { CreateIssue } from '@/components/issues/CreateIssue'
import { DocsList } from '@/components/docs/DocsList'
import { DocDetail } from '@/components/docs/DocDetail'
import { CreateDoc } from '@/components/docs/CreateDoc'
import { UsersList } from '@/components/users/UsersList'
import { UserDetail } from '@/components/users/UserDetail'
import { CreateUser } from '@/components/users/CreateUser'
import { SharedAssets } from '@/components/assets/SharedAssets'
import { ProjectConfig } from '@/components/settings/ProjectConfig'

// Routes that require project context (no longer accessible at root level)
const PROJECT_SCOPED_ROUTES = new Set(['issues', 'docs', 'users'])

interface RouteResult {
  content: ReactNode
  shouldRedirect: boolean
  redirectTo: RouteLiteral | null
}

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
      <h2>Project Required</h2>
      <p>
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

  const { content, shouldRedirect, redirectTo } = useMemo((): RouteResult => {
    const segments = pathname.split('/').filter(Boolean)

    // Check if this is a single-segment project-scoped route (e.g., /issues, /docs)
    if (segments.length === 1 && PROJECT_SCOPED_ROUTES.has(segments[0])) {
      return {
        content: <ProjectContextRequired requestedPage={segments[0]} />,
        shouldRedirect: false,
        redirectTo: null,
      }
    }

    // Need at least org/project to be a project-scoped route
    if (segments.length < 2) {
      return {
        content: <div className="not-found">Page not found</div>,
        shouldRedirect: false,
        redirectTo: null,
      }
    }

    // Extract org, project, and remaining path
    const [org, project, pageType, ...rest] = segments

    // Route based on the page type
    switch (pageType) {
      case 'issues':
        if (rest[0] === 'new') {
          return {
            content: <CreateIssue />,
            shouldRedirect: false,
            redirectTo: null,
          }
        }
        if (rest[0]) {
          return {
            content: <IssueDetail issueNumber={rest[0]} />,
            shouldRedirect: false,
            redirectTo: null,
          }
        }
        return {
          content: <IssuesList />,
          shouldRedirect: false,
          redirectTo: null,
        }

      case 'docs':
        if (rest[0] === 'new') {
          return {
            content: <CreateDoc />,
            shouldRedirect: false,
            redirectTo: null,
          }
        }
        if (rest[0]) {
          return {
            content: <DocDetail slug={rest[0]} />,
            shouldRedirect: false,
            redirectTo: null,
          }
        }
        return {
          content: <DocsList />,
          shouldRedirect: false,
          redirectTo: null,
        }

      case 'users':
        if (rest[0] === 'new') {
          return {
            content: <CreateUser />,
            shouldRedirect: false,
            redirectTo: null,
          }
        }
        if (rest[0]) {
          return {
            content: <UserDetail userId={rest[0]} />,
            shouldRedirect: false,
            redirectTo: null,
          }
        }
        return {
          content: <UsersList />,
          shouldRedirect: false,
          redirectTo: null,
        }

      case 'assets':
        return {
          content: <SharedAssets />,
          shouldRedirect: false,
          redirectTo: null,
        }

      case 'config':
        return {
          content: <ProjectConfig />,
          shouldRedirect: false,
          redirectTo: null,
        }

      case undefined:
        // Just org/project - redirect to issues
        return {
          content: null,
          shouldRedirect: true,
          redirectTo: route({
            pathname: '/[organization]/[project]/issues',
            query: { organization: org, project },
          }),
        }
    }

    return {
      content: <div className="not-found">Page not found</div>,
      shouldRedirect: false,
      redirectTo: null,
    }
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
