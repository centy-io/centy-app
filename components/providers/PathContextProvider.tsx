'use client'

import { useMemo, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import { UNGROUPED_ORG_MARKER } from '@/lib/project-resolver'
import { PathContext } from './PathContextProvider.hooks'
import {
  buildAggregateContext,
  buildResolvedContext,
  buildPendingContext,
} from './PathContextProvider.helpers'
import {
  useUrlParams,
  useProjectResolution,
} from './PathContextProvider.useResolve'

// Re-export hooks for consumers
export {
  usePathContext,
  useLastProjectPath,
  useProjectPathToUrl,
} from './PathContextProvider.hooks'

export function PathContextProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { urlOrg, urlProject, isAggregateView } = useUrlParams()
  const { resolution, isLoading, error } = useProjectResolution(
    urlOrg,
    urlProject,
    isAggregateView
  )

  const navigateToProject = useMemo(() => {
    return (orgSlug: string | null, projectName: string, page = 'issues') => {
      const o = orgSlug !== null ? orgSlug : UNGROUPED_ORG_MARKER
      router.push(
        route({
          pathname: '/[...path]',
          query: { path: [o, projectName, page] },
        })
      )
    }
  }, [router])

  const contextValue = useMemo(() => {
    if (isAggregateView) return buildAggregateContext(navigateToProject)
    if (resolution) {
      return buildResolvedContext(
        resolution,
        isLoading,
        error,
        navigateToProject
      )
    }
    return buildPendingContext(
      urlOrg,
      urlProject,
      isLoading,
      error,
      navigateToProject
    )
  }, [
    isAggregateView,
    resolution,
    urlOrg,
    urlProject,
    isLoading,
    error,
    navigateToProject,
  ])

  return (
    <PathContext.Provider value={contextValue}>{children}</PathContext.Provider>
  )
}
