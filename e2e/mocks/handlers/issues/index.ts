import type { GrpcMocker } from '../../../utils/mock-grpc'
import { mockIssues } from '../../../fixtures/issues'
import { mockManifest } from '../../../fixtures/config'
import type { IssueHandlerOptions } from './types'
import { addListIssuesHandler } from './read-handlers'
import {
  addGetIssueHandler,
  addGetIssueByDisplayNumberHandler,
  addGetNextIssueNumberHandler,
} from './get-handlers'
import { addCreateIssueHandler } from './create-handler'
import { addUpdateIssueHandler } from './update-handler'
import { addDeleteIssueHandler } from './delete-handler'

export type { IssueHandlerOptions } from './types'

/**
 * Adds issue-related handlers to the GrpcMocker.
 */
export function addIssueHandlers(
  mocker: GrpcMocker,
  options?: IssueHandlerOptions
): GrpcMocker {
  const resolvedOptions = options !== undefined ? options : {}
  const issues =
    resolvedOptions.issues !== undefined
      ? resolvedOptions.issues
      : [...mockIssues]
  let nextDisplayNumber = issues.length + 1
  const manifest = mockManifest

  addListIssuesHandler(mocker, issues)
  addGetIssueHandler(mocker, issues)
  addGetIssueByDisplayNumberHandler(mocker, issues)
  addGetNextIssueNumberHandler(mocker, () => nextDisplayNumber)
  addCreateIssueHandler(
    mocker,
    issues,
    manifest,
    resolvedOptions,
    () => nextDisplayNumber++
  )
  addUpdateIssueHandler(mocker, issues, manifest, resolvedOptions)
  addDeleteIssueHandler(mocker, issues, manifest, resolvedOptions)

  return mocker
}
