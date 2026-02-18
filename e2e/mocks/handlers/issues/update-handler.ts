import type { GrpcMocker } from '../../../utils/mock-grpc'
import type { IssueHandlerOptions } from './types'
import type { Issue, Manifest } from '@/gen/centy_pb'
import {
  UpdateIssueRequestSchema,
  UpdateIssueResponseSchema,
} from '@/gen/centy_pb'
import type { UpdateIssueResponse, UpdateIssueRequest } from '@/gen/centy_pb'

/**
 * Adds the UpdateIssue handler to the GrpcMocker.
 */
export function addUpdateIssueHandler(
  mocker: GrpcMocker,
  issues: Issue[],
  manifest: Manifest,
  options: IssueHandlerOptions
): void {
  mocker.addHandler(
    'UpdateIssue',
    UpdateIssueRequestSchema,
    UpdateIssueResponseSchema,
    (request: UpdateIssueRequest): UpdateIssueResponse => {
      const index = issues.findIndex(i => i.id === request.issueId)
      if (index === -1) {
        return {
          success: false,
          error: `Issue not found: ${request.issueId}`,
          issue: undefined,
          manifest,
          syncResults: [],
          $typeName: 'centy.v1.UpdateIssueResponse',
        }
      }

      // eslint-disable-next-line security/detect-object-injection
      const existing = issues[index]
      const updatedIssue = options.onUpdateIssue
        ? options.onUpdateIssue(request, existing)
        : {
            ...existing,
            title: request.title || existing.title,
            description: request.description || existing.description,
            metadata: {
              ...existing.metadata!,
              status:
                request.status ||
                (existing.metadata && existing.metadata.status) ||
                'open',
              priority:
                request.priority !== undefined
                  ? request.priority
                  : existing.metadata !== undefined &&
                      existing.metadata.priority !== undefined
                    ? existing.metadata.priority
                    : 2,
              updatedAt: new Date().toISOString(),
            },
          }

      // eslint-disable-next-line security/detect-object-injection
      issues[index] = updatedIssue

      return {
        success: true,
        error: '',
        issue: updatedIssue,
        manifest,
        syncResults: [],
        $typeName: 'centy.v1.UpdateIssueResponse',
      }
    }
  )
}
