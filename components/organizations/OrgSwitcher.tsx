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
import { getOrgLabel } from './getOrgLabel'
import { useClickOutside } from './useClickOutside'
import { useOrganization } from '@/components/providers/OrganizationProvider'

export function OrgSwitcher(): React.JSX.Element {
  const {
    selectedOrgSlug,
    setSelectedOrgSlug,
    organizations,
    loading,
    refreshOrganizations,
  } = useOrganization()
  const [isOpen, setIsOpen] = useState(false)

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    placement: 'bottom-start',
    middleware: [offset(4), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  })

  useEffect(() => {
    if (isOpen) {
      void refreshOrganizations()
    }
  }, [isOpen])

  useClickOutside(
    isOpen,
    () => {
      setIsOpen(false)
    },
    '.org-switcher-container'
  )

  const handleSelect = (slug: string | null | undefined): void => {
    setSelectedOrgSlug(slug)
    setIsOpen(false)
  }

  const currentLabel = getOrgLabel(selectedOrgSlug, organizations)

  return (
    <div className="org-switcher-container">
      <button
        ref={refs.setReference}
        className="org-switcher-trigger"
        onClick={() => {
          setIsOpen(!isOpen)
        }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        title="Filter by organization"
      >
        <span className="org-icon">🏢</span>
        <span className="org-label">{currentLabel}</span>
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <OrgSwitcherDropdown
          refs={refs}
          floatingStyles={floatingStyles}
          selectedOrgSlug={selectedOrgSlug}
          organizations={organizations}
          loading={loading}
          onRefresh={() => {
            void refreshOrganizations()
          }}
          onSelect={handleSelect}
          onClose={() => {
            setIsOpen(false)
          }}
        />
      )}
    </div>
  )
}
