import type { GrpcMocker } from '../../utils/mock-grpc'
import { createMockIssue, mockIssues } from '../../fixtures/issues'
import { mockManifest } from '../../fixtures/config'
import {
  ListIssuesRequestSchema,
  ListIssuesResponseSchema,
  GetIssueRequestSchema,
  GetIssueResponseSchema,
  GetIssueByDisplayNumberRequestSchema,
  CreateIssueRequestSchema,
  CreateIssueResponseSchema,
  UpdateIssueRequestSchema,
  UpdateIssueResponseSchema,
  DeleteIssueRequestSchema,
  DeleteIssueResponseSchema,
  GetNextIssueNumberRequestSchema,
  GetNextIssueNumberResponseSchema,
} from '@/gen/centy_pb'
import type {
  Issue,
  ListIssuesResponse,
  GetIssueResponse,
  CreateIssueResponse,
  UpdateIssueResponse,
  DeleteIssueResponse,
  GetNextIssueNumberResponse,
  ListIssuesRequest,
  GetIssueRequest,
  GetIssueByDisplayNumberRequest,
  CreateIssueRequest,
  UpdateIssueRequest,
} from '@/gen/centy_pb'

export interface IssueHandlerOptions {
  issues?: Issue[]
  onCreateIssue?: (request: CreateIssueRequest) => Issue
  onUpdateIssue?: (request: UpdateIssueRequest, existing: Issue) => Issue
  onDeleteIssue?: (issueId: string) => boolean
}

/**
 * Adds issue-related handlers to the GrpcMocker.
 */
export function addIssueHandlers(
  mocker: GrpcMocker,
  options: IssueHandlerOptions = {}
): GrpcMocker {
  const issues = options.issues !== undefined ? options.issues : [...mockIssues]
  let nextDisplayNumber = issues.length + 1

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

  // GetNextIssueNumber
  mocker.addHandler(
    'GetNextIssueNumber',
    GetNextIssueNumberRequestSchema,
    GetNextIssueNumberResponseSchema,
    (): GetNextIssueNumberResponse => ({
      issueNumber: String(nextDisplayNumber),
      success: true,
      error: '',
      $typeName: 'centy.v1.GetNextIssueNumberResponse',
    })
  )

  // CreateIssue
  mocker.addHandler(
    'CreateIssue',
    CreateIssueRequestSchema,
    CreateIssueResponseSchema,
    (request: CreateIssueRequest): CreateIssueResponse => {
      const newIssue = options.onCreateIssue
        ? options.onCreateIssue(request)
        : createMockIssue({
            displayNumber: nextDisplayNumber,
            title: request.title,
            description: request.description,
          })

      issues.push(newIssue)
      nextDisplayNumber++

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

  return mocker
}
