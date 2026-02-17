import type { Dispatch, SetStateAction } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { DeleteDocRequestSchema } from '@/gen/centy_pb'
import type { RouteLiteral } from 'nextjs-routes'
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

interface DeleteDocParams {
  projectPath: string
  slug: string
  setError: Dispatch<SetStateAction<string | null>>
  setDeleting: (v: boolean) => void
  setShowDeleteConfirm: (v: boolean) => void
  router: AppRouterInstance
  docsListUrl: RouteLiteral
}

export async function deleteDoc(params: DeleteDocParams) {
  const {
    projectPath,
    slug,
    setError,
    setDeleting,
    setShowDeleteConfirm,
    router,
    docsListUrl,
  } = params
  setDeleting(true)
  setError(null)
  try {
    const request = create(DeleteDocRequestSchema, { projectPath, slug })
    const response = await centyClient.deleteDoc(request)
    if (response.success) {
      router.push(docsListUrl)
    } else {
      setError(response.error || 'Failed to delete document')
      setShowDeleteConfirm(false)
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to connect to daemon')
    setShowDeleteConfirm(false)
  } finally {
    setDeleting(false)
  }
}
