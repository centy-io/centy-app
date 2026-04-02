'use client'

export async function getSupportedEditors(): Promise<{
  editors: Array<{
    $typeName: 'centy.v1.EditorInfo'
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
        name: 'Terminal',
        description: 'Open in terminal',
        available: true,
        editorId: 'terminal',
        terminalWrapper: true,
      },
    ],
  }
}
