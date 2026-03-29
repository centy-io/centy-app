import type { RefObject } from 'react'
import { buildCreateItemResult } from './buildCreateItemResult'
import type {
  AssetUploaderHandle,
  PendingAsset,
} from '@/components/assets/AssetUploader'

interface BuildHandleSubmitParams {
  title: string
  description: string
  priority: number
  status: string
  pendingAssets: PendingAsset[]
  assetUploaderRef: RefObject<AssetUploaderHandle>
  projectPath: string
  submitItem: (
    build: () => ReturnType<typeof buildCreateItemResult>,
    e?: React.FormEvent
  ) => Promise<void> | undefined
}

export function buildHandleSubmit(params: BuildHandleSubmitParams) {
  return async (e?: React.FormEvent): Promise<void> => {
    const {
      title,
      description,
      priority,
      status,
      pendingAssets,
      assetUploaderRef,
      projectPath,
      submitItem,
    } = params
    if (!title.trim()) return
    return submitItem(
      () =>
        buildCreateItemResult({
          projectPath,
          title,
          description,
          priority,
          status,
          pendingAssets,
          assetUploaderRef,
        }),
      e
    )
  }
}
