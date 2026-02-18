'use client'

import type { ReactElement } from 'react'
import type { Issue } from '@/gen/centy_pb'
import {
  ContextMenu,
  type ContextMenuItem,
} from '@/components/shared/ContextMenu'
import { MoveModal } from '@/components/shared/MoveModal'
import { DuplicateModal } from '@/components/shared/DuplicateModal'
import { StandaloneWorkspaceModal } from '@/components/shared/StandaloneWorkspaceModal'

interface IssuesModalsProps {
  projectPath: string
  contextMenu: { x: number; y: number; issue: Issue } | null
  contextMenuItems: ContextMenuItem[]
  onCloseContextMenu: () => void
  showMoveModal: boolean
  showDuplicateModal: boolean
  showStandaloneModal: boolean
  selectedIssue: Issue | null
  onCloseMoveModal: () => void
  onCloseDuplicateModal: () => void
  onCloseStandaloneModal: () => void
  onMoved: (targetProjectPath: string) => Promise<void>
  onDuplicated: (newIssueId: string, targetProjectPath: string) => Promise<void>
}

export function IssuesModals({
  projectPath,
  contextMenu,
  contextMenuItems,
  onCloseContextMenu,
  showMoveModal,
  showDuplicateModal,
  showStandaloneModal,
  selectedIssue,
  onCloseMoveModal,
  onCloseDuplicateModal,
  onCloseStandaloneModal,
  onMoved,
  onDuplicated,
}: IssuesModalsProps): ReactElement {
  return (
    <>
      {contextMenu && (
        <ContextMenu
          items={contextMenuItems}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={onCloseContextMenu}
        />
      )}

      {showMoveModal && selectedIssue && (
        <MoveModal
          entityType="issue"
          entityId={selectedIssue.id}
          entityTitle={selectedIssue.title}
          currentProjectPath={projectPath}
          onClose={onCloseMoveModal}
          onMoved={onMoved}
        />
      )}

      {showDuplicateModal && selectedIssue && (
        <DuplicateModal
          entityType="issue"
          entityId={selectedIssue.id}
          entityTitle={selectedIssue.title}
          currentProjectPath={projectPath}
          onClose={onCloseDuplicateModal}
          onDuplicated={onDuplicated}
        />
      )}

      {showStandaloneModal && projectPath && (
        <StandaloneWorkspaceModal
          projectPath={projectPath}
          onClose={onCloseStandaloneModal}
        />
      )}
    </>
  )
}
