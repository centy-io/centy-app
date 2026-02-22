'use client'

import type { NavLinks, NavItemType } from './types'
import { MobileNavLinks } from './MobileNavLinks'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { DaemonStatusIndicator } from '@/components/shared/DaemonStatusIndicator'
import { OrgSwitcher } from '@/components/organizations/OrgSwitcher'
import { ProjectSelector } from '@/components/project/ProjectSelector'

interface MobileMenuProps {
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  hasExplicitSelection: boolean
  navLinks: NavLinks | null
  pathname: string
  isActive: (href: string, checkPrefix?: boolean) => boolean
  effectiveOrg: string | undefined
  effectiveProject: string | undefined
  itemTypes: NavItemType[]
}

export function MobileMenu({
  mobileMenuOpen,
  setMobileMenuOpen,
  hasExplicitSelection,
  navLinks,
  pathname,
  isActive,
  effectiveOrg,
  effectiveProject,
  itemTypes,
}: MobileMenuProps) {
  return (
    <>
      <div
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-controls">
          <ThemeToggle />
          <DaemonStatusIndicator />
        </div>
        <div className="mobile-menu-selectors">
          <OrgSwitcher />
          {hasExplicitSelection && <ProjectSelector />}
        </div>
        <MobileNavLinks
          navLinks={navLinks}
          pathname={pathname}
          isActive={isActive}
          effectiveOrg={effectiveOrg}
          effectiveProject={effectiveProject}
          itemTypes={itemTypes}
        />
      </div>
    </>
  )
}
