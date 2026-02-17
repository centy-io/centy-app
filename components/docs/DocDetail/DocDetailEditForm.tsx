'use client'

import { TextEditor } from '@/components/shared/TextEditor'

interface DocDetailEditFormProps {
  editTitle: string
  editSlug: string
  editContent: string
  currentSlug: string
  setEditTitle: (value: string) => void
  setEditSlug: (value: string) => void
  setEditContent: (value: string) => void
}

export function DocDetailEditForm({
  editTitle,
  editSlug,
  editContent,
  currentSlug,
  setEditTitle,
  setEditSlug,
  setEditContent,
}: DocDetailEditFormProps) {
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

      <div className="form-group">
        <label htmlFor="edit-slug">Slug (leave empty to keep current):</label>
        <input
          id="edit-slug"
          type="text"
          value={editSlug}
          onChange={e => setEditSlug(e.target.value)}
          placeholder={currentSlug}
        />
      </div>

      <div className="form-group">
        <label htmlFor="edit-content">Content (Markdown):</label>
        <TextEditor
          value={editContent}
          onChange={setEditContent}
          format="md"
          mode="edit"
          placeholder="Write your documentation in Markdown..."
          minHeight={400}
        />
      </div>
    </div>
  )
}
