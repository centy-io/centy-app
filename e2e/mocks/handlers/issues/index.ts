import type { GrpcMocker } from '../../../utils/mock-grpc'
import { mockIssues } from '../../../fixtures/issues'
import type { IssueHandlerOptions } from './types'
import { addIssueReadHandlers } from './read-handlers'
import { addCreateIssueHandler } from './create-handler'
import { addIssueMutateHandlers } from './mutate-handlers'

/**
 * Adds issue-related handlers to the GrpcMocker.
 */
export function addIssueHandlers(
  mocker: GrpcMocker,
  options: IssueHandlerOptions = {}
): GrpcMocker {
  const issues = options.issues ?? [...mockIssues]
  const state = {
    issues,
    nextDisplayNumber: issues.length + 1,
    options,
  }

  addIssueReadHandlers(mocker, state)
  addCreateIssueHandler(mocker, state)
  addIssueMutateHandlers(mocker, state)

  return mocker
}

export type { IssueHandlerOptions }
