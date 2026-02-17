import { useState, useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  OpenInTempWorkspaceRequestSchema,
  LlmAction,
  type Issue,
} from '@/gen/centy_pb'

interface UseEditorActionsParams {
  projectPath: string
  issue: Issue | null
  setError: (error: string | null) => void
  setShowStatusConfigDialog: (v: boolean) => void
}

export function useEditorActions({
  projectPath,
  issue,
  setError,
  setShowStatusConfigDialog,
}: UseEditorActionsParams) {
  const [openingInVscode, setOpeningInVscode] = useState(false)

  const handleOpenInVscode = useCallback(async () => {
    if (!projectPath || !issue) return

    setOpeningInVscode(true)
    setError(null)

    try {
      const request = create(OpenInTempWorkspaceRequestSchema, {
        projectPath,
        issueId: issue.id,
        action: LlmAction.PLAN,
        agentName: '',
        ttlHours: 0,
      })
      const response = await centyClient.openInTempVscode(request)

      if (response.success) {
        if (!response.editorOpened) {
          const actionWord = response.workspaceReused
            ? 'Reopened workspace'
            : 'Workspace created'
          setError(
            `${actionWord} at ${response.workspacePath} but VS Code could not be opened automatically`
          )
        }
      } else if (response.requiresStatusConfig) {
        setShowStatusConfigDialog(true)
      } else {
        setError(response.error || 'Failed to open in VS Code')
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setOpeningInVscode(false)
    }
  }, [projectPath, issue, setError, setShowStatusConfigDialog])

  const handleOpenInTerminal = useCallback(async () => {
    if (!projectPath || !issue) return

    setOpeningInVscode(true)
    setError(null)

    try {
      const request = create(OpenInTempWorkspaceRequestSchema, {
        projectPath,
        issueId: issue.id,
        action: LlmAction.PLAN,
        agentName: '',
        ttlHours: 0,
      })
      const response = await centyClient.openInTempTerminal(request)

      if (response.success) {
        if (!response.editorOpened) {
          const actionWord = response.workspaceReused
            ? 'Reopened workspace'
            : 'Workspace created'
          setError(
            `${actionWord} at ${response.workspacePath} but terminal could not be opened automatically`
          )
        }
      } else if (response.requiresStatusConfig) {
        setShowStatusConfigDialog(true)
      } else {
        setError(response.error || 'Failed to open in Terminal')
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setOpeningInVscode(false)
    }
  }, [projectPath, issue, setError, setShowStatusConfigDialog])

  return {
    openingInVscode,
    handleOpenInVscode,
    handleOpenInTerminal,
  }
}
