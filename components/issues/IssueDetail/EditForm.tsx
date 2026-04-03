'use client'

import type { ReactElement } from 'react'
import type { EditFormProps } from './IssueDetail.types'
import { EditStatusSelect } from './EditStatusSelect'
import { EditPrioritySelect } from './EditPrioritySelect'
import { AssetUploader } from '@/components/assets/AssetUploader'
import { TextEditor } from '@/components/shared/TextEditor'

export function EditForm({
  projectPath,
  issueNumber,
  editTitle,
  setEditTitle,
  editDescription,
  setEditDescription,
  editStatus,
  setEditStatus,
  editPriority,
  setEditPriority,
  stateOptions,
  assets,
  setAssets,
}: EditFormProps): ReactElement {
  return (
    <div className="edit-form">
      <div className="form-group">
        <label className="form-label" htmlFor="edit-title">
          Title:
        </label>
        <input
          className="form-input"
          id="edit-title"
          type="text"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
        />
      </div>
      <div className="form-row">
        <EditStatusSelect
          editStatus={editStatus}
          setEditStatus={setEditStatus}
          stateOptions={stateOptions}
        />
        <EditPrioritySelect
          editPriority={editPriority}
          setEditPriority={setEditPriority}
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="edit-description">
          Description:
        </label>
        <TextEditor
          value={editDescription}
          onChange={setEditDescription}
          format="md"
          mode="edit"
          placeholder="Describe the issue..."
          minHeight={200}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Attachments:</label>
        <AssetUploader
          projectPath={projectPath}
          issueId={issueNumber}
          mode="edit"
          initialAssets={assets}
          onAssetsChange={setAssets}
        />
      </div>
    </div>
  )
}
