import type {
  AssetUploaderHandle,
  PendingAsset,
} from '@/components/assets/AssetUploader'
import type { RefObject } from 'react'

export interface CreateIssueFormState {
  title: string
  description: string
  priority: number
  status: string
  loading: boolean
  error: string | null
  pendingAssets: PendingAsset[]
}

export interface StateOption {
  value: string
  label: string
}

export interface CreateIssueFormProps {
  projectPath: string
  title: string
  setTitle: (v: string) => void
  description: string
  setDescription: (v: string) => void
  priority: number
  setPriority: (v: number) => void
  status: string
  setStatus: (v: string) => void
  loading: boolean
  error: string | null
  stateOptions: StateOption[]
  assetUploaderRef: RefObject<AssetUploaderHandle | null>
  setPendingAssets: (assets: PendingAsset[]) => void
  handleSubmit: (e: React.FormEvent) => void
  handleCancel: () => void
}
