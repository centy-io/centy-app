'use client'

export async function createLink(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] createLink called - changes not persisted')
  return { success: true }
}
