import type { GrpcMocker } from '../../../utils/mock-grpc'
import type { Doc } from '@/gen/centy_pb'
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
 * Adds the ListDocs handler to the GrpcMocker.
 */
export function addListDocsHandler(mocker: GrpcMocker, docs: Doc[]): void {
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
}

/**
 * Adds the GetDoc handler to the GrpcMocker.
 */
export function addGetDocHandler(mocker: GrpcMocker, docs: Doc[]): void {
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
