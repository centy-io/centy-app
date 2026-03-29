import { useState, useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  CreateItemRequestSchema,
  ListItemsRequestSchema,
  type GenericItem,
} from '@/gen/centy_pb'
import { callItemApi } from '@/components/generic/callItemApi'

export function useFetchComments(
  projectPath: string,
  parentItemId: string,
  setComments: React.Dispatch<React.SetStateAction<GenericItem[]>>,
  setError: (e: string | null) => void
): { fetchComments: () => Promise<void>; loading: boolean } {
  const [loading, setLoading] = useState(false)

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
  }, [projectPath, parentItemId, setComments, setError])

  return { fetchComments, loading }
}

export function useAddComment(
  projectPath: string,
  parentItemId: string,
  parentItemType: string,
  setComments: React.Dispatch<React.SetStateAction<GenericItem[]>>,
  setError: (e: string | null) => void
): {
  adding: boolean
  addComment: (body: string, author: string) => Promise<boolean>
} {
  const [adding, setAdding] = useState(false)

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
    [projectPath, parentItemId, parentItemType, setComments, setError]
  )

  return { adding, addComment }
}
