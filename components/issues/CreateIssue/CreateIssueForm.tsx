'use client'

import type { ReactElement } from 'react'
import type { CreateIssueFormProps } from './CreateIssue.types'
import { AssetUploader } from '@/components/assets/AssetUploader'
import { TextEditor } from '@/components/shared/TextEditor'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

// eslint-disable-next-line max-lines-per-function
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
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Issue title"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <TextEditor
          value={description}
          onChange={setDescription}
          format="md"
          mode="edit"
          placeholder="Describe the issue..."
          minHeight={150}
        />
      </div>

      <div className="form-group">
        <label htmlFor="priority">Priority:</label>
        <select
          id="priority"
          value={priority}
          onChange={e => setPriority(Number(e.target.value))}
        >
          <option value={1}>High</option>
          <option value={2}>Medium</option>
          <option value={3}>Low</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          {stateOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Attachments:</label>
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
