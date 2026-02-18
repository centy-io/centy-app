'use client'

import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { useRouter, useParams, usePathname } from 'next/navigation'
import { route } from 'nextjs-routes'
import * as Popover from '@radix-ui/react-popover'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListProjectsRequestSchema,
  RegisterProjectRequestSchema,
  SetProjectFavoriteRequestSchema,
  type ProjectInfo,
} from '@/gen/centy_pb'
import {
  useProject,
  useArchivedProjects,
} from '@/components/providers/ProjectProvider'
import { useOrganization } from '@/components/providers/OrganizationProvider'
import { UNGROUPED_ORG_MARKER } from '@/lib/project-resolver'

const COLLAPSED_ORGS_KEY = 'centy-collapsed-orgs'

const ROOT_ROUTES = new Set([
  'organizations',
  'settings',
  'archived',
  'assets',
  'project',
])

function ProjectItemContent({
  project,
  projectPath,
  onToggleFavorite,
  onArchive,
}: {
  project: ProjectInfo
  projectPath: string
  onToggleFavorite: (e: React.MouseEvent, project: ProjectInfo) => void
  onArchive: (e: React.MouseEvent, project: ProjectInfo) => void
}) {
  return (
    <>
      <div className="project-item-main">
        <button
          className={`favorite-btn ${project.isFavorite ? 'active' : ''}`}
          onClick={e => onToggleFavorite(e, project)}
          title={
            project.isFavorite ? 'Remove from favorites' : 'Add to favorites'
          }
        >
          {project.isFavorite ? '★' : '☆'}
        </button>
        <span className="project-item-name">{project.name}</span>
        {!project.initialized && (
          <span className="project-badge not-initialized">Not initialized</span>
        )}
        <button
          className="archive-btn"
          onClick={e => onArchive(e, project)}
          title="Archive project"
        >
          Archive
        </button>
      </div>
      <div className="project-item-details">
        <span className="project-item-path" title={project.displayPath}>
          {project.displayPath}
        </span>
        <div className="project-item-stats">
          {project.initialized && (
            <>
              <span title="Issues">📋 {project.issueCount}</span>
              <span title="Docs">📄 {project.docCount}</span>
            </>
          )}
        </div>
      </div>
    </>
  )
}

