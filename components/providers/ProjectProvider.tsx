'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

interface ProjectContextType {
  projectPath: string
  setProjectPath: (path: string) => void
  isInitialized: boolean | null
  setIsInitialized: (initialized: boolean | null) => void
}

const ProjectContext = createContext<ProjectContextType | null>(null)

const STORAGE_KEY = 'centy-project-path'
const ARCHIVED_STORAGE_KEY = 'centy-archived-projects'

function getArchivedProjects(): string[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(ARCHIVED_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

function setArchivedProjectsStorage(paths: string[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ARCHIVED_STORAGE_KEY, JSON.stringify(paths))
  }
}

const PROJECT_QUERY_PARAM = 'project'

export function ProjectProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const projectPathRef = useRef<string>('')

  const [projectPath, setProjectPathState] = useState(() => {
    // Priority: query string > localStorage > empty
    const queryProject = searchParams.get(PROJECT_QUERY_PARAM)
    if (queryProject) {
      return queryProject
    }
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) || ''
    }
    return ''
  })
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null)

  // Sync query string with project path on mount and when projectPath changes
  useEffect(() => {
    const currentQueryProject = searchParams.get(PROJECT_QUERY_PARAM)
    if (projectPath && currentQueryProject !== projectPath) {
      const newParams = new URLSearchParams(searchParams.toString())
      newParams.set(PROJECT_QUERY_PARAM, projectPath)
      router.replace(`${pathname}?${newParams.toString()}`)
    } else if (!projectPath && currentQueryProject) {
      const newParams = new URLSearchParams(searchParams.toString())
      newParams.delete(PROJECT_QUERY_PARAM)
      const queryString = newParams.toString()
      router.replace(queryString ? `${pathname}?${queryString}` : pathname)
    }
  }, [projectPath, searchParams, router, pathname])

  // Keep ref in sync for use in callback
  useEffect(() => {
    projectPathRef.current = projectPath
  }, [projectPath])

  const setProjectPath = useCallback(
    (path: string) => {
      // Navigate away from detail pages before changing project context
      // This prevents race conditions where components fetch with wrong project
      const isDetailPage = /^\/(issues|cycles|docs)\/[^/]+/.test(pathname)
      if (isDetailPage && path !== projectPathRef.current && path) {
        const basePath = pathname.split('/').slice(0, 2).join('/') // e.g., /issues
        // Persist to localStorage and use window.location for immediate navigation
        localStorage.setItem(STORAGE_KEY, path)
        window.location.href = `${basePath}?${PROJECT_QUERY_PARAM}=${encodeURIComponent(path)}`
        return
      }

      setProjectPathState(path)
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        if (path) {
          localStorage.setItem(STORAGE_KEY, path)
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    },
    [pathname]
  )

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
    throw new Error('useProject must be used within a ProjectProvider')
  }
  return context
}

export function useArchivedProjects() {
  const [archivedPaths, setArchivedPathsState] = useState<string[]>(() =>
    getArchivedProjects()
  )

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
