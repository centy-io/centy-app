import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { IssuesList } from './IssuesList'
import { makeListItemsResponse } from './IssuesList.spec-utils'
import { centyClient } from '@/lib/grpc/client'

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

describe('IssuesList - Empty state', () => {
  beforeEach(setupIssuesListMocks)

  it('should show empty state when no issues exist', async () => {
    vi.mocked(centyClient.listItems).mockResolvedValue(
      makeListItemsResponse([])
    )

    mockUsePathContext.mockReturnValue({
      projectPath: '/test/path',
      isInitialized: true,
      orgSlug: null,
      projectName: 'test',
      displayPath: '~/test/path',
      isAggregateView: false,
      isLoading: false,
      error: null,
      navigateToProject: vi.fn(),
    })

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('No issues found')).toBeInTheDocument()
      expect(screen.getByText('Create your first issue')).toBeInTheDocument()
    })
  })
})
