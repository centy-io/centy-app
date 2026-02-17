'use client'

import Link from 'next/link'
import { useCreateIssue } from './hooks/useCreateIssue'
import { CreateIssueForm } from './CreateIssueForm'

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
      <CreateIssueForm
        projectPath={projectPath}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        priority={priority}
        setPriority={setPriority}
        status={status}
        setStatus={setStatus}
        loading={loading}
        error={error}
        stateOptions={stateOptions}
        assetUploaderRef={assetUploaderRef}
        setPendingAssets={setPendingAssets}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />
    </div>
  )
}
