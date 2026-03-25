import type { LinkTypeInfo, GenericItem } from '@/gen/centy_pb'

export const createMockLinkTypeInfo = (
  name: string,
  inverse: string,
  description?: string
): LinkTypeInfo =>
  ({
    name,
    inverse,
    description: description !== undefined ? description : '',
    $typeName: 'centy.v1.LinkTypeInfo' as const,
    $unknown: undefined,
  }) as LinkTypeInfo

export const createMockGenericItem = (overrides: {
  id?: string
  itemType?: string
  title?: string
  body?: string
  displayNumber?: number
  status?: string
}): GenericItem =>
  ({
    id: overrides.id || 'item-1',
    itemType: overrides.itemType || 'issues',
    title: overrides.title || 'Test Item',
    body: overrides.body || '',
    metadata: {
      displayNumber: overrides.displayNumber || 1,
      status: overrides.status || 'open',
      priority: 2,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      deletedAt: '',
      customFields: {},
      $typeName: 'centy.v1.GenericItemMetadata' as const,
      $unknown: undefined,
    },
    $typeName: 'centy.v1.GenericItem' as const,
    $unknown: undefined,
  }) as GenericItem

export const makeListItemsResponse = (items: GenericItem[]) => ({
  items,
  totalCount: items.length,
  $typeName: 'centy.v1.ListItemsResponse' as const,
  $unknown: undefined,
  success: true,
  error: '',
})
