import type { PinnedItemsState } from './usePinnedItems.types'
import { DEFAULT_STATE } from './usePinnedItems.types'

export function getServerSnapshot(): PinnedItemsState {
  return DEFAULT_STATE
}
