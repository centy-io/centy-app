'use client'

import type { ReactElement } from 'react'
import Link from 'next/link'
import { route } from 'nextjs-routes'
import { UNGROUPED_ORG_MARKER } from '@/lib/project-resolver'

interface ContextLinkProps {
  effectiveOrg: string
  effectiveProject: string
}

function ContextLink({
  effectiveOrg,
  effectiveProject,
}: ContextLinkProps): ReactElement {
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

interface MaybeContextLinkProps {
  hasProjectContext: boolean
  effectiveOrg: string | undefined
  effectiveProject: string | undefined
}

export function MaybeContextLink({
  hasProjectContext,
  effectiveOrg,
  effectiveProject,
}: MaybeContextLinkProps): ReactElement | null {
  if (!hasProjectContext || !effectiveOrg || !effectiveProject) return null
  return (
    <ContextLink
      effectiveOrg={effectiveOrg}
      effectiveProject={effectiveProject}
    />
  )
}

interface HamburgerButtonProps {
  isOpen: boolean
  onToggle: () => void
}

export function HamburgerButton({
  isOpen,
  onToggle,
}: HamburgerButtonProps): ReactElement {
  return (
    <button
      className={`mobile-menu-toggle ${isOpen ? 'open' : ''}`}
      onClick={onToggle}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <span className="hamburger-line" />
      <span className="hamburger-line" />
      <span className="hamburger-line" />
    </button>
  )
}
