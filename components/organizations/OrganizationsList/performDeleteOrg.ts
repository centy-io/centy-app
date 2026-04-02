import { create } from '@bufbuild/protobuf'
import { formatDeleteErr } from './formatDeleteErr'
import { centyClient } from '@/lib/grpc/client'
import {
  DeleteOrganizationRequestSchema,
  type Organization,
} from '@/gen/centy_pb'

interface DeleteOrgParams {
  slug: string
  cascade?: boolean
  setDeleting: (v: boolean) => void
  setDeleteError: (v: string | null) => void
  setOrganizations: (updater: (prev: Organization[]) => Organization[]) => void
  setShowDeleteConfirm: (v: string | null) => void
  setShowCascadeConfirm: (v: string | null) => void
}

export async function performDeleteOrg(params: DeleteOrgParams): Promise<void> {
  const {
    slug,
    cascade,
    setDeleting,
    setDeleteError,
    setOrganizations,
    setShowDeleteConfirm,
    setShowCascadeConfirm,
  } = params
  setDeleting(true)
  setDeleteError(null)
  try {
    const response = await centyClient.deleteOrganization(
      create(DeleteOrganizationRequestSchema, { slug, cascade })
    )
    if (response.success) {
      setOrganizations(prev => prev.filter(o => o.slug !== slug))
      if (cascade) {
        setShowCascadeConfirm(null)
      } else {
        setShowDeleteConfirm(null)
      }
    } else if (!cascade && response.error === 'ORG_HAS_PROJECTS') {
      setShowDeleteConfirm(null)
      setShowCascadeConfirm(slug)
    } else {
      setDeleteError(response.error || 'Failed to delete organization')
    }
  } catch (err) {
    setDeleteError(formatDeleteErr(err))
  } finally {
    setDeleting(false)
  }
}
