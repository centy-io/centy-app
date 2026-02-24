import { useState, useCallback } from 'react'
import { openInEditor } from './openInEditor'
import { centyClient } from '@/lib/grpc/client'
import { type Issue } from '@/gen/centy_pb'

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
