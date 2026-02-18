import type { PendingAsset } from '@/components/assets/AssetUploader'
import type { AssetUploaderHandle } from '@/components/assets/AssetUploader'

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

export interface ProjectContext {
  organization: string
  project: string
}

export interface StateOption {
  value: string
  label: string
}

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

export interface UseCreateIssueSubmitParams {
  projectPath: string
  title: string
  description: string
  priority: number
  status: string
  pendingAssets: PendingAsset[]
  assetUploaderRef: React.RefObject<AssetUploaderHandle | null>
  getProjectContext: () => Promise<ProjectContext | null>
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}
