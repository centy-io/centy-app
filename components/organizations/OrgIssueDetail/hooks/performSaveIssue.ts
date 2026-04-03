import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { UpdateItemRequestSchema } from '@/gen/centy_pb'
import type { GenericItem } from '@/gen/centy_pb'

export async function performSaveIssue(
  orgProjectPath: string,
  issueId: string,
  editTitle: string,
  editDescription: string,
  editPriority: number,
  editStatus: string
): Promise<GenericItem | string> {
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
  if (res.success && res.item) return res.item
  return res.error || 'Failed to update issue'
}
