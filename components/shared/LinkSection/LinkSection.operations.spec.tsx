import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMockLink } from './LinkSection.spec-utils'
import { LinkSection } from '.'
import { centyClient } from '@/lib/grpc/client'

vi.mock('@/lib/grpc/client', () => ({
  centyClient: {
    listLinks: vi.fn(),
    deleteLink: vi.fn(),
  },
}))

const mockUsePathContext = vi.fn<() => unknown>()
vi.mock('@/components/providers/PathContextProvider', () => ({
  usePathContext: () => mockUsePathContext(),
}))

vi.mock('../AddLinkModal/index', () => ({
  AddLinkModal: vi.fn(() => (
    <div className="mock-add-link-modal" data-testid="add-link-modal" />
  )),
}))

describe('LinkSection - Link operations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUsePathContext.mockReturnValue({ projectPath: '/test/project' })
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
})
