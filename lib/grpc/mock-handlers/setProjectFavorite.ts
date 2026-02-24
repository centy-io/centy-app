'use client'

export async function setProjectFavorite(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] setProjectFavorite called - changes not persisted')
  return { success: true }
}
