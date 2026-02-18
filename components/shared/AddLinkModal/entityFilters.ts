import type { Issue, Doc, Link as LinkType } from '@/gen/centy_pb'
import type { EntityItem } from './AddLinkModal.types'

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
