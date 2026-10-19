import { create } from '@bufbuild/protobuf'
import { MENTIONS_LINK_TYPE } from './MENTIONS_LINK_TYPE'
import { centyClient } from '@/lib/grpc/client'
import {
  GetAvailableLinkTypesRequestSchema,
  GetConfigRequestSchema,
  UpdateConfigRequestSchema,
  LinkTypeDefinitionSchema,
} from '@/gen/centy_pb'

/**
 * The daemon rejects link types that are neither built in nor declared in the
 * project config (INVALID_LINK_TYPE), and `mentions` is not built in. Declare
 * it as a custom link type the first time a wiki link needs it.
 */
export async function ensureMentionsLinkType(
  projectPath: string
): Promise<void> {
  const available = await centyClient.getAvailableLinkTypes(
    create(GetAvailableLinkTypesRequestSchema, { projectPath })
  )
  if (available.linkTypes.some(t => t.name === MENTIONS_LINK_TYPE)) return

  const current = await centyClient.getConfig(
    create(GetConfigRequestSchema, { projectPath })
  )
  if (!current.config) return
  await centyClient.updateConfig(
    create(UpdateConfigRequestSchema, {
      projectPath,
      config: {
        ...current.config,
        customLinkTypes: [
          ...current.config.customLinkTypes,
          create(LinkTypeDefinitionSchema, {
            name: MENTIONS_LINK_TYPE,
            description: 'Item mentioned via a [[wiki link]]',
          }),
        ],
      },
    })
  )
}
