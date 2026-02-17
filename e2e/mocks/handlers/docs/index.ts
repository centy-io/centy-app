import type { GrpcMocker } from '../../../utils/mock-grpc'
import { mockDocs } from '../../../fixtures/docs'
import type { DocHandlerOptions } from './types'
import { addDocReadHandlers } from './read-handlers'
import { addCreateDocHandler } from './create-handler'
import { addDocMutateHandlers } from './mutate-handlers'

/**
 * Adds doc-related handlers to the GrpcMocker.
 */
export function addDocHandlers(
  mocker: GrpcMocker,
  options: DocHandlerOptions = {}
): GrpcMocker {
  const docs = options.docs ?? [...mockDocs]
  const state = { docs, options }

  addDocReadHandlers(mocker, state)
  addCreateDocHandler(mocker, state)
  addDocMutateHandlers(mocker, state)

  return mocker
}

export type { DocHandlerOptions }
