import { EditorType, type EditorInfo } from '@/gen/centy_pb'

// Helper to create mock editors for demo mode
export function createDemoEditors(): EditorInfo[] {
  return [
    {
      $typeName: 'centy.v1.EditorInfo',
      editorType: EditorType.VSCODE,
      name: 'VS Code',
      description: 'Open in temporary VS Code workspace with AI agent',
      available: true,
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

// Check for test override for vscode availability
export function getTestVscodeOverride(): boolean | undefined {
  return (window as Window & { __TEST_VSCODE_AVAILABLE__?: boolean })
    .__TEST_VSCODE_AVAILABLE__
}
