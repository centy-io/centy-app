/* eslint-disable max-lines, max-lines-per-function */
'use client'

import type { CreateOrgIssueFormProps } from './CreateOrgIssueForm.types'
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

      <div className="form-group">
        <label className="form-label" htmlFor="org-issue-priority">
          Priority:
        </label>
        <select
          className="form-select"
          id="org-issue-priority"
          value={priority}
          onChange={e => setPriority(Number(e.target.value))}
        >
          <option className="form-option" value={1}>
            High
          </option>
          <option className="form-option" value={2}>
            Medium
          </option>
          <option className="form-option" value={3}>
            Low
          </option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="org-issue-status">
          Status:
        </label>
        <select
          className="form-select"
          id="org-issue-status"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          {stateOptions.map(option => (
            <option
              className="form-option"
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
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
          {loading ? 'Creating...' : 'Create Org Issue'}
        </button>
      </div>
    </form>
  )
}
