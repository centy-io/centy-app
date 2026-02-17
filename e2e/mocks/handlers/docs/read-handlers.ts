import type { GrpcMocker } from '../../../utils/mock-grpc'
import type { DocHandlerState } from './types'
import {
  ListDocsRequestSchema,
  ListDocsResponseSchema,
  GetDocRequestSchema,
  GetDocResponseSchema,
} from '@/gen/centy_pb'
import type {
  ListDocsResponse,
  GetDocResponse,
  GetDocRequest,
} from '@/gen/centy_pb'

/**
 * Adds read-only doc handlers (List, Get).
 */
export function addDocReadHandlers(
  mocker: GrpcMocker,
  state: DocHandlerState
): void {
  const { docs } = state

  // ListDocs
  mocker.addHandler(
    'ListDocs',
    ListDocsRequestSchema,
    ListDocsResponseSchema,
    (): ListDocsResponse => ({
      docs,
      totalCount: docs.length,
      success: true,
      error: '',
      $typeName: 'centy.v1.ListDocsResponse',
    })
  )

  // GetDoc
  mocker.addHandler(
    'GetDoc',
    GetDocRequestSchema,
    GetDocResponseSchema,
    (request: GetDocRequest): GetDocResponse => {
      const doc = docs.find(d => d.slug === request.slug)
      if (!doc) {
        return {
          success: false,
          error: `Doc not found: ${request.slug}`,
          $typeName: 'centy.v1.GetDocResponse',
        }
      }
      return {
        success: true,
        error: '',
        doc,
        $typeName: 'centy.v1.GetDocResponse',
      }
    }
  )
}
