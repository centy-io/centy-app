'use client'

export async function deleteLink(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] deleteLink called - changes not persisted')
  return { success: true }
}
