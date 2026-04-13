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
  const isArchived = Boolean(item.metadata && item.metadata.deletedAt)
  return (
    <div className="generic-item-detail">
      <GenericItemDetailHeader
        displayName={buildItemDisplayName(state.config, itemType)}
        listUrl={state.listUrl}
        isEditing={state.isEditing}
        saving={state.saving}
        onEdit={() => void state.setIsEditing(true)}
        onCancelEdit={() => void state.setIsEditing(false)}
        onSave={() => void state.handleSave()}
        onDeleteRequest={() => void state.setShowDeleteConfirm(true)}
        onMove={() => void state.setShowMoveModal(true)}
      />
      {state.fetch.error && <DaemonErrorMessage error={state.fetch.error} />}
      {isArchived && (
        <ArchivedBanner
          restoring={state.restoring}
          onRestore={() => void state.handleRestore()}
        />
      )}
      <GenericItemModals
        item={item}
        itemType={itemType}
        projectPath={projectPath}
        showDeleteConfirm={state.showDeleteConfirm}
        showMoveModal={state.showMoveModal}
        deleting={state.deleting}
        onCancelDelete={() => void state.setShowDeleteConfirm(false)}
        onSoftDelete={() => void state.handleSoftDelete()}
        onConfirmDelete={() => void state.handleDelete()}
        onCloseMoveModal={() => void state.setShowMoveModal(false)}
        onMoved={targetProjectPath => void state.handleMoved(targetProjectPath)}
      />
      <ItemContent>
        <DetailBody
          item={item}
          config={state.config}
          isEditing={state.isEditing}
          itemType={itemType}
          projectPath={projectPath}
          fetch={state.fetch}
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
