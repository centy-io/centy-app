import { create } from '@bufbuild/protobuf'
import { toLinkTargetType } from './toLinkTargetType'
import { centyClient } from '@/lib/grpc/client'
import { DeleteLinkRequestSchema, type Link as LinkType } from '@/gen/centy_pb'

export async function deleteLinkRequest(
  projectPath: string,
  entityId: string,
  entityType: 'issue' | 'doc',
  link: LinkType
): Promise<{ success: boolean; error?: string }> {
  const request = create(DeleteLinkRequestSchema, {
    projectPath,
    sourceId: entityId,
    sourceType: toLinkTargetType(entityType),
    targetId: link.targetId,
    targetType: link.targetType,
    linkType: link.linkType,
  })
  const response = await centyClient.deleteLink(request)
  return { success: response.success, error: response.error }
}
