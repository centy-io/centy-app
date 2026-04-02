'use client'

import type { ReactElement } from 'react'
import Link from 'next/link'
import { route } from 'nextjs-routes'
import { useHeaderNav } from './useHeaderNav'
import { useMobileMenu } from './useMobileMenu'
import { DesktopNav } from './DesktopNav'
import { MobileMenu } from './MobileMenu'
import { MaybeContextLink, HamburgerButton } from './HeaderSubComponents'
import { DaemonStatusIndicator } from '@/components/shared/DaemonStatusIndicator'
import { DaemonUpdateBadge } from '@/components/shared/DaemonUpdateBadge'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { OrgSwitcher } from '@/components/organizations/OrgSwitcher'
import { ProjectSelector } from '@/components/project/ProjectSelector'
import { useOrganization } from '@/components/providers/OrganizationProvider'

export function Header(): ReactElement {
  const { selectedOrgSlug } = useOrganization()
  const {
    pathname,
    hasProjectContext,
    effectiveOrg,
    effectiveProject,
    itemTypes,
    navLinks,
    isActive,
  } = useHeaderNav()
  const { mobileMenuOpen, setMobileMenuOpen, toggleMobileMenu } =
    useMobileMenu(pathname)

  return (
    <header className="app-header">
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
          <MaybeContextLink
            hasProjectContext={hasProjectContext}
            effectiveOrg={effectiveOrg}
            effectiveProject={effectiveProject}
          />
        </h1>
        <div className="header-controls">
          <ThemeToggle />
          <DaemonUpdateBadge />
          <DaemonStatusIndicator />
          <OrgSwitcher />
          {selectedOrgSlug !== undefined && <ProjectSelector />}
        </div>
        <HamburgerButton isOpen={mobileMenuOpen} onToggle={toggleMobileMenu} />
      </div>
      <p className="header-tagline">
        Local-first issue and documentation tracker
      </p>
      <DesktopNav
        navLinks={navLinks}
        pathname={pathname}
        isActive={isActive}
        itemTypes={itemTypes}
      />
      <MobileMenu
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        selectedOrgSlug={selectedOrgSlug}
        navLinks={navLinks}
        pathname={pathname}
        isActive={isActive}
        itemTypes={itemTypes}
      />
    </header>
  )
}
