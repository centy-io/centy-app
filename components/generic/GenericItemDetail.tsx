'use client'

import Link from 'next/link'
import { ArchivedBanner } from './ArchivedBanner'
import { DetailBody } from './DetailBody'
import { useGenericItemDetailState } from './useGenericItemDetailState'
import { GenericItemDetailHeader } from './GenericItemDetailHeader'
import { GenericItemDeleteConfirm } from './GenericItemDeleteConfirm'
import { buildItemDisplayName } from './buildItemDisplayName'
import type { GenericItem } from '@/gen/centy_pb'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { usePathContext } from '@/components/providers/PathContextProvider'
import { CommentThread } from '@/components/comments/CommentThread'

interface GenericItemDetailProps {
  itemType: string
  itemId: string
}

interface ContentProps {
  state: ReturnType<typeof useGenericItemDetailState>
  item: GenericItem
  itemType: string
  projectPath: string
}

function GenericItemContent({
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
        <GenericItemDeleteConfirm
          itemLabel={item.title || item.id}
          deleting={deleting}
          onCancel={() => setShowDeleteConfirm(false)}
          onSoftDelete={handleSoftDelete}
          onHardDelete={handleDelete}
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

export function GenericItemDetail({
  itemType,
  itemId,
}: GenericItemDetailProps): React.JSX.Element | null {
  const { projectPath } = usePathContext()
  const state = useGenericItemDetailState(projectPath, itemType, itemId)
  const { fetch } = state

  if (!projectPath)
    return (
      <div className="generic-item-detail">
        <p className="no-project-text">Select a project to view this item</p>
      </div>
    )
  if (fetch.loading && !fetch.item)
    return <div className="loading">Loading...</div>
  if (fetch.error && !fetch.item)
    return (
      <div className="generic-item-detail">
        <DaemonErrorMessage error={fetch.error} />
        <Link href={state.listUrl}>Back to list</Link>
      </div>
    )
  if (!fetch.item) return null

  return (
    <GenericItemContent
      state={state}
      item={fetch.item}
      itemType={itemType}
      projectPath={projectPath}
    />
  )
}
