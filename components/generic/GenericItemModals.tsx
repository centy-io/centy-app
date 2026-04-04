'use client'

import { DeleteConfirm } from '@/components/shared/DeleteConfirm'
import { MoveModal } from '@/components/shared/MoveModal'
import type { GenericItem } from '@/gen/centy_pb'

interface GenericItemModalsProps {
  item: GenericItem
  itemType: string
  projectPath: string
  showDeleteConfirm: boolean
  showMoveModal: boolean
  deleting: boolean
  onCancelDelete: () => void
  onSoftDelete: () => void
  onConfirmDelete: () => void
  onCloseMoveModal: () => void
  onMoved: (targetProjectPath: string) => void
}

export function GenericItemModals({
  item,
  itemType,
  projectPath,
  showDeleteConfirm,
  showMoveModal,
  deleting,
  onCancelDelete,
  onSoftDelete,
  onConfirmDelete,
  onCloseMoveModal,
  onMoved,
}: GenericItemModalsProps) {
  return (
    <>
      {showDeleteConfirm && (
        <DeleteConfirm
          message={`Delete "${item.title || item.id}"?`}
          deleting={deleting}
          onCancel={onCancelDelete}
          onSoftDelete={onSoftDelete}
          onConfirm={onConfirmDelete}
        />
      )}
      {showMoveModal && (
        <MoveModal
          entityType={itemType}
          entityId={item.id}
          entityTitle={item.title}
          currentProjectPath={projectPath}
          onClose={onCloseMoveModal}
          onMoved={onMoved}
        />
      )}
    </>
  )
}
