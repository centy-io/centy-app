import { LinkTargetType } from '@/gen/centy_pb'

export const targetTypeToProto: Record<string, LinkTargetType> = {
  issue: LinkTargetType.ISSUE,
  doc: LinkTargetType.DOC,
}
