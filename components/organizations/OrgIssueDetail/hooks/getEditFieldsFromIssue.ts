import type { IssueEditFields } from './issueEditFields'
import type { Issue } from '@/gen/centy_pb'

export function getEditFieldsFromIssue(issue: Issue): IssueEditFields {
  const meta = issue.metadata
  return {
    title: issue.title,
    description: issue.description,
    priority: meta ? meta.priority : 2,
    status: meta ? meta.status : '',
  }
}
