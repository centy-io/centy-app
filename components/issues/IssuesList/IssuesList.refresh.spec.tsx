import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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

const mockUsePathContext = vi.fn<() => unknown>()
const mockUseProjectPathToUrl = vi.fn<() => unknown>()
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

const initializedContext = {
  projectPath: '/test/path',
  isInitialized: true,
  orgSlug: null,
  projectName: 'test',
  displayPath: '~/test/path',
  isAggregateView: false,
  isLoading: false,
  error: null,
  navigateToProject: vi.fn(),
}

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

describe('IssuesList - Refresh button', () => {
  beforeEach(setupIssuesListMocks)

  it('should show refresh button when project is initialized', async () => {
    vi.mocked(centyClient.listItems).mockResolvedValue(
      makeListItemsResponse([])
    )
    mockUsePathContext.mockReturnValue(initializedContext)

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Refresh')).toBeInTheDocument()
    })
  })
})

describe('IssuesList - Error handling', () => {
  beforeEach(setupIssuesListMocks)

  it('should handle network errors', async () => {
    const mockListItems = vi.mocked(centyClient.listItems)
    const errorMessage = 'Connection refused'
    mockListItems.mockRejectedValue(new Error(errorMessage))
    mockUsePathContext.mockReturnValue(initializedContext)

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Connection refused')).toBeInTheDocument()
    })
  })

  it('should refresh issues when clicking refresh button', async () => {
    const mockListItems = vi.mocked(centyClient.listItems)
    mockListItems.mockResolvedValue(makeListItemsResponse([]))
    mockUsePathContext.mockReturnValue(initializedContext)

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Refresh')).toBeInTheDocument()
    })

    mockListItems.mockClear()
    fireEvent.click(screen.getByText('Refresh'))

    await waitFor(() => {
      expect(mockListItems).toHaveBeenCalled()
    })
  })
})
