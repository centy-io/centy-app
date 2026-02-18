import type { ReactNode } from 'react'
import { route, type RouteLiteral } from 'nextjs-routes'
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
export const PROJECT_SCOPED_ROUTES = new Set(['issues', 'docs', 'users'])

export interface RouteResult {
  content: ReactNode
  shouldRedirect: boolean
  redirectTo: RouteLiteral | null
}

const NO_REDIRECT = {
  shouldRedirect: false,
  redirectTo: null,
} as const

function resolveSubRoute(pageType: string, rest: string[]): RouteResult | null {
  if (pageType === 'issues') {
    if (rest[0] === 'new') return { content: <CreateIssue />, ...NO_REDIRECT }
    if (rest[0])
      return {
        content: <IssueDetail issueNumber={rest[0]} />,
        ...NO_REDIRECT,
      }
    return { content: <IssuesList />, ...NO_REDIRECT }
  }
  if (pageType === 'docs') {
    if (rest[0] === 'new') return { content: <CreateDoc />, ...NO_REDIRECT }
    if (rest[0])
      return { content: <DocDetail slug={rest[0]} />, ...NO_REDIRECT }
    return { content: <DocsList />, ...NO_REDIRECT }
  }
  if (pageType === 'users') {
    if (rest[0] === 'new') return { content: <CreateUser />, ...NO_REDIRECT }
    if (rest[0])
      return {
        content: <UserDetail userId={rest[0]} />,
        ...NO_REDIRECT,
      }
    return { content: <UsersList />, ...NO_REDIRECT }
  }
  if (pageType === 'assets')
    return { content: <SharedAssets />, ...NO_REDIRECT }
  if (pageType === 'config')
    return { content: <ProjectConfig />, ...NO_REDIRECT }
  return null
}

export function resolveRoute(pathname: string): RouteResult {
  const segments = pathname.split('/').filter(Boolean)

  // Check if this is a single-segment project-scoped route
  if (segments.length === 1 && PROJECT_SCOPED_ROUTES.has(segments[0])) {
    return {
      content: null,
      shouldRedirect: false,
      redirectTo: null,
      // This case is handled specially in CatchAllRouter
    }
  }

  // Need at least org/project
  if (segments.length < 2) {
    return {
      content: <div className="not-found">Page not found</div>,
      ...NO_REDIRECT,
    }
  }

  const [org, project, pageType, ...rest] = segments

  if (pageType === undefined) {
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

  const result = resolveSubRoute(pageType, rest)
  if (result) return result

  return {
    content: <div className="not-found">Page not found</div>,
    ...NO_REDIRECT,
  }
}
