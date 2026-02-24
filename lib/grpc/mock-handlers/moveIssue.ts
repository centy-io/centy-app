'use client'

export async function moveIssue(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] moveIssue called - not available in demo mode')
  return { success: true }
}
