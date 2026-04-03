'use client'

import { useMemo } from 'react'
import { usePathname, useParams } from 'next/navigation'
import { ROOT_ROUTES } from './ROOT_ROUTES'

export function useProjectContext() {
  const pathname = usePathname()
  const params = useParams()

  const orgParam = params ? params.organization : undefined
  const org: string | undefined =
    typeof orgParam === 'string' ? orgParam : undefined
  const projectParam = params ? params.project : undefined
  const project: string | undefined =
    typeof projectParam === 'string' ? projectParam : undefined

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

  return { pathname, hasProjectContext, effectiveOrg, effectiveProject }
}
