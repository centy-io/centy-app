import { useState, useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  OpenInTempWorkspaceWithEditorRequestSchema,
  type Issue,
} from '@/gen/centy_pb'

// eslint-disable-next-line max-lines-per-function
export function useEditorActions(
  projectPath: string,
  issue: Issue | null,
  setError: (error: string | null) => void,
  setShowStatusConfigDialog: (show: boolean) => void
) {
  const [openingInVscode, setOpeningInVscode] = useState(false)

  const handleOpenInVscode = useCallback(async () => {
    if (!projectPath || !issue) return
    setOpeningInVscode(true)
    setError(null)

    try {
      const request = create(OpenInTempWorkspaceWithEditorRequestSchema, {
        projectPath,
        issueId: issue.id,
        ttlHours: 0,
        editorId: 'vscode',
      })
      const response = await centyClient.openInTempWorkspace(request)

      if (response.success) {
        if (!response.editorOpened) {
          const actionWord = response.workspaceReused
            ? 'Reopened workspace'
            : 'Workspace created'
          setError(
            `${actionWord} at ${response.workspacePath} but the editor could not be opened automatically`
          )
        }
      } else if (response.requiresStatusConfig) {
        setShowStatusConfigDialog(true)
      } else {
        setError(response.error || 'Failed to open in editor')
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
      const request = create(OpenInTempWorkspaceWithEditorRequestSchema, {
        projectPath,
        issueId: issue.id,
        ttlHours: 0,
        editorId: 'terminal',
      })
      const response = await centyClient.openInTempWorkspace(request)

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
