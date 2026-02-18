'use client'

import type { ReactElement } from 'react'
import type { Issue, Asset } from '@/gen/centy_pb'
import { TextEditor } from '@/components/shared/TextEditor'
import { AssetUploader } from '@/components/assets/AssetUploader'
import { LinkSection } from '@/components/shared/LinkSection'

interface ViewContentProps {
  issue: Issue
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
      <div className="issue-description">
        <h3>Description</h3>
        {issue.description ? (
          <TextEditor value={issue.description} format="md" mode="display" />
        ) : (
          <p className="no-description">No description provided</p>
        )}
      </div>

      <div className="issue-assets">
        <h3>Attachments</h3>
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

      <LinkSection entityId={issue.id} entityType="issue" editable={true} />
    </>
  )
}
