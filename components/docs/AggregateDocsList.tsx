'use client'

import Link from 'next/link'
import { useAggregateDocsData } from './useAggregateDocsData'
import { useAppLink } from '@/hooks/useAppLink'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

export function AggregateDocsList() {
  const { createProjectLink } = useAppLink()
  const { docs, loading, error, fetchAllDocs } = useAggregateDocsData()

  return (
    <div className="docs-list">
      <div className="docs-header">
        <h2>All Docs</h2>
        <div className="header-actions">
          <button
            onClick={fetchAllDocs}
            disabled={loading}
            className="refresh-btn"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      <p className="aggregate-note">
        Showing docs from all projects. Select a project to create new docs.
      </p>

      {error && <DaemonErrorMessage error={error} />}

      {loading && docs.length === 0 ? (
        <div className="loading">Loading docs from all projects...</div>
      ) : docs.length === 0 ? (
        <div className="empty-state">
          <p>No docs found across any projects</p>
        </div>
      ) : (
        <div className="docs-grid">
          {docs.map(doc => (
            <div key={`${doc.projectPath}-${doc.slug}`} className="doc-card">
              <div className="doc-project">
                <Link
                  href={createProjectLink(doc.orgSlug, doc.projectName, 'docs')}
                  className="project-link"
                >
                  {doc.projectName}
                </Link>
              </div>
              <Link
                href={createProjectLink(
                  doc.orgSlug,
                  doc.projectName,
                  `docs/${doc.slug}`
                )}
                className="doc-title"
              >
                {doc.title || doc.slug}
              </Link>
              {doc.metadata && doc.metadata.updatedAt && (
                <div className="doc-date">
                  Updated:{' '}
                  {new Date(doc.metadata.updatedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
