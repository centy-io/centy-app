import { EditorType, type EditorInfo } from '@/gen/centy_pb'

export function createFallbackEditors(vscodeAvailable: boolean): EditorInfo[] {
  return [
    {
      $typeName: 'centy.v1.EditorInfo',
      editorType: EditorType.VSCODE,
      name: 'VS Code',
      description: 'Open in temporary VS Code workspace with AI agent',
      available: vscodeAvailable,
      editorId: 'vscode',
      terminalWrapper: false,
    },
    {
      $typeName: 'centy.v1.EditorInfo',
      editorType: EditorType.TERMINAL,
      name: 'Terminal',
      description: 'Open in terminal with AI agent',
      available: true,
      editorId: 'terminal',
      terminalWrapper: true,
    },
  ]
}
