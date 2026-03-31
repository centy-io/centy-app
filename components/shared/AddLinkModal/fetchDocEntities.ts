import { create } from '@bufbuild/protobuf'
import type { EntityItem } from './AddLinkModal.types'
import { filterAndMapDocs } from './filterAndMapDocs'
import { centyClient } from '@/lib/grpc/client'
import { ListItemsRequestSchema, type Link as LinkType } from '@/gen/centy_pb'
import { genericItemToDoc } from '@/lib/genericItemToDoc'

export async function fetchDocEntities(
  projectPath: string,
  entityId: string,
  existingLinks: LinkType[],
  selectedLinkType: string,
  query: string
): Promise<EntityItem[]> {
  const request = create(ListItemsRequestSchema, {
    projectPath,
    itemType: 'docs',
  })
  const response = await centyClient.listItems(request)
  return filterAndMapDocs(
    response.items.map(genericItemToDoc),
    entityId,
    existingLinks,
    selectedLinkType,
    query
  )
}
