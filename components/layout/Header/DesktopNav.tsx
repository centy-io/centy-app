'use client'

import Link from 'next/link'
import { route, type RouteLiteral } from 'nextjs-routes'
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

function ProjectNavGroup({
  navLinks,
  isActive,
  effectiveOrg,
  effectiveProject,
  itemTypes,
}: Omit<DesktopNavProps, 'pathname' | 'navLinks'> & { navLinks: NavLinks }) {
  return (
    <>
      <div className="nav-group nav-group-project">
        {itemTypes.map(t => {
          const href =
            `/${effectiveOrg}/${effectiveProject}/${t.plural}` as RouteLiteral // eslint-disable-line no-restricted-syntax
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
  )
}

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
        <ProjectNavGroup
          navLinks={navLinks}
          isActive={isActive}
          effectiveOrg={effectiveOrg}
          effectiveProject={effectiveProject}
          itemTypes={itemTypes}
        />
      )}
      <div className="nav-group nav-group-general">
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
