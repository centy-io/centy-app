'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListOrganizationsRequestSchema,
  type Organization,
} from '@/gen/centy_pb'
import { isDaemonUnimplemented } from '@/lib/daemon-error'
import type { OrganizationContextType } from './OrganizationProvider.types'
import {
  STORAGE_KEY,
  EXPLICIT_SELECTION_KEY,
} from './OrganizationProvider.types'

const OrganizationContext = createContext<OrganizationContextType | null>(null)

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [selectedOrgSlug, setSelectedOrgSlugState] = useState<string | null>(
    null
  )
  const [hasExplicitSelection, setHasExplicitSelection] = useState(false)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    const explicitSelection = localStorage.getItem(EXPLICIT_SELECTION_KEY)
    if (explicitSelection === 'true') {
      setHasExplicitSelection(true)
      if (stored !== null) setSelectedOrgSlugState(stored)
    }
  }, [])

  const refreshOrganizations = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const request = create(ListOrganizationsRequestSchema, {})
      const response = await centyClient.listOrganizations(request)
      setOrganizations(response.organizations)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load organizations'
      if (isDaemonUnimplemented(message)) {
        setError(
          'Organizations feature is not available. Please update your daemon.'
        )
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    refreshOrganizations()
  }, [])

  const setSelectedOrgSlug = useCallback((slug: string | null) => {
    setSelectedOrgSlugState(slug)
    setHasExplicitSelection(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem(EXPLICIT_SELECTION_KEY, 'true')
      if (slug !== null) {
        localStorage.setItem(STORAGE_KEY, slug)
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  return (
    <OrganizationContext.Provider
      value={{
        selectedOrgSlug,
        setSelectedOrgSlug,
        hasExplicitSelection,
        organizations,
        loading,
        error,
        refreshOrganizations,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  const context = useContext(OrganizationContext)
  if (!context) {
    throw new Error(
      'useOrganization must be used within an OrganizationProvider'
    )
  }
  return context
}
