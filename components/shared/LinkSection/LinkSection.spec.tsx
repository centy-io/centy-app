import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMockLink } from './LinkSection.spec-utils'
import { LinkSection } from '.'
import { LinkTargetType } from '@/gen/centy_pb'
import { centyClient } from '@/lib/grpc/client'

vi.mock('@/lib/grpc/client', () => ({
  centyClient: {
    listLinks: vi.fn(),
    deleteLink: vi.fn(),
  },
}))

const mockUsePathContext = vi.fn()
vi.mock('@/components/providers/PathContextProvider', () => ({
  usePathContext: () => mockUsePathContext(),
}))

vi.mock('../AddLinkModal/index', () => ({
  AddLinkModal: vi.fn(({ onClose, onLinkCreated }) => (
    <div className="mock-add-link-modal" data-testid="add-link-modal">
      <button className="mock-close-btn" onClick={onClose}>
        Close Modal
      </button>
      <button className="mock-create-btn" onClick={onLinkCreated}>
        Create Link
      </button>
    </div>
  )),
}))

describe('LinkSection - Initial state', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUsePathContext.mockReturnValue({ projectPath: '/test/project' })
  })

  it('should show loading state initially', () => {
    vi.mocked(centyClient.listLinks).mockImplementation(
      () => new Promise(() => {})
    )

    render(<LinkSection entityId="entity-1" entityType="issue" />)

    expect(screen.getByText('Loading links...')).toBeInTheDocument()
  })

  it('should show empty state when no links exist', async () => {
    vi.mocked(centyClient.listLinks).mockResolvedValue({
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
    vi.mocked(centyClient.listLinks).mockResolvedValue({
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
})
