import { create } from '@bufbuild/protobuf'
import type { EntityItem } from './AddLinkModal.types'
import { filterAndMap } from './filterAndMap'
import { centyClient } from '@/lib/grpc/client'
import { ListItemsRequestSchema, type Link as LinkType } from '@/gen/centy_pb'

export async function fetchEntities(
  projectPath: string,
  entityId: string,
  existingLinks: LinkType[],
  selectedLinkType: string,
  query: string
): Promise<EntityItem[]> {
  const request = create(ListItemsRequestSchema, {
    projectPath,
    itemType: '',
  })
  const response = await centyClient.listItems(request)
  return filterAndMap(
    response.items,
    entityId,
    existingLinks,
    selectedLinkType,
    query
  )
}
