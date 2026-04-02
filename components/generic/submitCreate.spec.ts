import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitCreate } from './submitCreate'
import { centyClient } from '@/lib/grpc/client'

vi.mock('@/lib/grpc/client', () => ({
  centyClient: {
    createItem: vi.fn(),
  },
}))

const mockCreateItem = vi.mocked(centyClient.createItem)

describe('submitCreate empty title', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does nothing when title is empty', async () => {
    const setLoading = vi.fn()
    const setError = vi.fn()
    const onSuccess = vi.fn()

    await submitCreate(
      '/project',
      'docs',
      '',
      'open',
      {},
      'Doc',
      setLoading,
      setError,
      onSuccess
    )

    expect(mockCreateItem).not.toHaveBeenCalled()
    expect(onSuccess).not.toHaveBeenCalled()
  })
})

describe('submitCreate success', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls onSuccess with item id on success', async () => {
    mockCreateItem.mockResolvedValueOnce({
      $typeName: 'centy.v1.CreateItemResponse',
      success: true,
      error: '',
      item: {
        $typeName: 'centy.v1.GenericItem',
        id: 'new-id',
        itemType: 'docs',
        title: 'Test',
        body: '',
        metadata: undefined,
      },
    })

    const setLoading = vi.fn()
    const setError = vi.fn()
    const onSuccess = vi.fn()

    await submitCreate(
      '/project',
      'docs',
      'Test',
      'open',
      {},
      'Doc',
      setLoading,
      setError,
      onSuccess
    )

    expect(onSuccess).toHaveBeenCalledWith('new-id')
  })
})

describe('submitCreate failure', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sets error when creation fails', async () => {
    mockCreateItem.mockResolvedValueOnce({
      $typeName: 'centy.v1.CreateItemResponse',
      success: false,
      error: 'Creation failed',
      item: undefined,
    })

    const setLoading = vi.fn()
    const setError = vi.fn()
    const onSuccess = vi.fn()

    await submitCreate(
      '/project',
      'docs',
      'Test',
      'open',
      {},
      'Doc',
      setLoading,
      setError,
      onSuccess
    )

    expect(setError).toHaveBeenCalledWith('Creation failed')
    expect(onSuccess).not.toHaveBeenCalled()
  })
})
