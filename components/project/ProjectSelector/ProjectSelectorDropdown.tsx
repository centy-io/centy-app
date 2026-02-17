'use client'

import { ProjectItem } from './ProjectItem'
import { GroupedProjectList } from './GroupedProjectList'
import { ProjectSelectorFooter } from './ProjectSelectorFooter'
import { ProjectSearchBar } from './ProjectSearchBar'
import { useProjectFiltering } from './useProjectFiltering'
import type { ProjectSelectorDropdownProps } from './ProjectSelectorDropdown.types'

export function ProjectSelectorDropdown(props: ProjectSelectorDropdownProps) {
  const { projectPath, loading, error, searchQuery } = props
  const { visibleProjects, groupedProjects } = useProjectFiltering(
    props.projects,
    props.isArchived,
    searchQuery,
    props.selectedOrgSlug,
    props.organizations
  )

  return (
    <>
      <ProjectSearchBar
        searchInputRef={props.searchInputRef}
        searchQuery={searchQuery}
        setSearchQuery={props.setSearchQuery}
        loading={loading}
        onRefresh={props.fetchProjects}
      />
      {error && <div className="project-selector-error">{error}</div>}
      {loading ? (
        <div className="project-selector-loading">Loading projects...</div>
      ) : visibleProjects.length === 0 ? (
        <div className="project-selector-empty">
          {searchQuery ? (
            <>
              <p>No projects match &quot;{searchQuery}&quot;</p>
              <p className="hint">Try a different search term</p>
            </>
          ) : (
            <>
              <p>No tracked projects found</p>
              <p className="hint">
                Initialize a project with Centy to see it here
              </p>
            </>
          )}
        </div>
      ) : groupedProjects ? (
        <GroupedProjectList
          groupedProjects={groupedProjects}
          collapsedOrgs={props.collapsedOrgs}
          projectPath={projectPath}
          toggleOrgCollapse={props.toggleOrgCollapse}
          handleSelectProject={props.handleSelectProject}
          handleArchiveProject={props.handleArchiveProject}
          handleToggleFavorite={props.handleToggleFavorite}
        />
      ) : (
        <ul className="project-list" role="listbox">
          {visibleProjects.map(p => (
            <ProjectItem
              key={p.path}
              project={p}
              isSelected={p.path === projectPath}
              onSelect={props.handleSelectProject}
              onArchive={props.handleArchiveProject}
              onToggleFavorite={props.handleToggleFavorite}
            />
          ))}
        </ul>
      )}
      <ProjectSelectorFooter
        setIsOpen={props.setIsOpen}
        manualPath={props.manualPath}
        setManualPath={props.setManualPath}
        handleManualSubmit={props.handleManualSubmit}
      />
    </>
  )
}
