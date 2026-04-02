import { useState, useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { useRouter } from 'next/navigation'
import type { RouteLiteral } from 'nextjs-routes'
import { callItemApi } from '@/lib/callItemApi'
import { centyClient } from '@/lib/grpc/client'
import {
  DeleteItemRequestSchema,
  SoftDeleteItemRequestSchema,
  RestoreItemRequestSchema,
  type GenericItem,
} from '@/gen/centy_pb'

interface UseGenericItemDeleteParams {
  projectPath: string
  itemType: string
  item: GenericItem | null
  listUrl: RouteLiteral
  setError: (error: string | null) => void
  setItem?: (item: GenericItem) => void
}

export function useGenericItemDelete({
  projectPath,
  itemType,
  item,
  listUrl,
  setError,
  setItem,
}: UseGenericItemDeleteParams) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [restoring, setRestoring] = useState(false)

  const handleDelete = useCallback(async () => {
    if (!projectPath || !item) return
    const res = await callItemApi(
      () =>
        centyClient.deleteItem(
          create(DeleteItemRequestSchema, {
            projectPath,
            itemType,
            itemId: item.id,
          })
        ),
      setDeleting,
      setError
    )
    if (res && res.success) router.push(listUrl)
    else if (res) setError(res.error || 'Failed to delete')
  }, [projectPath, itemType, item, router, listUrl, setError])

  const handleSoftDelete = useCallback(async () => {
    if (!projectPath || !item) return
    const res = await callItemApi(
      () =>
        centyClient.softDeleteItem(
          create(SoftDeleteItemRequestSchema, {
            projectPath,
            itemType,
            itemId: item.id,
          })
        ),
      setDeleting,
      setError
    )
    if (res && res.success) router.push(listUrl)
    else if (res) setError(res.error || 'Failed to archive')
  }, [projectPath, itemType, item, router, listUrl, setError])

  const handleRestore = useCallback(async () => {
    if (!projectPath || !item || !setItem) return
    const res = await callItemApi(
      () =>
        centyClient.restoreItem(
          create(RestoreItemRequestSchema, {
            projectPath,
            itemType,
            itemId: item.id,
          })
        ),
      setRestoring,
      setError
    )
    if (res && res.success && res.item) setItem(res.item)
    else if (res) setError(res.error || 'Failed to restore')
  }, [projectPath, itemType, item, setItem, setError])

  return { deleting, restoring, handleDelete, handleSoftDelete, handleRestore }
}
