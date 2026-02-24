'use client'

import { useState } from 'react'
import { COLLAPSED_ORGS_KEY } from './ProjectSelector.types'

export function useCollapsedOrgs() {
  const [collapsedOrgs, setCollapsedOrgs] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    try {
      const s = localStorage.getItem(COLLAPSED_ORGS_KEY)
      return s ? new Set(JSON.parse(s)) : new Set()
    } catch {
      return new Set()
    }
  })
  const toggleOrgCollapse = (orgSlug: string) => {
    setCollapsedOrgs(prev => {
      const next = new Set(prev)
      if (next.has(orgSlug)) next.delete(orgSlug)
      else next.add(orgSlug)
      try {
        localStorage.setItem(COLLAPSED_ORGS_KEY, JSON.stringify([...next]))
      } catch {
        /* ignore */
      }
      return next
    })
  }
  return { collapsedOrgs, toggleOrgCollapse }
}
