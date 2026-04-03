import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { DeleteLinkRequestSchema, type Link as LinkType } from '@/gen/centy_pb'

export async function deleteLinkRequest(
  projectPath: string,
  link: LinkType
): Promise<{ success: boolean; error?: string }> {
  const request = create(DeleteLinkRequestSchema, {
    projectPath,
    linkId: link.id,
  })
  const response = await centyClient.deleteLink(request)
  return { success: response.success, error: response.error }
}
