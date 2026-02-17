import type { Issue, Asset } from '@/gen/centy_pb'
import { AssetUploader } from '@/components/assets/AssetUploader'
import { TextEditor } from '@/components/shared/TextEditor'
import { LinkSection } from '@/components/shared/LinkSection'
import { AssigneeSelector } from '@/components/users/AssigneeSelector'
import { IssueMetadata } from './IssueMetadata'

interface IssueViewContentProps {
  issue: Issue
  assets: Asset[]
  projectPath: string
  issueNumber: string
  updatingStatus: boolean
  showStatusDropdown: boolean
  stateOptions: { value: string; label: string }[]
  assignees: string[]
  onStatusDropdownToggle: () => void
  onStatusChange: (status: string) => void
  onAssetsChange: (assets: Asset[]) => void
  onAssigneesChange: (assignees: string[]) => void
}

export function IssueViewContent({
  issue,
  assets,
  projectPath,
  issueNumber,
  updatingStatus,
  showStatusDropdown,
  stateOptions,
  assignees,
  onStatusDropdownToggle,
  onStatusChange,
  onAssetsChange,
  onAssigneesChange,
}: IssueViewContentProps) {
  return (
    <>
      <h1 className="issue-title">{issue.title}</h1>

      <IssueMetadata
        issue={issue}
        updatingStatus={updatingStatus}
        showStatusDropdown={showStatusDropdown}
        stateOptions={stateOptions}
        onStatusDropdownToggle={onStatusDropdownToggle}
        onStatusChange={onStatusChange}
      />

      <div className="issue-assignees">
        <h4>Assignees</h4>
        <AssigneeSelector
          projectPath={projectPath}
          issueId={issueNumber}
          currentAssignees={assignees}
          onAssigneesChange={onAssigneesChange}
        />
      </div>

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
            onAssetsChange={onAssetsChange}
          />
        ) : (
          <p className="no-assets">No attachments</p>
        )}
      </div>

      <LinkSection entityId={issue.id} entityType="issue" editable={true} />
    </>
  )
}
