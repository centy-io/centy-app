import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LinkSection } from '.'
import { LinkTargetType, type Link as LinkType } from '@/gen/centy_pb'
import { centyClient } from '@/lib/grpc/client'

vi.mock('@/lib/grpc/client', () => ({
  centyClient: {
    listLinks: vi.fn(),
    deleteLink: vi.fn(),
  },
}))

const mockUseProject = vi.fn()
vi.mock('@/components/providers/ProjectProvider', () => ({
  useProject: () => mockUseProject(),
}))

vi.mock('../AddLinkModal/index', () => ({
  AddLinkModal: vi.fn(({ onClose, onLinkCreated }) => (
    <div data-testid="add-link-modal">
      <button onClick={onClose}>Close Modal</button>
      <button onClick={onLinkCreated}>Create Link</button>
    </div>
  )),
}))

const createMockLink = (overrides: Partial<LinkType> = {}): LinkType =>
  ({
    targetId: 'target-123',
    targetType: LinkTargetType.ISSUE,
    linkType: 'blocks',
    ...overrides,
    $typeName: 'centy.v1.Link' as const,
    $unknown: undefined,
  }) as LinkType

describe('LinkSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseProject.mockReturnValue({
      projectPath: '/test/project',
    })
  })

  it('should show loading state initially', () => {
    const mockListLinks = vi.mocked(centyClient.listLinks)
    mockListLinks.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<LinkSection entityId="entity-1" entityType="issue" />)

    expect(screen.getByText('Loading links...')).toBeInTheDocument()
  })

  it('should show empty state when no links exist', async () => {
    const mockListLinks = vi.mocked(centyClient.listLinks)
    mockListLinks.mockResolvedValue({
      links: [],
      totalCount: 0,
      $typeName: 'centy.v1.ListLinksResponse',
      $unknown: undefined,
      success: true,
      error: '',
    })

    render(<LinkSection entityId="entity-1" entityType="issue" />)

    await waitFor(() => {
      expect(screen.getByText('No linked items')).toBeInTheDocument()
    })
  })

  it('should display links grouped by type', async () => {
    const mockListLinks = vi.mocked(centyClient.listLinks)
    mockListLinks.mockResolvedValue({
      links: [
        createMockLink({ targetId: 'issue-1', linkType: 'blocks' }),
        createMockLink({ targetId: 'issue-2', linkType: 'blocks' }),
        createMockLink({
          targetId: 'doc-1',
          linkType: 'related-to',
          targetType: LinkTargetType.DOC,
        }),
      ],
      totalCount: 3,
      $typeName: 'centy.v1.ListLinksResponse',
      $unknown: undefined,
      success: true,
      error: '',
    })

    render(<LinkSection entityId="entity-1" entityType="issue" />)

    await waitFor(() => {
      expect(screen.getByText('Blocks')).toBeInTheDocument()
      expect(screen.getByText('Related To')).toBeInTheDocument()
    })
  })

  it('should show Add Link button when editable', async () => {
    const mockListLinks = vi.mocked(centyClient.listLinks)
    mockListLinks.mockResolvedValue({
      links: [],
      totalCount: 0,
      $typeName: 'centy.v1.ListLinksResponse',
      $unknown: undefined,
      success: true,
      error: '',
    })

    render(
      <LinkSection entityId="entity-1" entityType="issue" editable={true} />
    )

    await waitFor(() => {
      expect(screen.getByText('+ Add Link')).toBeInTheDocument()
    })
  })

  it('should hide Add Link button when not editable', async () => {
    const mockListLinks = vi.mocked(centyClient.listLinks)
    mockListLinks.mockResolvedValue({
      links: [],
      totalCount: 0,
      $typeName: 'centy.v1.ListLinksResponse',
      $unknown: undefined,
      success: true,
      error: '',
    })

    render(
      <LinkSection entityId="entity-1" entityType="issue" editable={false} />
    )

    await waitFor(() => {
      expect(screen.queryByText('+ Add Link')).not.toBeInTheDocument()
    })
  })

  it('should open AddLinkModal when clicking Add Link button', async () => {
    const mockListLinks = vi.mocked(centyClient.listLinks)
    mockListLinks.mockResolvedValue({
      links: [],
      totalCount: 0,
      $typeName: 'centy.v1.ListLinksResponse',
      $unknown: undefined,
      success: true,
      error: '',
    })

    render(<LinkSection entityId="entity-1" entityType="issue" />)

    await waitFor(() => {
      expect(screen.getByText('+ Add Link')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('+ Add Link'))

    expect(screen.getByTestId('add-link-modal')).toBeInTheDocument()
  })

  it('should close modal and refresh when link is created', async () => {
    const mockListLinks = vi.mocked(centyClient.listLinks)
    mockListLinks.mockResolvedValue({
      links: [],
      totalCount: 0,
      $typeName: 'centy.v1.ListLinksResponse',
      $unknown: undefined,
      success: true,
      error: '',
    })

    render(<LinkSection entityId="entity-1" entityType="issue" />)

    await waitFor(() => {
      expect(screen.getByText('+ Add Link')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('+ Add Link'))
    expect(screen.getByTestId('add-link-modal')).toBeInTheDocument()

    mockListLinks.mockClear()
    fireEvent.click(screen.getByText('Create Link'))

    await waitFor(() => {
      expect(screen.queryByTestId('add-link-modal')).not.toBeInTheDocument()
      expect(mockListLinks).toHaveBeenCalled()
    })
  })

  it('should delete link when clicking delete button', async () => {
    const mockListLinks = vi.mocked(centyClient.listLinks)
    const mockDeleteLink = vi.mocked(centyClient.deleteLink)

    mockListLinks.mockResolvedValue({
      links: [createMockLink({ targetId: 'issue-1', linkType: 'blocks' })],
      totalCount: 1,
      $typeName: 'centy.v1.ListLinksResponse',
      $unknown: undefined,
      success: true,
      error: '',
    })

    mockDeleteLink.mockResolvedValue({
      success: true,
      error: '',
      deletedCount: 1,
      $typeName: 'centy.v1.DeleteLinkResponse',
      $unknown: undefined,
    })

    render(<LinkSection entityId="entity-1" entityType="issue" />)

    await waitFor(() => {
      expect(screen.getByText('Blocks')).toBeInTheDocument()
    })

    const deleteButton = screen.getByTitle('Remove link')
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(mockDeleteLink).toHaveBeenCalled()
    })
  })

  it('should show error message when loading fails', async () => {
    const mockListLinks = vi.mocked(centyClient.listLinks)
    mockListLinks.mockRejectedValue(new Error('Network error'))

    render(<LinkSection entityId="entity-1" entityType="issue" />)

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })
  })

  it('should show error message when delete fails', async () => {
    const mockListLinks = vi.mocked(centyClient.listLinks)
    const mockDeleteLink = vi.mocked(centyClient.deleteLink)

    mockListLinks.mockResolvedValue({
      links: [createMockLink({ targetId: 'issue-1', linkType: 'blocks' })],
      totalCount: 1,
      $typeName: 'centy.v1.ListLinksResponse',
      $unknown: undefined,
      success: true,
      error: '',
    })

    mockDeleteLink.mockResolvedValue({
      success: false,
      error: 'Cannot delete link',
      deletedCount: 0,
      $typeName: 'centy.v1.DeleteLinkResponse',
      $unknown: undefined,
    })

    render(<LinkSection entityId="entity-1" entityType="issue" />)

    await waitFor(() => {
      expect(screen.getByText('Blocks')).toBeInTheDocument()
    })

    const deleteButton = screen.getByTitle('Remove link')
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(screen.getByText('Cannot delete link')).toBeInTheDocument()
    })
  })

  it('should display correct icons for different target types', async () => {
    const mockListLinks = vi.mocked(centyClient.listLinks)
    mockListLinks.mockResolvedValue({
      links: [
        createMockLink({
          targetId: 'issue-1',
          targetType: LinkTargetType.ISSUE,
          linkType: 'related',
        }),
        createMockLink({
          targetId: 'doc-1',
          targetType: LinkTargetType.DOC,
          linkType: 'related',
        }),
      ],
      totalCount: 2,
      $typeName: 'centy.v1.ListLinksResponse',
      $unknown: undefined,
      success: true,
      error: '',
    })

    render(<LinkSection entityId="entity-1" entityType="issue" />)

    await waitFor(() => {
      expect(screen.getByText('!')).toBeInTheDocument() // Issue icon
      expect(screen.getByText('D')).toBeInTheDocument() // Doc icon
    })
  })

  it('should not fetch links when projectPath is empty', async () => {
    mockUseProject.mockReturnValue({
      projectPath: '',
    })

    const mockListLinks = vi.mocked(centyClient.listLinks)

    render(<LinkSection entityId="entity-1" entityType="issue" />)

    await waitFor(() => {
      expect(mockListLinks).not.toHaveBeenCalled()
    })
  })

  it('should not fetch links when entityId is empty', async () => {
    const mockListLinks = vi.mocked(centyClient.listLinks)

    render(<LinkSection entityId="" entityType="issue" />)

    await waitFor(() => {
      expect(mockListLinks).not.toHaveBeenCalled()
    })
  })

  it('should hide delete buttons when not editable', async () => {
    const mockListLinks = vi.mocked(centyClient.listLinks)
    mockListLinks.mockResolvedValue({
      links: [createMockLink({ targetId: 'issue-1', linkType: 'blocks' })],
      totalCount: 1,
      $typeName: 'centy.v1.ListLinksResponse',
      $unknown: undefined,
      success: true,
      error: '',
    })

    render(
      <LinkSection entityId="entity-1" entityType="issue" editable={false} />
    )

    await waitFor(() => {
      expect(screen.getByText('Blocks')).toBeInTheDocument()
      expect(screen.queryByTitle('Remove link')).not.toBeInTheDocument()
    })
  })
})
