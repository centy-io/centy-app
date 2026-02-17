import type { Organization } from '@/gen/centy_pb'

export function getOrgDisplayName(
  selectedOrgSlug: string | null,
  organizations: Organization[]
): string {
  if (selectedOrgSlug === null) return 'All Issues'
  if (selectedOrgSlug === '') return 'Ungrouped Issues'
  const org = organizations.find(o => o.slug === selectedOrgSlug)
  return org?.name ? `${org.name} Issues` : `${selectedOrgSlug} Issues`
}

export function getEmptyMessage(
  selectedOrgSlug: string | null,
  organizations: Organization[]
): string {
  if (selectedOrgSlug === null) return 'No issues found across any projects'
  if (selectedOrgSlug === '') return 'No issues found in ungrouped projects'
  const name =
    organizations.find(o => o.slug === selectedOrgSlug)?.name || selectedOrgSlug
  return `No issues found in ${name} organization`
}

export function getNoteMessage(
  selectedOrgSlug: string | null,
  organizations: Organization[]
): string {
  if (selectedOrgSlug === null)
    return 'Showing issues from all projects. Select a project to create new issues.'
  if (selectedOrgSlug === '')
    return 'Showing issues from ungrouped projects. Select a project to create new issues.'
  const name =
    organizations.find(o => o.slug === selectedOrgSlug)?.name || selectedOrgSlug
  return `Showing issues from ${name} organization. Select a project to create new issues.`
}
