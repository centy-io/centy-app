'use client'

import Link from 'next/link'
import { useProjectContext } from './useProjectContext'
import { useCreateDoc } from './useCreateDoc'
import { TextEditor } from '@/components/shared/TextEditor'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

// eslint-disable-next-line max-lines-per-function
export function CreateDoc() {
  const { projectPath, isInitialized, getProjectContext } = useProjectContext()

  const {
    title,
    setTitle,
    content,
    setContent,
    slug,
    setSlug,
    loading,
    error,
    handleSubmit,
    handleCancel,
  } = useCreateDoc({ projectPath, getProjectContext })

  if (!projectPath) {
    return (
      <div className="create-doc">
        <h2 className="create-doc-title">Create New Document</h2>
        <div className="no-project-message">
          <p className="no-project-text">Select a project from the header to create a document</p>
        </div>
      </div>
    )
  }

  if (isInitialized === false) {
    return (
      <div className="create-doc">
        <h2 className="create-doc-title">Create New Document</h2>
        <div className="not-initialized-message">
          <p className="not-initialized-text">Centy is not initialized in this directory</p>
          <Link href="/">Initialize Project</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="create-doc">
      <h2 className="create-doc-title">Create New Document</h2>

      <form className="create-doc-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="title">Title:</label>
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
          <label className="form-label" htmlFor="content">Content (Markdown):</label>
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
    </div>
  )
}
