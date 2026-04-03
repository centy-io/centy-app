import type { EntityItem } from './EntityItem'
import type { GenericItem, Link as LinkType } from '@/gen/centy_pb'

export function filterAndMapDocs(
  docs: GenericItem[],
  entityId: string,
  existingLinks: LinkType[],
  selectedLinkType: string,
  searchQuery: string
): EntityItem[] {
  return docs
    .filter((d: GenericItem) => d.id !== entityId)
    .filter(
      (d: GenericItem) =>
        !existingLinks.some(
          (l: LinkType) =>
            l.targetId === d.id && l.linkType === selectedLinkType
        )
    )
    .filter(
      (d: GenericItem) =>
        !searchQuery ||
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((d: GenericItem) => ({
      id: d.id,
      title: d.title,
      type: 'doc' as const,
    }))
}
