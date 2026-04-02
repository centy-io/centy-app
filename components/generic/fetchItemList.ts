import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { ListItemsRequestSchema, type GenericItem } from '@/gen/centy_pb'

export async function fetchItemList(
  projectPath: string,
  itemType: string
): Promise<{ items: GenericItem[]; error: string | null }> {
  try {
    const response = await centyClient.listItems(
      create(ListItemsRequestSchema, {
        projectPath: projectPath.trim(),
        itemType,
      })
    )
    return { items: response.items, error: null }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to connect to daemon'
    return { items: [], error: message }
  }
}
