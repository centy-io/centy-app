import type { ProjectContext } from './ProjectContext'
import type { PendingAsset } from '@/components/assets/AssetUploader'
import type { AssetUploaderHandle } from '@/components/assets/AssetUploader'

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
