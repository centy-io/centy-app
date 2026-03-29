import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { CreateItemRequestSchema } from '@/gen/centy_pb'

async function callCreateItem(
  projectPath: string,
  itemType: string,
  title: string,
  status: string,
  customFields: Record<string, string>
) {
  return centyClient.createItem(
    create(CreateItemRequestSchema, {
      projectPath: projectPath.trim(),
      itemType,
      title: title.trim(),
      status,
      customFields,
    })
  )
}

export async function submitCreate(
  projectPath: string,
  itemType: string,
  title: string,
  status: string,
  customFields: Record<string, string>,
  displayName: string,
  setLoading: (v: boolean) => void,
  setError: (v: string | null) => void,
  onSuccess: (id: string) => void
): Promise<void> {
  if (!title.trim() || !projectPath.trim()) return
  setLoading(true)
  setError(null)
  try {
    const response = await callCreateItem(
      projectPath,
      itemType,
      title,
      status,
      customFields
    )
    if (response.success && response.item) {
      onSuccess(response.item.id)
    } else {
      setError(response.error || `Failed to create ${displayName}`)
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to connect to daemon')
  } finally {
    setLoading(false)
  }
}
