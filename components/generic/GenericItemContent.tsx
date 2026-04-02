'use client'

import { ArchivedBanner } from './ArchivedBanner'
import { DetailBody } from './DetailBody'
import { GenericItemDetailHeader } from './GenericItemDetailHeader'
import { buildItemDisplayName } from './buildItemDisplayName'
import type { useGenericItemDetailState } from './useGenericItemDetailState'
import { DeleteConfirm } from '@/components/shared/DeleteConfirm'
import { CommentThread } from '@/components/comments/CommentThread'
import type { GenericItem } from '@/gen/centy_pb'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

interface ContentProps {
  state: ReturnType<typeof useGenericItemDetailState>
  item: GenericItem
  itemType: string
  projectPath: string
}

export function GenericItemContent({
  state,
  item,
  itemType,
  projectPath,
}: ContentProps): React.JSX.Element {
  const { isEditing, setIsEditing, showDeleteConfirm, setShowDeleteConfirm } =
    state
  const {
    listUrl,
    fetch,
    saving,
    handleSave,
    deleting,
    restoring,
    handleDelete,
  } = state
  const { handleSoftDelete, handleRestore } = state
  const isArchived = Boolean(item.metadata && item.metadata.deletedAt)
  return (
    <div className="generic-item-detail">
      <GenericItemDetailHeader
        displayName={buildItemDisplayName(state.config, itemType)}
        listUrl={listUrl}
        isEditing={isEditing}
        saving={saving}
        onEdit={() => setIsEditing(true)}
        onCancelEdit={() => setIsEditing(false)}
        onSave={handleSave}
        onDeleteRequest={() => setShowDeleteConfirm(true)}
      />
      {fetch.error && <DaemonErrorMessage error={fetch.error} />}
      {isArchived && (
        <ArchivedBanner restoring={restoring} onRestore={handleRestore} />
      )}
      {showDeleteConfirm && (
        <DeleteConfirm
          message={`Delete "${item.title || item.id}"?`}
          deleting={deleting}
          onCancel={() => setShowDeleteConfirm(false)}
          onSoftDelete={handleSoftDelete}
          onConfirm={handleDelete}
        />
      )}
      <div className="doc-content">
        <DetailBody
          item={item}
          config={state.config}
          isEditing={isEditing}
          fetch={fetch}
        />
      </div>
      {itemType !== 'comments' && (
        <CommentThread
          projectPath={projectPath}
          parentItemId={item.id}
          parentItemType={itemType}
        />
      )}
    </div>
  )
}
