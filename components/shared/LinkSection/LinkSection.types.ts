import { LinkTargetType } from '@/gen/centy_pb'

export interface LinkSectionProps {
  entityId: string
  entityType: 'issue' | 'doc'
  editable?: boolean
}

export const targetTypeToProto: Record<string, LinkTargetType> = {
  issue: LinkTargetType.ISSUE,
  doc: LinkTargetType.DOC,
}

export const protoToTargetType: Record<LinkTargetType, string> = {
  [LinkTargetType.UNSPECIFIED]: 'unknown',
  [LinkTargetType.ISSUE]: 'issue',
  [LinkTargetType.DOC]: 'doc',
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
    default:
      return '?'
  }
}
