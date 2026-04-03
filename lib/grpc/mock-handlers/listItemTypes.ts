'use client'

export async function listItemTypes(): Promise<{
  success: boolean
  error: string
  itemTypes: {
    name: string
    plural: string
    identifier: string
    statuses: string[]
  }[]
  totalCount: number
}> {
  return {
    success: true,
    error: '',
    itemTypes: [
      {
        name: 'Issues',
        plural: 'issues',
        identifier: 'uuid',
        statuses: ['open', 'in-progress', 'for-validation', 'closed'],
      },
      { name: 'Docs', plural: 'docs', identifier: 'slug', statuses: [] },
    ],
    totalCount: 2,
  }
}
