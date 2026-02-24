import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListLinksRequestSchema,
  LinkTargetType,
  type Link as LinkType,
} from '@/gen/centy_pb'

interface FetchLinksSetters {
  setLinks: (links: LinkType[]) => void
  setLoading: (v: boolean) => void
  setError: (e: string | null) => void
}

function toProto(t: 'issue' | 'doc') {
  return t === 'issue' ? LinkTargetType.ISSUE : LinkTargetType.DOC
}

export async function fetchLinks(
  projectPath: string,
  entityId: string,
  entityType: 'issue' | 'doc',
  setters: FetchLinksSetters
) {
  if (!projectPath || !entityId) return
  setters.setLoading(true)
  setters.setError(null)
  try {
    const req = create(ListLinksRequestSchema, {
      projectPath,
      entityId,
      entityType: toProto(entityType),
    })
    const res = await centyClient.listLinks(req)
    setters.setLinks(res.links)
  } catch (err) {
    setters.setError(
      err instanceof Error ? err.message : 'Failed to load links'
    )
  } finally {
    setters.setLoading(false)
  }
}
