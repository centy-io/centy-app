'use client'

import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { DaemonStatusIndicator } from '@/components/shared/DaemonStatusIndicator'
import { OrgSwitcher } from '@/components/organizations/OrgSwitcher'
import { ProjectSelector } from '@/components/project/ProjectSelector'
import type { NavLinks } from './types'
import { MobileNavLinks } from './MobileNavLinks'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  pathname: string
  navLinks: NavLinks | null
  isActive: (href: string, checkPrefix?: boolean) => boolean
  hasExplicitSelection: boolean
}

export function MobileMenu({
  isOpen,
  onClose,
  pathname,
  navLinks,
  isActive,
  hasExplicitSelection,
}: MobileMenuProps) {
  return (
    <>
      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-menu-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile Menu Drawer */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <div className="mobile-menu-controls">
          <ThemeToggle />
          <DaemonStatusIndicator />
        </div>
        <div className="mobile-menu-selectors">
          <OrgSwitcher />
          {hasExplicitSelection && <ProjectSelector />}
        </div>
        <MobileNavLinks
          pathname={pathname}
          navLinks={navLinks}
          isActive={isActive}
        />
      </div>
    </>
  )
}
