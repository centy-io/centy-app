import type { GrpcMocker } from '../../utils/mock-grpc'
import { createMockDoc, mockDocs } from '../../fixtures/docs'
import { mockManifest } from '../../fixtures/config'
import {
  ListDocsRequestSchema,
  ListDocsResponseSchema,
  GetDocRequestSchema,
  GetDocResponseSchema,
  CreateDocRequestSchema,
  CreateDocResponseSchema,
  UpdateDocRequestSchema,
  UpdateDocResponseSchema,
  DeleteDocRequestSchema,
  DeleteDocResponseSchema,
} from '@/gen/centy_pb'
import type {
  Doc,
  ListDocsResponse,
  GetDocResponse,
  CreateDocResponse,
  UpdateDocResponse,
  DeleteDocResponse,
  GetDocRequest,
  CreateDocRequest,
  UpdateDocRequest,
} from '@/gen/centy_pb'

export interface DocHandlerOptions {
  docs?: Doc[]
  onCreateDoc?: (request: CreateDocRequest) => Doc
  onUpdateDoc?: (request: UpdateDocRequest, existing: Doc) => Doc
  onDeleteDoc?: (slug: string) => boolean
}

function makeGetDocHandler(docs: Doc[]) {
  return (request: GetDocRequest): GetDocResponse => {
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
}

function makeCreateDocHandler(docs: Doc[], options: DocHandlerOptions) {
  return (request: CreateDocRequest): CreateDocResponse => {
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
}

function makeUpdateDocHandler(docs: Doc[], options: DocHandlerOptions) {
  return (request: UpdateDocRequest): UpdateDocResponse => {
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
}

function makeDeleteDocHandler(docs: Doc[], options: DocHandlerOptions) {
  return (request: { slug: string }): DeleteDocResponse => {
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
}

export function addDocHandlers(
  mocker: GrpcMocker,
  options: DocHandlerOptions = {}
): GrpcMocker {
  const docs = options.docs !== undefined ? options.docs : [...mockDocs]

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

  mocker.addHandler(
    'GetDoc',
    GetDocRequestSchema,
    GetDocResponseSchema,
    makeGetDocHandler(docs)
  )
  mocker.addHandler(
    'CreateDoc',
    CreateDocRequestSchema,
    CreateDocResponseSchema,
    makeCreateDocHandler(docs, options)
  )
  mocker.addHandler(
    'UpdateDoc',
    UpdateDocRequestSchema,
    UpdateDocResponseSchema,
    makeUpdateDocHandler(docs, options)
  )
  mocker.addHandler(
    'DeleteDoc',
    DeleteDocRequestSchema,
    DeleteDocResponseSchema,
    makeDeleteDocHandler(docs, options)
  )

  return mocker
}
