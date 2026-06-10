import { useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListLinksRequestSchema,
  CreateLinkRequestSchema,
  DeleteLinkRequestSchema,
} from '@/gen/centy_pb'
import { usePathContext } from '@/components/providers/PathContextProvider'

function extractWikiLinkIds(body: string): { itemType: string; id: string }[] {
  const matches = [...body.matchAll(/\[\[(\w+)\/([^\]]+)\]\]/g)]
  return matches.map(m => ({ itemType: m[1], id: m[2] }))
}

export function useWikiLinkSync(entityId: string, entityType: string) {
  const { projectPath } = usePathContext()

  const syncWikiLinks = useCallback(
    async (body: string) => {
      if (!projectPath || !entityId) return

      const wikiRefs = extractWikiLinkIds(body)
      const wikiIds = new Set(wikiRefs.map(r => r.id))

      const linksResponse = await centyClient.listLinks(
        create(ListLinksRequestSchema, {
          projectPath,
          entityId,
          entityItemType: entityType,
        })
      )

      const mentionLinks = linksResponse.links.filter(
        l => l.linkType === 'mentions'
      )
      const existingMentionIds = new Set(mentionLinks.map(l => l.targetId))

      // Create links for new wikilink refs
      const toCreate = wikiRefs.filter(r => !existingMentionIds.has(r.id))
      await Promise.all(
        toCreate.map(ref =>
          centyClient.createLink(
            create(CreateLinkRequestSchema, {
              projectPath,
              sourceId: entityId,
              sourceItemType: entityType,
              targetId: ref.id,
              targetItemType: ref.itemType,
              linkType: 'mentions',
            })
          )
        )
      )

      // Delete links for removed wikilink refs
      const toDelete = mentionLinks.filter(l => !wikiIds.has(l.targetId))
      await Promise.all(
        toDelete.map(link =>
          centyClient.deleteLink(
            create(DeleteLinkRequestSchema, {
              projectPath,
              linkId: link.id,
            })
          )
        )
      )
    },
    [projectPath, entityId, entityType]
  )

  return { syncWikiLinks }
}
