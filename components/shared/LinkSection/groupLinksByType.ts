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
