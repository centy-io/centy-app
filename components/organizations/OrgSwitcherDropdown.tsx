'use client'

import Link from 'next/link'
import type { Organization } from '@/gen/centy_pb'

interface OrgSwitcherDropdownProps {
  refs: { setFloating: (el: HTMLElement | null) => void }
  floatingStyles: React.CSSProperties
  selectedOrgSlug: string | null
  organizations: Organization[]
  loading: boolean
  refreshOrganizations: () => Promise<void>
  onSelect: (slug: string | null) => void
  onClose: () => void
}

export function OrgSwitcherDropdown(props: OrgSwitcherDropdownProps) {
  const { selectedOrgSlug, organizations, loading } = props
  return (
    <div
      ref={props.refs.setFloating}
      style={props.floatingStyles}
      className="org-switcher-dropdown"
    >
      <div className="org-switcher-header">
        <h3>Filter by Organization</h3>
        <button
          className="refresh-btn"
          onClick={() => props.refreshOrganizations()}
          disabled={loading}
          title="Refresh organizations"
        >
          &#x21BB;
        </button>
      </div>
      <ul className="org-options" role="listbox">
        <li
          role="option"
          aria-selected={selectedOrgSlug === null}
          className={`org-option ${selectedOrgSlug === null ? 'selected' : ''}`}
          onClick={() => props.onSelect(null)}
        >
          <span className="org-option-name">All Organizations</span>
        </li>
        <li
          role="option"
          aria-selected={selectedOrgSlug === ''}
          className={`org-option ${selectedOrgSlug === '' ? 'selected' : ''}`}
          onClick={() => props.onSelect('')}
        >
          <span className="org-option-name">Ungrouped Projects</span>
        </li>
        {organizations.length > 0 && <li className="org-divider" />}
        {loading && organizations.length === 0 ? (
          <li className="org-loading">Loading...</li>
        ) : (
          organizations.map(org => (
            <li
              key={org.slug}
              role="option"
              aria-selected={selectedOrgSlug === org.slug}
              className={`org-option ${selectedOrgSlug === org.slug ? 'selected' : ''}`}
              onClick={() => props.onSelect(org.slug)}
            >
              <span className="org-option-name">{org.name}</span>
              <span className="org-project-count">{org.projectCount}</span>
            </li>
          ))
        )}
      </ul>
      <div className="org-switcher-footer">
        <Link
          href="/organizations"
          className="manage-orgs-link"
          onClick={props.onClose}
        >
          Manage Organizations
        </Link>
      </div>
    </div>
  )
}
