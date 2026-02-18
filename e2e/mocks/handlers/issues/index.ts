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
  options: IssueHandlerOptions = {}
): GrpcMocker {
  const issues = options.issues !== undefined ? options.issues : [...mockIssues]
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
    options,
    () => nextDisplayNumber++
  )
  addUpdateIssueHandler(mocker, issues, manifest, options)
  addDeleteIssueHandler(mocker, issues, manifest, options)

  return mocker
}
