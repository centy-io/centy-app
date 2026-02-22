'use client'

import Link from 'next/link'
import { route } from 'nextjs-routes'
import type { CreateOrgIssueProps } from './CreateOrgIssue.types'
import { useCreateOrgIssue } from './hooks/useCreateOrgIssue'
import { CreateOrgIssueForm } from './CreateOrgIssueForm'

export function CreateOrgIssue({ orgSlug }: CreateOrgIssueProps) {
  const {
    orgProjectPath,
    initLoading,
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
    handleSubmit,
    handleCancel,
  } = useCreateOrgIssue(orgSlug)

  return (
    <div className="create-issue">
      <div className="create-issue-header">
        <Link
          href={route({
            pathname: '/organizations/[orgSlug]/issues',
            query: { orgSlug },
          })}
          className="back-link"
        >
          ← Back to Org Issues
        </Link>
        <h2 className="create-issue-title">Create Org Issue</h2>
      </div>

      {initLoading ? (
        <div className="loading">Loading organization...</div>
      ) : !orgProjectPath ? (
        <div className="no-project-message">
          <p className="no-project-text">
            This organization has no initialized projects. Add a project first.
          </p>
          <Link
            href={route({
              pathname: '/organizations/[orgSlug]',
              query: { orgSlug },
            })}
            className="back-link"
          >
            Back to Organization
          </Link>
        </div>
      ) : (
        <CreateOrgIssueForm
          orgSlug={orgSlug}
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
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  )
}
