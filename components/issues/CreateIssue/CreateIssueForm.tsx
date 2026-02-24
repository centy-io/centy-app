'use client'

import type { ReactElement } from 'react'
import type { CreateIssueFormProps } from './CreateIssue.types'
import { PrioritySelect, StatusSelect } from './IssueFormSelects'
import { AssetUploader } from '@/components/assets/AssetUploader'
import { TextEditor } from '@/components/shared/TextEditor'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

export function CreateIssueForm({
  projectPath,
  title,
  setTitle,
  description,
  setDescription,
  priority,
  setPriority,
  status,
  setStatus,
  loading,
  error,
  stateOptions,
  setPendingAssets,
  assetUploaderRef,
  onSubmit,
  onCancel,
}: CreateIssueFormProps): ReactElement {
  return (
    <form className="create-issue-form" onSubmit={onSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="title">
          Title:
        </label>
        <input
          className="form-input"
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Issue title"
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="description">
          Description:
        </label>
        <TextEditor
          value={description}
          onChange={setDescription}
          format="md"
          mode="edit"
          placeholder="Describe the issue..."
          minHeight={150}
        />
      </div>
      <PrioritySelect priority={priority} setPriority={setPriority} />
      <StatusSelect
        status={status}
        setStatus={setStatus}
        stateOptions={stateOptions}
      />
      <div className="form-group">
        <label className="form-label">Attachments:</label>
        <AssetUploader
          ref={assetUploaderRef}
          projectPath={projectPath}
          mode="create"
          onPendingChange={setPendingAssets}
        />
      </div>
      {error && <DaemonErrorMessage error={error} />}
      <div className="actions">
        <button type="button" onClick={onCancel} className="secondary">
          Cancel
        </button>
        <button
          type="submit"
          disabled={!title.trim() || loading}
          className="primary"
        >
          {loading ? 'Creating...' : 'Create Issue'}
        </button>
      </div>
    </form>
  )
}
