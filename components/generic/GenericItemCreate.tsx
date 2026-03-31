'use client'

import { useGenericItemCreate } from './useGenericItemCreate'
import { GenericCreateForm } from './GenericCreateForm'

interface GenericItemCreateProps {
  itemType: string
}

export function GenericItemCreate({
  itemType,
}: GenericItemCreateProps): React.JSX.Element {
  const {
    projectPath,
    isInitialized,
    config,
    configLoading,
    title,
    setTitle,
    status,
    setStatus,
    customFields,
    setCustomFields,
    loading,
    error,
    listUrl,
    displayName,
    handleSubmit,
  } = useGenericItemCreate(itemType)

  if (!projectPath) {
    return (
      <div className="create-generic-item">
        <h2 className="create-generic-title">Create New {displayName}</h2>
        <div className="no-project-message">
          <p className="no-project-text">
            Select a project from the header to create a{' '}
            {displayName.toLowerCase()}
          </p>
        </div>
      </div>
    )
  }

  if (isInitialized === false) {
    return (
      <div className="create-generic-item">
        <h2 className="create-generic-title">Create New {displayName}</h2>
        <div className="not-initialized-message">
          <p className="not-initialized-text">
            Centy is not initialized in this directory
          </p>
        </div>
      </div>
    )
  }

  if (configLoading) {
    return <div className="loading">Loading configuration...</div>
  }

  return (
    <GenericCreateForm
      displayName={displayName}
      title={title}
      setTitle={setTitle}
      config={config}
      status={status}
      setStatus={setStatus}
      customFields={customFields}
      setCustomFields={setCustomFields}
      loading={loading}
      error={error}
      listUrl={listUrl}
      handleSubmit={handleSubmit}
    />
  )
}
