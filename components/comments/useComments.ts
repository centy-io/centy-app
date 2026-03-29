/* eslint-disable max-lines */
import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  CreateItemRequestSchema,
  UpdateItemRequestSchema,
  DeleteItemRequestSchema,
  ListItemsRequestSchema,
  type GenericItem,
} from '@/gen/centy_pb'
import { callItemApi } from '@/components/generic/callItemApi'

// eslint-disable-next-line max-lines-per-function
export function useComments(
  projectPath: string,
  parentItemId: string,
  parentItemType: string
) {
  const [comments, setComments] = useState<GenericItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchComments = useCallback(async () => {
    if (!projectPath || !parentItemId) return
    setLoading(true)
    setError(null)
    try {
      const filter = JSON.stringify({ customFields: { item_id: parentItemId } })
      const response = await centyClient.listItems(
        create(ListItemsRequestSchema, {
          projectPath,
          itemType: 'comments',
          filter,
        })
      )
      if (response.success) {
        setComments(response.items)
      } else {
        setError(response.error || 'Failed to load comments')
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setLoading(false)
    }
  }, [projectPath, parentItemId])

  const addComment = useCallback(
    async (body: string, author: string): Promise<boolean> => {
      if (!projectPath || !body.trim()) return false
      const res = await callItemApi(
        () =>
          centyClient.createItem(
            create(CreateItemRequestSchema, {
              projectPath,
              itemType: 'comments',
              body: body.trim(),
              customFields: {
                item_id: parentItemId,
                item_type: parentItemType,
                author: author.trim(),
              },
            })
          ),
        setAdding,
        setError
      )
      if (res && res.success && res.item) {
        setComments(prev => [...prev, res.item!])
        return true
      } else if (res) {
        setError(res.error || 'Failed to add comment')
      }
      return false
    },
    [projectPath, parentItemId, parentItemType]
  )

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
    [projectPath, comments]
  )

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
    [projectPath]
  )

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  return {
    comments,
    loading,
    error,
    adding,
    savingId,
    deletingId,
    addComment,
    updateComment,
    deleteComment,
  }
}
