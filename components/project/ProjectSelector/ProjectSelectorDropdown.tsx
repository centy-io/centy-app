'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import type { ProjectInfo, Organization } from '@/gen/centy_pb'
import { ProjectItem } from './ProjectItem'
import { GroupedProjectList } from './GroupedProjectList'
import type { GroupedProjectEntry } from './ProjectSelector.types'

interface ProjectSelectorDropdownProps {
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

export function ProjectSelectorDropdown(props: ProjectSelectorDropdownProps) {
  const {
    projectPath,
    projects,
    loading,
    error,
    searchQuery,
    selectedOrgSlug,
    organizations,
    isArchived,
  } = props
  const visibleProjects = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return projects
      .filter(p => !isArchived(p.path))
      .filter(
        p =>
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.path.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) return -1
        if (!a.isFavorite && b.isFavorite) return 1
        return 0
      })
  }, [projects, isArchived, searchQuery])
  const groupedProjects = useMemo(() => {
    if (selectedOrgSlug !== null) return null
    const groups = new Map<string, GroupedProjectEntry>()
    groups.set('', { name: 'Ungrouped', projects: [] })
    for (const p of visibleProjects) {
      const s = p.organizationSlug || ''
      if (!groups.has(s)) {
        const org = organizations.find(o => o.slug === s)
        groups.set(s, { name: org?.name || s, projects: [] })
      }
      groups.get(s)!.projects.push(p)
    }
    return Array.from(groups.entries())
      .filter(([, g]) => g.projects.length > 0)
      .sort(([a], [b]) => {
        if (a === '' && b !== '') return 1
        if (a !== '' && b === '') return -1
        return a.localeCompare(b)
      })
  }, [visibleProjects, selectedOrgSlug, organizations])

  return (
    <>
      <div className="project-selector-header">
        <h3>Select Project</h3>
        <button
          className="refresh-btn"
          onClick={() => props.fetchProjects()}
          disabled={loading}
          title="Refresh project list"
        >
          {'\u21BB'}
        </button>
      </div>
      <div className="project-selector-search">
        <input
          ref={props.searchInputRef}
          type="text"
          value={searchQuery}
          onChange={e => props.setSearchQuery(e.target.value)}
          placeholder="Search projects..."
          className="search-input"
        />
        {searchQuery && (
          <button
            className="search-clear-btn"
            onClick={() => props.setSearchQuery('')}
            title="Clear search"
          >
            &times;
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
      <div className="project-selector-actions">
        <Link
          href="/"
          className="init-project-btn"
          onClick={() => props.setIsOpen(false)}
        >
          {'\u2728'} Init Project
        </Link>
        <Link
          href="/archived"
          className="view-archived-link"
          onClick={() => props.setIsOpen(false)}
        >
          View Archived Projects
        </Link>
      </div>
      <div className="project-selector-manual">
        <form onSubmit={props.handleManualSubmit}>
          <input
            type="text"
            value={props.manualPath}
            onChange={e => props.setManualPath(e.target.value)}
            placeholder="Or enter path manually..."
            className="manual-path-input"
          />
          <button
            type="submit"
            disabled={!props.manualPath.trim()}
            className="manual-path-submit"
          >
            Go
          </button>
        </form>
      </div>
    </>
  )
}
