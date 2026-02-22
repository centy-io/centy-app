'use client'

export function getDraftStorageKey(type: string, projectPath: string): string {
  return `centy-draft-${type}-${projectPath}`
}
