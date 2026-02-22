'use client'

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
