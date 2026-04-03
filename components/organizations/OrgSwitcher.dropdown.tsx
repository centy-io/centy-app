'use client'

import Link from 'next/link'
import { route } from 'nextjs-routes'
import { OrgOption, OrgList } from './OrgSwitcherOptions'
import type { Organization } from '@/gen/centy_pb'

interface OrgSwitcherDropdownProps {
  refs: {
    setFloating: (node: HTMLElement | null) => void
  }
  floatingStyles: React.CSSProperties
  selectedOrgSlug: string | null | undefined
  organizations: Organization[]
  loading: boolean
  onRefresh: () => void
  onSelect: (slug: string | null | undefined) => void
  onClose: () => void
}

export function OrgSwitcherDropdown({
  refs,
  floatingStyles,
  selectedOrgSlug,
  organizations,
  loading,
  onRefresh,
  onSelect,
  onClose,
}: OrgSwitcherDropdownProps): React.JSX.Element {
  return (
    <div
      ref={refs.setFloating}
      style={floatingStyles}
      className="org-switcher-dropdown"
    >
      <div className="org-switcher-header">
        <h3 className="org-switcher-title">Filter by Organization</h3>
        <button
          className="refresh-btn"
          onClick={() => onRefresh()}
          disabled={loading}
          title="Refresh organizations"
        >
          ↻
        </button>
      </div>

      <ul className="org-options" role="listbox">
        <OrgOption
          slug={null}
          label="All Organizations"
          selectedOrgSlug={selectedOrgSlug}
          onSelect={onSelect}
        />
        <OrgOption
          slug=""
          label="Ungrouped Projects"
          selectedOrgSlug={selectedOrgSlug}
          onSelect={onSelect}
        />

        {organizations.length > 0 && <li className="org-divider" />}

        <OrgList
          organizations={organizations}
          loading={loading}
          selectedOrgSlug={selectedOrgSlug}
          onSelect={onSelect}
        />
      </ul>

      <div className="org-switcher-footer">
        <Link
          href={route({ pathname: '/organizations' })}
          className="manage-orgs-link"
          onClick={onClose}
        >
          Manage Organizations
        </Link>
      </div>
    </div>
  )
}
