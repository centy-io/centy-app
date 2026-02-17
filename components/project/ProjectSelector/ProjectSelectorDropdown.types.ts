import type { ProjectInfo, Organization } from '@/gen/centy_pb'

export interface ProjectSelectorDropdownProps {
  projectPath: string
  projects: ProjectInfo[]
  loading: boolean
  error: string | null
  searchQuery: string
  setSearchQuery: (v: string) => void
  searchInputRef: React.RefObject<HTMLInputElement | null>
  selectedOrgSlug: string | null
  organizations: Organization[]
  collapsedOrgs: Set<string>
  isArchived: (path: string) => boolean
  fetchProjects: () => void
  handleSelectProject: (project: ProjectInfo) => void
  handleArchiveProject: (e: React.MouseEvent, project: ProjectInfo) => void
  handleToggleFavorite: (e: React.MouseEvent, project: ProjectInfo) => void
  toggleOrgCollapse: (orgSlug: string) => void
  setIsOpen: (v: boolean) => void
  manualPath: string
  setManualPath: (v: string) => void
  handleManualSubmit: (e: React.FormEvent) => void
}
