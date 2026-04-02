import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { DeleteOrganizationRequestSchema } from '@/gen/centy_pb'

interface PerformDeleteOrgParams {
  orgSlug: string
  setDeleting: (v: boolean) => void
  setDeleteError: (v: string | null) => void
  onSuccess: () => void
}

export async function performDeleteOrganization(
  params: PerformDeleteOrgParams
): Promise<void> {
  const { orgSlug, setDeleting, setDeleteError, onSuccess } = params
  setDeleting(true)
  setDeleteError(null)
  try {
    const res = await centyClient.deleteOrganization(
      create(DeleteOrganizationRequestSchema, { slug: orgSlug })
    )
    if (res.success) {
      onSuccess()
    } else {
      setDeleteError(res.error || 'Failed to delete organization')
    }
  } catch (err) {
    setDeleteError(
      err instanceof Error ? err.message : 'Failed to connect to daemon'
    )
  } finally {
    setDeleting(false)
  }
}
