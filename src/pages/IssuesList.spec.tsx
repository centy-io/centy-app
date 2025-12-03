import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { IssuesList } from './IssuesList'

vi.mock('../api/client.ts', () => ({
  centyClient: {
    isInitialized: vi.fn(),
    listIssues: vi.fn(),
  },
}))

const mockUseProject = vi.fn()
vi.mock('../context/ProjectContext.tsx', () => ({
  useProject: () => mockUseProject(),
}))

import { centyClient } from '../api/client.ts'

// Helper to create mock Issue data
const createMockIssue = (
  overrides: {
    issueNumber?: string
    displayNumber?: number
    title?: string
    description?: string
    status?: string
    priority?: number
    priorityLabel?: string
    hasMetadata?: boolean
  } = {}
) => ({
  id: overrides.issueNumber || '0001',
  displayNumber: overrides.displayNumber || 1,
  issueNumber: overrides.issueNumber || '0001',
  title: overrides.title || 'Test Issue',
  description: overrides.description || 'Test description',
  metadata:
    overrides.hasMetadata === false
      ? undefined
      : {
          displayNumber: overrides.displayNumber || 1,
          status: overrides.status || 'open',
          priority: overrides.priority || 2,
          priorityLabel: overrides.priorityLabel || 'medium',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          customFields: {},
          $typeName: 'centy.IssueMetadata' as const,
          $unknown: undefined,
        },
  $typeName: 'centy.Issue' as const,
  $unknown: undefined,
})

