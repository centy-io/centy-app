import type { Organization } from '@/gen/centy_pb'

export interface OrganizationContextType {
  /** Selected org: undefined = not yet selected (initial), null = all orgs, '' = ungrouped only, slug = specific org */
  selectedOrgSlug: string | null | undefined
  setSelectedOrgSlug: (slug: string | null | undefined) => void
  organizations: Organization[]
  loading: boolean
  error: string | null
  refreshOrganizations: () => Promise<void>
}
