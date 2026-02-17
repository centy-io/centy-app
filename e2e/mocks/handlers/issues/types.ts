import type {
  Issue,
  CreateIssueRequest,
  UpdateIssueRequest,
} from '@/gen/centy_pb'

export interface IssueHandlerOptions {
  issues?: Issue[]
  onCreateIssue?: (request: CreateIssueRequest) => Issue
  onUpdateIssue?: (request: UpdateIssueRequest, existing: Issue) => Issue
  onDeleteIssue?: (issueId: string) => boolean
}

export interface IssueHandlerState {
  issues: Issue[]
  nextDisplayNumber: number
  options: IssueHandlerOptions
}
