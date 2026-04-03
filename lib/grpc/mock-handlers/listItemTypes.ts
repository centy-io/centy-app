'use client'

export function listItemTypes(): Promise<{
  success: boolean
  error: string
  itemTypes: {
    name: string
    plural: string
    identifier: string
    statuses: string[]
    listed: boolean
  }[]
  totalCount: number
}> {
  return Promise.resolve({
    success: true,
    error: '',
    itemTypes: [
      {
        name: 'Issues',
        plural: 'issues',
        identifier: 'uuid',
        statuses: ['open', 'in-progress', 'for-validation', 'closed'],
        listed: true,
      },
      {
        name: 'Docs',
        plural: 'docs',
        identifier: 'slug',
        statuses: [],
        listed: true,
      },
    ],
    totalCount: 2,
  })
}
