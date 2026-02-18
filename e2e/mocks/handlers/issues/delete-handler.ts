import type { GrpcMocker } from '../../../utils/mock-grpc'
import type { IssueHandlerOptions } from './types'
import type { Issue, Manifest } from '@/gen/centy_pb'
import {
  DeleteIssueRequestSchema,
  DeleteIssueResponseSchema,
} from '@/gen/centy_pb'
import type { DeleteIssueResponse } from '@/gen/centy_pb'

/**
 * Adds the DeleteIssue handler to the GrpcMocker.
 */
export function addDeleteIssueHandler(
  mocker: GrpcMocker,
  issues: Issue[],
  manifest: Manifest,
  options: IssueHandlerOptions
): void {
  mocker.addHandler(
    'DeleteIssue',
    DeleteIssueRequestSchema,
    DeleteIssueResponseSchema,
    (request: { issueId: string }): DeleteIssueResponse => {
      const index = issues.findIndex(i => i.id === request.issueId)
      if (index === -1) {
        return {
          success: false,
          error: `Issue not found: ${request.issueId}`,
          manifest,
          $typeName: 'centy.v1.DeleteIssueResponse',
        }
      }

      if (options.onDeleteIssue && !options.onDeleteIssue(request.issueId)) {
        return {
          success: false,
          error: 'Delete cancelled',
          manifest,
          $typeName: 'centy.v1.DeleteIssueResponse',
        }
      }

      issues.splice(index, 1)

      return {
        success: true,
        error: '',
        manifest,
        $typeName: 'centy.v1.DeleteIssueResponse',
      }
    }
  )
}
