'use client'

import { useHeaderNav } from './useHeaderNav'
import { useMobileMenu } from './useMobileMenu'
import { DesktopNav } from './DesktopNav'
import { MobileMenu } from './MobileMenu'
import { HeaderTop } from './HeaderTop'
import { useOrganization } from '@/components/providers/OrganizationProvider'

export function Header() {
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
      <HeaderTop
        selectedOrgSlug={selectedOrgSlug}
        hasProjectContext={hasProjectContext}
        effectiveOrg={effectiveOrg}
        effectiveProject={effectiveProject}
        mobileMenuOpen={mobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />
      <p className="header-tagline">
        Local-first issue and documentation tracker
      </p>
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
        selectedOrgSlug={selectedOrgSlug}
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
