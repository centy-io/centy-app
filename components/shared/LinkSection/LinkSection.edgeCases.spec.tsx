import { render, screen, waitFor } from '@testing-library/react'
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

const mockUsePathContext = vi.fn()
vi.mock('@/components/providers/PathContextProvider', () => ({
  usePathContext: () => mockUsePathContext(),
}))

vi.mock('../AddLinkModal/index', () => ({
  AddLinkModal: vi.fn(() => (
    <div className="mock-add-link-modal" data-testid="add-link-modal" />
  )),
}))

describe('LinkSection - Edge cases', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUsePathContext.mockReturnValue({ projectPath: '/test/project' })
  })

  it('should not fetch links when projectPath is empty', async () => {
    mockUsePathContext.mockReturnValue({ projectPath: '' })
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
    vi.mocked(centyClient.listLinks).mockResolvedValue({
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
