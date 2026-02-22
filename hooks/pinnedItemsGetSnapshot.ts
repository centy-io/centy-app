import type { PinnedItemsState } from './usePinnedItems.types'
import { pinnedItemsStoreState } from './pinnedItemsStoreState'

export function getSnapshot(projectPath: string): PinnedItemsState {
  return pinnedItemsStoreState.getOrCreate(projectPath).state
}
