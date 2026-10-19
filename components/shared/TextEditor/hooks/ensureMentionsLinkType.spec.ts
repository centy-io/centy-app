import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ensureMentionsLinkType } from './ensureMentionsLinkType'

const { getAvailableLinkTypes, getConfig, updateConfig } = vi.hoisted(() => ({
  getAvailableLinkTypes: vi.fn(),
  getConfig: vi.fn(),
  updateConfig: vi.fn(),
}))

vi.mock('@/lib/grpc/client', () => ({
  centyClient: { getAvailableLinkTypes, getConfig, updateConfig },
}))

describe('ensureMentionsLinkType', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does nothing when mentions already exists', async () => {
    getAvailableLinkTypes.mockResolvedValue({
      linkTypes: [{ name: 'mentions' }],
    })
    await ensureMentionsLinkType('/p')
    expect(updateConfig).not.toHaveBeenCalled()
  })

  it('declares mentions as a custom link type when missing', async () => {
    getAvailableLinkTypes.mockResolvedValue({ linkTypes: [{ name: 'blocks' }] })
    getConfig.mockResolvedValue({ config: { customLinkTypes: [] } })
    await ensureMentionsLinkType('/p')
    expect(updateConfig).toHaveBeenCalledTimes(1)
    expect(JSON.stringify(updateConfig.mock.calls[0])).toContain('"mentions"')
  })
})
