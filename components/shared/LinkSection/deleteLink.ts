import { create } from '@bufbuild/protobuf'
import type { Dispatch, SetStateAction } from 'react'
import { centyClient } from '@/lib/grpc/client'
import {
  DeleteLinkRequestSchema,
  LinkTargetType,
  type Link as LinkType,
} from '@/gen/centy_pb'

function toProto(t: 'issue' | 'doc') {
  return t === 'issue' ? LinkTargetType.ISSUE : LinkTargetType.DOC
}

export async function deleteLink(
  projectPath: string,
  entityId: string,
  entityType: 'issue' | 'doc',
  link: LinkType,
  setDeletingLinkId: (id: string | null) => void,
  setError: (e: string | null) => void,
  setLinks: Dispatch<SetStateAction<LinkType[]>>
) {
  if (!projectPath || !entityId) return
  setDeletingLinkId(`${link.targetId}-${link.linkType}`)
  setError(null)
  try {
    const req = create(DeleteLinkRequestSchema, {
      projectPath,
      sourceId: entityId,
      sourceType: toProto(entityType),
      targetId: link.targetId,
      targetType: link.targetType,
      linkType: link.linkType,
    })
    const res = await centyClient.deleteLink(req)
    if (res.success) {
      setLinks(prev =>
        prev.filter(
          l => !(l.targetId === link.targetId && l.linkType === link.linkType)
        )
      )
    } else {
      setError(res.error || 'Failed to delete link')
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to delete link')
  } finally {
    setDeletingLinkId(null)
  }
}
