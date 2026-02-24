'use client'

import { TextEditor } from '@/components/shared/TextEditor'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

interface CreateDocFormProps {
  title: string
  setTitle: (v: string) => void
  slug: string
  setSlug: (v: string) => void
  content: string
  setContent: (v: string) => void
  loading: boolean
  error: string | null
  handleSubmit: (e: React.FormEvent) => void
  handleCancel: () => void
}

export function CreateDocForm({
  title,
  setTitle,
  slug,
  setSlug,
  content,
  setContent,
  loading,
  error,
  handleSubmit,
  handleCancel,
}: CreateDocFormProps) {
  return (
    <form className="create-doc-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="title">
          Title:
        </label>
        <input
          className="form-input"
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Document title"
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="slug">
          Slug (optional, auto-generated from title):
        </label>
        <input
          className="form-input"
          id="slug"
          type="text"
          value={slug}
          onChange={e => setSlug(e.target.value)}
          placeholder="e.g., getting-started"
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="content">
          Content (Markdown):
        </label>
        <TextEditor
          value={content}
          onChange={setContent}
          format="md"
          mode="edit"
          placeholder="Write your documentation in Markdown..."
          minHeight={300}
        />
      </div>
      {error && <DaemonErrorMessage error={error} />}
      <div className="actions">
        <button type="button" onClick={handleCancel} className="secondary">
          Cancel
        </button>
        <button
          type="submit"
          disabled={!title.trim() || loading}
          className="primary"
        >
          {loading ? 'Creating...' : 'Create Document'}
        </button>
      </div>
    </form>
  )
}
