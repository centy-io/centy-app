'use client'

export async function setProjectTitle(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] setProjectTitle called - changes not persisted')
  return { success: true }
}
