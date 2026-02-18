import type { Doc, CreateDocRequest, UpdateDocRequest } from '@/gen/centy_pb'

export interface DocHandlerOptions {
  docs?: Doc[]
  onCreateDoc?: (request: CreateDocRequest) => Doc
  onUpdateDoc?: (request: UpdateDocRequest, existing: Doc) => Doc
  onDeleteDoc?: (slug: string) => boolean
}
