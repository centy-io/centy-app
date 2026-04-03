import type { IssueEditFields } from './issueEditFields'
import type { GenericItem } from '@/gen/centy_pb'

export function getEditFieldsFromIssue(issue: GenericItem): IssueEditFields {
  const meta = issue.metadata
  return {
    title: issue.title,
    description: issue.body,
    priority: meta ? meta.priority : 2,
    status: meta ? meta.status : '',
  }
}
