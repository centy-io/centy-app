import type { Link as LinkType } from '@/gen/centy_pb'

export function removeLinkFromList(
  links: LinkType[],
  link: LinkType
): LinkType[] {
  return links.filter(
    l => !(l.targetId === link.targetId && l.linkType === link.linkType)
  )
}
