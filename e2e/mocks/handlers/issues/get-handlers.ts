import type { GrpcMocker } from '../../../utils/mock-grpc'
import type { IssueHandlerState } from './types'
import {
  GetIssueRequestSchema,
  GetIssueResponseSchema,
  GetIssueByDisplayNumberRequestSchema,
} from '@/gen/centy_pb'
import type {
  GetIssueResponse,
  GetIssueRequest,
  GetIssueByDisplayNumberRequest,
} from '@/gen/centy_pb'

/**
 * Adds GetIssue and GetIssueByDisplayNumber handlers.
 */
export function addIssueGetHandlers(
  mocker: GrpcMocker,
  state: IssueHandlerState
): void {
  const { issues } = state

  // GetIssue
  mocker.addHandler(
    'GetIssue',
    GetIssueRequestSchema,
    GetIssueResponseSchema,
    (request: GetIssueRequest): GetIssueResponse => {
      const issue = issues.find(i => i.id === request.issueId)
      if (!issue) {
        return {
          success: false,
          error: `Issue not found: ${request.issueId}`,
          $typeName: 'centy.v1.GetIssueResponse',
        }
      }
      return {
        success: true,
        error: '',
        issue,
        $typeName: 'centy.v1.GetIssueResponse',
      }
    }
  )

  // GetIssueByDisplayNumber
  mocker.addHandler(
    'GetIssueByDisplayNumber',
    GetIssueByDisplayNumberRequestSchema,
    GetIssueResponseSchema,
    (request: GetIssueByDisplayNumberRequest): GetIssueResponse => {
      const issue = issues.find(i => i.displayNumber === request.displayNumber)
      if (!issue) {
        return {
          success: false,
          error: `Issue not found: #${request.displayNumber}`,
          $typeName: 'centy.v1.GetIssueResponse',
        }
      }
      return {
        success: true,
        error: '',
        issue,
        $typeName: 'centy.v1.GetIssueResponse',
      }
    }
  )
}
