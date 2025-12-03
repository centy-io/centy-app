import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import {
  ProjectProvider,
  useProject,
  useArchivedProjects,
} from './ProjectContext'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

function TestComponent() {
  const { projectPath, setProjectPath, isInitialized, setIsInitialized } =
    useProject()

  return (
    <div>
      <span data-testid="project-path">{projectPath}</span>
      <span data-testid="is-initialized">
        {isInitialized === null ? 'null' : String(isInitialized)}
      </span>
      <input
        data-testid="path-input"
        value={projectPath}
        onChange={e => setProjectPath(e.target.value)}
      />
      <button
        data-testid="set-initialized"
        onClick={() => setIsInitialized(true)}
      >
        Set Initialized
      </button>
    </div>
  )
}

describe('ProjectContext', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  it('should provide default empty project path', () => {
    render(
      <MemoryRouter>
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      </MemoryRouter>
    )

    expect(screen.getByTestId('project-path')).toHaveTextContent('')
  })

  it('should update project path when setProjectPath is called', () => {
    render(
      <MemoryRouter>
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      </MemoryRouter>
    )

    const input = screen.getByTestId('path-input')
    fireEvent.change(input, { target: { value: '/test/path' } })

    expect(screen.getByTestId('project-path')).toHaveTextContent('/test/path')
  })

  it('should persist project path to localStorage', () => {
    render(
      <MemoryRouter>
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      </MemoryRouter>
    )

    const input = screen.getByTestId('path-input')
    fireEvent.change(input, { target: { value: '/test/path' } })

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'centy-project-path',
      '/test/path'
    )
  })

  it('should load project path from localStorage on mount', () => {
    localStorageMock.getItem.mockReturnValue('/stored/path')

    render(
      <MemoryRouter>
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      </MemoryRouter>
    )

    expect(screen.getByTestId('project-path')).toHaveTextContent('/stored/path')
  })

  it('should provide isInitialized state', () => {
    render(
      <MemoryRouter>
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      </MemoryRouter>
    )

    expect(screen.getByTestId('is-initialized')).toHaveTextContent('null')

    fireEvent.click(screen.getByTestId('set-initialized'))

    expect(screen.getByTestId('is-initialized')).toHaveTextContent('true')
  })

  it('should throw error when useProject is used outside provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() =>
      render(
        <MemoryRouter>
          <TestComponent />
        </MemoryRouter>
      )
    ).toThrow('useProject must be used within a ProjectProvider')

    consoleError.mockRestore()
  })

  it('should remove from localStorage when path is cleared', () => {
    localStorageMock.getItem.mockReturnValue('/initial/path')

    render(
      <MemoryRouter>
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      </MemoryRouter>
    )

    const input = screen.getByTestId('path-input')
    fireEvent.change(input, { target: { value: '' } })

    expect(localStorageMock.removeItem).toHaveBeenCalledWith(
      'centy-project-path'
    )
  })
})

function ArchivedProjectsTestComponent() {
  const {
    archivedPaths,
    archiveProject,
    unarchiveProject,
    removeArchivedProject,
    isArchived,
  } = useArchivedProjects()

  return (
    <div>
      <span data-testid="archived-paths">{archivedPaths.join(',')}</span>
      <span data-testid="is-archived-test">
        {String(isArchived('/test/project'))}
      </span>
      <button
        data-testid="archive-btn"
        onClick={() => archiveProject('/test/project')}
      >
        Archive
      </button>
      <button
        data-testid="unarchive-btn"
        onClick={() => unarchiveProject('/test/project')}
      >
        Unarchive
      </button>
      <button
        data-testid="remove-btn"
        onClick={() => removeArchivedProject('/test/project')}
      >
        Remove
      </button>
    </div>
  )
}

describe('useArchivedProjects', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('should provide empty archived paths by default', () => {
    render(<ArchivedProjectsTestComponent />)

    expect(screen.getByTestId('archived-paths')).toHaveTextContent('')
  })

  it('should archive a project', () => {
    render(<ArchivedProjectsTestComponent />)

    fireEvent.click(screen.getByTestId('archive-btn'))

    expect(screen.getByTestId('archived-paths')).toHaveTextContent(
      '/test/project'
    )
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'centy-archived-projects',
      '["/test/project"]'
    )
  })

  it('should unarchive a project', () => {
    localStorageMock.getItem.mockReturnValue('["/test/project"]')

    render(<ArchivedProjectsTestComponent />)

    fireEvent.click(screen.getByTestId('unarchive-btn'))

    expect(screen.getByTestId('archived-paths')).toHaveTextContent('')
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'centy-archived-projects',
      '[]'
    )
  })

  it('should remove an archived project', () => {
    localStorageMock.getItem.mockReturnValue('["/test/project"]')

    render(<ArchivedProjectsTestComponent />)

    fireEvent.click(screen.getByTestId('remove-btn'))

    expect(screen.getByTestId('archived-paths')).toHaveTextContent('')
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'centy-archived-projects',
      '[]'
    )
  })

  it('should check if a project is archived', () => {
    localStorageMock.getItem.mockReturnValue('["/test/project"]')

    render(<ArchivedProjectsTestComponent />)

    expect(screen.getByTestId('is-archived-test')).toHaveTextContent('true')
  })

  it('should not duplicate when archiving the same project twice', () => {
    render(<ArchivedProjectsTestComponent />)

    fireEvent.click(screen.getByTestId('archive-btn'))
    fireEvent.click(screen.getByTestId('archive-btn'))

    expect(screen.getByTestId('archived-paths')).toHaveTextContent(
      '/test/project'
    )
    // Should only have one entry
    expect(
      screen.getByTestId('archived-paths').textContent?.split(',').length
    ).toBe(1)
  })
})
