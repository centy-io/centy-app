'use client'

import Link from 'next/link'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { useDocDetail } from './hooks/useDocDetail'
import { DocDetailView } from './DocDetailView'
import { DocDetailEditForm } from './DocDetailEditForm'
import { DocDetailHeaderActions } from './DocDetailHeaderActions'
import { DocDetailDeleteConfirm } from './DocDetailDeleteConfirm'
import { DocDetailModals } from './DocDetailModals'
import type { DocDetailProps } from './DocDetail.types'

export function DocDetail({ slug }: DocDetailProps) {
  const state = useDocDetail(slug)

  if (!state.projectPath) {
    return (
      <div className="doc-detail">
        <div className="error-message">
          No project path specified. Please go to the{' '}
          <Link href={state.docsListUrl}>documentation list</Link> and select a
          project.
        </div>
      </div>
    )
  }

  if (state.loading) {
    return (
      <div className="doc-detail">
        <div className="loading">Loading document...</div>
      </div>
    )
  }

  if (state.error && !state.doc) {
    return (
      <div className="doc-detail">
        <DaemonErrorMessage error={state.error} />
        <Link href={state.docsListUrl} className="back-link">
          Back to Documentation
        </Link>
      </div>
    )
  }

  if (!state.doc) {
    return (
      <div className="doc-detail">
        <div className="error-message">Document not found</div>
        <Link href={state.docsListUrl} className="back-link">
          Back to Documentation
        </Link>
      </div>
    )
  }

  return (
    <div className="doc-detail">
      <div className="doc-header">
        <Link href={state.docsListUrl} className="back-link">
          Back to Documentation
        </Link>
        <DocDetailHeaderActions state={state} />
      </div>

      {state.error && <DaemonErrorMessage error={state.error} />}

      {state.showDeleteConfirm && (
        <DocDetailDeleteConfirm
          deleting={state.deleting}
          onCancel={() => state.setShowDeleteConfirm(false)}
          onDelete={state.handleDelete}
        />
      )}

      <div className="doc-content">
        {state.isEditing ? (
          <DocDetailEditForm
            editTitle={state.editTitle}
            editSlug={state.editSlug}
            editContent={state.editContent}
            currentSlug={state.doc.slug}
            setEditTitle={state.setEditTitle}
            setEditSlug={state.setEditSlug}
            setEditContent={state.setEditContent}
          />
        ) : (
          <DocDetailView
            doc={state.doc}
            slug={slug}
            copyToClipboard={state.copyToClipboard}
          />
        )}
      </div>

      <DocDetailModals state={state} />
    </div>
  )
}
