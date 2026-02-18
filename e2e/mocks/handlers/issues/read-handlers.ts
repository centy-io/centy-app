import type { GrpcMocker } from '../../../utils/mock-grpc'
import type { Issue } from '@/gen/centy_pb'
import {
  ListIssuesRequestSchema,
  ListIssuesResponseSchema,
} from '@/gen/centy_pb'
import type { ListIssuesResponse, ListIssuesRequest } from '@/gen/centy_pb'

/**
 * Adds the ListIssues handler to the GrpcMocker.
 */
export function addListIssuesHandler(
  mocker: GrpcMocker,
  issues: Issue[]
): void {
  mocker.addHandler(
    'ListIssues',
    ListIssuesRequestSchema,
    ListIssuesResponseSchema,
    (request: ListIssuesRequest): ListIssuesResponse => {
      let filteredIssues = issues

      // Filter by status if provided
      if (request.status) {
        filteredIssues = filteredIssues.filter(
          i => i.metadata && i.metadata.status === request.status
        )
      }

      // Filter by priority if provided
      if (request.priority !== undefined && request.priority > 0) {
        filteredIssues = filteredIssues.filter(
          i => i.metadata && i.metadata.priority === request.priority
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
}
