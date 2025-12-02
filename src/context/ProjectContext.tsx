import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'

interface ProjectContextType {
  projectPath: string
  setProjectPath: (path: string) => void
  isInitialized: boolean | null
  setIsInitialized: (initialized: boolean | null) => void
}

const ProjectContext = createContext<ProjectContextType | null>(null)

const STORAGE_KEY = 'centy-project-path'

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projectPath, setProjectPathState] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) || ''
    }
    return ''
  })
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null)

  const setProjectPath = useCallback((path: string) => {
    setProjectPathState(path)
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      if (path) {
        localStorage.setItem(STORAGE_KEY, path)
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
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
    throw new Error('useProject must be used within a ProjectProvider')
  }
  return context
}
