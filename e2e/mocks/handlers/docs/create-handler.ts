import type { GrpcMocker } from '../../../utils/mock-grpc'
import type { DocHandlerState } from './types'
import { createMockDoc } from '../../../fixtures/docs'
import { mockManifest } from '../../../fixtures/config'
import { CreateDocRequestSchema, CreateDocResponseSchema } from '@/gen/centy_pb'
import type { CreateDocResponse, CreateDocRequest } from '@/gen/centy_pb'

/**
 * Adds the CreateDoc handler.
 */
export function addCreateDocHandler(
  mocker: GrpcMocker,
  state: DocHandlerState
): void {
  const { docs, options } = state

  mocker.addHandler(
    'CreateDoc',
    CreateDocRequestSchema,
    CreateDocResponseSchema,
    (request: CreateDocRequest): CreateDocResponse => {
      // Check if slug already exists
      if (docs.some(d => d.slug === request.slug)) {
        return {
          success: false,
          error: `Doc with slug "${request.slug}" already exists`,
          slug: '',
          createdFile: '',
          manifest: mockManifest,
          syncResults: [],
          $typeName: 'centy.v1.CreateDocResponse',
        }
      }

      const newDoc = options.onCreateDoc
        ? options.onCreateDoc(request)
        : createMockDoc({
            slug: request.slug,
            title: request.title,
            content: request.content,
          })

      docs.push(newDoc)

      return {
        success: true,
        error: '',
        slug: newDoc.slug,
        createdFile: `.centy/docs/${newDoc.slug}.md`,
        manifest: mockManifest,
        syncResults: [],
        $typeName: 'centy.v1.CreateDocResponse',
      }
    }
  )
}
