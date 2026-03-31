import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  UpdateOrganizationRequestSchema,
  type Organization,
} from '@/gen/centy_pb'

export async function performUpdateOrg(
  orgSlug: string,
  editName: string,
  editDescription: string,
  editSlug: string
): Promise<{ org: Organization } | { error: string }> {
  const res = await centyClient.updateOrganization(
    create(UpdateOrganizationRequestSchema, {
      slug: orgSlug,
      name: editName,
      description: editDescription,
      newSlug: editSlug !== orgSlug ? editSlug : undefined,
    })
  )
  if (res.success && res.organization) return { org: res.organization }
  return { error: res.error || 'Failed to update organization' }
}
