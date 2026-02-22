import { LinkTargetType } from '@/gen/centy_pb'

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
