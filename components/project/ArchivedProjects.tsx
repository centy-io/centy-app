'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListProjectsRequestSchema,
  UntrackProjectRequestSchema,
  type ProjectInfo,
} from '@/gen/centy_pb'
import {
  useArchivedProjects,
  useProject,
} from '@/components/providers/ProjectProvider'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

function RemoveAllConfirm({
  removingAll,
  onConfirm,
  onCancel,
}: {
  removingAll: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="remove-all-confirm">
      <span className="confirm-text">Remove all permanently?</span>
      <button
        className="confirm-yes-btn"
        onClick={onConfirm}
        disabled={removingAll}
      >
        {removingAll ? 'Removing...' : 'Yes'}
      </button>
      <button
        className="confirm-no-btn"
        onClick={onCancel}
        disabled={removingAll}
      >
        No
      </button>
    </div>
  )
}

function ArchivedItemActions({
  projectPath,
  confirmRemove,
  removingPath,
  onRestore,
  onRestoreAndSelect,
  onRemove,
  onConfirmRemove,
  onCancelConfirm,
}: {
  projectPath: string
  confirmRemove: string | null
  removingPath: string | null
  onRestore: () => void
  onRestoreAndSelect: () => void
  onRemove: () => void
  onConfirmRemove: () => void
  onCancelConfirm: () => void
}) {
  if (confirmRemove === projectPath) {
    return (
      <>
        <span className="confirm-text">Remove permanently?</span>
        <button
          className="confirm-yes-btn"
          onClick={onRemove}
          disabled={removingPath === projectPath}
        >
          {removingPath === projectPath ? 'Removing...' : 'Yes'}
        </button>
        <button
          className="confirm-no-btn"
          onClick={onCancelConfirm}
          disabled={removingPath === projectPath}
        >
          No
        </button>
      </>
    )
  }

  return (
    <>
      <button className="restore-btn" onClick={onRestore}>
        Restore
      </button>
      <button className="restore-select-btn" onClick={onRestoreAndSelect}>
        Restore & Select
      </button>
      <button className="remove-btn" onClick={onConfirmRemove}>
        Remove
      </button>
    </>
  )
}

function StaleItemActions({
  path,
  confirmRemove,
  onRemoveStale,
  onConfirmRemove,
  onCancelConfirm,
}: {
  path: string
  confirmRemove: string | null
  onRemoveStale: () => void
  onConfirmRemove: () => void
  onCancelConfirm: () => void
}) {
  if (confirmRemove === path) {
    return (
      <>
        <span className="confirm-text">Remove permanently?</span>
        <button className="confirm-yes-btn" onClick={onRemoveStale}>
          Yes
        </button>
        <button className="confirm-no-btn" onClick={onCancelConfirm}>
          No
        </button>
      </>
    )
  }

  return (
    <button className="remove-btn" onClick={onConfirmRemove}>
      Remove
    </button>
  )
}

function ArchivedProjectItem({
  project,
  confirmRemove,
  removingPath,
  onRestore,
  onRestoreAndSelect,
  onRemove,
  onConfirmRemove,
  onCancelConfirm,
}: {
  project: ProjectInfo
  confirmRemove: string | null
  removingPath: string | null
  onRestore: () => void
  onRestoreAndSelect: () => void
  onRemove: () => void
  onConfirmRemove: () => void
  onCancelConfirm: () => void
}) {
  return (
    <li className="archived-item">
      <div className="archived-item-info">
        <span className="archived-item-name">
          {project.userTitle || project.projectTitle || project.name}
        </span>
        <span className="archived-item-path">{project.displayPath}</span>
        <div className="archived-item-stats">
          <span>Issues: {project.issueCount}</span>
          <span>Docs: {project.docCount}</span>
          {!project.initialized && (
            <span className="not-initialized-badge">Not initialized</span>
          )}
        </div>
      </div>
      <div className="archived-item-actions">
        <ArchivedItemActions
          projectPath={project.path}
          confirmRemove={confirmRemove}
          removingPath={removingPath}
          onRestore={onRestore}
          onRestoreAndSelect={onRestoreAndSelect}
          onRemove={onRemove}
          onConfirmRemove={onConfirmRemove}
          onCancelConfirm={onCancelConfirm}
        />
      </div>
    </li>
  )
}

