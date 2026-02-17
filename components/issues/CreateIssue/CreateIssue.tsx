'use client'

import Link from 'next/link'
import { AssetUploader } from '@/components/assets/AssetUploader'
import { TextEditor } from '@/components/shared/TextEditor'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { useCreateIssue } from './hooks/useCreateIssue'

export function CreateIssue() {
  const {
    projectPath,
    isInitialized,
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
    assetUploaderRef,
    setPendingAssets,
    handleSubmit,
    handleCancel,
  } = useCreateIssue()

  if (!projectPath) {
    return (
      <div className="create-issue">
        <h2>Create New Issue</h2>
        <div className="no-project-message">
          <p>Select a project from the header to create an issue</p>
        </div>
      </div>
    )
  }

  if (isInitialized === false) {
    return (
      <div className="create-issue">
        <h2>Create New Issue</h2>
        <div className="not-initialized-message">
          <p>Centy is not initialized in this directory</p>
          <Link href="/">Initialize Project</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="create-issue">
      <h2>Create New Issue</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Issue title"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
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
          <label htmlFor="priority">Priority:</label>
          <select
            id="priority"
            value={priority}
            onChange={e => setPriority(Number(e.target.value))}
          >
            <option value={1}>High</option>
            <option value={2}>Medium</option>
            <option value={3}>Low</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            {stateOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Attachments:</label>
          <AssetUploader
            ref={assetUploaderRef}
            projectPath={projectPath}
            mode="create"
            onPendingChange={setPendingAssets}
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
            {loading ? 'Creating...' : 'Create Issue'}
          </button>
        </div>
      </form>
    </div>
  )
}
