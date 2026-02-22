import type { Doc } from '@/gen/centy_pb'
import { TextEditor } from '@/components/shared/TextEditor'

interface DocDetailEditFormProps {
  doc: Doc
  editTitle: string
  setEditTitle: (title: string) => void
  editSlug: string
  setEditSlug: (slug: string) => void
  editContent: string
  setEditContent: (content: string) => void
}

export function DocDetailEditForm({
  doc,
  editTitle,
  setEditTitle,
  editSlug,
  setEditSlug,
  editContent,
  setEditContent,
}: DocDetailEditFormProps) {
  return (
    <div className="edit-form">
      <div className="form-group">
        <label className="form-label" htmlFor="edit-title">Title:</label>
        <input
          className="form-input"
          id="edit-title"
          type="text"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="edit-slug">Slug (leave empty to keep current):</label>
        <input
          className="form-input"
          id="edit-slug"
          type="text"
          value={editSlug}
          onChange={e => setEditSlug(e.target.value)}
          placeholder={doc.slug}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="edit-content">Content (Markdown):</label>
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
