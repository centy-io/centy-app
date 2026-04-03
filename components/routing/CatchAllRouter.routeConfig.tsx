import type { ReactNode } from 'react'
import { route, type RouteLiteral } from 'nextjs-routes'
import { IssuesList } from '@/components/issues/IssuesList'
import { IssueDetail } from '@/components/issues/IssueDetail'
import { CreateIssue } from '@/components/issues/CreateIssue'
import { UsersList } from '@/components/users/UsersList'
import { UserDetail } from '@/components/users/UserDetail'
import { CreateUser } from '@/components/users/CreateUser'
import { SharedAssets } from '@/components/assets/SharedAssets'
import { ProjectConfig } from '@/components/settings/ProjectConfig'
import { GenericItemsList } from '@/components/generic/GenericItemsList'
import { GenericItemDetail } from '@/components/generic/GenericItemDetail'
import { GenericItemCreate } from '@/components/generic/GenericItemCreate'

// Routes that require project context (no longer accessible at root level)
export const PROJECT_SCOPED_ROUTES = new Set(['issues', 'users'])

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

  // Generic fallback for dynamic page types (e.g. personas, stories)
  if (rest[0] === 'new')
    return {
      content: <GenericItemCreate itemType={pageType} />,
      ...NO_REDIRECT,
    }
  if (rest[0])
    return {
      content: <GenericItemDetail itemType={pageType} itemId={rest[0]} />,
      ...NO_REDIRECT,
    }
  return { content: <GenericItemsList itemType={pageType} />, ...NO_REDIRECT }
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

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
