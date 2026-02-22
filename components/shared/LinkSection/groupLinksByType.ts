import type { Link as LinkType } from '@/gen/centy_pb'

export function groupLinksByType(
  links: LinkType[]
): Record<string, LinkType[]> {
  return links.reduce<Record<string, LinkType[]>>((acc, link) => {
    const type = link.linkType || 'related'
    // eslint-disable-next-line security/detect-object-injection
    if (!acc[type]) {
      // eslint-disable-next-line security/detect-object-injection
      acc[type] = []
    }
    // eslint-disable-next-line security/detect-object-injection
    acc[type].push(link)
    return acc
  }, {})
}
