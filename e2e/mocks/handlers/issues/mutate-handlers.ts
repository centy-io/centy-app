import type { GrpcMocker } from '../../../utils/mock-grpc'
import type { IssueHandlerState } from './types'
import { mockManifest } from '../../../fixtures/config'
import {
  UpdateIssueRequestSchema,
  UpdateIssueResponseSchema,
  DeleteIssueRequestSchema,
  DeleteIssueResponseSchema,
} from '@/gen/centy_pb'
import type {
  UpdateIssueResponse,
  DeleteIssueResponse,
  UpdateIssueRequest,
} from '@/gen/centy_pb'

/**
 * Adds UpdateIssue and DeleteIssue handlers.
 */
export function addIssueMutateHandlers(
  mocker: GrpcMocker,
  state: IssueHandlerState
): void {
  const { issues, options } = state

  // UpdateIssue
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
          manifest: mockManifest,
          syncResults: [],
          $typeName: 'centy.v1.UpdateIssueResponse',
        }
      }

      const existing = issues[index]
      const updatedIssue = options.onUpdateIssue
        ? options.onUpdateIssue(request, existing)
        : {
            ...existing,
            title: request.title || existing.title,
            description: request.description || existing.description,
            metadata: {
              ...existing.metadata!,
              status: request.status || existing.metadata?.status || 'open',
              priority:
                request.priority !== undefined
                  ? request.priority
                  : (existing.metadata?.priority ?? 2),
              updatedAt: new Date().toISOString(),
            },
          }

      issues[index] = updatedIssue

      return {
        success: true,
        error: '',
        issue: updatedIssue,
        manifest: mockManifest,
        syncResults: [],
        $typeName: 'centy.v1.UpdateIssueResponse',
      }
    }
  )

  // DeleteIssue
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
          manifest: mockManifest,
          $typeName: 'centy.v1.DeleteIssueResponse',
        }
      }

      if (options.onDeleteIssue && !options.onDeleteIssue(request.issueId)) {
        return {
          success: false,
          error: 'Delete cancelled',
          manifest: mockManifest,
          $typeName: 'centy.v1.DeleteIssueResponse',
        }
      }

      issues.splice(index, 1)

      return {
        success: true,
        error: '',
        manifest: mockManifest,
        $typeName: 'centy.v1.DeleteIssueResponse',
      }
    }
  )
}
