'use client'

// Build the demo redirect URL
export function buildDemoRedirectUrl(
  orgSlug: string,
  projectPath: string
): string {
  return `/?org=${orgSlug}&project=${encodeURIComponent(projectPath)}`
}
