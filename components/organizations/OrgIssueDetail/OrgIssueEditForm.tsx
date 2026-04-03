'use client'

import type { useOrgIssueDetail } from './hooks/useOrgIssueDetail'
import { TextEditor } from '@/components/shared/TextEditor'

type OrgIssueDetailState = ReturnType<typeof useOrgIssueDetail>

interface OrgIssueEditFormProps {
  state: OrgIssueDetailState
}

export function OrgIssueEditForm({ state }: OrgIssueEditFormProps) {
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
          value={state.editTitle}
          onChange={e => void state.setEditTitle(e.target.value)}
          placeholder="Issue title"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="edit-priority">
          Priority:
        </label>
        <select
          className="form-select"
          id="edit-priority"
          value={state.editPriority}
          onChange={e => void state.setEditPriority(Number(e.target.value))}
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
        <label className="form-label" htmlFor="edit-status">
          Status:
        </label>
        <select
          className="form-select"
          id="edit-status"
          value={state.editStatus}
          onChange={e => void state.setEditStatus(e.target.value)}
        >
          {state.stateOptions.map(opt => (
            <option className="form-option" key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Description:</label>
        <TextEditor
          value={state.editDescription}
          onChange={state.setEditDescription}
          format="md"
          mode="edit"
          placeholder="Describe the issue..."
          minHeight={150}
        />
      </div>
    </div>
  )
}
