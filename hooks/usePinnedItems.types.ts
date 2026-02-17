export interface PinnedItem {
  id: string
  type: 'issue' | 'doc' | 'pr'
  title: string
  displayNumber?: number
  pinnedAt: number
}

export interface PinnedItemsState {
  items: PinnedItem[]
}

export const STORAGE_KEY_PREFIX = 'centy-pinned-items'

export const DEFAULT_STATE: PinnedItemsState = {
  items: [],
}
