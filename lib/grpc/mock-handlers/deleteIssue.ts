'use client'

// eslint-disable-next-line @typescript-eslint/require-await
export async function deleteIssue(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] deleteIssue called - changes not persisted')
  return { success: true }
}
