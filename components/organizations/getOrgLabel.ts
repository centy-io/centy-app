import type { Organization } from '@/gen/centy_pb'

export function getOrgLabel(
  selectedOrgSlug: string | null | undefined,
  organizations: Organization[]
): string {
  if (selectedOrgSlug === undefined) return 'Select Org'
  if (selectedOrgSlug === null) return 'All Orgs'
  if (selectedOrgSlug === '') return 'Ungrouped'
  const org = organizations.find(o => o.slug === selectedOrgSlug)
  return (org ? org.name : '') || selectedOrgSlug
}
