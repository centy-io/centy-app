import type { GrpcMocker } from '../../../utils/mock-grpc'
import type { IssueHandlerState } from './types'
import { createMockIssue } from '../../../fixtures/issues'
import { mockManifest } from '../../../fixtures/config'
import {
  CreateIssueRequestSchema,
  CreateIssueResponseSchema,
} from '@/gen/centy_pb'
import type { CreateIssueResponse, CreateIssueRequest } from '@/gen/centy_pb'

/**
 * Adds the CreateIssue handler.
 */
export function addCreateIssueHandler(
  mocker: GrpcMocker,
  state: IssueHandlerState
): void {
  const { issues, options } = state

  mocker.addHandler(
    'CreateIssue',
    CreateIssueRequestSchema,
    CreateIssueResponseSchema,
    (request: CreateIssueRequest): CreateIssueResponse => {
      const newIssue = options.onCreateIssue
        ? options.onCreateIssue(request)
        : createMockIssue({
            displayNumber: state.nextDisplayNumber,
            title: request.title,
            description: request.description,
          })

      issues.push(newIssue)
      state.nextDisplayNumber++

      return {
        success: true,
        error: '',
        id: newIssue.id,
        displayNumber: newIssue.displayNumber,
        issueNumber: newIssue.issueNumber,
        createdFiles: [],
        manifest: mockManifest,
        orgDisplayNumber: 0,
        syncResults: [],
        $typeName: 'centy.v1.CreateIssueResponse',
      }
    }
  )
}
