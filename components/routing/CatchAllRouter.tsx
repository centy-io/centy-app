'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useMemo, useEffect, type ReactNode } from 'react'
import Link from 'next/link'
import { route } from 'nextjs-routes'
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
  redirectTo: string | null
}

function contentResult(content: ReactNode): RouteResult {
  return { content, shouldRedirect: false, redirectTo: null }
}

function redirectResult(redirectTo: string): RouteResult {
  return { content: null, shouldRedirect: true, redirectTo }
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

function resolveIssuesRoute(rest: string[]): RouteResult {
  if (rest[0] === 'new') return contentResult(<CreateIssue />)
  if (rest[0]) return contentResult(<IssueDetail issueNumber={rest[0]} />)
  return contentResult(<IssuesList />)
}

function resolveDocsRoute(rest: string[]): RouteResult {
  if (rest[0] === 'new') return contentResult(<CreateDoc />)
  if (rest[0]) return contentResult(<DocDetail slug={rest[0]} />)
  return contentResult(<DocsList />)
}

function resolveUsersRoute(rest: string[]): RouteResult {
  if (rest[0] === 'new') return contentResult(<CreateUser />)
  if (rest[0]) return contentResult(<UserDetail userId={rest[0]} />)
  return contentResult(<UsersList />)
}

function resolveProjectRoute(
  org: string,
  project: string,
  pageType: string | undefined,
  rest: string[]
): RouteResult {
  switch (pageType) {
    case 'issues':
      return resolveIssuesRoute(rest)
    case 'docs':
      return resolveDocsRoute(rest)
    case 'users':
      return resolveUsersRoute(rest)
    case 'assets':
      return contentResult(<SharedAssets />)
    case 'config':
      return contentResult(<ProjectConfig />)
    case undefined:
      // Just org/project - redirect to issues
      return redirectResult(
        route({
          pathname: '/[organization]/[project]/issues',
          query: { organization: org, project },
        })
      )
    default:
      return contentResult(<div className="not-found">Page not found</div>)
  }
}

function resolveRoute(pathname: string): RouteResult {
  const segments = pathname.split('/').filter(Boolean)

  // Check if this is a single-segment project-scoped route (e.g., /issues, /docs)
  if (segments.length === 1 && PROJECT_SCOPED_ROUTES.has(segments[0])) {
    return contentResult(<ProjectContextRequired requestedPage={segments[0]} />)
  }

  // Need at least org/project to be a project-scoped route
  if (segments.length < 2) {
    return contentResult(<div className="not-found">Page not found</div>)
  }

  // Extract org, project, and remaining path
  const [org, project, pageType, ...rest] = segments
  return resolveProjectRoute(org, project, pageType, rest)
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
export function CatchAllRouter() {
  const pathname = usePathname()
  const router = useRouter()

  const { content, shouldRedirect, redirectTo } = useMemo(
    () => resolveRoute(pathname),
    [pathname]
  )

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
