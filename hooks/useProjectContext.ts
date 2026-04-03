'use client'

import { useMemo } from 'react'
import { usePathname, useParams } from 'next/navigation'

const ROOT_ROUTES = new Set([
  'organizations',
  'settings',
  'archived',
  'assets',
  'project',
])

interface ProjectContext {
  pathSegments: string[]
  hasProjectContext: boolean
  effectiveOrg: string | undefined
  effectiveProject: string | undefined
}

export function useProjectContext(): ProjectContext {
  const pathname = usePathname()
  const params = useParams()

  const rawOrg = params ? params.organization : undefined
  const org: string | undefined =
    typeof rawOrg === 'string' ? rawOrg : undefined
  const rawProject = params ? params.project : undefined
  const project: string | undefined =
    typeof rawProject === 'string' ? rawProject : undefined

  const pathSegments = useMemo(() => {
    return pathname.split('/').filter(Boolean)
  }, [pathname])

  const hasProjectContext = useMemo(() => {
    if (org && project) return true
    if (pathSegments.length >= 2 && !ROOT_ROUTES.has(pathSegments[0])) {
      return true
    }
    return false
  }, [org, project, pathSegments])

  const effectiveOrg = org ?? (hasProjectContext ? pathSegments[0] : undefined)
  const effectiveProject =
    project ?? (hasProjectContext ? pathSegments[1] : undefined)

  return { pathSegments, hasProjectContext, effectiveOrg, effectiveProject }
}
