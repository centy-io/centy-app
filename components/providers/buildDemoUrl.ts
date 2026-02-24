'use client'

// Build the demo URL from current path
export function buildDemoUrl(orgSlug: string, projectPath: string): string {
  return `${window.location.pathname}?org=${orgSlug}&project=${encodeURIComponent(projectPath)}`
}
