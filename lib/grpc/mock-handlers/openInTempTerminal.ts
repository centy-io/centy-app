'use client'

// eslint-disable-next-line @typescript-eslint/require-await
export async function openInTempTerminal(): Promise<{
  success: boolean
  error: string
  workspacePath: string
  issueId: string
  displayNumber: number
  expiresAt: string
  editorOpened: boolean
}> {
  console.warn(
    '[Demo Mode] openInTempTerminal called - not available in demo mode'
  )
  return {
    success: false,
    error: 'Opening Terminal workspaces is not available in demo mode',
    workspacePath: '',
    issueId: '',
    displayNumber: 0,
    expiresAt: '',
    editorOpened: false,
  }
}
