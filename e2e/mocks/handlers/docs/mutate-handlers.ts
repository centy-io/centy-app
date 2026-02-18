import type { GrpcMocker } from '../../../utils/mock-grpc'
import type { Doc, Manifest } from '@/gen/centy_pb'
import {
  UpdateDocRequestSchema,
  UpdateDocResponseSchema,
  DeleteDocRequestSchema,
  DeleteDocResponseSchema,
} from '@/gen/centy_pb'
import type {
  UpdateDocResponse,
  DeleteDocResponse,
  UpdateDocRequest,
} from '@/gen/centy_pb'
import type { DocHandlerOptions } from './types'

/**
 * Adds the UpdateDoc handler to the GrpcMocker.
 */
export function addUpdateDocHandler(
  mocker: GrpcMocker,
  docs: Doc[],
  manifest: Manifest,
  options: DocHandlerOptions
): void {
  mocker.addHandler(
    'UpdateDoc',
    UpdateDocRequestSchema,
    UpdateDocResponseSchema,
    (request: UpdateDocRequest): UpdateDocResponse => {
      const index = docs.findIndex(d => d.slug === request.slug)
      if (index === -1) {
        return {
          success: false,
          error: `Doc not found: ${request.slug}`,
          doc: undefined,
          manifest,
          syncResults: [],
          $typeName: 'centy.v1.UpdateDocResponse',
        }
      }

      const existing = docs[index]
      const updatedDoc = options.onUpdateDoc
        ? options.onUpdateDoc(request, existing)
        : {
            ...existing,
            slug: request.newSlug || existing.slug,
            title: request.title || existing.title,
            content: request.content || existing.content,
            metadata: {
              ...existing.metadata!,
              updatedAt: new Date().toISOString(),
            },
          }

      docs[index] = updatedDoc

      return {
        success: true,
        error: '',
        doc: updatedDoc,
        manifest,
        syncResults: [],
        $typeName: 'centy.v1.UpdateDocResponse',
      }
    }
  )
}

/**
 * Adds the DeleteDoc handler to the GrpcMocker.
 */
export function addDeleteDocHandler(
  mocker: GrpcMocker,
  docs: Doc[],
  manifest: Manifest,
  options: DocHandlerOptions
): void {
  mocker.addHandler(
    'DeleteDoc',
    DeleteDocRequestSchema,
    DeleteDocResponseSchema,
    (request: { slug: string }): DeleteDocResponse => {
      const index = docs.findIndex(d => d.slug === request.slug)
      if (index === -1) {
        return {
          success: false,
          error: `Doc not found: ${request.slug}`,
          manifest,
          $typeName: 'centy.v1.DeleteDocResponse',
        }
      }

      if (options.onDeleteDoc && !options.onDeleteDoc(request.slug)) {
        return {
          success: false,
          error: 'Delete cancelled',
          manifest,
          $typeName: 'centy.v1.DeleteDocResponse',
        }
      }

      docs.splice(index, 1)

      return {
        success: true,
        error: '',
        manifest,
        $typeName: 'centy.v1.DeleteDocResponse',
      }
    }
  )
}
