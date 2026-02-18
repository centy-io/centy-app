'use client'

import Link from 'next/link'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import type { DocDetailProps } from './types'
import { useDocDetail } from './useDocDetail'
import { HeaderActions } from './HeaderActions'
import { DeleteConfirm } from './DeleteConfirm'
import { DocDetailView } from './DocDetailView'
import { DocDetailEditForm } from './DocDetailEditForm'
import { DocDetailModals } from './DocDetailModals'
import { DocDetailStates } from './DocDetailStates'

export function DocDetail({ slug }: DocDetailProps) {
  const state = useDocDetail(slug)

  const stateView = DocDetailStates({
    projectPath: state.projectPath,
    loading: state.loading,
    error: state.error,
    doc: state.doc,
    docsListUrl: state.docsListUrl,
  })
  if (stateView) return stateView

  const doc = state.doc!

  return (
    <div className="doc-detail">
      <div className="doc-header">
        <Link href={state.docsListUrl} className="back-link">
          Back to Documentation
        </Link>
        <HeaderActions
          isEditing={state.isEditing}
          saving={state.saving}
          onEdit={() => state.setIsEditing(true)}
          onMove={() => state.setShowMoveModal(true)}
          onDuplicate={() => state.setShowDuplicateModal(true)}
          onDelete={() => state.setShowDeleteConfirm(true)}
          onCancel={state.handleCancelEdit}
          onSave={state.handleSave}
        />
      </div>

      {state.error && <DaemonErrorMessage error={state.error} />}

      {state.showDeleteConfirm && (
        <DeleteConfirm
          deleting={state.deleting}
          onCancel={() => state.setShowDeleteConfirm(false)}
          onConfirm={state.handleDelete}
        />
      )}

      <div className="doc-content">
        {state.isEditing ? (
          <DocDetailEditForm
            doc={doc}
            editTitle={state.editTitle}
            setEditTitle={state.setEditTitle}
            editSlug={state.editSlug}
            setEditSlug={state.setEditSlug}
            editContent={state.editContent}
            setEditContent={state.setEditContent}
          />
        ) : (
          <DocDetailView doc={doc} slug={slug} />
        )}
      </div>

      <DocDetailModals
        doc={doc}
        projectPath={state.projectPath}
        showMoveModal={state.showMoveModal}
        showDuplicateModal={state.showDuplicateModal}
        onCloseMoveModal={() => state.setShowMoveModal(false)}
        onCloseDuplicateModal={() => state.setShowDuplicateModal(false)}
        onMoved={state.handleMoved}
        onDuplicated={(newSlug, targetProjectPath) => {
          state.handleDuplicated(newSlug, targetProjectPath)
          state.setShowDuplicateModal(false)
        }}
      />
    </div>
  )
}
