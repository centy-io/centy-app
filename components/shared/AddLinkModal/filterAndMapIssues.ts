import type { EntityItem } from './EntityItem'
import type { GenericItem, Link as LinkType } from '@/gen/centy_pb'

export function filterAndMapIssues(
  issues: GenericItem[],
  entityId: string,
  existingLinks: LinkType[],
  selectedLinkType: string,
  searchQuery: string
): EntityItem[] {
  return issues
    .filter((i: GenericItem) => i.id !== entityId)
    .filter(
      (i: GenericItem) =>
        !existingLinks.some(
          (l: LinkType) =>
            l.targetId === i.id && l.linkType === selectedLinkType
        )
    )
    .filter(
      (i: GenericItem) =>
        !searchQuery ||
        i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(i.metadata ? i.metadata.displayNumber : '').includes(searchQuery)
    )
    .map((i: GenericItem) => ({
      id: i.id,
      displayNumber: i.metadata ? i.metadata.displayNumber : 0,
      title: i.title,
      type: 'issue' as const,
    }))
}
