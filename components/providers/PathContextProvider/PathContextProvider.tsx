'use client'

import {
  createContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import {
  resolveProject,
  UNGROUPED_ORG_MARKER,
  type ProjectResolution,
} from '@/lib/project-resolver'
import type { PathContextType } from './PathContextProvider.types'
import { LAST_PROJECT_STORAGE_KEY } from './PathContextProvider.types'
import { useUrlParams } from './useUrlParams'
import { buildContextValue } from './buildContextValue'

export const PathContext = createContext<PathContextType | null>(null)

export function PathContextProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { urlOrg, urlProject, isAggregateView } = useUrlParams()
  const [resolution, setResolution] = useState<ProjectResolution | null>(null)
  const [isLoading, setIsLoading] = useState(!isAggregateView)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAggregateView) {
      setResolution(null)
      setIsLoading(false)
      setError(null)
      return
    }
    let cancelled = false
    async function resolve() {
      setIsLoading(true)
      setError(null)
      try {
        const result = await resolveProject(urlOrg!, urlProject!)
        if (cancelled) return
        if (result) {
          setResolution(result)
          if (typeof window !== 'undefined')
            localStorage.setItem(LAST_PROJECT_STORAGE_KEY, result.projectPath)
        } else {
          setError(`Project not found: ${urlOrg}/${urlProject}`)
          setResolution(null)
        }
      } catch (err) {
        if (cancelled) return
        setError(
          err instanceof Error ? err.message : 'Failed to resolve project'
        )
        setResolution(null)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    resolve()
    return () => {
      cancelled = true
    }
  }, [urlOrg, urlProject, isAggregateView])

  const navigateToProject = useMemo(() => {
    return (orgSlug: string | null, projectName: string, page = 'issues') => {
      const o = orgSlug ?? UNGROUPED_ORG_MARKER
      router.push(
        route({
          pathname: '/[...path]',
          query: { path: [o, projectName, page] },
        })
      )
    }
  }, [router])

  const contextValue = useMemo(
    () =>
      buildContextValue(
        isAggregateView,
        resolution,
        urlOrg,
        urlProject,
        isLoading,
        error,
        navigateToProject
      ),
    [
      isAggregateView,
      resolution,
      urlOrg,
      urlProject,
      isLoading,
      error,
      navigateToProject,
    ]
  )

  return (
    <PathContext.Provider value={contextValue}>{children}</PathContext.Provider>
  )
}
