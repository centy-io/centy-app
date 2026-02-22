'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import { ProjectProviderError } from '@/lib/errors'

interface ProjectContextType {
  projectPath: string
  setProjectPath: (path: string) => void
  isInitialized: boolean | null
  setIsInitialized: (initialized: boolean | null) => void
}

const ProjectContext = createContext<ProjectContextType | null>(null)

const ARCHIVED_STORAGE_KEY = 'centy-archived-projects'

function setArchivedProjectsStorage(paths: string[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ARCHIVED_STORAGE_KEY, JSON.stringify(paths))
  }
}

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projectPath, setProjectPathState] = useState('')
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null)

  const setProjectPath = useCallback((path: string) => {
    setProjectPathState(path)
  }, [])

  return (
    <ProjectContext.Provider
      value={{ projectPath, setProjectPath, isInitialized, setIsInitialized }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new ProjectProviderError()
  }
  return context
}

export function useArchivedProjects() {
  // Initialize to empty to avoid hydration mismatch - load from localStorage after mount
  const [archivedPaths, setArchivedPathsState] = useState<string[]>([])

  // Load from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    const stored = localStorage.getItem(ARCHIVED_STORAGE_KEY)
    if (stored) {
      setArchivedPathsState(JSON.parse(stored))
    }
  }, [])

  const archiveProject = useCallback((path: string) => {
    setArchivedPathsState(prev => {
      if (prev.includes(path)) return prev
      const updated = [...prev, path]
      setArchivedProjectsStorage(updated)
      return updated
    })
  }, [])

  const unarchiveProject = useCallback((path: string) => {
    setArchivedPathsState(prev => {
      const updated = prev.filter(p => p !== path)
      setArchivedProjectsStorage(updated)
      return updated
    })
  }, [])

  const removeArchivedProject = useCallback((path: string) => {
    setArchivedPathsState(prev => {
      const updated = prev.filter(p => p !== path)
      setArchivedProjectsStorage(updated)
      return updated
    })
  }, [])

  const isArchived = useCallback(
    (path: string) => {
      return archivedPaths.includes(path)
    },
    [archivedPaths]
  )

  return {
    archivedPaths,
    archiveProject,
    unarchiveProject,
    removeArchivedProject,
    isArchived,
  }
}
