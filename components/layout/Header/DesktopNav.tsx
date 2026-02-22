'use client'

import Link from 'next/link'
import type { RouteLiteral } from 'nextjs-routes'
import type { NavLinks, NavItemType } from './types'
import { DOCS_URL } from '@/lib/constants/urls'

interface DesktopNavProps {
  navLinks: NavLinks | null
  pathname: string
  isActive: (href: string, checkPrefix?: boolean) => boolean
  effectiveOrg: string | undefined
  effectiveProject: string | undefined
  itemTypes: NavItemType[]
}

// eslint-disable-next-line max-lines-per-function
export function DesktopNav({
  navLinks,
  pathname,
  isActive,
  effectiveOrg,
  effectiveProject,
  itemTypes,
}: DesktopNavProps) {
  return (
    <nav className="app-nav">
      {navLinks && (
        <>
          <div className="nav-group nav-group-project">
            {itemTypes.map(t => {
              // eslint-disable-next-line no-restricted-syntax
              const href =
                `/${effectiveOrg}/${effectiveProject}/${t.plural}` as RouteLiteral
              return (
                <Link
                  key={t.plural}
                  href={href}
                  className={isActive(href) ? 'active' : ''}
                >
                  {t.name}
                </Link>
              )
            })}
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
          <div className="nav-divider" aria-hidden="true" />
        </>
      )}
      <div className="nav-group nav-group-general">
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
