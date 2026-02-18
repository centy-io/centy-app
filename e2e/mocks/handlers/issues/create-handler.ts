import type { GrpcMocker } from '../../../utils/mock-grpc'
import { createMockIssue } from '../../../fixtures/issues'
import type { IssueHandlerOptions } from './types'
import type { Issue, Manifest } from '@/gen/centy_pb'
import {
  CreateIssueRequestSchema,
  CreateIssueResponseSchema,
} from '@/gen/centy_pb'
import type { CreateIssueResponse, CreateIssueRequest } from '@/gen/centy_pb'

/**
 * Adds the CreateIssue handler to the GrpcMocker.
 */
export function addCreateIssueHandler(
  mocker: GrpcMocker,
  issues: Issue[],
  manifest: Manifest,
  options: IssueHandlerOptions,
  getAndIncrementDisplayNumber: () => number
): void {
  mocker.addHandler(
    'CreateIssue',
    CreateIssueRequestSchema,
    CreateIssueResponseSchema,
    (request: CreateIssueRequest): CreateIssueResponse => {
      const displayNumber = getAndIncrementDisplayNumber()
      const newIssue = options.onCreateIssue
        ? options.onCreateIssue(request)
        : createMockIssue({
            displayNumber,
            title: request.title,
            description: request.description,
          })

      issues.push(newIssue)

      return {
        success: true,
        error: '',
        id: newIssue.id,
        displayNumber: newIssue.displayNumber,
        issueNumber: newIssue.issueNumber,
        createdFiles: [],
        manifest,
        orgDisplayNumber: 0,
        syncResults: [],
        $typeName: 'centy.v1.CreateIssueResponse',
      }
    }
  )
}
