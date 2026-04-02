import { useState, useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  UpdateItemRequestSchema,
  DeleteItemRequestSchema,
  type GenericItem,
} from '@/gen/centy_pb'
import { callItemApi } from '@/lib/callItemApi'

export function useUpdateComment(
  projectPath: string,
  comments: GenericItem[],
  setComments: React.Dispatch<React.SetStateAction<GenericItem[]>>,
  setError: (e: string | null) => void
): {
  savingId: string | null
  updateComment: (commentId: string, body: string) => Promise<void>
} {
  const [savingId, setSavingId] = useState<string | null>(null)

  const updateComment = useCallback(
    async (commentId: string, body: string) => {
      if (!projectPath || !body.trim()) return
      const existing = comments.find(c => c.id === commentId)
      const meta = existing ? existing.metadata : null
      const existingFields =
        meta && meta.customFields ? { ...meta.customFields } : {}
      const res = await callItemApi(
        () =>
          centyClient.updateItem(
            create(UpdateItemRequestSchema, {
              projectPath,
              itemType: 'comments',
              itemId: commentId,
              body: body.trim(),
              customFields: existingFields,
            })
          ),
        (v: boolean) => setSavingId(v ? commentId : null),
        setError
      )
      if (res && res.success && res.item) {
        setComments(prev => prev.map(c => (c.id === commentId ? res.item! : c)))
      } else if (res) {
        setError(res.error || 'Failed to update comment')
      }
    },
    [projectPath, comments, setComments, setError]
  )

  return { savingId, updateComment }
}

export function useDeleteComment(
  projectPath: string,
  setComments: React.Dispatch<React.SetStateAction<GenericItem[]>>,
  setError: (e: string | null) => void
): {
  deletingId: string | null
  deleteComment: (commentId: string) => Promise<void>
} {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const deleteComment = useCallback(
    async (commentId: string) => {
      if (!projectPath) return
      const res = await callItemApi(
        () =>
          centyClient.deleteItem(
            create(DeleteItemRequestSchema, {
              projectPath,
              itemType: 'comments',
              itemId: commentId,
            })
          ),
        (v: boolean) => setDeletingId(v ? commentId : null),
        setError
      )
      if (res && res.success) {
        setComments(prev => prev.filter(c => c.id !== commentId))
      } else if (res) {
        setError(res.error || 'Failed to delete comment')
      }
    },
    [projectPath, setComments, setError]
  )

  return { deletingId, deleteComment }
}
