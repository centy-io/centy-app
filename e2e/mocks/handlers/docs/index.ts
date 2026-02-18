import type { GrpcMocker } from '../../../utils/mock-grpc'
import { mockDocs } from '../../../fixtures/docs'
import { mockManifest } from '../../../fixtures/config'
import type { DocHandlerOptions } from './types'
import { addListDocsHandler, addGetDocHandler } from './read-handlers'
import { addCreateDocHandler } from './create-handler'
import { addUpdateDocHandler, addDeleteDocHandler } from './mutate-handlers'

export type { DocHandlerOptions } from './types'

/**
 * Adds doc-related handlers to the GrpcMocker.
 */
export function addDocHandlers(
  mocker: GrpcMocker,
  options?: DocHandlerOptions
): GrpcMocker {
  const resolvedOptions = options !== undefined ? options : {}
  const docs =
    resolvedOptions.docs !== undefined ? resolvedOptions.docs : [...mockDocs]
  const manifest = mockManifest

  addListDocsHandler(mocker, docs)
  addGetDocHandler(mocker, docs)
  addCreateDocHandler(mocker, docs, manifest, resolvedOptions)
  addUpdateDocHandler(mocker, docs, manifest, resolvedOptions)
  addDeleteDocHandler(mocker, docs, manifest, resolvedOptions)

  return mocker
}
