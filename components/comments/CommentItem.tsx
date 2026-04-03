'use client'

import { useState, type ReactElement } from 'react'
import { CommentEditForm } from './CommentEditForm'
import { TextEditor } from '@/components/shared/TextEditor'
import type { GenericItem } from '@/gen/centy_pb'

interface CommentItemProps {
  comment: GenericItem
  savingId: string | null
  deletingId: string | null
  onUpdate: (id: string, body: string) => void
  onDelete: (id: string) => void
}

export function CommentItem({
  comment,
  savingId,
  deletingId,
  onUpdate,
  onDelete,
}: CommentItemProps): ReactElement {
  const [isEditing, setIsEditing] = useState(false)
  const [editBody, setEditBody] = useState(comment.body)
  const meta = comment.metadata
  const customFields = meta ? meta.customFields : {}
  const author = customFields.author || ''
  const createdAt =
    meta && meta.createdAt ? new Date(meta.createdAt).toLocaleString() : ''
  const isSaving = savingId === comment.id
  const isDeleting = deletingId === comment.id

  function handleSave(): void {
    onUpdate(comment.id, editBody)
    setIsEditing(false)
  }

  function handleCancel(): void {
    setEditBody(comment.body)
    setIsEditing(false)
  }

  return (
    <div className="comment-item">
      <div className="comment-header">
        <span className="comment-author">{author || 'Anonymous'}</span>
        {createdAt && <span className="comment-date">{createdAt}</span>}
        <div className="comment-actions">
          <button
            type="button"
            className="comment-edit-btn"
            onClick={() => {
              setIsEditing(true)
            }}
            disabled={isEditing || isDeleting}
          >
            Edit
          </button>
          <button
            type="button"
            className="comment-delete-btn"
            onClick={() => {
              onDelete(comment.id)
            }}
            disabled={isDeleting || isSaving}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {isEditing ? (
        <CommentEditForm
          editBody={editBody}
          isSaving={isSaving}
          onChange={setEditBody}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <div className="comment-body">
          {comment.body ? (
            <TextEditor value={comment.body} format="md" mode="display" />
          ) : (
            <span className="comment-empty">No content</span>
          )}
        </div>
      )}
    </div>
  )
}
