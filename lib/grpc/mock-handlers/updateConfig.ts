'use client'

export async function updateConfig(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] updateConfig called - changes not persisted')
  return { success: true }
}
