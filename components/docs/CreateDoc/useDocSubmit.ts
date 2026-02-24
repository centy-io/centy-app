import { useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { CreateItemRequestSchema } from '@/gen/centy_pb'

interface UseDocSubmitParams {
  title: string
  content: string
  projectPath: string
  submitItem: (
    fn: () => Promise<{ success: boolean; error?: string; slug?: string }>,
    e: React.FormEvent
  ) => Promise<void>
}

export function useDocSubmit({
  title,
  content,
  projectPath,
  submitItem,
}: UseDocSubmitParams) {
  return useCallback(
    (e: React.FormEvent) => {
      if (!title.trim()) return
      return submitItem(async () => {
        const response = await centyClient.createItem(
          create(CreateItemRequestSchema, {
            projectPath: projectPath.trim(),
            itemType: 'docs',
            title: title.trim(),
            body: content.trim(),
          })
        )
        return {
          success: response.success,
          error: response.error,
          slug: response.item ? response.item.id : undefined,
        }
      }, e)
    },
    [projectPath, title, content, submitItem]
  )
}
