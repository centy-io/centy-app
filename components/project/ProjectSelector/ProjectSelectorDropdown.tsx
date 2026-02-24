'use client'

import Link from 'next/link'
import { route } from 'nextjs-routes'
import type { GroupedProjects } from './ProjectSelector.types'
import { ProjectGroupList } from './ProjectGroupList'
import { ProjectFlatList } from './ProjectFlatList'
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

  const focusSearch = () => {
    if (searchInputRef.current) searchInputRef.current.focus()
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'ArrowDown') return
    e.preventDefault()
    const firstItem = document.querySelector<HTMLElement>(
      '#project-listbox [role="option"]'
    )
    if (firstItem) firstItem.focus()
  }

  return (
    <>
      <div className="project-selector-header">
        <h3 className="project-selector-title">Select Project</h3>
        <button
          className="refresh-btn"
          onClick={fetchProjects}
          disabled={loading}
          title="Refresh project list"
        >
          {'\u21BB'}
        </button>
      </div>
      <div className="project-selector-search">
        <input
          ref={searchInputRef}
          role="combobox"
          aria-expanded="true"
          aria-controls="project-listbox"
          aria-autocomplete="list"
          aria-label="Search projects"
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search projects..."
          className="search-input"
        />
        {searchQuery && (
          <button
            className="search-clear-btn"
            onClick={() => setSearchQuery('')}
            title="Clear search"
          >
            {'\u00D7'}
          </button>
        )}
      </div>
      {error && <div className="project-selector-error">{error}</div>}
      <div className="project-selector-list-area">
        {loading ? (
          <div className="project-selector-loading">Loading projects...</div>
        ) : visibleProjects.length === 0 ? (
          <div className="project-selector-empty">
            {searchQuery ? (
              <>
                <p className="empty-state-text">
                  No projects match &quot;{searchQuery}&quot;
                </p>
                <p className="hint">Try a different search term</p>
              </>
            ) : (
              <>
                <p className="empty-state-text">No tracked projects found</p>
                <p className="hint">
                  Initialize a project with Centy to see it here
                </p>
              </>
            )}
          </div>
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
      <div className="project-selector-actions">
        <Link
          href={route({ pathname: '/' })}
          className="init-project-btn"
          onClick={() => setIsOpen(false)}
        >
          {'\u2728'} Init Project
        </Link>
        <Link
          href={route({ pathname: '/archived' })}
          className="view-archived-link"
          onClick={() => setIsOpen(false)}
        >
          View Archived Projects
        </Link>
      </div>
      <div className="project-selector-manual">
        <form className="manual-path-form" onSubmit={handleManualSubmit}>
          <input
            type="text"
            value={manualPath}
            onChange={e => setManualPath(e.target.value)}
            placeholder="Or enter path manually..."
            className="manual-path-input"
          />
          <button
            type="submit"
            disabled={!manualPath.trim()}
            className="manual-path-submit"
          >
            Go
          </button>
        </form>
      </div>
    </>
  )
}
