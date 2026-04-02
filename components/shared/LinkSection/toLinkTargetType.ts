import { LinkTargetType } from '@/gen/centy_pb'

export function toLinkTargetType(entityType: 'issue' | 'doc'): LinkTargetType {
  return entityType === 'issue' ? LinkTargetType.ISSUE : LinkTargetType.DOC
}
