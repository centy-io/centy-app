import { create } from '@bufbuild/protobuf'
import { callItemApi } from '@/lib/callItemApi'
import { centyClient } from '@/lib/grpc/client'
import { DeleteItemRequestSchema } from '@/gen/centy_pb'

export async function deleteListItem(
  projectPath: string,
  itemType: string,
  itemId: string,
  setDeleting: (v: boolean) => void,
  setError: (v: string | null) => void
): Promise<boolean> {
  const res = await callItemApi(
    () =>
      centyClient.deleteItem(
        create(DeleteItemRequestSchema, { projectPath, itemType, itemId })
      ),
    setDeleting,
    setError
  )
  if (res && res.success) return true
  if (res) setError(res.error || 'Failed to delete item')
  return false
}
