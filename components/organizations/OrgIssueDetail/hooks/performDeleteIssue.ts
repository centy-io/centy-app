import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { DeleteItemRequestSchema } from '@/gen/centy_pb'

export async function performDeleteIssue(
  orgProjectPath: string,
  issueId: string
): Promise<string | null> {
  const res = await centyClient.deleteItem(
    create(DeleteItemRequestSchema, {
      projectPath: orgProjectPath,
      itemType: 'issues',
      itemId: issueId,
    })
  )
  return res.success ? null : res.error || 'Failed to delete issue'
}