function ProjectGroup({
  orgSlug,
  group,
  projectPath,
  isCollapsed,
  onToggleCollapse,
  onSelectProject,
  onToggleFavorite,
  onArchive,
}: {
  orgSlug: string
  group: { name: string; projects: ProjectInfo[] }
  projectPath: string
  isCollapsed: boolean
  onToggleCollapse: (orgSlug: string) => void
  onSelectProject: (project: ProjectInfo) => void
  onToggleFavorite: (e: React.MouseEvent, project: ProjectInfo) => void
  onArchive: (e: React.MouseEvent, project: ProjectInfo) => void
}) {
  return (
    <div className="project-group">
      <button
        className="project-group-header"
        onClick={() => onToggleCollapse(orgSlug)}
        aria-expanded={!isCollapsed}
      >
        <span
          className={`project-group-chevron ${isCollapsed ? 'collapsed' : ''}`}
        >
          ▼
        </span>
        <span className="project-group-name">
          {orgSlug ? `🏢 ${group.name}` : '📁 Ungrouped'}
        </span>
        <span className="project-group-count">{group.projects.length}</span>
      </button>
      {!isCollapsed && (
        <ul className="project-group-list">
          {group.projects.map(project => (
            <li
              key={project.path}
              role="option"
              aria-selected={project.path === projectPath}
              className={`project-item ${project.path === projectPath ? 'selected' : ''}`}
              onClick={() => onSelectProject(project)}
            >
              <ProjectItemContent
                project={project}
                projectPath={projectPath}
                onToggleFavorite={onToggleFavorite}
                onArchive={onArchive}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function GroupedProjectList({
  groupedProjects,
  projectPath,
  collapsedOrgs,
  onToggleCollapse,
  onSelectProject,
  onToggleFavorite,
  onArchive,
}: {
  groupedProjects: [string, { name: string; projects: ProjectInfo[] }][]
  projectPath: string
  collapsedOrgs: Set<string>
  onToggleCollapse: (orgSlug: string) => void
  onSelectProject: (project: ProjectInfo) => void
  onToggleFavorite: (e: React.MouseEvent, project: ProjectInfo) => void
  onArchive: (e: React.MouseEvent, project: ProjectInfo) => void
}) {
  return (
    <div className="project-list-grouped" role="listbox">
      {groupedProjects.map(([orgSlug, group]) => (
        <ProjectGroup
          key={orgSlug || '__ungrouped'}
          orgSlug={orgSlug}
          group={group}
          projectPath={projectPath}
          isCollapsed={collapsedOrgs.has(orgSlug)}
          onToggleCollapse={onToggleCollapse}
          onSelectProject={onSelectProject}
          onToggleFavorite={onToggleFavorite}
          onArchive={onArchive}
        />
      ))}
    </div>
  )
}

function FlatProjectList({
  projects,
  projectPath,
  onSelectProject,
  onToggleFavorite,
  onArchive,
}: {
  projects: ProjectInfo[]
  projectPath: string
  onSelectProject: (project: ProjectInfo) => void
  onToggleFavorite: (e: React.MouseEvent, project: ProjectInfo) => void
  onArchive: (e: React.MouseEvent, project: ProjectInfo) => void
}) {
  return (
    <ul className="project-list" role="listbox">
      {projects.map(project => (
        <li
          key={project.path}
          role="option"
          aria-selected={project.path === projectPath}
          className={`project-item ${project.path === projectPath ? 'selected' : ''}`}
          onClick={() => onSelectProject(project)}
        >
          <ProjectItemContent
            project={project}
            projectPath={projectPath}
            onToggleFavorite={onToggleFavorite}
            onArchive={onArchive}
          />
        </li>
      ))}
    </ul>
  )
}

function SelectorFooter({ onClose }: { onClose: () => void }) {
  return (
    <div className="project-selector-actions">
      <Link href="/" className="init-project-btn" onClick={onClose}>
        ✨ Init Project
      </Link>
      <Link href="/archived" className="view-archived-link" onClick={onClose}>
        View Archived Projects
      </Link>
    </div>
  )
}

function ManualPathForm({
  manualPath,
  onManualPathChange,
  onSubmit,
}: {
  manualPath: string
  onManualPathChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
}) {
  return (
    <div className="project-selector-manual">
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={manualPath}
          onChange={e => onManualPathChange(e.target.value)}
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
  )
}

function EmptyProjectList({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="project-selector-empty">
      {searchQuery ? (
        <>
          <p>No projects match &quot;{searchQuery}&quot;</p>
          <p className="hint">Try a different search term</p>
        </>
      ) : (
        <>
          <p>No tracked projects found</p>
          <p className="hint">Initialize a project with Centy to see it here</p>
        </>
      )}
    </div>
  )
}

function SearchBar({
  searchQuery,
  onSearchChange,
  searchInputRef,
}: {
  searchQuery: string
  onSearchChange: (value: string) => void
  searchInputRef: React.RefObject<HTMLInputElement | null>
}) {
  return (
    <div className="project-selector-search">
      <input
        ref={searchInputRef}
        type="text"
        value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
        placeholder="Search projects..."
        className="search-input"
      />
      {searchQuery && (
        <button
          className="search-clear-btn"
          onClick={() => onSearchChange('')}
          title="Clear search"
        >
          ×
        </button>
      )}
    </div>
  )
}

function useCurrentPage() {
  const params = useParams()
  const pathname = usePathname()

  return () => {
    const orgParam = params ? params.organization : undefined
    const org: string | undefined =
      typeof orgParam === 'string' ? orgParam : undefined
    const projectParam = params ? params.project : undefined
    const project: string | undefined =
      typeof projectParam === 'string' ? projectParam : undefined
    const pathSegments = pathname.split('/').filter(Boolean)

    if (org && project) {
      return pathSegments[2] || 'issues'
    }

    if (pathSegments.length >= 2 && !ROOT_ROUTES.has(pathSegments[0])) {
      return pathSegments[2] || 'issues'
    }

    const page = pathSegments[0]
    return page || 'issues'
  }
}

function useGroupedProjects(
  visibleProjects: ProjectInfo[],
  selectedOrgSlug: string | null,
  organizations: { slug: string; name?: string }[]
) {
  return useMemo(() => {
    if (selectedOrgSlug !== null) {
      return null
    }

    const groups: Map<string, { name: string; projects: ProjectInfo[] }> =
      new Map()
    groups.set('', { name: 'Ungrouped', projects: [] })

    for (const project of visibleProjects) {
      const orgSlug = project.organizationSlug || ''
      if (!groups.has(orgSlug)) {
        const org = organizations.find(o => o.slug === orgSlug)
        groups.set(orgSlug, {
          name: (org ? org.name : '') || orgSlug,
          projects: [],
        })
      }
      groups.get(orgSlug)!.projects.push(project)
    }

    const sortedGroups = Array.from(groups.entries())
      .filter(([, g]) => g.projects.length > 0)
      .sort(([slugA], [slugB]) => {
        if (slugA === '' && slugB !== '') return 1
        if (slugA !== '' && slugB === '') return -1
        return slugA.localeCompare(slugB)
      })

    return sortedGroups
  }, [visibleProjects, selectedOrgSlug, organizations])
}

function initCollapsedOrgs(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const stored = localStorage.getItem(COLLAPSED_ORGS_KEY)
    return stored ? new Set(JSON.parse(stored)) : new Set()
  } catch {
    return new Set()
  }
}

async function registerManualProject(
  path: string,
  setProjectPath: (path: string) => void,
  setIsInitialized: (initialized: boolean | null) => void,
  setProjects: React.Dispatch<React.SetStateAction<ProjectInfo[]>>
) {
  try {
    const request = create(RegisterProjectRequestSchema, { projectPath: path })
    const response = await centyClient.registerProject(request)
    if (response.success && response.project) {
      setProjectPath(path)
      setIsInitialized(response.project.initialized)
      setProjects(prev => {
        if (prev.some(p => p.path === path)) return prev
        return [...prev, response.project!]
      })
    } else {
      setProjectPath(path)
      setIsInitialized(null)
    }
  } catch {
    setProjectPath(path)
    setIsInitialized(null)
  }
}

async function fetchProjectsList(
  selectedOrgSlug: string | null,
  setProjects: (projects: ProjectInfo[]) => void,
  setError: (error: string | null) => void,
  setLoading: (loading: boolean) => void
) {
  setLoading(true)
  setError(null)
  try {
    const request = create(ListProjectsRequestSchema, {
      includeStale: false,
      organizationSlug:
        selectedOrgSlug !== null && selectedOrgSlug !== ''
          ? selectedOrgSlug
          : undefined,
      ungroupedOnly: selectedOrgSlug === '',
    })
    const response = await centyClient.listProjects(request)
    setProjects(response.projects)
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to load projects')
  } finally {
    setLoading(false)
  }
}

async function toggleFavorite(
  e: React.MouseEvent,
  project: ProjectInfo,
  setProjects: React.Dispatch<React.SetStateAction<ProjectInfo[]>>
) {
  e.stopPropagation()
  try {
    const request = create(SetProjectFavoriteRequestSchema, {
      projectPath: project.path,
      isFavorite: !project.isFavorite,
    })
    const response = await centyClient.setProjectFavorite(request)
    if (response.success && response.project) {
      setProjects(prev =>
        prev.map(p => (p.path === project.path ? response.project! : p))
      )
    }
  } catch (err) {
    console.error('Failed to toggle favorite:', err)
  }
}

function toggleOrgCollapseState(
  orgSlug: string,
  setCollapsedOrgs: React.Dispatch<React.SetStateAction<Set<string>>>
) {
  setCollapsedOrgs(prev => {
    const next = new Set(prev)
    if (next.has(orgSlug)) {
      next.delete(orgSlug)
    } else {
      next.add(orgSlug)
    }
    try {
      localStorage.setItem(COLLAPSED_ORGS_KEY, JSON.stringify([...next]))
    } catch {
      /* Ignore storage errors */
    }
    return next
  })
}

function useVisibleProjects(
  projects: ProjectInfo[],
  isArchived: (path: string) => boolean,
  searchQuery: string
) {
  return useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    return projects
      .filter(p => !isArchived(p.path))
      .filter(p => {
        if (!query) return true
        return (
          p.name.toLowerCase().includes(query) ||
          p.path.toLowerCase().includes(query)
        )
      })
      .sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) return -1
        if (!a.isFavorite && b.isFavorite) return 1
        return 0
      })
  }, [projects, isArchived, searchQuery])
}

function useProjectSelectorFields() {
  const [projects, setProjects] = useState<ProjectInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [manualPath, setManualPath] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [collapsedOrgs, setCollapsedOrgs] =
    useState<Set<string>>(initCollapsedOrgs)
  const searchInputRef = useRef<HTMLInputElement>(null)

  return {
    projects,
    setProjects,
    loading,
    setLoading,
    error,
    setError,
    isOpen,
    setIsOpen,
    manualPath,
    setManualPath,
    searchQuery,
    setSearchQuery,
    collapsedOrgs,
    setCollapsedOrgs,
    searchInputRef,
  }
}

function selectProject(
  project: ProjectInfo,
  setProjectPath: (path: string) => void,
  setIsInitialized: (initialized: boolean | null) => void,
  router: ReturnType<typeof useRouter>,
  getCurrentPage: () => string,
  setIsOpen: (open: boolean) => void,
  setSearchQuery: (query: string) => void
) {
  const orgSlug = project.organizationSlug || UNGROUPED_ORG_MARKER
  setProjectPath(project.path)
  setIsInitialized(project.initialized)
  router.push(
    route({
      pathname: '/[...path]',
      query: { path: [orgSlug, project.name, getCurrentPage()] },
    })
  )
  setIsOpen(false)
  setSearchQuery('')
}

function getProjectName(projectPath: string, projects: ProjectInfo[]): string {
  if (!projectPath) return 'Select Project'
  const project = projects.find(p => p.path === projectPath)
  if (project && project.name) return project.name
  const parts = projectPath.split('/')
  return parts[parts.length - 1] || projectPath
}

async function submitManualPath(
  manualPath: string,
  setProjectPath: (path: string) => void,
  setIsInitialized: (initialized: boolean | null) => void,
  setProjects: React.Dispatch<React.SetStateAction<ProjectInfo[]>>,
  setManualPath: (path: string) => void,
  setSearchQuery: (query: string) => void,
  setIsOpen: (open: boolean) => void
) {
  await registerManualProject(
    manualPath,
    setProjectPath,
    setIsInitialized,
    setProjects
  )
  setManualPath('')
  setSearchQuery('')
  setIsOpen(false)
}

function archiveAndClear(
  e: React.MouseEvent,
  p: ProjectInfo,
  archiveProject: (path: string) => void,
  projectPath: string,
  setProjectPath: (path: string) => void,
  setIsInitialized: (initialized: boolean | null) => void
) {
  e.stopPropagation()
  archiveProject(p.path)
  if (p.path !== projectPath) return
  setProjectPath('')
  setIsInitialized(null)
}

function useProjectFetch(
  selectedOrgSlug: string | null,
  setProjects: (projects: ProjectInfo[]) => void,
  setError: (error: string | null) => void,
  setLoading: (loading: boolean) => void,
  isOpen: boolean
) {
  const fetchProjects = useCallback(async () => {
    await fetchProjectsList(selectedOrgSlug, setProjects, setError, setLoading)
  }, [selectedOrgSlug]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isOpen) fetchProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  return fetchProjects
}

function useProjectSelectorState() {
  const router = useRouter()
  const { projectPath, setProjectPath, setIsInitialized } = useProject()
  const { isArchived, archiveProject } = useArchivedProjects()
  const { selectedOrgSlug, organizations } = useOrganization()
  const f = useProjectSelectorFields()
  const getCurrentPage = useCurrentPage()

  const fetchProjects = useProjectFetch(
    selectedOrgSlug,
    f.setProjects,
    f.setError,
    f.setLoading,
    f.isOpen
  )

  const handleSelectProject = (project: ProjectInfo) =>
    selectProject(
      project,
      setProjectPath,
      setIsInitialized,
      router,
      getCurrentPage,
      f.setIsOpen,
      f.setSearchQuery
    )

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!f.manualPath.trim()) return
    await submitManualPath(f.manualPath.trim(), setProjectPath, setIsInitialized, f.setProjects, f.setManualPath, f.setSearchQuery, f.setIsOpen) // prettier-ignore
  }

  const visibleProjects = useVisibleProjects(
    f.projects,
    isArchived,
    f.searchQuery
  )
  const groupedProjects = useGroupedProjects(
    visibleProjects,
    selectedOrgSlug,
    organizations
  )

  return {
    projectPath,
    ...f,
    visibleProjects,
    groupedProjects,
    fetchProjects,
    handleSelectProject,
    handleManualSubmit,
    getCurrentProjectName: () => getProjectName(projectPath, f.projects),
    handleArchiveProject: (e: React.MouseEvent, p: ProjectInfo) =>
      archiveAndClear(
        e,
        p,
        archiveProject,
        projectPath,
        setProjectPath,
        setIsInitialized
      ),
    handleToggleFavorite: (e: React.MouseEvent, project: ProjectInfo) =>
      toggleFavorite(e, project, f.setProjects),
    toggleOrgCollapse: (orgSlug: string) =>
      toggleOrgCollapseState(orgSlug, f.setCollapsedOrgs),
  }
}

