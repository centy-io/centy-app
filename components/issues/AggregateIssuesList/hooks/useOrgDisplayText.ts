import { useOrganization } from '@/components/providers/OrganizationProvider'

export function useOrgDisplayText() {
  const { selectedOrgSlug, organizations } = useOrganization()

  const getOrgDisplayName = () => {
    if (selectedOrgSlug === null) return 'All Issues'
    if (selectedOrgSlug === '') return 'Ungrouped Issues'
    const org = organizations.find(o => o.slug === selectedOrgSlug)
    return org && org.name ? `${org.name} Issues` : `${selectedOrgSlug} Issues`
  }

  const getOrgNoteText = () => {
    if (selectedOrgSlug === null) {
      return 'Showing issues from all projects. Select a project to create new issues.'
    }
    if (selectedOrgSlug === '') {
      return 'Showing issues from ungrouped projects. Select a project to create new issues.'
    }
    const found = organizations.find(o => o.slug === selectedOrgSlug)
    const orgName = (found ? found.name : '') || selectedOrgSlug
    return `Showing issues from ${orgName} organization. Select a project to create new issues.`
  }

  const getEmptyText = () => {
    if (selectedOrgSlug === null) {
      return 'No issues found across any projects'
    }
    if (selectedOrgSlug === '') {
      return 'No issues found in ungrouped projects'
    }
    const found = organizations.find(o => o.slug === selectedOrgSlug)
    const orgName = (found ? found.name : '') || selectedOrgSlug
    return `No issues found in ${orgName} organization`
  }

  return {
    selectedOrgSlug,
    getOrgDisplayName,
    getOrgNoteText,
    getEmptyText,
  }
}
