import type { StateOption } from './StateOption'
import type { PendingAsset } from '@/components/assets/AssetUploader'
import type { AssetUploaderHandle } from '@/components/assets/AssetUploader'

export interface CreateIssueFormProps {
  projectPath: string
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
  stateOptions: StateOption[]
  setPendingAssets: (assets: PendingAsset[]) => void
  assetUploaderRef: React.RefObject<AssetUploaderHandle | null>
  onSubmit: (e?: React.FormEvent) => Promise<void>
  onCancel: () => void
}
