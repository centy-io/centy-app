import {
  LinkTargetType,
  type Link as LinkType,
  type LinkTypeInfo,
} from '@/gen/centy_pb'

export interface AddLinkModalProps {
  entityId: string
  entityType: 'issue' | 'doc'
  existingLinks: LinkType[]
  onClose: () => void
  onLinkCreated: () => void
}

export interface EntityItem {
  id: string
  displayNumber?: number
  title: string
  type: 'issue' | 'doc'
}

export function getInverseLinkType(
  linkTypes: LinkTypeInfo[],
  linkType: string
): string {
  const type = linkTypes.find(t => t.name === linkType)
  return type?.inverse || linkType
}

export const targetTypeToProto: Record<string, LinkTargetType> = {
  issue: LinkTargetType.ISSUE,
  doc: LinkTargetType.DOC,
}

export function getEntityLabel(item: EntityItem): string {
  if (item.displayNumber) {
    return `#${item.displayNumber} - ${item.title}`
  }
  return `${item.id} - ${item.title}`
}
