import type { Organization } from '@/gen/centy_pb'

export interface OrganizationContextType {
  /** Selected org filter: null = all, '' = ungrouped only, slug = specific org */
  selectedOrgSlug: string | null
  setSelectedOrgSlug: (slug: string | null) => void
  /** Whether the user has explicitly selected an organization (including "All Orgs") */
  hasExplicitSelection: boolean
  organizations: Organization[]
  loading: boolean
  error: string | null
  refreshOrganizations: () => Promise<void>
}
