'use client'

import type { GroupedProjects } from './ProjectSelector.types'
import { ProjectGroupList } from './ProjectGroupList'
import { ProjectFlatList } from './ProjectFlatList'
import { ProjectSelectorHeader } from './ProjectSelectorHeader'
import { ProjectSelectorSearch } from './ProjectSelectorSearch'
import { ProjectSelectorEmptyState } from './ProjectSelectorEmptyState'
import { ProjectSelectorFooter } from './ProjectSelectorFooter'
import type { ProjectInfo } from '@/gen/centy_pb'

interface ProjectSelectorDropdownProps {
  loading: boolean
  error: string | null
  searchQuery: string
  setSearchQuery: (v: string) => void
  searchInputRef: React.RefObject<HTMLInputElement | null>
  visibleProjects: ProjectInfo[]
  groupedProjects: GroupedProjects
  projectPath: string
  collapsedOrgs: Set<string>
  manualPath: string
  setManualPath: (v: string) => void
  fetchProjects: () => Promise<void>
  setIsOpen: (v: boolean) => void
  handleSelectProject: (project: ProjectInfo) => void
  handleManualSubmit: (e: React.FormEvent) => Promise<void>
  handleToggleFavorite: (e: React.MouseEvent, project: ProjectInfo) => void
  handleArchiveProject: (e: React.MouseEvent, project: ProjectInfo) => void
  toggleOrgCollapse: (orgSlug: string) => void
}

export function ProjectSelectorDropdown(props: ProjectSelectorDropdownProps) {
  const {
    loading,
    error,
    searchQuery,
    setSearchQuery,
    searchInputRef,
    visibleProjects,
    groupedProjects,
    projectPath,
    collapsedOrgs,
    manualPath,
    setManualPath,
    fetchProjects,
    setIsOpen,
    handleSelectProject,
    handleManualSubmit,
    handleToggleFavorite,
    handleArchiveProject,
    toggleOrgCollapse,
  } = props
  const focusSearch = () =>
    searchInputRef.current && searchInputRef.current.focus()
  return (
    <>
      <ProjectSelectorHeader loading={loading} onRefresh={fetchProjects} />
      <ProjectSelectorSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchInputRef={searchInputRef}
      />
      {error && <div className="project-selector-error">{error}</div>}
      <div className="project-selector-list-area">
        {loading ? (
          <div className="project-selector-loading">Loading projects...</div>
        ) : visibleProjects.length === 0 ? (
          <ProjectSelectorEmptyState searchQuery={searchQuery} />
        ) : groupedProjects ? (
          <ProjectGroupList
            groupedProjects={groupedProjects}
            projectPath={projectPath}
            collapsedOrgs={collapsedOrgs}
            toggleOrgCollapse={toggleOrgCollapse}
            onSelect={handleSelectProject}
            onToggleFavorite={handleToggleFavorite}
            onArchive={handleArchiveProject}
            onFocusSearch={focusSearch}
          />
        ) : (
          <ProjectFlatList
            projects={visibleProjects}
            projectPath={projectPath}
            onSelect={handleSelectProject}
            onToggleFavorite={handleToggleFavorite}
            onArchive={handleArchiveProject}
            onFocusSearch={focusSearch}
          />
        )}
      </div>
      <ProjectSelectorFooter
        manualPath={manualPath}
        setManualPath={setManualPath}
        onManualSubmit={handleManualSubmit}
        setIsOpen={setIsOpen}
      />
    </>
  )
}
