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
import type { OrganizationContextType } from './OrganizationProvider.types'
import { useUrlParams } from './PathContextProvider.useResolve'
import { centyClient } from '@/lib/grpc/client'
import {
  ListOrganizationsRequestSchema,
  type Organization,
} from '@/gen/centy_pb'
import { isDaemonUnimplemented } from '@/lib/daemon-error'
import { OrganizationProviderError } from '@/lib/errors'

const OrganizationContext = createContext<OrganizationContextType | null>(null)

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const { urlOrg } = useUrlParams()
  // Derive selected org from URL; allow local override without persistence
  // undefined = not yet selected (initial), null = all orgs, string = specific org or ''
  const [selectedOrgSlug, setSelectedOrgSlugState] = useState<
    string | null | undefined
  >(urlOrg)

  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sync selected org from URL whenever the URL org changes
  useEffect(() => {
    setSelectedOrgSlugState(urlOrg)
  }, [urlOrg])

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

  // Load organizations on mount
  useEffect(() => {
    refreshOrganizations()
  }, [refreshOrganizations])

  const setSelectedOrgSlug = useCallback((slug: string | null | undefined) => {
    setSelectedOrgSlugState(slug)
  }, [])

  return (
    <OrganizationContext.Provider
      value={{
        selectedOrgSlug,
        setSelectedOrgSlug,
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
    throw new OrganizationProviderError()
  }
  return context
}
