'use client'

import Link from 'next/link'
import { route } from 'nextjs-routes'
import type { NavLinks, NavItemType } from './types'
import { ProjectNavGroup } from './ProjectNavGroup'
import { DOCS_URL } from '@/lib/constants/urls'

interface DesktopNavProps {
  navLinks: NavLinks | null
  pathname: string
  isActive: (href: string, checkPrefix?: boolean) => boolean
  effectiveOrg: string | undefined
  effectiveProject: string | undefined
  itemTypes: NavItemType[]
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
