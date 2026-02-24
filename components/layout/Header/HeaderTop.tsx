'use client'

import Link from 'next/link'
import { route } from 'nextjs-routes'
import { DaemonStatusIndicator } from '@/components/shared/DaemonStatusIndicator'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { OrgSwitcher } from '@/components/organizations/OrgSwitcher'
import { ProjectSelector } from '@/components/project/ProjectSelector'
import { UNGROUPED_ORG_MARKER } from '@/lib/project-resolver'

export interface HeaderTopProps {
  selectedOrgSlug: string | null | undefined
  hasProjectContext: boolean
  effectiveOrg: string | undefined
  effectiveProject: string | undefined
  mobileMenuOpen: boolean
  toggleMobileMenu: () => void
}

export function HeaderTop({
  selectedOrgSlug,
  hasProjectContext,
  effectiveOrg,
  effectiveProject,
  mobileMenuOpen,
  toggleMobileMenu,
}: HeaderTopProps) {
  const contextLink =
    hasProjectContext && effectiveOrg && effectiveProject ? (
      <Link
        href={
          effectiveOrg === UNGROUPED_ORG_MARKER
            ? route({ pathname: '/organizations' })
            : route({
                pathname: '/organizations/[orgSlug]',
                query: { orgSlug: effectiveOrg },
              })
        }
        className="header-context-link"
      >
        {effectiveOrg === UNGROUPED_ORG_MARKER ? '' : `${effectiveOrg} / `}
        {effectiveProject}
      </Link>
    ) : null
  return (
    <div className="header-top">
      <h1 className="header-title">
        <Link href={route({ pathname: '/' })} className="header-logo-link">
          <img
            src="/logo.svg"
            alt=""
            className="header-logo-icon"
            width={28}
            height={28}
            aria-hidden="true"
          />
          <span className="header-app-name">Centy</span>
        </Link>
        {contextLink}
      </h1>
      <div className="header-controls">
        <ThemeToggle />
        <DaemonStatusIndicator />
        <OrgSwitcher />
        {selectedOrgSlug !== undefined && <ProjectSelector />}
      </div>
      <button
        className={`mobile-menu-toggle ${mobileMenuOpen ? 'open' : ''}`}
        onClick={toggleMobileMenu}
        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileMenuOpen}
      >
        <span className="hamburger-line" />
        <span className="hamburger-line" />
        <span className="hamburger-line" />
      </button>
    </div>
  )
}
