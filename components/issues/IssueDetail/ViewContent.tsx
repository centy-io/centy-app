'use client'

import type { ReactElement } from 'react'
import type { GenericItem, Asset } from '@/gen/centy_pb'
import { TextEditor } from '@/components/shared/TextEditor'
import { AssetUploader } from '@/components/assets/AssetUploader'
import { CommentThread } from '@/components/comments/CommentThread'

interface ViewContentProps {
  issue: GenericItem
  projectPath: string
  issueNumber: string
  assets: Asset[]
  setAssets: (assets: Asset[]) => void
}

export function ViewContent({
  issue,
  projectPath,
  issueNumber,
  assets,
  setAssets,
}: ViewContentProps): ReactElement {
  return (
    <>
      <TextEditor
        value={issue.body}
        format="md"
        mode="display"
        className="generic-item-body"
      />

      <div className="issue-assets">
        <h3 className="section-title">Attachments</h3>
        {assets.length > 0 ? (
          <AssetUploader
            projectPath={projectPath}
            issueId={issueNumber}
            mode="edit"
            initialAssets={assets}
            onAssetsChange={setAssets}
          />
        ) : (
          <p className="no-assets">No attachments</p>
        )}
      </div>

      <CommentThread
        projectPath={projectPath}
        parentItemId={issue.id}
        parentItemType="issues"
      />
    </>
  )
}
