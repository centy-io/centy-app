'use client'

import Link from 'next/link'
import { route } from 'nextjs-routes'
import { UNGROUPED_ORG_MARKER } from '@/lib/project-resolver'

interface ContextLinkProps {
  effectiveOrg: string
  effectiveProject: string
}

export function ContextLink({
  effectiveOrg,
  effectiveProject,
}: ContextLinkProps) {
  const href =
    effectiveOrg === UNGROUPED_ORG_MARKER
      ? route({ pathname: '/organizations' })
      : route({
          pathname: '/organizations/[orgSlug]',
          query: { orgSlug: effectiveOrg },
        })

  return (
    <Link href={href} className="header-context-link">
      {effectiveOrg === UNGROUPED_ORG_MARKER ? '' : `${effectiveOrg} / `}
      {effectiveProject}
    </Link>
  )
}
