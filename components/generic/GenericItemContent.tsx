'use client'

import { ArchivedBanner } from './ArchivedBanner'
import { DetailBody } from './DetailBody'
import { GenericItemDetailHeader } from './GenericItemDetailHeader'
import { GenericItemModals } from './GenericItemModals'
import { buildItemDisplayName } from './buildItemDisplayName'
import type { useGenericItemDetailState } from './useGenericItemDetailState'
import { CommentThread } from '@/components/comments/CommentThread'
import type { GenericItem } from '@/gen/centy_pb'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { ItemContent } from '@/components/shared/ItemView'

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
  const {
    isEditing,
    setIsEditing,
    showDeleteConfirm,
    setShowDeleteConfirm,
    showMoveModal,
    setShowMoveModal,
    handleMoved,
  } = state
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
        onEdit={() => void setIsEditing(true)}
        onCancelEdit={() => void setIsEditing(false)}
        onSave={() => void handleSave()}
        onDeleteRequest={() => void setShowDeleteConfirm(true)}
        onMove={() => void setShowMoveModal(true)}
      />
      {fetch.error && <DaemonErrorMessage error={fetch.error} />}
      {isArchived && (
        <ArchivedBanner
          restoring={restoring}
          onRestore={() => void handleRestore()}
        />
      )}
      <GenericItemModals
        item={item}
        itemType={itemType}
        projectPath={projectPath}
        showDeleteConfirm={showDeleteConfirm}
        showMoveModal={showMoveModal}
        deleting={deleting}
        onCancelDelete={() => void setShowDeleteConfirm(false)}
        onSoftDelete={() => void handleSoftDelete()}
        onConfirmDelete={() => void handleDelete()}
        onCloseMoveModal={() => void setShowMoveModal(false)}
        onMoved={targetProjectPath => void handleMoved(targetProjectPath)}
      />
      <ItemContent>
        <DetailBody
          item={item}
          config={state.config}
          isEditing={isEditing}
          fetch={fetch}
        />
      </ItemContent>
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