function ProjectListContent({
  state,
}: {
  state: ReturnType<typeof useProjectSelectorState>
}) {
  if (state.loading) {
    return <div className="project-selector-loading">Loading projects...</div>
  }

  if (state.visibleProjects.length === 0) {
    return <EmptyProjectList searchQuery={state.searchQuery} />
  }

  if (state.groupedProjects) {
    return (
      <GroupedProjectList
        groupedProjects={state.groupedProjects}
        projectPath={state.projectPath}
        collapsedOrgs={state.collapsedOrgs}
        onToggleCollapse={state.toggleOrgCollapse}
        onSelectProject={state.handleSelectProject}
        onToggleFavorite={state.handleToggleFavorite}
        onArchive={state.handleArchiveProject}
      />
    )
  }

  return (
    <FlatProjectList
      projects={state.visibleProjects}
      projectPath={state.projectPath}
      onSelectProject={state.handleSelectProject}
      onToggleFavorite={state.handleToggleFavorite}
      onArchive={state.handleArchiveProject}
    />
  )
}

function SelectorDropdownContent({
  state,
}: {
  state: ReturnType<typeof useProjectSelectorState>
}) {
  return (
    <Popover.Content
      className="project-selector-dropdown"
      align="start"
      sideOffset={4}
      onOpenAutoFocus={e => {
        e.preventDefault()
        if (state.searchInputRef.current) state.searchInputRef.current.focus()
      }}
    >
      <div className="project-selector-header">
        <h3>Select Project</h3>
        <button
          className="refresh-btn"
          onClick={state.fetchProjects}
          disabled={state.loading}
          title="Refresh project list"
        >
          ↻
        </button>
      </div>

      <SearchBar
        searchQuery={state.searchQuery}
        onSearchChange={state.setSearchQuery}
        searchInputRef={state.searchInputRef}
      />

      {state.error && (
        <div className="project-selector-error">{state.error}</div>
      )}

      <ProjectListContent state={state} />

      <SelectorFooter onClose={() => state.setIsOpen(false)} />

      <ManualPathForm
        manualPath={state.manualPath}
        onManualPathChange={state.setManualPath}
        onSubmit={state.handleManualSubmit}
      />
    </Popover.Content>
  )
}

export function ProjectSelector() {
  const state = useProjectSelectorState()

  return (
    <Popover.Root open={state.isOpen} onOpenChange={state.setIsOpen}>
      <Popover.Trigger asChild>
        <button className="project-selector-trigger" aria-haspopup="listbox">
          <span className="project-icon">📁</span>
          <span className="project-name">{state.getCurrentProjectName()}</span>
          <span className="dropdown-arrow">{state.isOpen ? '▲' : '▼'}</span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <SelectorDropdownContent state={state} />
      </Popover.Portal>
    </Popover.Root>
  )
}
