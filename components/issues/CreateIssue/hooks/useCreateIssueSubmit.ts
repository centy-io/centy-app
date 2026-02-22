import { useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import type { UseCreateIssueSubmitParams } from '../CreateIssue.types'
import { centyClient } from '@/lib/grpc/client'
import { CreateIssueRequestSchema } from '@/gen/centy_pb'
import { useCreateItemSubmit } from '@/hooks/useCreateItemSubmit'

export function useCreateIssueSubmit({
  projectPath,
  title,
  description,
  priority,
  status,
  pendingAssets,
  assetUploaderRef,
  getProjectContext,
  setLoading,
  setError,
  clearDraft,
}: UseCreateIssueSubmitParams) {
  const { submitItem, handleCancel } = useCreateItemSubmit({
    kind: 'issue',
    projectPath,
    getProjectContext,
    setLoading,
    setError,
    clearDraft,
  })

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (!title.trim()) return
      return submitItem(
        async () => {
          const request = create(CreateIssueRequestSchema, {
            projectPath: projectPath.trim(),
            title: title.trim(),
            description: description.trim(),
            priority,
            status,
          })
          const response = await centyClient.createIssue(request)
          if (
            response.success &&
            pendingAssets.length > 0 &&
            assetUploaderRef.current
          ) {
            await assetUploaderRef.current.uploadAllPending(response.id)
          }
          return response
        },
        e
      )
    },
    [
      title,
      description,
      priority,
      status,
      pendingAssets,
      assetUploaderRef,
      projectPath,
      submitItem,
    ]
  )

  return {
    handleSubmit,
    handleCancel,
  }
}
