import { LinkTargetType } from '@/gen/centy_pb'

export interface LinkSectionProps {
  entityId: string
  entityType: 'issue' | 'doc'
  /** Whether the user can add/remove links (edit mode) */
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