function StaleProjectItem({
  path,
  confirmRemove,
  onRemoveStale,
  onConfirmRemove,
  onCancelConfirm,
}: {
  path: string
  confirmRemove: string | null
  onRemoveStale: () => void
  onConfirmRemove: () => void
  onCancelConfirm: () => void
}) {
  return (
    <li className="archived-item stale">
      <div className="archived-item-info">
        <span className="archived-item-name">
          {path.split('/').pop() || path}
        </span>
        <span className="archived-item-path">{path}</span>
        <div className="archived-item-stats">
          <span className="stale-badge">Not tracked by daemon</span>
        </div>
      </div>
      <div className="archived-item-actions">
        <StaleItemActions
          path={path}
          confirmRemove={confirmRemove}
          onRemoveStale={onRemoveStale}
          onConfirmRemove={onConfirmRemove}
          onCancelConfirm={onCancelConfirm}
        />
      </div>
    </li>
  )
}

async function removeAllArchivedProjects(
  archivedProjects: ProjectInfo[],
  archivedPathsNotInDaemon: string[],
  removeArchivedProject: (path: string) => void,
  archivedPaths: string[],
  setAllProjects: React.Dispatch<React.SetStateAction<ProjectInfo[]>>,
  setError: (error: string | null) => void,
  setRemovingAll: (removing: boolean) => void,
  setConfirmRemoveAll: (confirm: boolean) => void
) {
  setRemovingAll(true)
  setError(null)
  try {
    for (const project of archivedProjects) {
      const request = create(UntrackProjectRequestSchema, {
        projectPath: project.path,
      })
      const response = await centyClient.untrackProject(request)
      if (!response.success && response.error) {
        setError(response.error)
        setRemovingAll(false)
        setConfirmRemoveAll(false)
        return
      }
      removeArchivedProject(project.path)
    }
    for (const path of archivedPathsNotInDaemon) {
      removeArchivedProject(path)
    }
    setAllProjects(prev => prev.filter(p => !archivedPaths.includes(p.path)))
  } catch (err) {
    setError(
      err instanceof Error ? err.message : 'Failed to remove all projects'
    )
  } finally {
    setRemovingAll(false)
    setConfirmRemoveAll(false)
  }
}

function ArchivedHeader({
  hasArchivedProjects,
  loading,
  confirmRemoveAll,
  removingAll,
  onRemoveAll,
  onCancelRemoveAll,
  onStartRemoveAll,
}: {
  hasArchivedProjects: boolean
  loading: boolean
  confirmRemoveAll: boolean
  removingAll: boolean
  onRemoveAll: () => void
  onCancelRemoveAll: () => void
  onStartRemoveAll: () => void
}) {
  return (
    <div className="archived-header">
      <h2>Archived Projects</h2>
      <div className="archived-header-actions">
        {hasArchivedProjects && !loading && (
          <>
            {confirmRemoveAll ? (
              <RemoveAllConfirm
                removingAll={removingAll}
                onConfirm={onRemoveAll}
                onCancel={onCancelRemoveAll}
              />
            ) : (
              <button className="remove-all-btn" onClick={onStartRemoveAll}>
                Remove all
              </button>
            )}
          </>
        )}
        <Link href="/" className="back-link">
          Back to Projects
        </Link>
      </div>
    </div>
  )
}

function ArchivedProjectsList({
  archivedProjects,
  archivedPathsNotInDaemon,
  confirmRemove,
  removingPath,
  onRestore,
  onRestoreAndSelect,
  onRemove,
  onConfirmRemove,
  onCancelConfirm,
  onRemoveStale,
}: {
  archivedProjects: ProjectInfo[]
  archivedPathsNotInDaemon: string[]
  confirmRemove: string | null
  removingPath: string | null
  onRestore: (path: string) => void
  onRestoreAndSelect: (project: ProjectInfo) => void
  onRemove: (path: string) => void
  onConfirmRemove: (path: string) => void
  onCancelConfirm: () => void
  onRemoveStale: (path: string) => void
}) {
  return (
    <ul className="archived-list">
      {archivedProjects.map(project => (
        <ArchivedProjectItem
          key={project.path}
          project={project}
          confirmRemove={confirmRemove}
          removingPath={removingPath}
          onRestore={() => onRestore(project.path)}
          onRestoreAndSelect={() => onRestoreAndSelect(project)}
          onRemove={() => onRemove(project.path)}
          onConfirmRemove={() => onConfirmRemove(project.path)}
          onCancelConfirm={onCancelConfirm}
        />
      ))}
      {archivedPathsNotInDaemon.map(path => (
        <StaleProjectItem
          key={path}
          path={path}
          confirmRemove={confirmRemove}
          onRemoveStale={() => onRemoveStale(path)}
          onConfirmRemove={() => onConfirmRemove(path)}
          onCancelConfirm={onCancelConfirm}
        />
      ))}
    </ul>
  )
}

