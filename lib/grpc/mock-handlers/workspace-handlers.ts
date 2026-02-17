'use client'

import type { MockHandlers } from './types'

// Handlers for workspace/editor-related operations
export const workspaceHandlers: MockHandlers = {
  async openInTempVscode(): Promise<{
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
  },

  async openInTempTerminal(): Promise<{
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
  },

  async getSupportedEditors(): Promise<{
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
          editorType: 1, // VSCODE
          name: 'VS Code',
          description: 'Open in temporary VS Code workspace with AI agent',
          available: true,
          editorId: 'vscode',
          terminalWrapper: false,
        },
        {
          $typeName: 'centy.v1.EditorInfo',
          editorType: 2, // TERMINAL
          name: 'Terminal',
          description: 'Open in terminal with AI agent',
          available: true,
          editorId: 'terminal',
          terminalWrapper: true,
        },
      ],
    }
  },
}
