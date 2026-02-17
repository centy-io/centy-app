'use client'

import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { route } from 'nextjs-routes'
import { useState, useEffect, useMemo } from 'react'
import { DaemonStatusIndicator } from '@/components/shared/DaemonStatusIndicator'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { OrgSwitcher } from '@/components/organizations/OrgSwitcher'
import { ProjectSelector } from '@/components/project/ProjectSelector'
import { useOrganization } from '@/components/providers/OrganizationProvider'
import { UNGROUPED_ORG_MARKER } from '@/lib/project-resolver'

// Known root-level routes that are NOT org/project paths
const ROOT_ROUTES = new Set([
  'organizations',
  'settings',
  'archived',
  'assets',
  'project',
])

interface NavLinks {
  issues: string
  docs: string
  assets: string
  users: string
  config: string
}

function useNavLinks(
  hasProjectContext: boolean,
  effectiveOrg?: string,
  effectiveProject?: string
) {
  return useMemo((): NavLinks | null => {
    if (hasProjectContext && effectiveOrg && effectiveProject) {
      return {
        issues: route({
          pathname: '/[organization]/[project]/issues',
          query: { organization: effectiveOrg, project: effectiveProject },
        }),
        docs: route({
          pathname: '/[organization]/[project]/docs',
          query: { organization: effectiveOrg, project: effectiveProject },
        }),
        assets: route({
          pathname: '/[organization]/[project]/assets',
          query: { organization: effectiveOrg, project: effectiveProject },
        }),
        users: route({
          pathname: '/[organization]/[project]/users',
          query: { organization: effectiveOrg, project: effectiveProject },
        }),
        config: route({
          pathname: '/[organization]/[project]/config',
          query: { organization: effectiveOrg, project: effectiveProject },
        }),
      }
    }
    return null
  }, [hasProjectContext, effectiveOrg, effectiveProject])
}

function useProjectContext(
  params: ReturnType<typeof useParams>,
  pathname: string
) {
  const org = params ? (params.organization as string | undefined) : undefined
  const project = params ? (params.project as string | undefined) : undefined

  const pathSegments = useMemo(() => {
    return pathname.split('/').filter(Boolean)
  }, [pathname])

  const hasProjectContext = useMemo(() => {
    if (org && project) return true
    if (pathSegments.length >= 2 && !ROOT_ROUTES.has(pathSegments[0])) {
      return true
    }
    return false
  }, [org, project, pathSegments])

  const effectiveOrg = org || (hasProjectContext ? pathSegments[0] : undefined)
  const effectiveProject =
    project || (hasProjectContext ? pathSegments[1] : undefined)

  return { hasProjectContext, effectiveOrg, effectiveProject }
}

function useMobileMenu(pathname: string) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setMobileMenuOpen(false)
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [pathname])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return { mobileMenuOpen, setMobileMenuOpen }
}

interface ProjectNavLinksProps {
  navLinks: NavLinks
  isActive: (href: string, checkPrefix?: boolean) => boolean
  groupClassName: string
  dividerClassName: string
}

function ProjectNavLinks({
  navLinks,
  isActive,
  groupClassName,
  dividerClassName,
}: ProjectNavLinksProps) {
  return (
    <>
      <div className={groupClassName}>
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
      <div className={dividerClassName} aria-hidden="true" />
    </>
  )
}

function GeneralNavLinks({
  pathname,
  groupClassName,
}: {
  pathname: string
  groupClassName: string
}) {
  return (
    <div className={groupClassName}>
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
        href="https://docs.centy.io"
        target="_blank"
        rel="noopener noreferrer"
        className="external-link"
      >
        Docs ↗
      </a>
    </div>
  )
}

function ContextDisplay({
  effectiveOrg,
  effectiveProject,
}: {
  effectiveOrg: string
  effectiveProject: string
}) {
  return (
    <Link
      href={
        effectiveOrg === UNGROUPED_ORG_MARKER
          ? '/organizations'
          : route({
              pathname: '/organizations/[orgSlug]',
              query: { orgSlug: effectiveOrg },
            })
      }
      className="header-context-link"
    >
      {effectiveOrg === UNGROUPED_ORG_MARKER ? '' : `${effectiveOrg} / `}
      {effectiveProject}
    </Link>
  )
}

