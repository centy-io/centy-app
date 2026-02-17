import type { PendingAsset } from '@/components/assets/AssetUploader'

export interface CreateIssueFormState {
  title: string
  description: string
  priority: number
  status: string
  loading: boolean
  error: string | null
  pendingAssets: PendingAsset[]
}
