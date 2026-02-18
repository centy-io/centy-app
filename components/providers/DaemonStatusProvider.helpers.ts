import type { DaemonStatus } from './DaemonStatusProvider.types'
import { EditorType, type EditorInfo } from '@/gen/centy_pb'

export const CHECK_INTERVAL_MS = 10000 // Check every 10 seconds

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

// Helper to create fallback editors when getSupportedEditors fails
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

// Helper to resolve vscode availability, considering test overrides
export function resolveVscodeAvailable(fallback: boolean): boolean {
  const testOverride: boolean | undefined = window.__TEST_VSCODE_AVAILABLE__
  return testOverride !== undefined ? testOverride : fallback
}

// Build the demo URL from current path
export function buildDemoUrl(orgSlug: string, projectPath: string): string {
  return `${window.location.pathname}?org=${orgSlug}&project=${encodeURIComponent(projectPath)}`
}

// Build the demo redirect URL
export function buildDemoRedirectUrl(
  orgSlug: string,
  projectPath: string
): string {
  return `/?org=${orgSlug}&project=${encodeURIComponent(projectPath)}`
}

type SetState<T> = (value: T) => void

// Apply demo mode state to all status setters
export function applyDemoState(
  setStatus: SetState<DaemonStatus>,
  setVscode: SetState<boolean | null>,
  setEds: SetState<EditorInfo[]>
) {
  setStatus('demo')
  setVscode(resolveVscodeAvailable(true))
  setEds(createDemoEditors())
}
