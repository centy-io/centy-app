'use client'

import Link from 'next/link'
import { useGenericItemCreate } from './useGenericItemCreate'
import { GenericCreateFormFields } from './GenericCreateFormFields'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

interface GenericItemCreateProps {
  itemType: string
}

// eslint-disable-next-line max-lines-per-function
export function GenericItemCreate({ itemType }: GenericItemCreateProps) {
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
    <div className="create-generic-item">
      <h2 className="create-generic-title">Create New {displayName}</h2>
      <form className="create-generic-form" onSubmit={handleSubmit}>
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
            placeholder={`${displayName} title`}
            required
          />
        </div>
        <GenericCreateFormFields
          config={config}
          status={status}
          setStatus={setStatus}
          customFields={customFields}
          setCustomFields={setCustomFields}
        />
        {error && <DaemonErrorMessage error={error} />}
        <div className="actions">
          <Link href={listUrl} className="secondary">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={!title.trim() || loading}
            className="primary"
          >
            {loading ? 'Creating...' : `Create ${displayName}`}
          </button>
        </div>
      </form>
    </div>
  )
}
