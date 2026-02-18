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
  options: DocHandlerOptions = {}
): GrpcMocker {
  const docs = options.docs !== undefined ? options.docs : [...mockDocs]
  const manifest = mockManifest

  addListDocsHandler(mocker, docs)
  addGetDocHandler(mocker, docs)
  addCreateDocHandler(mocker, docs, manifest, options)
  addUpdateDocHandler(mocker, docs, manifest, options)
  addDeleteDocHandler(mocker, docs, manifest, options)

  return mocker
}
