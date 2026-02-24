import { pinnedItemsStoreState } from './pinnedItemsStoreState'

export function subscribe(projectPath: string, listener: () => void) {
  const store = pinnedItemsStoreState.getOrCreate(projectPath)
  store.listeners.add(listener)
  return () => store.listeners.delete(listener)
}
