import type { GrpcMocker } from '../../../utils/mock-grpc'
import type { DocHandlerState } from './types'
import { mockManifest } from '../../../fixtures/config'
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

/**
 * Adds UpdateDoc and DeleteDoc handlers.
 */
export function addDocMutateHandlers(
  mocker: GrpcMocker,
  state: DocHandlerState
): void {
  const { docs, options } = state

  // UpdateDoc
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
          manifest: mockManifest,
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
        manifest: mockManifest,
        syncResults: [],
        $typeName: 'centy.v1.UpdateDocResponse',
      }
    }
  )

  // DeleteDoc
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
          manifest: mockManifest,
          $typeName: 'centy.v1.DeleteDocResponse',
        }
      }

      if (options.onDeleteDoc && !options.onDeleteDoc(request.slug)) {
        return {
          success: false,
          error: 'Delete cancelled',
          manifest: mockManifest,
          $typeName: 'centy.v1.DeleteDocResponse',
        }
      }

      docs.splice(index, 1)

      return {
        success: true,
        error: '',
        manifest: mockManifest,
        $typeName: 'centy.v1.DeleteDocResponse',
      }
    }
  )
}
