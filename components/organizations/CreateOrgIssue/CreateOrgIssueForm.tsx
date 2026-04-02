'use client'

import type { CreateOrgIssueFormProps } from './CreateOrgIssue.types'
import { PrioritySelect } from './PrioritySelect'
import { StatusSelect } from './StatusSelect'
import { TextEditor } from '@/components/shared/TextEditor'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

export function CreateOrgIssueForm({
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
  onSubmit,
  onCancel,
}: CreateOrgIssueFormProps) {
  return (
    <form className="create-issue-form" onSubmit={onSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="org-issue-title">
          Title:
        </label>
        <input
          className="form-input"
          id="org-issue-title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Issue title"
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="org-issue-description">
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
      <PrioritySelect value={priority} onChange={setPriority} />
      <StatusSelect
        value={status}
        onChange={setStatus}
        options={stateOptions}
      />
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
          {loading ? 'Creating...' : 'Create Org Issue'}
        </button>
      </div>
    </form>
  )
}
