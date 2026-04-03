import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchLatestDaemonVersion } from './fetchLatestDaemonVersion'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

function mockOkResponse(body: string) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    text: () => body,
  })
}

describe('fetchLatestDaemonVersion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the version string from the release tag', async () => {
    mockOkResponse(JSON.stringify({ tag_name: 'v0.4.0' }))

    const result = await fetchLatestDaemonVersion()
    expect(result).toBe('0.4.0')
  })

  it('strips the v prefix from tag_name', async () => {
    mockOkResponse(JSON.stringify({ tag_name: 'v1.2.3' }))

    const result = await fetchLatestDaemonVersion()
    expect(result).toBe('1.2.3')
  })

  it('returns null when response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false })

    const result = await fetchLatestDaemonVersion()
    expect(result).toBeNull()
  })

  it('returns null when tag_name is missing', async () => {
    mockOkResponse(JSON.stringify({}))

    const result = await fetchLatestDaemonVersion()
    expect(result).toBeNull()
  })

  it('returns null when fetch throws', async () => {
    mockFetch.mockRejectedValueOnce(new Error())

    const result = await fetchLatestDaemonVersion()
    expect(result).toBeNull()
  })
})
