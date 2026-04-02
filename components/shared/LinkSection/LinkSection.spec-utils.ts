import { LinkTargetType, type Link as LinkType } from '@/gen/centy_pb'

export const createMockLink = (overrides?: Partial<LinkType>): LinkType =>
  ({
    targetId: 'target-123',
    targetType: LinkTargetType.ISSUE,
    linkType: 'blocks',
    ...(overrides || {}),
    $typeName: 'centy.v1.Link' as const,
    $unknown: undefined,
  }) as LinkType
