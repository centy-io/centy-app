'use client'

import type { ReactElement } from 'react'
import { AssetUploader } from '@/components/assets/AssetUploader'
import { TextEditor } from '@/components/shared/TextEditor'
import type { EditFormProps } from './IssueDetail.types'

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
        <label htmlFor="edit-title">Title:</label>
        <input
          id="edit-title"
          type="text"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="edit-status">Status:</label>
          <select
            id="edit-status"
            value={editStatus}
            onChange={e => setEditStatus(e.target.value)}
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
            onChange={e => setEditPriority(Number(e.target.value))}
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
          onChange={setEditDescription}
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
          onAssetsChange={setAssets}
        />
      </div>
    </div>
  )
}
