/* eslint-disable max-lines */
'use client'

import { useState, useEffect } from 'react'
import {
  useFloating,
  autoUpdate,
  flip,
  shift,
  offset,
} from '@floating-ui/react'
import { OrgSwitcherDropdown } from './OrgSwitcher.dropdown'
import { useOrganization } from '@/components/providers/OrganizationProvider'
import type { Organization } from '@/gen/centy_pb'

function useOrgSwitcher(
  isOpen: boolean,
  setIsOpen: (v: boolean) => void,
  refreshOrganizations: () => void
) {
  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    placement: 'bottom-start',
    middleware: [offset(4), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  })

  useEffect(() => {
    if (isOpen) refreshOrganizations()
  }, [isOpen, refreshOrganizations])

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target
      if (
        !(target instanceof HTMLElement) ||
        !target.closest('.org-switcher-container')
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isOpen, setIsOpen])

  return { refs, floatingStyles }
}

function getCurrentLabel(
  selectedOrgSlug: string | null | undefined,
  organizations: Organization[]
) {
  if (selectedOrgSlug === undefined) return 'Select Org'
  if (selectedOrgSlug === null) return 'All Orgs'
  if (selectedOrgSlug === '') return 'Ungrouped'
  const org = organizations.find(o => o.slug === selectedOrgSlug)
  return (org ? org.name : '') || selectedOrgSlug
}

export function OrgSwitcher() {
  const {
    selectedOrgSlug,
    setSelectedOrgSlug,
    organizations,
    loading,
    refreshOrganizations,
  } = useOrganization()
  const [isOpen, setIsOpen] = useState(false)
  const { refs, floatingStyles } = useOrgSwitcher(
    isOpen,
    setIsOpen,
    refreshOrganizations
  )

  const handleSelect = (slug: string | null | undefined) => {
    setSelectedOrgSlug(slug)
    setIsOpen(false)
  }

  return (
    <div className="org-switcher-container">
      <button
        ref={refs.setReference}
        className="org-switcher-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        title="Filter by organization"
      >
        <span className="org-icon">🏢</span>
        <span className="org-label">
          {getCurrentLabel(selectedOrgSlug, organizations)}
        </span>
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <OrgSwitcherDropdown
          refs={refs}
          floatingStyles={floatingStyles}
          selectedOrgSlug={selectedOrgSlug}
          organizations={organizations}
          loading={loading}
          onRefresh={refreshOrganizations}
          onSelect={handleSelect}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
