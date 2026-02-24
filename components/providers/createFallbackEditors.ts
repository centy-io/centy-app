'use client'

import { EditorType, type EditorInfo } from '@/gen/centy_pb'

// Helper to create fallback editors when getSupportedEditors fails
export function createFallbackEditors(vscodeAvailable: boolean): EditorInfo[] {
  return [
    {
      $typeName: 'centy.v1.EditorInfo',
      editorType: EditorType.VSCODE,
      name: 'VS Code',
      description: 'Open in temporary VS Code workspace',
      available: vscodeAvailable,
      editorId: 'vscode',
      terminalWrapper: false,
    },
    {
      $typeName: 'centy.v1.EditorInfo',
      editorType: EditorType.TERMINAL,
      name: 'Terminal',
      description: 'Open in terminal',
      available: true,
      editorId: 'terminal',
      terminalWrapper: true,
    },
  ]
}