describe('IssuesList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default mock - no project selected
    mockUseProject.mockReturnValue({
      projectPath: '',
      setProjectPath: vi.fn(),
      isInitialized: null,
      setIsInitialized: vi.fn(),
    })
  })

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <IssuesList />
      </BrowserRouter>
    )
  }

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
    mockUseProject.mockReturnValue({
      projectPath: '/test/path',
      setProjectPath: vi.fn(),
      isInitialized: false,
      setIsInitialized: vi.fn(),
    })

    renderComponent()

    expect(
      screen.getByText('Centy is not initialized in this directory')
    ).toBeInTheDocument()
    expect(screen.getByText('Initialize Project')).toBeInTheDocument()
  })

  it('should show empty state when no issues exist', async () => {
    const mockListIssues = vi.mocked(centyClient.listIssues)
    mockListIssues.mockResolvedValue({
      issues: [],
      totalCount: 0,
      $typeName: 'centy.ListIssuesResponse',
      $unknown: undefined,
    })

    mockUseProject.mockReturnValue({
      projectPath: '/test/path',
      setProjectPath: vi.fn(),
      isInitialized: true,
      setIsInitialized: vi.fn(),
    })

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('No issues found')).toBeInTheDocument()
      expect(screen.getByText('Create your first issue')).toBeInTheDocument()
    })
  })

  it('should display list of issues', async () => {
    const mockListIssues = vi.mocked(centyClient.listIssues)
    mockListIssues.mockResolvedValue({
      issues: [
        createMockIssue({
          issueNumber: '0001',
          displayNumber: 1,
          title: 'First Issue',
          description: 'Description 1',
          status: 'open',
          priority: 1,
          priorityLabel: 'high',
        }),
        createMockIssue({
          issueNumber: '0002',
          displayNumber: 2,
          title: 'Second Issue',
          description: 'Description 2',
          status: 'in-progress',
        }),
      ],
      totalCount: 2,
      $typeName: 'centy.ListIssuesResponse',
      $unknown: undefined,
    })

    mockUseProject.mockReturnValue({
      projectPath: '/test/path',
      setProjectPath: vi.fn(),
      isInitialized: true,
      setIsInitialized: vi.fn(),
    })

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('First Issue')).toBeInTheDocument()
      expect(screen.getByText('Second Issue')).toBeInTheDocument()
      expect(screen.getByText('#1')).toBeInTheDocument()
      expect(screen.getByText('#2')).toBeInTheDocument()
    })
  })

  it('should show refresh button when project is initialized', async () => {
    const mockListIssues = vi.mocked(centyClient.listIssues)
    mockListIssues.mockResolvedValue({
      issues: [],
      totalCount: 0,
      $typeName: 'centy.ListIssuesResponse',
      $unknown: undefined,
    })

    mockUseProject.mockReturnValue({
      projectPath: '/test/path',
      setProjectPath: vi.fn(),
      isInitialized: true,
      setIsInitialized: vi.fn(),
    })

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Refresh')).toBeInTheDocument()
    })
  })

  it('should handle network errors', async () => {
    const mockListIssues = vi.mocked(centyClient.listIssues)
    mockListIssues.mockRejectedValue(new Error('Connection refused'))

    mockUseProject.mockReturnValue({
      projectPath: '/test/path',
      setProjectPath: vi.fn(),
      isInitialized: true,
      setIsInitialized: vi.fn(),
    })

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Connection refused')).toBeInTheDocument()
    })
  })

  it('should refresh issues when clicking refresh button', async () => {
    const mockListIssues = vi.mocked(centyClient.listIssues)
    mockListIssues.mockResolvedValue({
      issues: [],
      totalCount: 0,
      $typeName: 'centy.ListIssuesResponse',
      $unknown: undefined,
    })

    mockUseProject.mockReturnValue({
      projectPath: '/test/path',
      setProjectPath: vi.fn(),
      isInitialized: true,
      setIsInitialized: vi.fn(),
    })

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Refresh')).toBeInTheDocument()
    })

    mockListIssues.mockClear()

    const refreshBtn = screen.getByText('Refresh')
    fireEvent.click(refreshBtn)

    await waitFor(() => {
      expect(mockListIssues).toHaveBeenCalled()
    })
  })

  it('should display status and priority badges with correct styling', async () => {
    const mockListIssues = vi.mocked(centyClient.listIssues)
    mockListIssues.mockResolvedValue({
      issues: [
        createMockIssue({
          status: 'open',
          priority: 1,
          priorityLabel: 'high',
        }),
      ],
      totalCount: 1,
      $typeName: 'centy.ListIssuesResponse',
      $unknown: undefined,
    })

    mockUseProject.mockReturnValue({
      projectPath: '/test/path',
      setProjectPath: vi.fn(),
      isInitialized: true,
      setIsInitialized: vi.fn(),
    })

    renderComponent()

    await waitFor(() => {
      const statusBadge = screen.getByText('open')
      const priorityBadge = screen.getByText('high')

      expect(statusBadge).toHaveClass('status-open')
      expect(priorityBadge).toHaveClass('priority-high')
    })
  })

  it('should handle non-Error rejection', async () => {
    const mockListIssues = vi.mocked(centyClient.listIssues)
    mockListIssues.mockRejectedValue('string error')

    mockUseProject.mockReturnValue({
      projectPath: '/test/path',
      setProjectPath: vi.fn(),
      isInitialized: true,
      setIsInitialized: vi.fn(),
    })

    renderComponent()

    await waitFor(() => {
      expect(
        screen.getByText('Failed to connect to daemon')
      ).toBeInTheDocument()
    })
  })

  it('should show closed status badge correctly', async () => {
    const mockListIssues = vi.mocked(centyClient.listIssues)
    mockListIssues.mockResolvedValue({
      issues: [
        createMockIssue({
          title: 'Closed Issue',
          status: 'closed',
          priority: 3,
          priorityLabel: 'low',
        }),
      ],
      totalCount: 1,
      $typeName: 'centy.ListIssuesResponse',
      $unknown: undefined,
    })

    mockUseProject.mockReturnValue({
      projectPath: '/test/path',
      setProjectPath: vi.fn(),
      isInitialized: true,
      setIsInitialized: vi.fn(),
    })

    renderComponent()

    // Wait for the component to load - the table will be rendered but empty due to default filter (open, in-progress only)
    await waitFor(() => {
      // Table should exist even though no issues are visible
      expect(screen.getByRole('table')).toBeInTheDocument()
    })

    // Open the status multi-select dropdown and select closed
    const statusFilterTriggers = screen
      .getAllByRole('button')
      .filter(btn => btn.classList.contains('multi-select-trigger'))
    fireEvent.click(statusFilterTriggers[0])

    // Select Closed and deselect Open and In Progress
    await waitFor(() => {
      const closedCheckbox = screen.getByRole('checkbox', { name: 'Closed' })
      const openCheckbox = screen.getByRole('checkbox', { name: 'Open' })
      const inProgressCheckbox = screen.getByRole('checkbox', {
        name: 'In Progress',
      })
      fireEvent.click(closedCheckbox)
      fireEvent.click(openCheckbox)
      fireEvent.click(inProgressCheckbox)
    })

    await waitFor(() => {
      const statusBadge = screen.getByText('closed')
      const priorityBadge = screen.getByText('low')

      expect(statusBadge).toHaveClass('status-closed')
      expect(priorityBadge).toHaveClass('priority-low')
    })
  })

  it('should display issue without metadata gracefully', async () => {
    const mockListIssues = vi.mocked(centyClient.listIssues)
    mockListIssues.mockResolvedValue({
      issues: [
        createMockIssue({
          title: 'Issue Without Metadata',
          description: 'Description',
          hasMetadata: false,
        }),
      ],
      totalCount: 1,
      $typeName: 'centy.ListIssuesResponse',
      $unknown: undefined,
    })

    mockUseProject.mockReturnValue({
      projectPath: '/test/path',
      setProjectPath: vi.fn(),
      isInitialized: true,
      setIsInitialized: vi.fn(),
    })

    renderComponent()

    // Wait for table to render
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument()
    })

    // Clear status filter to show issues with 'unknown' status (no metadata)
    const filterTriggers = screen
      .getAllByRole('button')
      .filter(btn => btn.classList.contains('multi-select-trigger'))
    fireEvent.click(filterTriggers[0])

    // Deselect Open and In Progress to clear filter (which shows all issues including 'unknown')
    await waitFor(() => {
      const openCheckbox = screen.getByRole('checkbox', { name: 'Open' })
      const inProgressCheckbox = screen.getByRole('checkbox', {
        name: 'In Progress',
      })
      fireEvent.click(openCheckbox)
      fireEvent.click(inProgressCheckbox)
    })

    // Now with no filter, all issues including 'unknown' should be visible
    await waitFor(() => {
      expect(screen.getByText('Issue Without Metadata')).toBeInTheDocument()
      expect(screen.getAllByText('unknown')).toHaveLength(2)
    })
  })

  describe('TanStack Table sorting and filtering', () => {
    const setupWithIssues = async () => {
      const mockListIssues = vi.mocked(centyClient.listIssues)
      mockListIssues.mockResolvedValue({
        issues: [
          createMockIssue({
            issueNumber: '0001',
            displayNumber: 1,
            title: 'Alpha Issue',
            status: 'open',
            priorityLabel: 'high',
          }),
          createMockIssue({
            issueNumber: '0002',
            displayNumber: 2,
            title: 'Beta Issue',
            status: 'closed',
            priorityLabel: 'low',
          }),
          createMockIssue({
            issueNumber: '0003',
            displayNumber: 3,
            title: 'Gamma Issue',
            status: 'in-progress',
            priorityLabel: 'medium',
          }),
        ],
        totalCount: 3,
        $typeName: 'centy.ListIssuesResponse',
        $unknown: undefined,
      })

      mockUseProject.mockReturnValue({
        projectPath: '/test/path',
        setProjectPath: vi.fn(),
        isInitialized: true,
        setIsInitialized: vi.fn(),
      })

      renderComponent()

      await waitFor(() => {
        expect(screen.getByText('Alpha Issue')).toBeInTheDocument()
      })
    }

    it('should sort by column when clicking header', async () => {
      await setupWithIssues()

      // Find and click the Title sort button
      const titleHeader = screen.getByRole('button', { name: /title/i })
      fireEvent.click(titleHeader)

      // After sorting, check that sort indicator appears
      await waitFor(() => {
        expect(titleHeader).toHaveClass('sorted')
      })
    })

    it('should toggle sort direction on multiple clicks', async () => {
      await setupWithIssues()

      const titleHeader = screen.getByRole('button', { name: /title/i })

      // First click - ascending
      fireEvent.click(titleHeader)
      await waitFor(() => {
        expect(titleHeader.textContent).toContain('\u25B2') // Up arrow
      })

      // Second click - descending
      fireEvent.click(titleHeader)
      await waitFor(() => {
        expect(titleHeader.textContent).toContain('\u25BC') // Down arrow
      })
    })

    it('should filter by title using text input', async () => {
      await setupWithIssues()

      // Find the title column filter input
      const filterInputs = screen.getAllByPlaceholderText('Filter...')
      const titleFilter = filterInputs[1] // Title is the second column

      // Filter by "Gamma" which is an open issue (visible by default)
      fireEvent.change(titleFilter, { target: { value: 'Gamma' } })

      await waitFor(() => {
        expect(screen.getByText('Gamma Issue')).toBeInTheDocument()
        expect(screen.queryByText('Alpha Issue')).not.toBeInTheDocument()
        // Beta Issue is closed and hidden by default
      })
    })

    it('should filter by issue number using text input', async () => {
      await setupWithIssues()

      // Find the # column filter input (first filter)
      const filterInputs = screen.getAllByPlaceholderText('Filter...')
      const numberFilter = filterInputs[0]

      // Filter by issue number 3 (Gamma Issue, which is open and visible by default)
      fireEvent.change(numberFilter, { target: { value: '3' } })

      await waitFor(() => {
        expect(screen.getByText('Gamma Issue')).toBeInTheDocument()
        expect(screen.queryByText('Alpha Issue')).not.toBeInTheDocument()
      })
    })

    it('should filter by status using multi-select dropdown', async () => {
      await setupWithIssues()

      // Open the status multi-select dropdown
      const statusFilterTriggers = screen
        .getAllByRole('button')
        .filter(btn => btn.classList.contains('multi-select-trigger'))
      fireEvent.click(statusFilterTriggers[0])

      // By default, Open and In Progress are selected, so Beta Issue (closed) is not visible
      // Select Closed and deselect Open and In Progress to show only closed issues
      await waitFor(() => {
        const closedCheckbox = screen.getByRole('checkbox', { name: 'Closed' })
        const openCheckbox = screen.getByRole('checkbox', { name: 'Open' })
        const inProgressCheckbox = screen.getByRole('checkbox', {
          name: 'In Progress',
        })
        fireEvent.click(closedCheckbox)
        fireEvent.click(openCheckbox)
        fireEvent.click(inProgressCheckbox)
      })

      await waitFor(() => {
        expect(screen.getByText('Beta Issue')).toBeInTheDocument()
        expect(screen.queryByText('Alpha Issue')).not.toBeInTheDocument()
        expect(screen.queryByText('Gamma Issue')).not.toBeInTheDocument()
      })
    })

    it('should filter by priority using multi-select dropdown', async () => {
      await setupWithIssues()

      // Open the priority multi-select dropdown (second one)
      const filterTriggers = screen
        .getAllByRole('button')
        .filter(btn => btn.classList.contains('multi-select-trigger'))
      fireEvent.click(filterTriggers[1])

      // Select only medium priority
      await waitFor(() => {
        const mediumCheckbox = screen.getByRole('checkbox', { name: 'Medium' })
        fireEvent.click(mediumCheckbox)
      })

      await waitFor(() => {
        expect(screen.getByText('Gamma Issue')).toBeInTheDocument()
        expect(screen.queryByText('Alpha Issue')).not.toBeInTheDocument()
        // Beta Issue is also hidden due to default status filter
      })
    })

    it('should show all issues when selecting All in status filter', async () => {
      await setupWithIssues()

      // By default, Open and In Progress are selected, so Beta Issue (closed) is not visible
      await waitFor(() => {
        expect(screen.getByText('Alpha Issue')).toBeInTheDocument()
        expect(screen.queryByText('Beta Issue')).not.toBeInTheDocument()
        expect(screen.getByText('Gamma Issue')).toBeInTheDocument()
      })

      // Open the status multi-select dropdown and select All
      const filterTriggers = screen
        .getAllByRole('button')
        .filter(btn => btn.classList.contains('multi-select-trigger'))
      fireEvent.click(filterTriggers[0])

      // Click All checkbox to select all statuses
      await waitFor(() => {
        const allCheckbox = screen.getAllByRole('checkbox')[0] // First checkbox is "All"
        fireEvent.click(allCheckbox)
      })

      await waitFor(() => {
        expect(screen.getByText('Alpha Issue')).toBeInTheDocument()
        expect(screen.getByText('Beta Issue')).toBeInTheDocument()
        expect(screen.getByText('Gamma Issue')).toBeInTheDocument()
      })
    })

    it('should sort by priority with custom order (high > medium > low)', async () => {
      await setupWithIssues()

      // First, show all issues (including closed) by selecting All in status filter
      const filterTriggers = screen
        .getAllByRole('button')
        .filter(btn => btn.classList.contains('multi-select-trigger'))
      fireEvent.click(filterTriggers[0])

      await waitFor(() => {
        const allCheckbox = screen.getAllByRole('checkbox')[0]
        fireEvent.click(allCheckbox)
      })

      await waitFor(() => {
        expect(screen.getByText('Beta Issue')).toBeInTheDocument()
      })

      // Click Priority header to sort
      const priorityHeader = screen.getByRole('button', { name: /priority/i })
      fireEvent.click(priorityHeader)

      await waitFor(() => {
        expect(priorityHeader).toHaveClass('sorted')
      })

      // Get all rows and verify order
      const rows = screen.getAllByRole('row').slice(1) // Skip header row
      const priorities = rows.map(
        row => row.querySelector('.priority-badge')?.textContent
      )

      // Ascending order: high, medium, low
      expect(priorities).toEqual(['high', 'medium', 'low'])
    })

    it('should sort by created date descending by default', async () => {
      const mockListIssues = vi.mocked(centyClient.listIssues)
      mockListIssues.mockResolvedValue({
        issues: [
          {
            ...createMockIssue({
              issueNumber: '0001',
              displayNumber: 1,
              title: 'Older Issue',
            }),
            metadata: {
              ...createMockIssue().metadata!,
              createdAt: '2024-01-01T10:00:00Z',
            },
          },
          {
            ...createMockIssue({
              issueNumber: '0002',
              displayNumber: 2,
              title: 'Newer Issue',
            }),
            metadata: {
              ...createMockIssue().metadata!,
              createdAt: '2024-06-15T10:00:00Z',
            },
          },
        ],
        totalCount: 2,
        $typeName: 'centy.ListIssuesResponse',
        $unknown: undefined,
      })

      mockUseProject.mockReturnValue({
        projectPath: '/test/path',
        setProjectPath: vi.fn(),
        isInitialized: true,
        setIsInitialized: vi.fn(),
      })

      renderComponent()

      await waitFor(() => {
        expect(screen.getByText('Older Issue')).toBeInTheDocument()
      })

      // Created header should be sorted by default (descending - newest first)
      const createdHeader = screen.getByRole('button', { name: /created/i })
      expect(createdHeader).toHaveClass('sorted')

      // Verify the descending sort indicator is shown
      const sortIndicator = createdHeader.querySelector('.sort-indicator')
      expect(sortIndicator?.textContent).toContain('▼')

      // Issues should be displayed with newest first (descending order)
      const rows = screen.getAllByRole('row').slice(1) // skip header row
      const titles = rows.map(
        row => row.querySelector('.issue-title-link')?.textContent
      )
      expect(titles).toEqual(['Newer Issue', 'Older Issue'])
    })

    it('should handle P1/P2/P3 priority format', async () => {
      const mockListIssues = vi.mocked(centyClient.listIssues)
      mockListIssues.mockResolvedValue({
        issues: [
          createMockIssue({
            issueNumber: '0001',
            displayNumber: 1,
            title: 'P1 Issue',
            priorityLabel: 'P1',
          }),
        ],
        totalCount: 1,
        $typeName: 'centy.ListIssuesResponse',
        $unknown: undefined,
      })

      mockUseProject.mockReturnValue({
        projectPath: '/test/path',
        setProjectPath: vi.fn(),
        isInitialized: true,
        setIsInitialized: vi.fn(),
      })

      renderComponent()

      await waitFor(() => {
        const priorityBadge = screen.getByText('P1')
        expect(priorityBadge).toHaveClass('priority-high')
      })
    })
  })
})
