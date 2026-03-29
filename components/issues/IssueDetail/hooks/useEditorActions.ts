import { useState, useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  OpenInTempWorkspaceWithEditorRequestSchema,
  type Issue,
} from '@/gen/centy_pb'

interface OpenWorkspaceParams {
  projectPath: string
  issue: Issue
  editorId: string
  failureMessage: string
  setOpening: (v: boolean) => void
  setError: (error: string | null) => void
  setShowStatusConfigDialog: (show: boolean) => void
}

async function openInWorkspace({
  projectPath,
  issue,
  editorId,
  failureMessage,
  setOpening,
  setError,
  setShowStatusConfigDialog,
}: OpenWorkspaceParams): Promise<void> {
  setOpening(true)
  setError(null)
  try {
    const request = create(OpenInTempWorkspaceWithEditorRequestSchema, {
      projectPath,
      issueId: issue.id,
      ttlHours: 0,
      editorId,
    })
    const response = await centyClient.openInTempWorkspace(request)
    if (response.success) {
      if (!response.editorOpened) {
        const actionWord = response.workspaceReused
          ? 'Reopened workspace'
          : 'Workspace created'
        setError(
          `${actionWord} at ${response.workspacePath} but ${failureMessage}`
        )
      }
    } else if (response.requiresStatusConfig) {
      setShowStatusConfigDialog(true)
    } else {
      setError(response.error || `Failed to open in ${editorId}`)
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to connect to daemon')
  } finally {
    setOpening(false)
  }
}

export function useEditorActions(
  projectPath: string,
  issue: Issue | null,
  setError: (error: string | null) => void,
  setShowStatusConfigDialog: (show: boolean) => void
) {
  const [openingInVscode, setOpeningInVscode] = useState(false)

  const handleOpenInVscode = useCallback(async () => {
    if (!projectPath || !issue) return
    await openInWorkspace({
      projectPath,
      issue,
      editorId: 'vscode',
      failureMessage: 'the editor could not be opened automatically',
      setOpening: setOpeningInVscode,
      setError,
      setShowStatusConfigDialog,
    })
  }, [projectPath, issue, setError, setShowStatusConfigDialog])

  const handleOpenInTerminal = useCallback(async () => {
    if (!projectPath || !issue) return
    await openInWorkspace({
      projectPath,
      issue,
      editorId: 'terminal',
      failureMessage: 'terminal could not be opened automatically',
      setOpening: setOpeningInVscode,
      setError,
      setShowStatusConfigDialog,
    })
  }, [projectPath, issue, setError, setShowStatusConfigDialog])

  return {
    openingInVscode,
    handleOpenInVscode,
    handleOpenInTerminal,
  }
}
