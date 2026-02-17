import type { Issue, Asset } from '@/gen/centy_pb'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { IssueEditForm } from './IssueEditForm'
import { IssueViewContent } from './IssueViewContent'

interface IssueContentSectionProps {
  issue: Issue
  issueNumber: string
  projectPath: string
  isEditing: boolean
  editTitle: string
  editDescription: string
  editStatus: string
  editPriority: number
  stateOptions: { value: string; label: string }[]
  assets: Asset[]
  updatingStatus: boolean
  showStatusDropdown: boolean
  assignees: string[]
  onTitleChange: (v: string) => void
  onDescriptionChange: (v: string) => void
  onStatusChange: (v: string) => void
  onPriorityChange: (v: number) => void
  onAssetsChange: (v: Asset[]) => void
  onStatusDropdownToggle: () => void
  onViewStatusChange: (status: string) => void
  onAssigneesChange: (assignees: string[]) => void
}

export function IssueContentSection({
  issue,
  issueNumber,
  projectPath,
  isEditing,
  editTitle,
  editDescription,
  editStatus,
  editPriority,
  stateOptions,
  assets,
  updatingStatus,
  showStatusDropdown,
  assignees,
  onTitleChange,
  onDescriptionChange,
  onStatusChange,
  onPriorityChange,
  onAssetsChange,
  onStatusDropdownToggle,
  onViewStatusChange,
  onAssigneesChange,
}: IssueContentSectionProps) {
  const { copyToClipboard } = useCopyToClipboard()

  return (
    <div className="issue-content">
      <button
        type="button"
        className="issue-number-badge"
        onClick={() =>
          copyToClipboard(issueNumber, `issue #${issue.displayNumber}`)
        }
        title="Click to copy UUID"
      >
        #{issue.displayNumber}
      </button>
      {isEditing ? (
        <IssueEditForm
          editTitle={editTitle}
          editDescription={editDescription}
          editStatus={editStatus}
          editPriority={editPriority}
          stateOptions={stateOptions}
          assets={assets}
          projectPath={projectPath}
          issueNumber={issueNumber}
          onTitleChange={onTitleChange}
          onDescriptionChange={onDescriptionChange}
          onStatusChange={onStatusChange}
          onPriorityChange={onPriorityChange}
          onAssetsChange={onAssetsChange}
        />
      ) : (
        <IssueViewContent
          issue={issue}
          assets={assets}
          projectPath={projectPath}
          issueNumber={issueNumber}
          updatingStatus={updatingStatus}
          showStatusDropdown={showStatusDropdown}
          stateOptions={stateOptions}
          assignees={assignees}
          onStatusDropdownToggle={onStatusDropdownToggle}
          onStatusChange={onViewStatusChange}
          onAssetsChange={onAssetsChange}
          onAssigneesChange={onAssigneesChange}
        />
      )}
    </div>
  )
}
