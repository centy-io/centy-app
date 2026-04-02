'use client'

export async function openInTempVscode(): Promise<{
  success: boolean
  error: string
  workspacePath: string
  issueId: string
  displayNumber: number
  expiresAt: string
  editorOpened: boolean
}> {
  console.warn(
    '[Demo Mode] openInTempVscode called - not available in demo mode'
  )
  return {
    success: false,
    error: 'Opening VS Code workspaces is not available in demo mode',
    workspacePath: '',
    issueId: '',
    displayNumber: 0,
    expiresAt: '',
    editorOpened: false,
  }
}
