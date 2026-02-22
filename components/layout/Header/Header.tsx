'use client'

import Link from 'next/link'
import { route } from 'nextjs-routes'
import { useHeaderNav } from './useHeaderNav'
import { useMobileMenu } from './useMobileMenu'
import { DesktopNav } from './DesktopNav'
import { MobileMenu } from './MobileMenu'
import { DaemonStatusIndicator } from '@/components/shared/DaemonStatusIndicator'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { OrgSwitcher } from '@/components/organizations/OrgSwitcher'
import { ProjectSelector } from '@/components/project/ProjectSelector'
import { useOrganization } from '@/components/providers/OrganizationProvider'
import { UNGROUPED_ORG_MARKER } from '@/lib/project-resolver'

// eslint-disable-next-line max-lines-per-function
export function Header() {
  const { hasExplicitSelection } = useOrganization()
  const {
    pathname,
    hasProjectContext,
    effectiveOrg,
    effectiveProject,
    navLinks,
    isActive,
    itemTypes,
  } = useHeaderNav()
  const { mobileMenuOpen, setMobileMenuOpen, toggleMobileMenu } =
    useMobileMenu(pathname)

  const contextDisplay =
    hasProjectContext && effectiveOrg && effectiveProject ? (
      <Link
        href={
          effectiveOrg === UNGROUPED_ORG_MARKER
            ? '/organizations'
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
    <header className="app-header">
      <div className="header-top">
        <h1>
          <Link href="/" className="header-logo-link">
            <img
              src="/logo.svg"
              alt=""
              className="header-logo-icon"
              width={28}
              height={28}
              aria-hidden="true"
            />
            <span>Centy</span>
          </Link>
          {contextDisplay}
        </h1>
        <div className="header-controls">
          <ThemeToggle />
          <DaemonStatusIndicator />
          <OrgSwitcher />
          {hasExplicitSelection && <ProjectSelector />}
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
      <p>Local-first issue and documentation tracker</p>
      <DesktopNav
        navLinks={navLinks}
        pathname={pathname}
        isActive={isActive}
        effectiveOrg={effectiveOrg}
        effectiveProject={effectiveProject}
        itemTypes={itemTypes}
      />
      <MobileMenu
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        hasExplicitSelection={hasExplicitSelection}
        navLinks={navLinks}
        pathname={pathname}
        isActive={isActive}
        effectiveOrg={effectiveOrg}
        effectiveProject={effectiveProject}
        itemTypes={itemTypes}
      />
    </header>
  )
}
