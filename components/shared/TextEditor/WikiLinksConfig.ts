import type { WikiLinkItem } from './extensions/WikiLink/WikiLinkItem'

export interface WikiLinksConfig {
  fetchItems: (query: string) => Promise<WikiLinkItem[]>
}
