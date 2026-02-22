import type { PendingAsset } from '@/components/assets/AssetUploader'

export interface CreateIssueState {
  title: string
  setTitle: (title: string) => void
  description: string
  setDescription: (description: string) => void
  priority: number
  setPriority: (priority: number) => void
  status: string
  setStatus: (status: string) => void
  loading: boolean
  error: string | null
  pendingAssets: PendingAsset[]
  setPendingAssets: (assets: PendingAsset[]) => void
}
