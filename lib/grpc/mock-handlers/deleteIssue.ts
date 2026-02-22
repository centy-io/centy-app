'use client'

export async function deleteIssue(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] deleteIssue called - changes not persisted')
  return { success: true }
}
