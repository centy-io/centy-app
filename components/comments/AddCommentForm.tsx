'use client'

import { useState, type ReactElement } from 'react'
import { TextEditor } from '@/components/shared/TextEditor'

interface AddCommentFormProps {
  adding: boolean
  onAdd: (body: string, author: string) => void
}

export function AddCommentForm({
  adding,
  onAdd,
}: AddCommentFormProps): ReactElement {
  const [body, setBody] = useState('')
  const [author, setAuthor] = useState('')
  const [expanded, setExpanded] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    onAdd(body, author)
    setBody('')
    setAuthor('')
    setExpanded(false)
  }

  if (!expanded) {
    return (
      <button
        type="button"
        className="comment-add-toggle"
        onClick={() => setExpanded(true)}
      >
        + Add comment
      </button>
    )
  }

  return (
    <form className="comment-add-form" onSubmit={handleSubmit}>
      <div className="comment-add-author">
        <input
          type="text"
          className="comment-author-input"
          placeholder="Your name (optional)"
          value={author}
          onChange={e => setAuthor(e.target.value)}
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
