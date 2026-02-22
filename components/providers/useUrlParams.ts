'use client'

import { useMemo } from 'react'
import { useParams, usePathname } from 'next/navigation'
import { ROOT_ROUTES } from './PathContextProvider.types'

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
