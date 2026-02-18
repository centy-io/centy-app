'use client'

import Link from 'next/link'
import type { NavLinks } from './types'
import { DOCS_URL } from '@/lib/constants/urls'

interface MobileNavLinksProps {
  navLinks: NavLinks | null
  pathname: string
  isActive: (href: string, checkPrefix?: boolean) => boolean
}

export function MobileNavLinks({
  navLinks,
  pathname,
  isActive,
}: MobileNavLinksProps) {
  return (
    <nav className="mobile-menu-nav">
      {navLinks && (
        <>
          <div className="mobile-nav-group">
            <Link
              href={navLinks.issues}
              className={isActive(navLinks.issues) ? 'active' : ''}
            >
              Issues
            </Link>
            <Link
              href={navLinks.docs}
              className={isActive(navLinks.docs) ? 'active' : ''}
            >
              Docs
            </Link>
            <Link
              href={navLinks.assets}
              className={isActive(navLinks.assets, false) ? 'active' : ''}
            >
              Assets
            </Link>
            <Link
              href={navLinks.users}
              className={isActive(navLinks.users) ? 'active' : ''}
            >
              Users
            </Link>
            <Link
              href={navLinks.config}
              className={isActive(navLinks.config, false) ? 'active' : ''}
            >
              Project Config
            </Link>
          </div>
          <div className="mobile-nav-divider" aria-hidden="true" />
        </>
      )}
      <div className="mobile-nav-group">
        <Link
          href="/organizations"
          className={pathname.startsWith('/organizations') ? 'active' : ''}
        >
          Organizations
        </Link>
        <Link
          href="/settings"
          className={pathname === '/settings' ? 'active' : ''}
        >
          Settings
        </Link>
        <a
          href={DOCS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="external-link"
        >
          Docs {'\u2197'}
        </a>
      </div>
    </nav>
  )
}
