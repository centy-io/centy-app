'use client'

import type { ReactElement } from 'react'
import { TextEditor } from '@/components/shared/TextEditor'

export interface CommentEditFormProps {
  editBody: string
  isSaving: boolean
  onChange: (value: string) => void
  onSave: () => void
  onCancel: () => void
}

export function CommentEditForm({
  editBody,
  isSaving,
  onChange,
  onSave,
  onCancel,
}: CommentEditFormProps): ReactElement {
  return (
    <div className="comment-edit-form">
      <TextEditor
        value={editBody}
        onChange={onChange}
        format="md"
        mode="edit"
        placeholder="Edit your comment..."
        minHeight={80}
      />
      <div className="comment-edit-actions">
        <button
          type="button"
          className="comment-save-btn"
          onClick={onSave}
          disabled={isSaving || !editBody.trim()}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          className="comment-cancel-btn"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
