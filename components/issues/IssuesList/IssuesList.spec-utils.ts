import type { GenericItem } from '@/gen/centy_pb'

export const createMockGenericItem = (overrides?: {
  id?: string
  displayNumber?: number
  title?: string
  body?: string
  status?: string
  priority?: number
  priorityLabel?: string
  hasMetadata?: boolean
}): GenericItem => {
  const o = overrides ?? {}
  return {
    id: o.id ?? '0001',
    itemType: 'issues',
    title: o.title ?? 'Test Issue',
    body: o.body ?? 'Test description',
    metadata:
      o.hasMetadata === false
        ? undefined
        : {
            displayNumber: o.displayNumber ?? 1,
            status: o.status ?? 'open',
            priority: o.priority ?? 2,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
            deletedAt: '',
            customFields: {
              priority_label: o.priorityLabel ?? 'medium',
            },
            $typeName: 'centy.v1.GenericItemMetadata' as const,
            $unknown: undefined,
          },
    $typeName: 'centy.v1.GenericItem' as const,
    $unknown: undefined,
  } as GenericItem
}

export const makeListItemsResponse = (items: GenericItem[]) => ({
  items,
  totalCount: items.length,
  $typeName: 'centy.v1.ListItemsResponse' as const,
  $unknown: undefined,
  success: true,
  error: '',
})
