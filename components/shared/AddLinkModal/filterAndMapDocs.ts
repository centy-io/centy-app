import type { EntityItem } from './EntityItem'
import type { Doc, Link as LinkType } from '@/gen/centy_pb'

export function filterAndMapDocs(
  docs: Doc[],
  entityId: string,
  existingLinks: LinkType[],
  selectedLinkType: string,
  searchQuery: string
): EntityItem[] {
  return docs
    .filter((d: Doc) => d.slug !== entityId)
    .filter(
      (d: Doc) =>
        !existingLinks.some(
          (l: LinkType) =>
            l.targetId === d.slug && l.linkType === selectedLinkType
        )
    )
    .filter(
      (d: Doc) =>
        !searchQuery ||
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.slug.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((d: Doc) => ({
      id: d.slug,
      title: d.title,
      type: 'doc' as const,
    }))
}
