export interface PinnedItem {
  id: string
  type: 'issue' | 'doc'
  title: string
  displayNumber?: number
  pinnedAt: number
}
