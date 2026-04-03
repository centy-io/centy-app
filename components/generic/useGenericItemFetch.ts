import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { GetItemRequestSchema, type GenericItem } from '@/gen/centy_pb'

export function useGenericItemFetch(
  projectPath: string,
  itemType: string,
  itemId: string
) {
  const [item, setItem] = useState<GenericItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')
  const [editStatus, setEditStatus] = useState('')
  const [editCustomFields, setEditCustomFields] = useState<
    Record<string, string>
  >({})

  const fetchItem = useCallback(async () => {
    if (!projectPath) return
    setLoading(true)
    setError(null)
    try {
      const request = create(GetItemRequestSchema, {
        projectPath,
        itemType,
        itemId,
      })
      const response = await centyClient.getItem(request)
      if (response.item) {
        setItem(response.item)
        setEditTitle(response.item.title)
        setEditBody(response.item.body)
        const meta = response.item.metadata
        setEditStatus(meta ? meta.status : '')
        setEditCustomFields(meta ? { ...meta.customFields } : {})
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setLoading(false)
    }
  }, [projectPath, itemType, itemId])

  useEffect(() => {
    fetchItem()
  }, [fetchItem])

  return {
    item,
    setItem,
    loading,
    error,
    setError,
    editTitle,
    setEditTitle,
    editBody,
    setEditBody,
    editStatus,
    setEditStatus,
    editCustomFields,
    setEditCustomFields,
  }
}
