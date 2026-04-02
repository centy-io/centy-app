import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LinkSection } from '.'
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

const emptyLinksResponse = {
  links: [],
  totalCount: 0,
  $typeName: 'centy.v1.ListLinksResponse' as const,
  $unknown: undefined,
  success: true,
  error: '',
}

describe('LinkSection - Add link button', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUsePathContext.mockReturnValue({ projectPath: '/test/project' })
  })

  it('should show Add Link button when editable', async () => {
    vi.mocked(centyClient.listLinks).mockResolvedValue(emptyLinksResponse)

    render(
      <LinkSection entityId="entity-1" entityType="issue" editable={true} />
    )

    await waitFor(() => {
      expect(screen.getByText('+ Add Link')).toBeInTheDocument()
    })
  })

  it('should hide Add Link button when not editable', async () => {
    vi.mocked(centyClient.listLinks).mockResolvedValue(emptyLinksResponse)

    render(
      <LinkSection entityId="entity-1" entityType="issue" editable={false} />
    )

    await waitFor(() => {
      expect(screen.queryByText('+ Add Link')).not.toBeInTheDocument()
    })
  })

  it('should open AddLinkModal when clicking Add Link button', async () => {
    vi.mocked(centyClient.listLinks).mockResolvedValue(emptyLinksResponse)

    render(<LinkSection entityId="entity-1" entityType="issue" />)

    await waitFor(() => {
      expect(screen.getByText('+ Add Link')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('+ Add Link'))

    expect(screen.getByTestId('add-link-modal')).toBeInTheDocument()
  })
})
