'use client'

export async function deleteDoc(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] deleteDoc called - changes not persisted')
  return { success: true }
}
