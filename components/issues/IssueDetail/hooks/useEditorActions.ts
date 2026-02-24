import { useState, useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  OpenInTempWorkspaceRequestSchema,
  LlmAction,
  type Issue,
} from '@/gen/centy_pb'

type OpenWorkspaceFn = (
  request: ReturnType<typeof create<typeof OpenInTempWorkspaceRequestSchema>>
) => Promise<{
  success: boolean
  editorOpened: boolean
  workspaceReused: boolean
  workspacePath: string
  requiresStatusConfig: boolean
  error: string
}>

async function openInEditor(
  projectPath: string,
  issue: Issue,
  openFn: OpenWorkspaceFn,
  editorLabel: string,
  setError: (error: string | null) => void,
  setShowStatusConfigDialog: (show: boolean) => void
): Promise<void> {
  const request = create(OpenInTempWorkspaceRequestSchema, {
    projectPath,
    issueId: issue.id,
    action: LlmAction.PLAN,
    agentName: '',
    ttlHours: 0,
  })
  const response = await openFn(request)
  if (response.success) {
    if (!response.editorOpened) {
      const actionWord = response.workspaceReused
        ? 'Reopened workspace'
        : 'Workspace created'
      setError(
        `${actionWord} at ${response.workspacePath} but ${editorLabel} could not be opened automatically`
      )
    }
  } else if (response.requiresStatusConfig) {
    setShowStatusConfigDialog(true)
  } else {
    setError(response.error || `Failed to open in ${editorLabel}`)
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
    setOpeningInVscode(true)
    setError(null)
    try {
      await openInEditor(
        projectPath,
        issue,
        centyClient.openInTempVscode.bind(centyClient),
        'VS Code',
        setError,
        setShowStatusConfigDialog
      )
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
      await openInEditor(
        projectPath,
        issue,
        centyClient.openInTempTerminal.bind(centyClient),
        'terminal',
        setError,
        setShowStatusConfigDialog
      )
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