async function handleRemoveProject(
  projectPath: string,
  removeArchivedProject: (path: string) => void,
  setAllProjects: React.Dispatch<React.SetStateAction<ProjectInfo[]>>,
  setError: (error: string | null) => void,
  setRemovingPath: (path: string | null) => void,
  setConfirmRemove: (path: string | null) => void
) {
  setRemovingPath(projectPath)
  setError(null)
  try {
    const request = create(UntrackProjectRequestSchema, { projectPath })
    const response = await centyClient.untrackProject(request)
    if (!response.success && response.error) {
      setError(response.error)
    } else {
      removeArchivedProject(projectPath)
      setAllProjects(prev => prev.filter(p => p.path !== projectPath))
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to remove project')
  } finally {
    setRemovingPath(null)
    setConfirmRemove(null)
  }
}

function useArchivedProjectsFetch() {
  const [allProjects, setAllProjects] = useState<ProjectInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const request = create(ListProjectsRequestSchema, { includeStale: true })
      const response = await centyClient.listProjects(request)
      setAllProjects(response.projects)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return { allProjects, setAllProjects, loading, error, setError }
}

function useArchivedProjectsState() {
  const { archivedPaths, unarchiveProject, removeArchivedProject } =
    useArchivedProjects()
  const { setProjectPath, setIsInitialized } = useProject()
  const { allProjects, setAllProjects, loading, error, setError } =
    useArchivedProjectsFetch()
  const [removingPath, setRemovingPath] = useState<string | null>(null)
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null)
  const [confirmRemoveAll, setConfirmRemoveAll] = useState(false)
  const [removingAll, setRemovingAll] = useState(false)

  const archivedProjects = allProjects.filter(p =>
    archivedPaths.includes(p.path)
  )
  const archivedPathsNotInDaemon = archivedPaths.filter(
    path => !allProjects.some(p => p.path === path)
  )

  const handleRestore = (pp: string) => {
    unarchiveProject(pp)
  }

  const handleRestoreAndSelect = (project: ProjectInfo) => {
    unarchiveProject(project.path)
    setProjectPath(project.path)
    setIsInitialized(project.initialized)
  }

  const handleRemove = async (pp: string) => {
    await handleRemoveProject(
      pp,
      removeArchivedProject,
      setAllProjects,
      setError,
      setRemovingPath,
      setConfirmRemove
    )
  }

  const handleRemoveStale = (path: string) => {
    removeArchivedProject(path)
    setConfirmRemove(null)
  }

  const handleRemoveAll = async () => {
    await removeAllArchivedProjects(
      archivedProjects,
      archivedPathsNotInDaemon,
      removeArchivedProject,
      archivedPaths,
      setAllProjects,
      setError,
      setRemovingAll,
      setConfirmRemoveAll
    )
  }

  return {
    loading,
    error,
    removingPath,
    confirmRemove,
    confirmRemoveAll,
    removingAll,
    archivedProjects,
    archivedPathsNotInDaemon,
    setConfirmRemove,
    setConfirmRemoveAll,
    handleRestore,
    handleRestoreAndSelect,
    handleRemove,
    handleRemoveStale,
    handleRemoveAll,
  }
}

export function ArchivedProjects() {
  const state = useArchivedProjectsState()

  const hasArchivedProjects =
    state.archivedProjects.length > 0 ||
    state.archivedPathsNotInDaemon.length > 0

  return (
    <div className="archived-projects">
      <ArchivedHeader
        hasArchivedProjects={hasArchivedProjects}
        loading={state.loading}
        confirmRemoveAll={state.confirmRemoveAll}
        removingAll={state.removingAll}
        onRemoveAll={state.handleRemoveAll}
        onCancelRemoveAll={() => state.setConfirmRemoveAll(false)}
        onStartRemoveAll={() => state.setConfirmRemoveAll(true)}
      />

      {state.error && <DaemonErrorMessage error={state.error} />}

      {state.loading ? (
        <div className="loading">Loading projects...</div>
      ) : !hasArchivedProjects ? (
        <div className="empty-state">
          <p>No archived projects</p>
          <p className="hint">
            Archive projects from the project selector to see them here
          </p>
        </div>
      ) : (
        <ArchivedProjectsList
          archivedProjects={state.archivedProjects}
          archivedPathsNotInDaemon={state.archivedPathsNotInDaemon}
          confirmRemove={state.confirmRemove}
          removingPath={state.removingPath}
          onRestore={state.handleRestore}
          onRestoreAndSelect={state.handleRestoreAndSelect}
          onRemove={state.handleRemove}
          onConfirmRemove={path => state.setConfirmRemove(path)}
          onCancelConfirm={() => state.setConfirmRemove(null)}
          onRemoveStale={state.handleRemoveStale}
        />
      )}
    </div>
  )
}
