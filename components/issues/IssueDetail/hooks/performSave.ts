import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { UpdateItemRequestSchema } from '@/gen/centy_pb'
import type { GenericItem } from '@/gen/centy_pb'

interface SaveEditState {
  editTitle: string
  editDescription: string
  editStatus: string
  editPriority: number
  setIsEditing: (v: boolean) => void
}

export async function performSave(
  projectPath: string,
  issueNumber: string,
  editState: SaveEditState,
  setIssue: (issue: GenericItem) => void,
  setError: (error: string | null) => void,
  setSaving: (v: boolean) => void
): Promise<void> {
  setSaving(true)
  setError(null)
  try {
    const request = create(UpdateItemRequestSchema, {
      projectPath,
      itemType: 'issues',
      itemId: issueNumber,
      title: editState.editTitle,
      body: editState.editDescription,
      status: editState.editStatus,
      priority: editState.editPriority,
    })
    const response = await centyClient.updateItem(request)
    if (response.success && response.item) {
      setIssue(response.item)
      editState.setIsEditing(false)
    } else {
      setError(response.error || 'Failed to update issue')
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to connect to daemon')
  } finally {
    setSaving(false)
  }
}
