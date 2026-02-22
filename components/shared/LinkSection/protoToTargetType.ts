import { LinkTargetType } from '@/gen/centy_pb'

export const protoToTargetType: Record<LinkTargetType, string> = {
  [LinkTargetType.UNSPECIFIED]: 'unknown',
  [LinkTargetType.ISSUE]: 'issue',
  [LinkTargetType.DOC]: 'doc',
}
