import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ProjectProvider, useProject } from './ProjectContext'

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
      <ProjectProvider>
        <TestComponent />
      </ProjectProvider>
    )

    expect(screen.getByTestId('project-path')).toHaveTextContent('')
  })

  it('should update project path when setProjectPath is called', () => {
    render(
      <ProjectProvider>
        <TestComponent />
      </ProjectProvider>
    )

    const input = screen.getByTestId('path-input')
    fireEvent.change(input, { target: { value: '/test/path' } })

    expect(screen.getByTestId('project-path')).toHaveTextContent('/test/path')
  })

  it('should persist project path to localStorage', () => {
    render(
      <ProjectProvider>
        <TestComponent />
      </ProjectProvider>
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
      <ProjectProvider>
        <TestComponent />
      </ProjectProvider>
    )

    expect(screen.getByTestId('project-path')).toHaveTextContent('/stored/path')
  })

  it('should provide isInitialized state', () => {
    render(
      <ProjectProvider>
        <TestComponent />
      </ProjectProvider>
    )

    expect(screen.getByTestId('is-initialized')).toHaveTextContent('null')

    fireEvent.click(screen.getByTestId('set-initialized'))

    expect(screen.getByTestId('is-initialized')).toHaveTextContent('true')
  })

  it('should throw error when useProject is used outside provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<TestComponent />)).toThrow(
      'useProject must be used within a ProjectProvider'
    )

    consoleError.mockRestore()
  })

  it('should remove from localStorage when path is cleared', () => {
    localStorageMock.getItem.mockReturnValue('/initial/path')

    render(
      <ProjectProvider>
        <TestComponent />
      </ProjectProvider>
    )

    const input = screen.getByTestId('path-input')
    fireEvent.change(input, { target: { value: '' } })

    expect(localStorageMock.removeItem).toHaveBeenCalledWith(
      'centy-project-path'
    )
  })
})
