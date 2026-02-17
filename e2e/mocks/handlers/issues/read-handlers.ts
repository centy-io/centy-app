import type { GrpcMocker } from '../../../utils/mock-grpc'
import type { IssueHandlerState } from './types'
import {
  ListIssuesRequestSchema,
  ListIssuesResponseSchema,
  GetNextIssueNumberRequestSchema,
  GetNextIssueNumberResponseSchema,
} from '@/gen/centy_pb'
import type {
  ListIssuesResponse,
  GetNextIssueNumberResponse,
  ListIssuesRequest,
} from '@/gen/centy_pb'
import { addIssueGetHandlers } from './get-handlers'

/**
 * Adds read-only issue handlers (List, Get, GetByDisplayNumber, GetNextNumber).
 */
export function addIssueReadHandlers(
  mocker: GrpcMocker,
  state: IssueHandlerState
): void {
  const { issues } = state

  // ListIssues
  mocker.addHandler(
    'ListIssues',
    ListIssuesRequestSchema,
    ListIssuesResponseSchema,
    (request: ListIssuesRequest): ListIssuesResponse => {
      let filteredIssues = issues

      // Filter by status if provided
      if (request.status) {
        filteredIssues = filteredIssues.filter(
          i => i.metadata?.status === request.status
        )
      }

      // Filter by priority if provided
      if (request.priority !== undefined && request.priority > 0) {
        filteredIssues = filteredIssues.filter(
          i => i.metadata?.priority === request.priority
        )
      }

      return {
        issues: filteredIssues,
        totalCount: filteredIssues.length,
        success: true,
        error: '',
        $typeName: 'centy.v1.ListIssuesResponse',
      }
    }
  )

  // GetNextIssueNumber
  mocker.addHandler(
    'GetNextIssueNumber',
    GetNextIssueNumberRequestSchema,
    GetNextIssueNumberResponseSchema,
    (): GetNextIssueNumberResponse => ({
      issueNumber: String(state.nextDisplayNumber),
      success: true,
      error: '',
      $typeName: 'centy.v1.GetNextIssueNumberResponse',
    })
  )

  addIssueGetHandlers(mocker, state)
}
