import { create } from '@bufbuild/protobuf'
import { callItemApi } from '@/lib/callItemApi'
import { centyClient } from '@/lib/grpc/client'
import { SoftDeleteItemRequestSchema } from '@/gen/centy_pb'

export async function softDeleteListItem(
  projectPath: string,
  itemType: string,
  itemId: string,
  setDeleting: (v: boolean) => void,
  setError: (v: string | null) => void
): Promise<boolean> {
  const res = await callItemApi(
    () =>
      centyClient.softDeleteItem(
        create(SoftDeleteItemRequestSchema, { projectPath, itemType, itemId })
      ),
    setDeleting,
    setError
  )
  if (res && res.success) return true
  if (res) setError(res.error || 'Failed to archive item')
  return false
}
