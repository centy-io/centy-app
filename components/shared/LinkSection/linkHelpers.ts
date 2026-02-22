import { LinkTargetType } from '@/gen/centy_pb'
import type { Link as LinkType } from '@/gen/centy_pb'

export function groupLinksByType(
  links: LinkType[]
): Record<string, LinkType[]> {
  const groups = new Map<string, LinkType[]>()
  for (const link of links) {
    const type = link.linkType || 'related'
    const existing = groups.get(type)
    groups.set(type, existing ? [...existing, link] : [link])
  }
  return Object.fromEntries(groups)
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
