import type { PinnedItemsState } from './usePinnedItems.types'
import { pinnedItemsStoreState } from './pinnedItemsStoreState'

export function updateState(
  projectPath: string,
  updater: (prev: PinnedItemsState) => PinnedItemsState
) {
  const store = pinnedItemsStoreState.getOrCreate(projectPath)
  store.state = updater(store.state)
  pinnedItemsStoreState.save(projectPath, store.state)
  store.listeners.forEach(listener => listener())
}