interface MobileMenuDrawerProps {
  mobileMenuOpen: boolean
  setMobileMenuOpen: (v: boolean) => void
  hasExplicitSelection: boolean
  navLinks: NavLinks | null
  isActive: (href: string, checkPrefix?: boolean) => boolean
  pathname: string
}

function MobileMenuDrawer({
  mobileMenuOpen,
  setMobileMenuOpen,
  hasExplicitSelection,
  navLinks,
  isActive,
  pathname,
}: MobileMenuDrawerProps) {
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
        <nav className="mobile-menu-nav">
          {navLinks && (
            <ProjectNavLinks
              navLinks={navLinks}
              isActive={isActive}
              groupClassName="mobile-nav-group"
              dividerClassName="mobile-nav-divider"
            />
          )}
          <GeneralNavLinks
            pathname={pathname}
            groupClassName="mobile-nav-group"
          />
        </nav>
      </div>
    </>
  )
}

interface HeaderTopProps {
  hasProjectContext: boolean
  effectiveOrg?: string
  effectiveProject?: string
  hasExplicitSelection: boolean
  mobileMenuOpen: boolean
  setMobileMenuOpen: (v: boolean) => void
}

function HeaderTop({
  hasProjectContext,
  effectiveOrg,
  effectiveProject,
  hasExplicitSelection,
  mobileMenuOpen,
  setMobileMenuOpen,
}: HeaderTopProps) {
  return (
    <div className="header-top">
      <h1>
        <Link href="/" className="header-logo-link">
          <img
            src="/logo.svg"
            alt=""
            className="header-logo-icon"
            width={28}
            height={28}
            aria-hidden="true"
          />
          <span>Centy</span>
        </Link>
        {hasProjectContext && effectiveOrg && effectiveProject && (
          <ContextDisplay
            effectiveOrg={effectiveOrg}
            effectiveProject={effectiveProject}
          />
        )}
      </h1>
      <div className="header-controls">
        <ThemeToggle />
        <DaemonStatusIndicator />
        <OrgSwitcher />
        {hasExplicitSelection && <ProjectSelector />}
      </div>
      <button
        className={`mobile-menu-toggle ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileMenuOpen}
      >
        <span className="hamburger-line" />
        <span className="hamburger-line" />
        <span className="hamburger-line" />
      </button>
    </div>
  )
}

function useIsActive(hasProjectContext: boolean, pathname: string) {
  return (href: string, checkPrefix = true) => {
    if (checkPrefix) {
      if (hasProjectContext) {
        const page = href.split('/').slice(3).join('/')
        const currentPage = pathname.split('/').slice(3).join('/')
        return currentPage.startsWith(page.split('/')[0])
      }
      return pathname.startsWith(href)
    }
    return pathname === href
  }
}

export function Header() {
  const pathname = usePathname()
  const params = useParams()
  const { hasExplicitSelection } = useOrganization()
  const { hasProjectContext, effectiveOrg, effectiveProject } =
    useProjectContext(params, pathname)
  const navLinks = useNavLinks(
    hasProjectContext,
    effectiveOrg,
    effectiveProject
  )
  const { mobileMenuOpen, setMobileMenuOpen } = useMobileMenu(pathname)
  const isActive = useIsActive(hasProjectContext, pathname)

  return (
    <header className="app-header">
      <HeaderTop
        hasProjectContext={hasProjectContext}
        effectiveOrg={effectiveOrg}
        effectiveProject={effectiveProject}
        hasExplicitSelection={hasExplicitSelection}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <p>Local-first issue and documentation tracker</p>
      <nav className="app-nav">
        {navLinks && (
          <ProjectNavLinks
            navLinks={navLinks}
            isActive={isActive}
            groupClassName="nav-group nav-group-project"
            dividerClassName="nav-divider"
          />
        )}
        <GeneralNavLinks
          pathname={pathname}
          groupClassName="nav-group nav-group-general"
        />
      </nav>
      <MobileMenuDrawer
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        hasExplicitSelection={hasExplicitSelection}
        navLinks={navLinks}
        isActive={isActive}
        pathname={pathname}
      />
    </header>
  )
}
