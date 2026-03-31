import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { UpdateItemRequestSchema, type Issue } from '@/gen/centy_pb'
import { genericItemToIssue } from '@/lib/genericItemToIssue'

export async function performSaveIssue(
  orgProjectPath: string,
  issueId: string,
  editTitle: string,
  editDescription: string,
  editPriority: number,
  editStatus: string
): Promise<Issue | string> {
  const res = await centyClient.updateItem(
    create(UpdateItemRequestSchema, {
      projectPath: orgProjectPath,
      itemType: 'issues',
      itemId: issueId,
      title: editTitle.trim(),
      body: editDescription.trim(),
      priority: editPriority,
      status: editStatus,
    })
  )
  if (res.success && res.item) return genericItemToIssue(res.item)
  return res.error || 'Failed to update issue'
}
