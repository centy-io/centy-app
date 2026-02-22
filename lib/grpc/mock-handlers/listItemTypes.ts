'use client'

export async function listItemTypes(): Promise<{
  success: boolean
  error: string
  itemTypes: Array<{ name: string; plural: string; identifier: string }>
  totalCount: number
}> {
  return {
    success: true,
    error: '',
    itemTypes: [
      { name: 'Issues', plural: 'issues', identifier: 'uuid' },
      { name: 'Docs', plural: 'docs', identifier: 'slug' },
    ],
    totalCount: 2,
  }
}
