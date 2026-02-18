'use client'

import Link from 'next/link'
import type { ProjectInfo } from '@/gen/centy_pb'
import type { GroupedProjects } from './ProjectSelector.types'
import { ProjectGroupList } from './ProjectGroupList'
import { ProjectFlatList } from './ProjectFlatList'

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

  return (
    <>
      <div className="project-selector-header">
        <h3>Select Project</h3>
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
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
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
        <ProjectGroupList
          groupedProjects={groupedProjects}
          projectPath={projectPath}
          collapsedOrgs={collapsedOrgs}
          toggleOrgCollapse={toggleOrgCollapse}
          onSelect={handleSelectProject}
          onToggleFavorite={handleToggleFavorite}
          onArchive={handleArchiveProject}
        />
      ) : (
        <ProjectFlatList
          projects={visibleProjects}
          projectPath={projectPath}
          onSelect={handleSelectProject}
          onToggleFavorite={handleToggleFavorite}
          onArchive={handleArchiveProject}
        />
      )}
      <div className="project-selector-actions">
        <Link
          href="/"
          className="init-project-btn"
          onClick={() => setIsOpen(false)}
        >
          {'\u2728'} Init Project
        </Link>
        <Link
          href="/archived"
          className="view-archived-link"
          onClick={() => setIsOpen(false)}
        >
          View Archived Projects
        </Link>
      </div>
      <div className="project-selector-manual">
        <form onSubmit={handleManualSubmit}>
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
