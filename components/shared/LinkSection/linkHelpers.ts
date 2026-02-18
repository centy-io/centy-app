import { LinkTargetType } from '@/gen/centy_pb'
import type { Link as LinkType } from '@/gen/centy_pb'

export function groupLinksByType(
  links: LinkType[]
): Record<string, LinkType[]> {
  return links.reduce<Record<string, LinkType[]>>((acc, link) => {
    const type = link.linkType || 'related'
    if (!acc[type]) {
      acc[type] = []
    }
    acc[type].push(link)
    return acc
  }, {})
}

export function getLinkTypeDisplay(linkType: string): string {
  return linkType
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function getTargetTypeIcon(targetType: LinkTargetType): string {
  switch (targetType) {
    case LinkTargetType.ISSUE:
      return '!'
    case LinkTargetType.DOC:
      return 'D'
    case LinkTargetType.UNSPECIFIED:
      return '?'
  }
}
