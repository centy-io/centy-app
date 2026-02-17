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
import {
  PROJECT_SCOPED_ROUTES,
  ProjectContextRequired,
} from './CatchAllRouter.types'

export interface RouteResult {
  content: React.ReactNode | null
  shouldRedirect: boolean
  redirectTo: RouteLiteral | null
}

const NO_REDIRECT = { shouldRedirect: false, redirectTo: null }

export function resolveRoute(pathname: string): RouteResult {
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 1 && PROJECT_SCOPED_ROUTES.has(segments[0])) {
    return {
      content: <ProjectContextRequired requestedPage={segments[0]} />,
      ...NO_REDIRECT,
    }
  }
  if (segments.length < 2) {
    return {
      content: <div className="not-found">Page not found</div>,
      ...NO_REDIRECT,
    }
  }

  const [org, project, pageType, ...rest] = segments

  switch (pageType) {
    case 'issues':
      if (rest[0] === 'new') return { content: <CreateIssue />, ...NO_REDIRECT }
      if (rest[0])
        return {
          content: <IssueDetail issueNumber={rest[0]} />,
          ...NO_REDIRECT,
        }
      return { content: <IssuesList />, ...NO_REDIRECT }
    case 'docs':
      if (rest[0] === 'new') return { content: <CreateDoc />, ...NO_REDIRECT }
      if (rest[0])
        return { content: <DocDetail slug={rest[0]} />, ...NO_REDIRECT }
      return { content: <DocsList />, ...NO_REDIRECT }
    case 'users':
      if (rest[0] === 'new') return { content: <CreateUser />, ...NO_REDIRECT }
      if (rest[0])
        return { content: <UserDetail userId={rest[0]} />, ...NO_REDIRECT }
      return { content: <UsersList />, ...NO_REDIRECT }
    case 'assets':
      return { content: <SharedAssets />, ...NO_REDIRECT }
    case 'config':
      return { content: <ProjectConfig />, ...NO_REDIRECT }
    case undefined:
      return {
        content: null,
        shouldRedirect: true,
        redirectTo: route({
          pathname: '/[organization]/[project]/issues',
          query: { organization: org, project },
        }),
      }
    default:
      return {
        content: <div className="not-found">Page not found</div>,
        ...NO_REDIRECT,
      }
  }
}
