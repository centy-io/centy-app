import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { UpdateLinkRequestSchema, type Link as LinkType } from '@/gen/centy_pb'

export async function updateLinkRequest(
  projectPath: string,
  link: LinkType,
  newLinkType: string
): Promise<{ success: boolean; error?: string }> {
  const request = create(UpdateLinkRequestSchema, {
    projectPath,
    linkId: link.id,
    linkType: newLinkType,
  })
  const response = await centyClient.updateLink(request)
  return { success: response.success, error: response.error }
}
