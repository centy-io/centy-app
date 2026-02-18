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

export async function getSupportedEditors(): Promise<{
  editors: Array<{
    $typeName: 'centy.v1.EditorInfo'
    editorType: number
    name: string
    description: string
    available: boolean
    editorId: string
    terminalWrapper: boolean
  }>
}> {
  return {
    editors: [
      {
        $typeName: 'centy.v1.EditorInfo',
        editorType: 1,
        name: 'VS Code',
        description: 'Open in temporary VS Code workspace with AI agent',
        available: true,
        editorId: 'vscode',
        terminalWrapper: false,
      },
      {
        $typeName: 'centy.v1.EditorInfo',
        editorType: 2,
        name: 'Terminal',
        description: 'Open in terminal with AI agent',
        available: true,
        editorId: 'terminal',
        terminalWrapper: true,
      },
    ],
  }
}
