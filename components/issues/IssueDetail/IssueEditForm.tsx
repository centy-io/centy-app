import type { Asset } from '@/gen/centy_pb'
import { AssetUploader } from '@/components/assets/AssetUploader'
import { TextEditor } from '@/components/shared/TextEditor'

interface StateOption {
  value: string
  label: string
}

interface IssueEditFormProps {
  editTitle: string
  editDescription: string
  editStatus: string
  editPriority: number
  stateOptions: StateOption[]
  assets: Asset[]
  projectPath: string
  issueNumber: string
  onTitleChange: (v: string) => void
  onDescriptionChange: (v: string) => void
  onStatusChange: (v: string) => void
  onPriorityChange: (v: number) => void
  onAssetsChange: (v: Asset[]) => void
}

export function IssueEditForm({
  editTitle,
  editDescription,
  editStatus,
  editPriority,
  stateOptions,
  assets,
  projectPath,
  issueNumber,
  onTitleChange,
  onDescriptionChange,
  onStatusChange,
  onPriorityChange,
  onAssetsChange,
}: IssueEditFormProps) {
  return (
    <div className="edit-form">
      <div className="form-group">
        <label htmlFor="edit-title">Title:</label>
        <input
          id="edit-title"
          type="text"
          value={editTitle}
          onChange={e => onTitleChange(e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="edit-status">Status:</label>
          <select
            id="edit-status"
            value={editStatus}
            onChange={e => onStatusChange(e.target.value)}
          >
            {stateOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="edit-priority">Priority:</label>
          <select
            id="edit-priority"
            value={editPriority}
            onChange={e => onPriorityChange(Number(e.target.value))}
          >
            <option value={1}>High</option>
            <option value={2}>Medium</option>
            <option value={3}>Low</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="edit-description">Description:</label>
        <TextEditor
          value={editDescription}
          onChange={onDescriptionChange}
          format="md"
          mode="edit"
          placeholder="Describe the issue..."
          minHeight={200}
        />
      </div>

      <div className="form-group">
        <label>Attachments:</label>
        <AssetUploader
          projectPath={projectPath}
          issueId={issueNumber}
          mode="edit"
          initialAssets={assets}
          onAssetsChange={onAssetsChange}
        />
      </div>
    </div>
  )
}
