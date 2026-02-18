import type { GrpcMocker } from '../../../utils/mock-grpc'
import type { Issue } from '@/gen/centy_pb'
import {
  GetIssueRequestSchema,
  GetIssueResponseSchema,
  GetIssueByDisplayNumberRequestSchema,
  GetNextIssueNumberRequestSchema,
  GetNextIssueNumberResponseSchema,
} from '@/gen/centy_pb'
import type {
  GetIssueResponse,
  GetIssueRequest,
  GetIssueByDisplayNumberRequest,
  GetNextIssueNumberResponse,
} from '@/gen/centy_pb'

/**
 * Adds the GetIssue handler to the GrpcMocker.
 */
export function addGetIssueHandler(mocker: GrpcMocker, issues: Issue[]): void {
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
}

/**
 * Adds the GetIssueByDisplayNumber handler to the GrpcMocker.
 */
export function addGetIssueByDisplayNumberHandler(
  mocker: GrpcMocker,
  issues: Issue[]
): void {
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

/**
 * Adds the GetNextIssueNumber handler to the GrpcMocker.
 */
export function addGetNextIssueNumberHandler(
  mocker: GrpcMocker,
  getNextDisplayNumber: () => number
): void {
  mocker.addHandler(
    'GetNextIssueNumber',
    GetNextIssueNumberRequestSchema,
    GetNextIssueNumberResponseSchema,
    (): GetNextIssueNumberResponse => ({
      issueNumber: String(getNextDisplayNumber()),
      success: true,
      error: '',
      $typeName: 'centy.v1.GetNextIssueNumberResponse',
    })
  )
}
