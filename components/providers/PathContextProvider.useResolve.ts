'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, usePathname } from 'next/navigation'
import { resolveProject, type ProjectResolution } from '@/lib/project-resolver'
import {
  LAST_PROJECT_STORAGE_KEY,
  ROOT_ROUTES,
} from './PathContextProvider.types'

export function useUrlParams() {
  const params = useParams()
  const pathname = usePathname()

  const orgParam = params ? params.organization : undefined
  const org: string | undefined =
    typeof orgParam === 'string' ? orgParam : undefined
  const projectParam = params ? params.project : undefined
  const project: string | undefined =
    typeof projectParam === 'string' ? projectParam : undefined

  const pathSegments = useMemo(() => {
    return pathname
      .split('/')
      .filter(Boolean)
      .map(s => decodeURIComponent(s))
  }, [pathname])

  const urlOrg = useMemo(() => {
    if (org) return org
    if (pathSegments.length >= 2 && !ROOT_ROUTES.has(pathSegments[0])) {
      return pathSegments[0]
    }
    return undefined
  }, [org, pathSegments])

  const urlProject = useMemo(() => {
    if (project) return project
    if (pathSegments.length >= 2 && !ROOT_ROUTES.has(pathSegments[0])) {
      return pathSegments[1]
    }
    return undefined
  }, [project, pathSegments])

  const isAggregateView = !urlOrg || !urlProject

  return { urlOrg, urlProject, isAggregateView }
}

export function useProjectResolution(
  urlOrg: string | undefined,
  urlProject: string | undefined,
  isAggregateView: boolean
) {
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
          if (typeof window !== 'undefined') {
            localStorage.setItem(LAST_PROJECT_STORAGE_KEY, result.projectPath)
          }
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

  return { resolution, isLoading, error }
}
