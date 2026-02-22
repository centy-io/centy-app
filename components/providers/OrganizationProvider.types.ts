import type { Organization } from '@/gen/centy_pb'

export interface OrganizationContextType {
  /** Selected org derived from URL: null = all/aggregate, '' = ungrouped only, slug = specific org */
  selectedOrgSlug: string | null
  setSelectedOrgSlug: (slug: string | null) => void
  organizations: Organization[]
  loading: boolean
  error: string | null
  refreshOrganizations: () => Promise<void>
}
