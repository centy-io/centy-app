import { useState, useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { useRouter } from 'next/navigation'
import type { RouteLiteral } from 'nextjs-routes'
import { centyClient } from '@/lib/grpc/client'
import { DeleteItemRequestSchema, type GenericItem } from '@/gen/centy_pb'

interface UseGenericItemDeleteParams {
  projectPath: string
  itemType: string
  item: GenericItem | null
  listUrl: RouteLiteral
  setError: (error: string | null) => void
}

export function useGenericItemDelete({
  projectPath,
  itemType,
  item,
  listUrl,
  setError,
}: UseGenericItemDeleteParams) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = useCallback(async () => {
    if (!projectPath || !item) return
    setDeleting(true)
    setError(null)
    try {
      const request = create(DeleteItemRequestSchema, {
        projectPath,
        itemType,
        itemId: item.id,
      })
      const response = await centyClient.deleteItem(request)
      if (response.success) {
        router.push(listUrl)
      } else {
        setError(response.error || 'Failed to delete')
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setDeleting(false)
    }
  }, [projectPath, itemType, item, router, listUrl, setError])

  return { deleting, handleDelete }
}
