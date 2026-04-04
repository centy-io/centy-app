import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useLinkTypes } from './useLinkTypes'
import { createMockLinkTypeInfo } from './AddLinkModal.spec-utils'
import { centyClient } from '@/lib/grpc/client'

vi.mock('@/lib/grpc/client', () => ({
  centyClient: {
    getAvailableLinkTypes: vi.fn(),
  },
}))

describe('useLinkTypes', () => {
  it('loads and exposes link types', async () => {
    vi.mocked(centyClient.getAvailableLinkTypes).mockResolvedValue({
      linkTypes: [createMockLinkTypeInfo('blocks', 'Blocks another')],
      $typeName: 'centy.v1.GetAvailableLinkTypesResponse',
      $unknown: undefined,
    })

    const { result } = renderHook(() => useLinkTypes('/project', false, ''))

    await waitFor(() => {
      expect(result.current.linkTypes).toHaveLength(1)
    })
    expect(result.current.selectedLinkType).toBe('blocks')
    expect(result.current.loadingTypes).toBe(false)
  })

  it('keeps initial link type in edit mode', async () => {
    vi.mocked(centyClient.getAvailableLinkTypes).mockResolvedValue({
      linkTypes: [createMockLinkTypeInfo('related-to', 'Related')],
      $typeName: 'centy.v1.GetAvailableLinkTypesResponse',
      $unknown: undefined,
    })

    const { result } = renderHook(() =>
      useLinkTypes('/project', true, 'blocks')
    )

    await waitFor(() => {
      expect(result.current.linkTypes).toHaveLength(1)
    })
    expect(result.current.selectedLinkType).toBe('blocks')
  })
})
