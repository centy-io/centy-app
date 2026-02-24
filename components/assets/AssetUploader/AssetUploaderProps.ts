import type { PendingAsset } from './PendingAsset'
import type { Asset } from '@/gen/centy_pb'

export interface AssetUploaderProps {
  projectPath: string
  issueId?: string
  prId?: string
  onAssetsChange?: (assets: Asset[]) => void
  onPendingChange?: (pending: PendingAsset[]) => void
  initialAssets?: Asset[]
  mode: 'create' | 'edit'
}
