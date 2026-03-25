import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { IssuesList } from './IssuesList'

vi.mock('@/lib/grpc/client', () => ({
  centyClient: {
    isInitialized: vi.fn(),
    listItems: vi.fn(),
  },
}))

const mockUsePathContext = vi.fn()
const mockUseProjectPathToUrl = vi.fn()
vi.mock('@/components/providers/PathContextProvider', () => ({
  usePathContext: () => mockUsePathContext(),
  useProjectPathToUrl: () => mockUseProjectPathToUrl(),
}))

vi.mock('@/components/providers/ProjectProvider', () => ({
  useProject: () => ({
    projectPath: '/test/path',
    setProjectPath: vi.fn(),
    isInitialized: true,
    setIsInitialized: vi.fn(),
  }),
}))

function setupIssuesListMocks() {
  vi.clearAllMocks()
  mockUsePathContext.mockReturnValue({
    projectPath: '',
    isInitialized: null,
    orgSlug: null,
    projectName: null,
    displayPath: '',
    isAggregateView: false,
    isLoading: false,
    error: null,
    navigateToProject: vi.fn(),
  })
  mockUseProjectPathToUrl.mockReturnValue(vi.fn().mockResolvedValue(null))
}

const renderComponent = () => render(<IssuesList />)

describe('IssuesList - Header and empty states', () => {
  beforeEach(setupIssuesListMocks)

  it('should render the page header', () => {
    renderComponent()

    expect(screen.getByText('Issues')).toBeInTheDocument()
    expect(screen.getByText('+ New Issue')).toBeInTheDocument()
  })

  it('should show message when no project is selected', () => {
    renderComponent()

    expect(
      screen.getByText('Select a project from the header to view issues')
    ).toBeInTheDocument()
  })

  it('should show error when project is not initialized', () => {
    mockUsePathContext.mockReturnValue({
      projectPath: '/test/path',
      isInitialized: false,
      orgSlug: null,
      projectName: 'test',
      displayPath: '~/test/path',
      isAggregateView: false,
      isLoading: false,
      error: null,
      navigateToProject: vi.fn(),
    })

    renderComponent()

    expect(
      screen.getByText('Centy is not initialized in this directory')
    ).toBeInTheDocument()
    expect(screen.getByText('Initialize Project')).toBeInTheDocument()
  })
})
