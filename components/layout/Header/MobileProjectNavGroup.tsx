'use client'

import Link from 'next/link'
import { type RouteLiteral } from 'nextjs-routes'
import type { NavLinks, NavItemType } from './types'

export interface MobileNavGroupProps {
  navLinks: NavLinks
  isActive: (href: string, checkPrefix?: boolean) => boolean
  effectiveOrg: string | undefined
  effectiveProject: string | undefined
  itemTypes: NavItemType[]
}

export function MobileProjectNavGroup({
  navLinks,
  isActive,
  effectiveOrg,
  effectiveProject,
  itemTypes,
}: MobileNavGroupProps) {
  return (
    <>
      <div className="mobile-nav-group">
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
      <div className="mobile-nav-divider" aria-hidden="true" />
    </>
  )
}
