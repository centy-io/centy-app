'use client'

export async function updateDoc(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] updateDoc called - changes not persisted')
  return { success: true }
}
