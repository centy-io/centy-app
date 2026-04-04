import type { EntityItem } from './EntityItem'
import type { GenericItem, Link as LinkType } from '@/gen/centy_pb'

export function filterAndMap(
  items: GenericItem[],
  entityId: string,
  existingLinks: LinkType[],
  selectedLinkType: string,
  searchQuery: string
): EntityItem[] {
  return items
    .filter(i => i.id !== entityId)
    .filter(
      i =>
        !existingLinks.some(
          l => l.targetId === i.id && l.linkType === selectedLinkType
        )
    )
    .filter(
      i =>
        !searchQuery ||
        i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(i.metadata ? i.metadata.displayNumber : '').includes(
          searchQuery
        ) ||
        i.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map(i => ({
      id: i.id,
      displayNumber:
        i.metadata && i.metadata.displayNumber
          ? i.metadata.displayNumber
          : undefined,
      title: i.title,
      type: i.itemType.endsWith('s') ? i.itemType.slice(0, -1) : i.itemType,
    }))
}
