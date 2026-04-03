'use client'

import { useState, useEffect } from 'react'
import { resolveProject, type ProjectResolution } from '@/lib/project-resolver'

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
    if (!urlOrg || !urlProject) return
    const org = urlOrg
    const project = urlProject
    let cancelled = false
    async function resolve() {
      setIsLoading(true)
      setError(null)
      try {
        const result = await resolveProject(org, project)
        if (cancelled) return
        if (result) {
          setResolution(result)
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
