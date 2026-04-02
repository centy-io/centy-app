'use client'

// Helper to resolve vscode availability, considering test overrides
export function resolveVscodeAvailable(fallback: boolean): boolean {
  const testOverride: boolean | undefined = window.__TEST_VSCODE_AVAILABLE__
  return testOverride !== undefined ? testOverride : fallback
}
