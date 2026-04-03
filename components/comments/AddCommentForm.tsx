'use client'

import { useState, type ReactElement } from 'react'
import { TextEditor } from '@/components/shared/TextEditor'

interface AddCommentFormProps {
  adding: boolean
  onAdd: (body: string, author: string) => Promise<boolean>
}

export function AddCommentForm({
  adding,
  onAdd,
}: AddCommentFormProps): ReactElement {
  const [body, setBody] = useState('')
  const [author, setAuthor] = useState('')
  const [expanded, setExpanded] = useState(false)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    const success = await onAdd(body, author)
    if (!success) return
    setBody('')
    setAuthor('')
    setExpanded(false)
  }

  if (!expanded) {
    return (
      <button
        type="button"
        className="comment-add-toggle"
        onClick={() => void setExpanded(true)}
      >
        + Add comment
      </button>
    )
  }

  return (
    <form className="comment-add-form" onSubmit={e => void handleSubmit(e)}>
      <div className="comment-add-author">
        <input
          className="comment-author-input"
          placeholder="Your name (optional)"
          value={author}
          onChange={e => void setAuthor(e.target.value)}
          disabled={adding}
        />
      </div>
      <TextEditor
        value={body}
        onChange={setBody}
        format="md"
        mode="edit"
        placeholder="Write a comment..."
        minHeight={100}
      />
      <div className="comment-add-actions">
        <button
          type="submit"
          className="comment-submit-btn"
          disabled={adding || !body.trim()}
        >
          {adding ? 'Adding...' : 'Add comment'}
        </button>
        <button
          type="button"
          className="comment-cancel-btn"
          onClick={() => {
            setExpanded(false)
            setBody('')
            setAuthor('')
          }}
          disabled={adding}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
