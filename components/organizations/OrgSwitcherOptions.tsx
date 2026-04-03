'use client'

import type { Organization } from '@/gen/centy_pb'

interface OrgOptionProps {
  slug: string | null
  label: string
  selectedOrgSlug: string | null | undefined
  onSelect: (slug: string | null | undefined) => void
}

export function OrgOption({
  slug,
  label,
  selectedOrgSlug,
  onSelect,
}: OrgOptionProps): React.JSX.Element {
  const isSelected = selectedOrgSlug === slug
  return (
    <li
      role="option"
      aria-selected={isSelected}
      className={`org-option ${isSelected ? 'selected' : ''}`}
      onClick={() => {
        onSelect(slug)
      }}
    >
      <span className="org-option-name">{label}</span>
    </li>
  )
}

interface OrgListProps {
  organizations: Organization[]
  loading: boolean
  selectedOrgSlug: string | null | undefined
  onSelect: (slug: string | null | undefined) => void
}

export function OrgList({
  organizations,
  loading,
  selectedOrgSlug,
  onSelect,
}: OrgListProps): React.JSX.Element {
  if (loading && organizations.length === 0) {
    return <li className="org-loading">Loading...</li>
  }
  return (
    <>
      {organizations.map(org => (
        <li
          key={org.slug}
          role="option"
          aria-selected={selectedOrgSlug === org.slug}
          className={`org-option ${selectedOrgSlug === org.slug ? 'selected' : ''}`}
          onClick={() => {
            onSelect(org.slug)
          }}
        >
          <span className="org-option-name">{org.name}</span>
          <span className="org-project-count">{org.projectCount}</span>
        </li>
      ))}
    </>
  )
}
