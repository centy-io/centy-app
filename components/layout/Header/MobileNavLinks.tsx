'use client'

import Link from 'next/link'
import { route } from 'nextjs-routes'
import type { NavLinks, NavItemType } from './types'
import { MobileProjectNavGroup } from './MobileProjectNavGroup'
import { DOCS_URL } from '@/lib/constants/urls'

interface MobileNavLinksProps {
  navLinks: NavLinks | null
  pathname: string
  isActive: (href: string, checkPrefix?: boolean) => boolean
  effectiveOrg: string | undefined
  effectiveProject: string | undefined
  itemTypes: NavItemType[]
}

export function MobileNavLinks({
  navLinks,
  pathname,
  isActive,
  effectiveOrg,
  effectiveProject,
  itemTypes,
}: MobileNavLinksProps) {
  return (
    <nav className="mobile-menu-nav">
      {navLinks && (
        <MobileProjectNavGroup
          navLinks={navLinks}
          isActive={isActive}
          effectiveOrg={effectiveOrg}
          effectiveProject={effectiveProject}
          itemTypes={itemTypes}
        />
      )}
      <div className="mobile-nav-group">
        <Link
          href={route({ pathname: '/organizations' })}
          className={pathname.startsWith('/organizations') ? 'active' : ''}
        >
          Organizations
        </Link>
        <Link
          href={route({ pathname: '/settings' })}
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
