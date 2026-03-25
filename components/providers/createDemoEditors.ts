'use client'

import type { EditorInfo } from '@/gen/centy_pb'

// Helper to create mock editors for demo mode
export function createDemoEditors(): EditorInfo[] {
  return [
    {
      $typeName: 'centy.v1.EditorInfo',
      name: 'Terminal',
      description: 'Open in terminal',
      available: true,
      editorId: 'terminal',
      terminalWrapper: true,
    },
  ]
}
