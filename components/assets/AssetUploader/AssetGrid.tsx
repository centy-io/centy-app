'use client'

import type { PendingAsset } from './types'
import { AssetPreviewItem } from './AssetPreviewItem'
import { PendingAssetPreviewItem } from './PendingAssetPreviewItem'
import type { Asset } from '@/gen/centy_pb'

interface AssetGridProps {
  assets: Asset[]
  pendingAssets: PendingAsset[]
  projectPath: string
  issueId: string | undefined
  onRemoveAsset: (filename: string) => void
  onRemovePending: (pendingId: string) => void
}

export function AssetGrid({
  assets,
  pendingAssets,
  projectPath,
  issueId,
  onRemoveAsset,
  onRemovePending,
}: AssetGridProps) {
  if (assets.length === 0 && pendingAssets.length === 0) {
    return null
  }

  return (
    <div className="asset-grid">
      {assets.map(asset => (
        <AssetPreviewItem
          key={asset.filename}
          asset={asset}
          projectPath={projectPath}
          issueId={issueId!}
          onRemove={() => onRemoveAsset(asset.filename)}
        />
      ))}
      {pendingAssets.map(pending => (
        <PendingAssetPreviewItem
          key={pending.id}
          pending={pending}
          onRemove={() => onRemovePending(pending.id)}
        />
      ))}
    </div>
  )
}
