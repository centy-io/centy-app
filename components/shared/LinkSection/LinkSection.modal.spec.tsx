import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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

beforeEach(() => {
  vi.clearAllMocks()
  mockUsePathContext.mockReturnValue({ projectPath: '/test/project' })
})

describe('LinkSection - Modal refresh', () => {
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
})

describe('LinkSection - Target type icons', () => {
  it('should display correct icons for different target types', async () => {
    vi.mocked(centyClient.listLinks).mockResolvedValue({
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
      expect(screen.getByText('!')).toBeInTheDocument()
      expect(screen.getByText('D')).toBeInTheDocument()
    })
  })
})
