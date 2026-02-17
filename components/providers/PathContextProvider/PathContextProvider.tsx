'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react'
import { useParams, useRouter, usePathname } from 'next/navigation'
import { route } from 'nextjs-routes'
import {
  resolveProject,
  resolveProjectPath,
  UNGROUPED_ORG_MARKER,
  type ProjectResolution,
} from '@/lib/project-resolver'
import type { PathContextType } from './PathContextProvider.types'
import {
  LAST_PROJECT_STORAGE_KEY,
  ROOT_ROUTES,
} from './PathContextProvider.types'

const PathContext = createContext<PathContextType | null>(null)

/**
 * Provider that extracts org/project from URL path and resolves to project info
 */
export function PathContextProvider({ children }: { children: ReactNode }) {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const org = params?.organization as string | undefined
  const project = params?.project as string | undefined
  const pathSegments = useMemo(
    () =>
      pathname
        .split('/')
        .filter(Boolean)
        .map(s => decodeURIComponent(s)),
    [pathname]
  )

  const urlOrg = useMemo(() => {
    if (org) return org
    if (pathSegments.length >= 2 && !ROOT_ROUTES.has(pathSegments[0]))
      return pathSegments[0]
    return undefined
  }, [org, pathSegments])

  const urlProject = useMemo(() => {
    if (project) return project
    if (pathSegments.length >= 2 && !ROOT_ROUTES.has(pathSegments[0]))
      return pathSegments[1]
    return undefined
  }, [project, pathSegments])

  const isAggregateView = !urlOrg || !urlProject
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

  const contextValue = useMemo<PathContextType>(() => {
    if (isAggregateView) {
      return {
        orgSlug: null,
        projectName: null,
        projectPath: '',
        isInitialized: null,
        displayPath: '',
        isAggregateView: true,
        isLoading: false,
        error: null,
        navigateToProject,
      }
    }
    if (resolution) {
      return {
        orgSlug: resolution.orgSlug,
        projectName: resolution.projectName,
        projectPath: resolution.projectPath,
        isInitialized: resolution.initialized,
        displayPath: resolution.displayPath,
        isAggregateView: false,
        isLoading,
        error,
        navigateToProject,
      }
    }
    return {
      orgSlug: urlOrg === UNGROUPED_ORG_MARKER ? null : (urlOrg ?? null),
      projectName: urlProject ?? null,
      projectPath: '',
      isInitialized: null,
      displayPath: '',
      isAggregateView: false,
      isLoading,
      error,
      navigateToProject,
    }
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

/**
 * Hook to access path context
 */
export function usePathContext() {
  const context = useContext(PathContext)
  if (!context) {
    throw new Error('usePathContext must be used within a PathContextProvider')
  }
  return context
}

/**
 * Hook to get last used project path (for redirect from root)
 */
export function useLastProjectPath(): string | null {
  const [lastPath] = useState<string | null>(() => {
    if (typeof window !== 'undefined')
      return localStorage.getItem(LAST_PROJECT_STORAGE_KEY)
    return null
  })
  return lastPath
}

/**
 * Hook to resolve a project path to URL params
 */
export function useProjectPathToUrl() {
  return async (projectPath: string) => {
    const result = await resolveProjectPath(projectPath)
    if (!result) return null
    return { orgSlug: result.orgSlug, projectName: result.projectName }
  }
}
