import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { IssuesList } from './IssuesList'
import {
  createMockGenericItem,
  makeListItemsResponse,
} from './IssuesList.spec-utils'
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

describe('IssuesList - Issue list rendering', () => {
  beforeEach(setupIssuesListMocks)

  it('should display list of issues', async () => {
    vi.mocked(centyClient.listItems).mockResolvedValue(
      makeListItemsResponse([
        createMockGenericItem({
          id: '0001',
          displayNumber: 1,
          title: 'First Issue',
          body: 'Description 1',
          status: 'open',
          priority: 1,
          priorityLabel: 'high',
        }),
        createMockGenericItem({
          id: '0002',
          displayNumber: 2,
          title: 'Second Issue',
          body: 'Description 2',
          status: 'in-progress',
        }),
      ])
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
      expect(screen.getByText('First Issue')).toBeInTheDocument()
      expect(screen.getByText('Second Issue')).toBeInTheDocument()
      expect(screen.getByText('#1')).toBeInTheDocument()
      expect(screen.getByText('#2')).toBeInTheDocument()
    })
  })
})
