'use client'

// eslint-disable-next-line @typescript-eslint/require-await
export async function updateIssue(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] updateIssue called - changes not persisted')
  return { success: true }
}
