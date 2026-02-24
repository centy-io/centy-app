'use client'

import { useParams, usePathname } from 'next/navigation'
import { ROOT_ROUTES } from './ProjectSelector.types'

export function getCurrentPageFromParams(
  routeParams: ReturnType<typeof useParams>,
  pathname: string
): string {
  const orgP = routeParams ? routeParams.organization : undefined
  const org = typeof orgP === 'string' ? orgP : undefined
  const projP = routeParams ? routeParams.project : undefined
  const proj = typeof projP === 'string' ? projP : undefined
  const segments = pathname.split('/').filter(Boolean)
  if (org && proj) return segments[2] || 'issues'
  if (segments.length >= 2 && !ROOT_ROUTES.has(segments[0]))
    return segments[2] || 'issues'
  return segments[0] || 'issues'
}
