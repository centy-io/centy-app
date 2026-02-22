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
  const { selectedOrgSlug } = useOrganization()
  const {
    pathname,
    hasProjectContext,
    effectiveOrg,
    effectiveProject,
    navLinks,
    isActive,
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
        <h1 className="header-title">
          <Link href="/" className="header-logo-link">
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
          {contextDisplay}
        </h1>
        <div className="header-controls">
          <ThemeToggle />
          <DaemonStatusIndicator />
          <OrgSwitcher />
          {selectedOrgSlug !== null && <ProjectSelector />}
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
      <p className="header-tagline">
        Local-first issue and documentation tracker
      </p>
      <DesktopNav navLinks={navLinks} pathname={pathname} isActive={isActive} />
      <MobileMenu
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        selectedOrgSlug={selectedOrgSlug}
        navLinks={navLinks}
        pathname={pathname}
        isActive={isActive}
      />
    </header>
  )
}
