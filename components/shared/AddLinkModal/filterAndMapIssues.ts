import type { EntityItem } from './EntityItem'
import type { Issue, Link as LinkType } from '@/gen/centy_pb'

export function filterAndMapIssues(
  issues: Issue[],
  entityId: string,
  existingLinks: LinkType[],
  selectedLinkType: string,
  searchQuery: string
): EntityItem[] {
  return issues
    .filter((i: Issue) => i.id !== entityId)
    .filter(
      (i: Issue) =>
        !existingLinks.some(
          (l: LinkType) =>
            l.targetId === i.id && l.linkType === selectedLinkType
        )
    )
    .filter(
      (i: Issue) =>
        !searchQuery ||
        i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(i.displayNumber).includes(searchQuery)
    )
    .map((i: Issue) => ({
      id: i.id,
      displayNumber: i.displayNumber,
      title: i.title,
      type: 'issue' as const,
    }))
}
